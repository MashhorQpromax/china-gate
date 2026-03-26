'use client';

import { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';

interface QualityInspection {
  id: string;
  deal_id: string;
  inspector_id: string;
  stage: string;
  result: string;
  defect_rate: number;
  sample_size: number;
  defective_count: number;
  notes: string;
  findings: string;
  corrective_actions: string;
  photos: string[];
  report_url: string;
  certificates: string[];
  scheduled_date: string;
  completed_at: string;
  status: string;
  created_at: string;
  deal: {
    id: string;
    reference_number: string;
    product_name: string;
    buyer_name: string;
    supplier_name: string;
  } | null;
}

interface ApiResponse {
  data: QualityInspection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const STAGES = [
  'pre_production',
  'material_check',
  'first_article',
  'production_process',
  'in_process',
  'final_inspection',
  'packaging',
  'load_check',
  'transit_monitoring',
  'post_delivery',
];

const STAGE_LABELS: Record<string, string> = {
  pre_production: 'Pre-Production',
  material_check: 'Material Check',
  first_article: 'First Article',
  production_process: 'Production Process',
  in_process: 'In-Process',
  final_inspection: 'Final Inspection',
  packaging: 'Packaging',
  load_check: 'Load Check',
  transit_monitoring: 'Transit Monitoring',
  post_delivery: 'Post-Delivery',
};

const RESULT_LABELS: Record<string, string> = {
  pass: 'Pass',
  conditional_pass: 'Conditional Pass',
  fail: 'Fail',
  pending: 'Pending',
};

const getResultColor = (result: string) => {
  switch (result) {
    case 'pass':
      return 'text-green-400';
    case 'conditional_pass':
      return 'text-yellow-400';
    case 'fail':
      return 'text-red-400';
    case 'pending':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }
};

const getResultBgColor = (result: string) => {
  switch (result) {
    case 'pass':
      return 'bg-green-900/20 border-green-700/50';
    case 'conditional_pass':
      return 'bg-yellow-900/20 border-yellow-700/50';
    case 'fail':
      return 'bg-red-900/20 border-red-700/50';
    case 'pending':
      return 'bg-gray-900/20 border-gray-700/50';
    default:
      return 'bg-gray-900/20 border-gray-700/50';
  }
};

const getStageIndex = (stage: string) => {
  return STAGES.indexOf(stage);
};

export default function QualityPage() {
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [resultFilter, setResultFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  const fetchInspections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (resultFilter !== 'all') {
        params.append('result', resultFilter);
      }
      if (stageFilter !== 'all') {
        params.append('stage', stageFilter);
      }

      const response = await fetch(`/api/quality?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inspections: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();
      setInspections(result.data);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, limit, resultFilter, stageFilter]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  const handleRetry = () => {
    fetchInspections();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#1a1f2b]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Quality Inspections</h1>
            <p className="text-gray-400">Track and manage quality inspections across all stages</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Result
              </label>
              <div className="relative">
                <select
                  value={resultFilter}
                  onChange={(e) => {
                    setResultFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d4a843] appearance-none"
                >
                  <option value="all">All Results</option>
                  <option value="pass">Pass</option>
                  <option value="conditional_pass">Conditional Pass</option>
                  <option value="fail">Fail</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Stage
              </label>
              <div className="relative">
                <select
                  value={stageFilter}
                  onChange={(e) => {
                    setStageFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d4a843] appearance-none"
                >
                  <option value="all">All Stages</option>
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {STAGE_LABELS[stage]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4a843] mx-auto mb-4"></div>
                <p className="text-gray-400">Loading inspections...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                <p className="text-red-300 text-sm mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && inspections.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-lg">No quality inspections found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}

          {!loading && !error && inspections.length > 0 && (
            <>
              <div className="space-y-4">
                {inspections.map((inspection) => {
                  const stageIndex = getStageIndex(inspection.stage);
                  const stageProgress = ((stageIndex + 1) / STAGES.length) * 100;

                  return (
                    <div
                      key={inspection.id}
                      className={`p-6 rounded-lg border transition-all ${getResultBgColor(inspection.result)} hover:border-gray-500/50`}
                    >
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            {inspection.deal && (
                              <>
                                <h3 className="text-lg font-semibold text-white">
                                  {inspection.deal.reference_number}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {inspection.deal.product_name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Buyer: {inspection.deal.buyer_name} | Supplier: {inspection.deal.supplier_name}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getResultColor(inspection.result)}`}>
                              {RESULT_LABELS[inspection.result] || inspection.result}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-[#d4a843]">
                            {STAGE_LABELS[inspection.stage] || inspection.stage}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({stageIndex + 1} of {STAGES.length})
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {STAGES.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-2 flex-1 rounded-sm ${
                                idx <= stageIndex
                                  ? 'bg-[#d4a843]'
                                  : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Sample Size</p>
                          <p className="text-white font-semibold">{inspection.sample_size}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Defective Count</p>
                          <p className="text-white font-semibold">{inspection.defective_count}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Defect Rate</p>
                          <p className="text-white font-semibold">
                            {(inspection.defect_rate * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Completed</p>
                          <p className="text-white font-semibold">
                            {inspection.completed_at
                              ? new Date(inspection.completed_at).toLocaleDateString()
                              : 'Pending'}
                          </p>
                        </div>
                      </div>

                      {inspection.findings && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Findings</p>
                          <p className="text-sm text-gray-300">{inspection.findings}</p>
                        </div>
                      )}

                      {inspection.corrective_actions && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Corrective Actions</p>
                          <p className="text-sm text-gray-300">{inspection.corrective_actions}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} inspections
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-500 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            page === pageNum
                              ? 'bg-[#d4a843] border-[#d4a843] text-black font-semibold'
                              : 'bg-[#0f1419] border-gray-700 text-white hover:border-gray-500'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-500 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
