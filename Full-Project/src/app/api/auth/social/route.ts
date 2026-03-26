import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    // Only allow google and apple
    const validProviders = ['google', 'apple'];
    if (!provider || !validProviders.includes(provider)) {
      return NextResponse.redirect(new URL('/login?error=invalid_provider', request.url));
    }

    // Get the site URL for redirect
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://china-gate.vercel.app';

    // Collect cookies that Supabase SSR sets (including PKCE code_verifier)
    const cookiesToSet: { name: string; value: string; options: CookieOptions }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      }
    );

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'apple',
      options: {
        redirectTo: `${siteUrl}/api/auth/callback`,
        queryParams: provider === 'google' ? {
          access_type: 'offline',
          prompt: 'consent',
        } : undefined,
      },
    });

    if (error || !data.url) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
    }

    // Redirect to OAuth provider
    const response = NextResponse.redirect(data.url);

    // Set all cookies from Supabase SSR (PKCE code_verifier etc.)
    for (const cookie of cookiesToSet) {
      response.cookies.set(cookie.name, cookie.value, cookie.options as any);
    }

    return response;
  } catch (error) {
    console.error('Social auth error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
