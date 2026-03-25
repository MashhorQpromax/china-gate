import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data } = await supabase.auth.getUser(token);
  return data?.user?.id || null;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    '0.0.0.0'
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 });
    }

    // Limit batch size
    if (events.length > 50) {
      return NextResponse.json({ error: 'Too many events (max 50)' }, { status: 400 });
    }

    const userId = await getUserId(request);
    const ip = getClientIP(request);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Separate page_view events from activity events
    const pageViewEvents: any[] = [];
    const activityEvents: any[] = [];

    for (const event of events) {
      // Skip page time updates, only track initial views
      if (event.eventType === 'page_view' && event.eventData?.isUpdate) {
        // Update existing page view with time data
        if (event.sessionId && event.eventData.timeOnPage) {
          await supabase
            .from('page_views')
            .update({
              time_on_page: event.eventData.timeOnPage,
              scroll_depth: event.eventData.scrollDepth || 0,
            })
            .eq('session_id', event.sessionId)
            .eq('page_path', event.pagePath)
            .order('viewed_at', { ascending: false })
            .limit(1);
        }
        continue;
      }

      if (event.eventType === 'page_view') {
        pageViewEvents.push({
          user_id: userId,
          session_id: event.sessionId,
          page_url: event.pageUrl,
          page_title: event.pageTitle || '',
          page_path: event.pagePath,
          page_category: event.eventCategory,
          referrer_url: event.eventData?.referrerUrl || '',
          referrer_domain: event.eventData?.referrerDomain || '',
          viewed_at: event.timestamp || new Date().toISOString(),
        });
      }

      // All events go to activities table
      activityEvents.push({
        user_id: userId,
        session_id: event.sessionId,
        event_type: event.eventType,
        event_name: event.eventName?.substring(0, 200),
        event_category: event.eventCategory,
        event_data: event.eventData || {},
        page_url: event.pageUrl,
        page_path: event.pagePath,
        element_id: event.elementId || null,
        element_text: event.elementText || null,
        ip_address: ip,
        created_at: event.timestamp || new Date().toISOString(),
      });
    }

    // Batch insert page views
    if (pageViewEvents.length > 0) {
      const { error: pvError } = await supabase
        .from('page_views')
        .insert(pageViewEvents);

      if (pvError) {
        console.error('Page views insert error:', pvError);
      }
    }

    // Batch insert activities
    if (activityEvents.length > 0) {
      const { error: actError } = await supabase
        .from('user_activities')
        .insert(activityEvents);

      if (actError) {
        console.error('Activities insert error:', actError);
      }
    }

    // Update session pages_viewed and total_events count
    const sessionIds = [...new Set(events.map((e: any) => e.sessionId).filter(Boolean))];
    for (const sid of sessionIds) {
      const pvCount = pageViewEvents.filter(p => p.session_id === sid).length;
      const evCount = activityEvents.filter(a => a.session_id === sid).length;

      if (pvCount > 0 || evCount > 0) {
        // Get current counts
        const { data: currentSession } = await supabase
          .from('user_sessions')
          .select('pages_viewed, total_events')
          .eq('id', sid)
          .single();

        if (currentSession) {
          await supabase
            .from('user_sessions')
            .update({
              pages_viewed: (currentSession.pages_viewed || 0) + pvCount,
              total_events: (currentSession.total_events || 0) + evCount,
            })
            .eq('id', sid);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: { pageViews: pageViewEvents.length, activities: activityEvents.length }
    }, { status: 200 });

  } catch (error) {
    console.error('Events tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
