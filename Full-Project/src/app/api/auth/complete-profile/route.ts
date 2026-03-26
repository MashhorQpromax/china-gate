import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      accountType,
      fullNameAr,
      fullNameEn,
      companyName,
      country,
      city,
      phone,
      commercialReg,
      sector,
    } = body;

    // Validate required fields
    if (!fullNameEn || !companyName || !phone || !city) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validTypes = ['gulf_buyer', 'chinese_supplier', 'gulf_manufacturer'];
    if (accountType && !validTypes.includes(accountType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account type' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Update profile with complete data
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name_ar: fullNameAr || '',
        full_name_en: fullNameEn,
        company_name: companyName,
        account_type: accountType || 'gulf_buyer',
        country: country || 'Saudi Arabia',
        city: city,
        phone: phone,
        commercial_reg: commercialReg || null,
        sector: sector || null,
        profile_completed: true,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Determine redirect based on account type
    const dashboardMap: Record<string, string> = {
      gulf_buyer: '/dashboard/buyer',
      chinese_supplier: '/dashboard/supplier',
      gulf_manufacturer: '/dashboard/manufacturer',
      admin: '/dashboard/admin',
    };
    const redirectTo = dashboardMap[accountType || 'gulf_buyer'] || '/dashboard/buyer';

    // Update the user_profile_data cookie
    const profileData = JSON.stringify({
      id: user.id,
      email: user.email,
      full_name_en: fullNameEn,
      account_type: accountType || 'gulf_buyer',
    });

    const response = NextResponse.json({
      success: true,
      data: { redirectTo },
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
    console.error('Complete profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
