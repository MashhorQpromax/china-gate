import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiPaginated,
  apiCreated,
  apiNotFound,
  apiServerError,
  apiForbidden,
  apiBadRequest,
  getRequestUser,
  getPaginationParams,
} from '@/lib/api-response';
import { validateBody, sendMessageSchema } from '@/lib/validations';

/**
 * GET /api/messages
 * List all conversations for the current user
 * Returns paginated list of conversations with last few messages
 */
export async function GET(request: NextRequest) {
  try {
    const user = getRequestUser(request);

    if (!user.isAuthenticated || !user.id) {
      return apiForbidden('Authentication required');
    }

    const { page, limit, offset } = getPaginationParams(new URL(request.url));

    // Get conversations where user is a participant
    const { data: conversations, error: conversationsError, count } = await supabaseAdmin
      .from('conversations')
      .select('*', { count: 'exact' })
      .contains('participant_ids', [user.id])
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      return apiServerError('Failed to fetch conversations');
    }

    // Get last few messages and participant profiles for each conversation
    if (conversations && conversations.length > 0) {
      const conversationIds = conversations.map((c) => c.id);

      // Collect all unique participant IDs
      const allParticipantIds = [
        ...new Set(conversations.flatMap((c) => c.participant_ids || [])),
      ];

      // Fetch messages and profiles in parallel
      const [messagesResult, profilesResult] = await Promise.all([
        supabaseAdmin
          .from('messages')
          .select('*')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: false }),
        supabaseAdmin
          .from('profiles')
          .select('id, full_name_en, full_name_ar, company_name, account_type')
          .in('id', allParticipantIds),
      ]);

      if (messagesResult.error) {
        console.error('Error fetching messages:', messagesResult.error);
        return apiServerError('Failed to fetch messages');
      }

      // Build a profile lookup map
      const profileMap: Record<string, { full_name_en: string; full_name_ar: string; company_name: string; account_type: string }> = {};
      if (profilesResult.data) {
        for (const p of profilesResult.data) {
          profileMap[p.id] = p;
        }
      }

      // Attach messages and participant info to conversations
      const conversationsWithMessages = conversations.map((conv) => {
        const participantProfiles = (conv.participant_ids || [])
          .filter((pid: string) => pid !== user.id)
          .map((pid: string) => profileMap[pid] || { id: pid, full_name_en: 'Unknown', full_name_ar: 'غير معروف', company_name: '', account_type: '' });

        return {
          ...conv,
          messages: (messagesResult.data || [])
            .filter((msg) => msg.conversation_id === conv.id)
            .slice(0, 5),
          participants: participantProfiles,
        };
      });

      return apiPaginated(conversationsWithMessages, {
        page,
        limit,
        total: count || 0,
      });
    }

    return apiPaginated(conversations || [], {
      page,
      limit,
      total: count || 0,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/messages:', error);
    return apiServerError();
  }
}

/**
 * POST /api/messages
 * Send a new message to an existing conversation or create a new one
 * Body: {
 *   conversation_id?: string (existing conversation)
 *   recipient_id?: string (create new conversation)
 *   content: string
 *   deal_id?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const user = getRequestUser(request);

    if (!user.isAuthenticated || !user.id) {
      return apiForbidden('Authentication required');
    }

    // Validate request body
    const validation = await validateBody(request, sendMessageSchema);
    if (validation.error) {
      return validation.error;
    }

    const { conversation_id, recipient_id, content, deal_id } = validation.data;

    // Either conversation_id or recipient_id must be provided
    if (!conversation_id && !recipient_id) {
      return apiBadRequest(
        'Either conversation_id (existing) or recipient_id (new conversation) is required'
      );
    }

    let conversationId = conversation_id;

    // If creating a new conversation
    if (!conversationId && recipient_id) {
      // Check if conversation already exists between these two users
      const { data: existingConv } = await supabaseAdmin
        .from('conversations')
        .select('id')
        .contains('participant_ids', [user.id])
        .contains('participant_ids', [recipient_id])
        .single();

      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        // Create new conversation
        const title = deal_id ? `Deal Discussion` : `Conversation`;
        const { data: newConv, error: convError } = await supabaseAdmin
          .from('conversations')
          .insert({
            participant_ids: [user.id, recipient_id],
            deal_id: deal_id || null,
            product_id: null,
            title,
            is_group: false,
          })
          .select()
          .single();

        if (convError || !newConv) {
          console.error('Error creating conversation:', convError);
          return apiServerError('Failed to create conversation');
        }

        conversationId = newConv.id;
      }
    }

    if (!conversationId) {
      return apiBadRequest('Unable to determine conversation');
    }

    // Verify user is a participant in the conversation
    const { data: conversation, error: convCheckError } = await supabaseAdmin
      .from('conversations')
      .select('participant_ids')
      .eq('id', conversationId)
      .single();

    if (convCheckError || !conversation) {
      return apiNotFound('Conversation not found');
    }

    if (!conversation.participant_ids.includes(user.id)) {
      return apiForbidden('You are not a participant in this conversation');
    }

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
    console.error('Unexpected error in POST /api/messages:', error);
    return apiServerError();
  }
}
