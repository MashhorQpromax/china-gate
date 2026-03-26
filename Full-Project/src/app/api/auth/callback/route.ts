import { NextRequest, NextResponse } from 'next/server';

// This route handles any server-side redirects from Supabase
// For implicit flow, tokens come in the URL hash which is handled client-side
// This route just redirects to the client-side callback page
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors from Supabase
  if (error) {
    console.error('OAuth callback error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  // Redirect to the client-side callback page
  // Any hash fragment (#access_token=...) will be preserved by the browser
  return NextResponse.redirect(new URL('/auth/callback', request.url));
}
