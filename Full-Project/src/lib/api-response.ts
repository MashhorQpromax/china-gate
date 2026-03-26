import { NextResponse } from 'next/server';

// Unified API response structure
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Success response helpers
export function apiSuccess<T>(data: T, message?: string, status = 200) {
  const body: ApiSuccessResponse<T> & { message?: string } = { success: true, data };
  if (message) body.message = message;
  return NextResponse.json(body, { status });
}

export function apiPaginated<T>(
  data: T[],
  opts: { page: number; limit: number; total: number }
) {
  const body: ApiSuccessResponse<T[]> = {
    success: true,
    data,
    meta: {
      page: opts.page,
      limit: opts.limit,
      total: opts.total,
      totalPages: Math.ceil(opts.total / opts.limit),
    },
  };
  return NextResponse.json(body, { status: 200 });
}

export function apiCreated<T>(data: T) {
  return apiSuccess(data, 201);
}

// Error response helpers
export function apiError(
  message: string,
  code: string,
  status: number,
  details?: unknown
) {
  const body: ApiErrorResponse = {
    success: false,
    error: { code, message, details },
  };
  return NextResponse.json(body, { status });
}

export function apiBadRequest(message: string, details?: unknown) {
  return apiError(message, 'BAD_REQUEST', 400, details);
}

export function apiUnauthorized(message = 'Authentication required') {
  return apiError(message, 'UNAUTHORIZED', 401);
}

export function apiForbidden(message = 'Access denied') {
  return apiError(message, 'FORBIDDEN', 403);
}

export function apiNotFound(message = 'Resource not found') {
  return apiError(message, 'NOT_FOUND', 404);
}

export function apiConflict(message: string) {
  return apiError(message, 'CONFLICT', 409);
}

export function apiServerError(message = 'Internal server error') {
  return apiError(message, 'SERVER_ERROR', 500);
}

// Helper to get user info from middleware headers
export function getRequestUser(request: Request) {
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');
  const userRole = request.headers.get('x-user-role');

  return {
    id: userId,
    email: userEmail,
    role: userRole,
    isAdmin: userRole === 'admin',
    isBuyer: userRole === 'gulf_buyer',
    isSupplier: userRole === 'chinese_supplier',
    isManufacturer: userRole === 'gulf_manufacturer',
    isAuthenticated: !!userId,
  };
}

// Parse pagination params
export function getPaginationParams(url: URL) {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// Parse sort params
export function getSortParams(url: URL, allowedFields: string[]) {
  const sortBy = url.searchParams.get('sort_by') || 'created_at';
  const sortOrder = url.searchParams.get('sort_order') === 'asc' ? 'asc' : 'desc';

  // Only allow whitelisted sort fields
  const safeSortBy = allowedFields.includes(sortBy) ? sortBy : 'created_at';

  return { sortBy: safeSortBy, sortOrder: sortOrder as 'asc' | 'desc' };
}
