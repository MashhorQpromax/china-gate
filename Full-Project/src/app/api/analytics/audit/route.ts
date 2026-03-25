import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/analytics/audit - Audit log queries
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || 'recent';
    const tableName = searchParams.get('table');
    const recordId = searchParams.get('record_id');
    const userId = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = (page - 1) * limit;

    // Record history for specific record
    if (type === 'record' && tableName && recordId) {
      const { data, error } = await supabase.rpc('get_record_history', {
        p_table_name: tableName,
        p_record_id: recordId,
        p_limit: limit,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ history: data });
    }

    // User's changes
    if (type === 'user' && userId) {
      const { data, error } = await supabase.rpc('get_user_changes', {
        p_user_id: userId,
        p_limit: limit,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ changes: data });
    }

    // Critical changes
    if (type === 'critical') {
      const { data, error } = await supabase.rpc('get_critical_changes', {
        p_limit: limit,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ criticalChanges: data });
    }

    // Daily summary
    if (type === 'summary') {
      const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase.rpc('get_daily_summary', {
        p_date: date,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ summary: data });
    }

    // Default: recent changes
    const { data, error, count } = await supabase
      .from('change_log')
      .select('id, table_name, record_id, operation, changed_by, changed_by_name, change_source, changed_fields, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .schema('audit');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      changes: data,
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
