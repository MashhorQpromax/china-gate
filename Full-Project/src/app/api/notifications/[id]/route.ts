import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiServerError,
  apiNotFound,
  getRequestUser,
} from '@/lib/api-response';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiServerError('Unauthorized', 401);
    }

    // Fetch the notification to verify it belongs to the user
    const { data: notification, error: fetchError } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !notification) {
      return apiNotFound('Notification not found');
    }

    // Verify the notification belongs to the user
    if (notification.recipient_id !== user.id) {
      return apiServerError('This notification does not belong to you', 403);
    }

    // Update the notification to mark as read
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('notifications')
      .update({
        read: true,
        read_at: now,
      })
      .eq('id', id);

    if (updateError) {
      return apiServerError(
        `Failed to update notification: ${updateError.message}`,
        500
      );
    }

    return apiSuccess({
      message: 'Notification marked as read',
      notification: {
        ...notification,
        read: true,
        read_at: now,
      },
    });
  } catch (error) {
    return apiServerError(
      `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiServerError('Unauthorized', 401);
    }

    // Fetch the notification to verify it belongs to the user
    const { data: notification, error: fetchError } = await supabaseAdmin
      .from('notifications')
      .select('id, recipient_id')
      .eq('id', id)
      .single();

    if (fetchError || !notification) {
      return apiNotFound('Notification not found');
    }

    // Verify the notification belongs to the user
    if (notification.recipient_id !== user.id) {
      return apiServerError('This notification does not belong to you', 403);
    }

    // Delete the notification
    const { error: deleteError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return apiServerError(
        `Failed to delete notification: ${deleteError.message}`,
        500
      );
    }

    return apiSuccess({
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    return apiServerError(
      `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
}
