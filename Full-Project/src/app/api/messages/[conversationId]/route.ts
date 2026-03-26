import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiPaginated,
  apiCreated,
  apiNotFound,
  apiServerError,
  apiForbidden,
  getRequestUser,
  getPaginationParams,
} from '@/lib/api-response';
import { validateBody, sendMessageSchema } from '@/lib/validations';

/**
 * GET /api/messages/[conversationId]
 * Get all messages in a specific conversation
 * Returns paginated messages ordered by created_at ascending, plus conversation info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const user = getRequestUser(request);

    if (!user.isAuthenticated || !user.id) {
      return apiForbidden('Authentication required');
    }

    // Verify user is a participant in the conversation
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return apiNotFound('Conversation not found');
    }

    if (!conversation.participant_ids.includes(user.id)) {
      return apiForbidden('You are not a participant in this conversation');
    }

    // Get pagination params
    const { page, limit, offset } = getPaginationParams(new URL(request.url));

    // Get messages for this conversation
    const { data: messages, error: messagesError, count } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return apiServerError('Failed to fetch messages');
    }

    // Fetch profiles for all participants
    const participantIds = conversation.participant_ids || [];
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name_en, full_name_ar, company_name, account_type')
      .in('id', participantIds);

    const profileMap: Record<string, { full_name_en: string; company_name: string }> = {};
    if (profiles) {
      for (const p of profiles) {
        profileMap[p.id] = p;
      }
    }

    // Attach sender info to each message
    const messagesWithSender = (messages || []).map((msg) => ({
      ...msg,
      sender_name: profileMap[msg.sender_id]?.full_name_en || 'Unknown',
      sender_company: profileMap[msg.sender_id]?.company_name || '',
    }));

    // Return messages with conversation info
    const response = {
      conversation,
      messages: messagesWithSender,
      participants: profileMap,
    };

    return apiPaginated([response], {
      page,
      limit,
      total: count || 0,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/messages/[conversationId]:', error);
    return apiServerError();
  }
}

/**
 * POST /api/messages/[conversationId]
 * Send a new message to this conversation
 * Body: {
 *   content: string
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const user = getRequestUser(request);

    if (!user.isAuthenticated || !user.id) {
      return apiForbidden('Authentication required');
    }

    // Verify user is a participant in the conversation
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('participant_ids')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return apiNotFound('Conversation not found');
    }

    if (!conversation.participant_ids.includes(user.id)) {
      return apiForbidden('You are not a participant in this conversation');
    }

    // Validate request body
    const validation = await validateBody(request, sendMessageSchema);
    if (validation.error) {
      return validation.error;
    }

    const { content } = validation.data;

    // Insert message
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: 'text',
        read_by: [],
        is_edited: false,
      })
      .select()
      .single();

    if (messageError || !message) {
      console.error('Error inserting message:', messageError);
      return apiServerError('Failed to send message');
    }

    // Update conversation's last_message_text and last_message_at
    const { error: updateError } = await supabaseAdmin
      .from('conversations')
      .update({
        last_message_text: content,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (updateError) {
      console.error('Error updating conversation:', updateError);
      return apiServerError('Message sent but failed to update conversation');
    }

    return apiCreated(message);
  } catch (error) {
    console.error('Unexpected error in POST /api/messages/[conversationId]:', error);
    return apiServerError();
  }
}
