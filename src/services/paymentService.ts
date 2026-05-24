import { authenticatedFetch } from '@/lib/api';

// Types
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
export type PlanType = 'STARTER' | 'GROWTH' | 'EXPANSION' | 'ENTERPRISE';
export type TimeFrame = 'week' | 'month' | 'quarter' | 'year' | 'all';

export interface Payment {
	_id: string;
	transactionId: string;
	reference: string;
	churchName: string;
	plan: PlanType;
	amount: number;
	paymentMethod: string | null;
	status: PaymentStatus;
	date: string;
}

export interface PaymentListResponse {
	data: Payment[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

export interface PaymentStats {
	totalRevenue: number;
	pendingCount: number;
	pendingAmount: number;
	successRate: string;
	failedCount: number;
	totalCount: number;
}

export interface PaymentFilters {
	page?: number;
	limit?: number;
	status?: PaymentStatus;
	plan?: PlanType;
	timeframe?: TimeFrame;
	churchId?: string;
	from?: string;
	to?: string;
	search?: string;
	sortBy?: 'amount' | 'date';
	sortOrder?: 'ASC' | 'DESC';
}

// Get all payments with pagination and filters
export async function fetchPayments(params?: PaymentFilters): Promise<PaymentListResponse> {
	const query = new URLSearchParams();

	if (params?.page) query.append('page', String(params.page));
	if (params?.limit) query.append('limit', String(params.limit));
	if (params?.status) query.append('status', params.status);
	if (params?.plan) query.append('plan', params.plan);
	if (params?.timeframe) query.append('timeframe', params.timeframe);
	if (params?.from) query.append('from', params.from);
	if (params?.to) query.append('to', params.to);
	if (params?.search) query.append('search', params.search);
	if (params?.sortBy) query.append('sortBy', params.sortBy);
	if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

	const suffix = query.toString() ? `?${query.toString()}` : '';

	return authenticatedFetch<PaymentListResponse>(`/payment${suffix}`, {
		method: 'GET',
	});
}

// Get payment statistics
export async function fetchPaymentStats(timeframe?: TimeFrame): Promise<PaymentStats> {
	const query = timeframe ? `?timeframe=${timeframe}` : '';

	return authenticatedFetch<PaymentStats>(`/payment/stats${query}`, {
		method: 'GET',
	});
}

// Get single payment by ID
export async function fetchPaymentById(id: string): Promise<Payment> {
	const response = await authenticatedFetch<{ success: boolean; data: Payment }>(`/payment/${id}`, {
		method: 'GET',
	});
	return response.data;
}
