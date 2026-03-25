import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value
      || request.headers.get('Authorization')?.replace('Bearer ', '');

    if (token) {
      // Try to sign out from Supabase
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Get user before signing out for audit
      const { data: { user } } = await supabase.auth.getUser(token);

      if (user) {
        // Log logout in security audit
        await supabase.from('security_audit_log').insert({
          user_id: user.id,
          action: 'logout',
          action_type: 'auth',
          description: 'User logged out',
          ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0',
          risk_level: 'low',
        }).catch(() => {});
      }

      await supabase.auth.admin.signOut(token).catch(() => {});
    }

    // Clear the cookie
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
    response.cookies.set('access_token', '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookie even on error
    const response = NextResponse.json(
      { message: 'Logged out' },
      { status: 200 }
    );
    response.cookies.set('access_token', '', { path: '/', maxAge: 0 });
    return response;
  }
}
