import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, refresh_token } = body;

    if (!access_token) {
      return NextResponse.json(
        { success: false, error: 'Missing access token' },
        { status: 400 }
      );
    }

    // Use the access token to get the user info from Supabase
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(access_token);

    if (userError || !user) {
      console.error('Get user error:', userError);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get or create profile
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // If no profile exists (first-time OAuth user), create one
    if (!profile) {
      const metadata = user.user_metadata || {};
      const { data: newProfile } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name_en: metadata.full_name || metadata.name || user.email?.split('@')[0] || '',
          full_name_ar: '',
          account_type: 'gulf_buyer',
          account_status: 'active',
          country: 'Saudi Arabia',
        })
        .select('*')
        .single();
      profile = newProfile;
    }

    // Log OAuth login in security audit (best effort)
    try {
      await supabaseAdmin.from('security_audit_log').insert({
        user_id: user.id,
        action: 'oauth_login',
        action_type: 'auth',
        description: `OAuth login via ${user.app_metadata?.provider || 'unknown'}`,
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0',
        user_agent: request.headers.get('user-agent') || '',
        metadata: { provider: user.app_metadata?.provider, email: user.email },
        risk_level: 'low',
      });
    } catch {
      // Ignore audit log errors
    }

    // Determine redirect based on account type
    const dashboardMap: Record<string, string> = {
      gulf_buyer: '/dashboard/buyer',
      chinese_supplier: '/dashboard/supplier',
      gulf_manufacturer: '/dashboard/manufacturer',
      admin: '/dashboard/admin',
    };
    const redirectTo = dashboardMap[profile?.account_type || ''] || '/dashboard/buyer';

    // Build response with httpOnly cookies
    const response = NextResponse.json({
      success: true,
      data: { redirectTo },
    });

    // Set access_token as httpOnly cookie (7 days)
    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // Set refresh_token as httpOnly cookie (30 days)
    if (refresh_token) {
      response.cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    // Set user profile in a non-httpOnly cookie so client JS can read it
    const profileData = JSON.stringify({
      id: user.id,
      email: user.email,
      full_name_en: profile?.full_name_en || '',
      account_type: profile?.account_type || 'gulf_buyer',
    });
    response.cookies.set('user_profile_data', profileData, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Set session error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
