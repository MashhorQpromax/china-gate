import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper to extract user ID from token
async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data } = await supabase.auth.getUser(token);
  return data?.user?.id || null;
}

// Get IP from request headers
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
    const { action } = body;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'start') {
      // Start a new session
      const userId = await getUserId(request);
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { clientInfo, fingerprint, landingPage, referrerUrl } = body;
      const ip = getClientIP(request);

      // Close any previous active sessions
      await supabase
        .from('user_sessions')
        .update({ is_active: false, session_end: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_active', true);

      // Create new session
      const { data: session, error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          ip_address: ip,
          browser_name: clientInfo?.browserName,
          browser_version: clientInfo?.browserVersion,
          os_name: clientInfo?.osName,
          os_version: clientInfo?.osVersion,
          device_type: clientInfo?.deviceType || 'unknown',
          screen_resolution: clientInfo ? `${clientInfo.screenWidth}x${clientInfo.screenHeight}` : null,
          viewport_size: clientInfo ? `${clientInfo.viewportWidth}x${clientInfo.viewportHeight}` : null,
          user_agent: clientInfo?.userAgent,
          referrer_url: referrerUrl || clientInfo?.referrerUrl,
          landing_page: landingPage,
          connection_type: clientInfo?.connectionType,
          language: clientInfo?.language,
          timezone: clientInfo?.timezone,
          country: '', // Will be filled by geo lookup
          city: '',
        })
        .select('id')
        .single();

      if (sessionError) {
        console.error('Session create error:', sessionError);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
      }

      // Upsert device info
      if (fingerprint && clientInfo) {
        await supabase
          .from('user_devices')
          .upsert({
            user_id: userId,
            device_fingerprint: fingerprint,
            device_type: clientInfo.deviceType,
            browser_name: clientInfo.browserName,
            browser_version: clientInfo.browserVersion,
            os_name: clientInfo.osName,
            os_version: clientInfo.osVersion,
            device_brand: clientInfo.deviceBrand,
            device_model: clientInfo.deviceModel,
            screen_width: clientInfo.screenWidth,
            screen_height: clientInfo.screenHeight,
            pixel_ratio: clientInfo.pixelRatio,
            touch_support: clientInfo.touchSupport,
            language: clientInfo.language,
            timezone: clientInfo.timezone,
            last_seen_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,device_fingerprint',
          });

        // Update login_count on existing device
        try {
          await supabase.rpc('increment_device_login', {
            p_user_id: userId,
            p_fingerprint: fingerprint,
          });
        } catch {
          // RPC might not exist yet, ignore
        }
      }

      // Update profile online status
      await supabase
        .from('profiles')
        .update({ is_online: true, last_active_at: new Date().toISOString() })
        .eq('id', userId);

      return NextResponse.json({ sessionId: session.id }, { status: 200 });

    } else if (action === 'end') {
      // End session
      const { sessionId, exitPage } = body;
      if (!sessionId) {
        return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
      }

      // Get session to calculate duration
      const { data: session } = await supabase
        .from('user_sessions')
        .select('session_start, user_id')
        .eq('id', sessionId)
        .single();

      if (session) {
        const duration = Math.round(
          (Date.now() - new Date(session.session_start).getTime()) / 1000
        );

        await supabase
          .from('user_sessions')
          .update({
            is_active: false,
            session_end: new Date().toISOString(),
            exit_page: exitPage,
            session_duration: duration,
            is_bounce: duration < 10,
          })
          .eq('id', sessionId);

        // Update profile
        await supabase
          .from('profiles')
          .update({
            is_online: false,
            total_session_duration: supabase.rpc ? undefined : 0,
          })
          .eq('id', session.user_id);
      }

      return NextResponse.json({ success: true }, { status: 200 });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Session tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
