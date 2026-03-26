import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      fullNameAr,
      fullNameEn,
      companyName,
      accountType,
      country,
      city,
      phone,
      commercialReg,
      sector,
    } = body;

    // Validate required fields
    if (!email || !password || !fullNameEn || !accountType) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, fullNameEn, and accountType are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (server-side)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }
    if (!/\d/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      );
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character' },
        { status: 400 }
      );
    }

    // Validate account type
    const validTypes = ['gulf_buyer', 'chinese_supplier', 'gulf_manufacturer'];
    if (!validTypes.includes(accountType)) {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      );
    }

    // Validate name length
    if (fullNameEn.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name_en: fullNameEn,
        full_name_ar: fullNameAr,
        account_type: accountType,
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Update profile with additional details
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name_ar: fullNameAr,
          full_name_en: fullNameEn,
          company_name: companyName,
          account_type: accountType,
          country: country || 'Saudi Arabia',
          city,
          phone,
          commercial_reg: commercialReg,
          sector: sector || null,
          email: email,
          profile_completed: !!(phone && companyName),
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }
    }

    // Log registration in security audit
    if (authData.user) {
      try {
        await supabase.from('security_audit_log').insert({
          user_id: authData.user.id,
          action: 'account_created',
          action_type: 'auth',
          description: `New ${accountType} account created: ${email}`,
          ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0',
          user_agent: request.headers.get('user-agent') || '',
          metadata: { email, accountType, company: companyName, country, city },
          risk_level: 'low',
        });
      } catch {
        // Ignore audit log errors
      }
    }

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
