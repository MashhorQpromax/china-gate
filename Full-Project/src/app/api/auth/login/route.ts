import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
    const { email, password, clientInfo } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const ip = getClientIP(request);

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log failed login attempt
      // Find user by email to log the attempt
      const { data: users } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      await supabaseAdmin.from('login_history').insert({
        user_id: users?.[0]?.id || null,
        ip_address: ip,
        browser_name: clientInfo?.browserName || null,
        browser_version: clientInfo?.browserVersion || null,
        os_name: clientInfo?.osName || null,
        os_version: clientInfo?.osVersion || null,
        device_type: clientInfo?.deviceType || 'unknown',
        device_brand: clientInfo?.deviceBrand || null,
        device_model: clientInfo?.deviceModel || null,
        screen_width: clientInfo?.screenWidth || null,
        screen_height: clientInfo?.screenHeight || null,
        user_agent: clientInfo?.userAgent || null,
        login_method: 'email',
        login_status: 'failed',
        failure_reason: error.message,
      }).catch(() => {});

      // Log security audit
      await supabaseAdmin.from('security_audit_log').insert({
        user_id: users?.[0]?.id || null,
        action: 'login_failed',
        action_type: 'auth',
        description: `Failed login attempt for ${email}`,
        ip_address: ip,
        user_agent: clientInfo?.userAgent || null,
        metadata: { email, reason: error.message },
        risk_level: 'medium',
      }).catch(() => {});

      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Log successful login
    await supabaseAdmin.from('login_history').insert({
      user_id: data.user.id,
      ip_address: ip,
      browser_name: clientInfo?.browserName || null,
      browser_version: clientInfo?.browserVersion || null,
      os_name: clientInfo?.osName || null,
      os_version: clientInfo?.osVersion || null,
      device_type: clientInfo?.deviceType || 'unknown',
      device_brand: clientInfo?.deviceBrand || null,
      device_model: clientInfo?.deviceModel || null,
      screen_width: clientInfo?.screenWidth || null,
      screen_height: clientInfo?.screenHeight || null,
      user_agent: clientInfo?.userAgent || null,
      login_method: 'email',
      login_status: 'success',
    }).catch((err) => {
      console.error('Login history insert error:', err);
    });

    // Log security audit
    await supabaseAdmin.from('security_audit_log').insert({
      user_id: data.user.id,
      action: 'login_success',
      action_type: 'auth',
      description: `Successful login from ${clientInfo?.browserName || 'Unknown'} on ${clientInfo?.osName || 'Unknown'}`,
      ip_address: ip,
      user_agent: clientInfo?.userAgent || null,
      metadata: {
        browser: `${clientInfo?.browserName || ''} ${clientInfo?.browserVersion || ''}`,
        os: `${clientInfo?.osName || ''} ${clientInfo?.osVersion || ''}`,
        device: clientInfo?.deviceType || 'unknown',
      },
      risk_level: 'low',
    }).catch(() => {});

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: data.user.id,
          email: data.user.email,
          profile,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
