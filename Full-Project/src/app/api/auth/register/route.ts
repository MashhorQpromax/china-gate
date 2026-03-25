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
    } = body;

    // Validate required fields
    if (!email || !password || !fullNameEn || !accountType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
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
