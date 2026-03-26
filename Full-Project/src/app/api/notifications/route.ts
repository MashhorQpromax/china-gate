import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  apiSuccess,
  apiServerError,
  getRequestUser,
  getPaginationParams,
} from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiServerError('Unauthorized', 401);
    }

    const { page, limit } = getPaginationParams(request);
    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';

    // Build query
    let query = supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    // Apply unread filter if requested
    if (unreadOnly) {
      query = query.eq('read', false);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: notifications, count, error } = await query;

    if (error) {
      return apiServerError(`Failed to fetch notifications: ${error.message}`, 500);
    }

    // Get unread count
    const { count: unreadCount, error: unreadError } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('read', false);

    if (unreadError) {
      return apiServerError(
        `Failed to fetch unread count: ${unreadError.message}`,
        500
      );
    }

    return apiSuccess(
      {
        notifications: notifications || [],
        unreadCount: unreadCount || 0,
      },
      undefined,
      200
    );
  } catch (error) {
    return apiServerError(
      `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getRequestUser(request);

    if (!user.isAuthenticated) {
      return apiServerError('Unauthorized', 401);
    }

    const body = await request.json();
    const { notification_ids, all } = body;

    // Validate input
    if (!all && (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0)) {
      return apiServerError(
        'Either "notification_ids" array or "all: true" is required',
        400
      );
    }

    const now = new Date().toISOString();

    if (all) {
      // Mark all notifications as read for the user
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({
          read: true,
          read_at: now,
        })
        .eq('recipient_id', user.id)
        .eq('read', false);

      if (error) {
        return apiServerError(
          `Failed to mark notifications as read: ${error.message}`,
          500
        );
      }

      return apiSuccess({
        message: 'All notifications marked as read',
      });
    } else {
      // Mark specific notifications as read
      // First, verify all notifications belong to the user
      const { data: notificationsToUpdate, error: fetchError } =
        await supabaseAdmin
          .from('notifications')
          .select('id, recipient_id')
          .in('id', notification_ids);

      if (fetchError) {
        return apiServerError(
          `Failed to fetch notifications: ${fetchError.message}`,
          500
        );
      }

      // Check if all notifications belong to the user
      if (
        !notificationsToUpdate ||
        notificationsToUpdate.length !== notification_ids.length ||
        notificationsToUpdate.some((n) => n.recipient_id !== user.id)
      ) {
        return apiServerError('One or more notifications do not belong to you', 403);
      }

      // Update the notifications
      const { error: updateError } = await supabaseAdmin
        .from('notifications')
        .update({
          read: true,
          read_at: now,
        })
        .in('id', notification_ids);

      if (updateError) {
        return apiServerError(
          `Failed to mark notifications as read: ${updateError.message}`,
          500
        );
      }

      return apiSuccess({
        message: `${notification_ids.length} notification(s) marked as read`,
      });
    }
  } catch (error) {
    return apiServerError(
      `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
}
