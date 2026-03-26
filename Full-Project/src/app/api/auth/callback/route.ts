import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth callback error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    // Use SSR client that reads PKCE code_verifier from cookies
    const cookiesToSet: { name: string; value: string; options: CookieOptions }[] = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookiesToSet.push({ name, value, options });
        },
        remove(name: string, options: CookieOptions) {
          cookiesToSet.push({ name, value: '', options });
        },
      },
    });

    // Exchange the code for a session (PKCE verifier read from cookies)
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !data.session) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(new URL('/login?error=exchange_failed', request.url));
    }

    const { session, user } = data;

    // Get or create profile using admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // If no profile exists yet (first-time OAuth user), create one
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
    await supabaseAdmin.from('security_audit_log').insert({
      user_id: user.id,
      action: 'oauth_login',
      action_type: 'auth',
      description: `OAuth login via ${user.app_metadata?.provider || 'unknown'}`,
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0',
      user_agent: request.headers.get('user-agent') || '',
      metadata: { provider: user.app_metadata?.provider, email: user.email },
      risk_level: 'low',
    }).catch(() => {});

    // Determine redirect based on account type
    const dashboardMap: Record<string, string> = {
      gulf_buyer: '/dashboard/buyer',
      chinese_supplier: '/dashboard/supplier',
      gulf_manufacturer: '/dashboard/manufacturer',
      admin: '/dashboard/admin',
    };
    const redirectPath = dashboardMap[profile?.account_type || ''] || '/dashboard/buyer';

    // Build redirect response with httpOnly cookies
    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    // Set access_token as httpOnly cookie (7 days)
    response.cookies.set('access_token', session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // Set refresh_token as httpOnly cookie (30 days)
    response.cookies.set('refresh_token', session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 60 * 60 * 24 * 30,
    });

    // Set user profile in a non-httpOnly cookie so client JS can read it for UI display
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

    // Also set any Supabase SSR cookies (cleanup PKCE verifier, etc.)
    for (const cookie of cookiesToSet) {
      response.cookies.set(cookie.name, cookie.value, cookie.options as any);
    }

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url));
  }
}
