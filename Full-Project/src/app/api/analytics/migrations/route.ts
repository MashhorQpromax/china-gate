import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/analytics/migrations - Migration status
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [statusReport, currentVersion] = await Promise.all([
      supabase.rpc('status_report'),
      supabase.rpc('current_version'),
    ]);

    return NextResponse.json({
      currentVersion: currentVersion.data,
      migrations: statusReport.data || [],
    });
  } catch (error) {
    console.error('Migrations API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
