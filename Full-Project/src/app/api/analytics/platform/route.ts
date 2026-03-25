import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/analytics/platform - Platform KPIs and trends
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30';
    const days = parseInt(period);

    // Run parallel queries for dashboard data
    const [
      platformDaily,
      monthlySummary,
      categoryPerformance,
      rfqFunnel,
      supplierRanking,
    ] = await Promise.all([
      // Daily platform KPIs (last N days)
      supabase
        .from('fact_platform_daily')
        .select('*')
        .gte('date_key', parseInt(
          new Date(Date.now() - days * 86400000).toISOString().slice(0, 10).replace(/-/g, '')
        ))
        .order('date_key', { ascending: true })
        .schema('analytics'),

      // Monthly revenue summary
      supabase
        .from('mv_monthly_summary')
        .select('*')
        .order('month', { ascending: false })
        .limit(12)
        .schema('analytics'),

      // Category performance
      supabase
        .from('mv_category_performance')
        .select('*')
        .order('total_views', { ascending: false })
        .limit(20)
        .schema('analytics'),

      // RFQ funnel
      supabase
        .from('mv_rfq_funnel')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(12)
        .schema('analytics'),

      // Top suppliers
      supabase
        .from('mv_supplier_ranking')
        .select('*')
        .order('overall_rank', { ascending: true })
        .limit(10)
        .schema('analytics'),
    ]);

    return NextResponse.json({
      daily: platformDaily.data || [],
      monthly: monthlySummary.data || [],
      categories: categoryPerformance.data || [],
      rfqFunnel: rfqFunnel.data || [],
      topSuppliers: supplierRanking.data || [],
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
