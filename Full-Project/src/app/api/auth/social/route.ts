import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    // Only allow google and apple
    const validProviders = ['google', 'apple'];
    if (!provider || !validProviders.includes(provider)) {
      return NextResponse.redirect(new URL('/login?error=invalid_provider', request.url));
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the site URL for redirect
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://china-gate.vercel.app';

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
    return NextResponse.redirect(data.url);
  } catch (error) {
    console.error('Social auth error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
