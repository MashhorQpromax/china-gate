import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send password reset email (Supabase handles it)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://china-gate.vercel.app';
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });

    // Log the attempt (best effort)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';
    try {
      await supabase.from('security_audit_log').insert({
        action: 'password_reset_requested',
        action_type: 'auth',
        description: `Password reset requested for ${email}`,
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || '',
        metadata: { email },
        risk_level: 'medium',
      });
    } catch {
      // Ignore audit log errors
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  }
}
