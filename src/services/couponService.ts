// couponService.ts
import { authenticatedFetch } from '@/lib/api';

// Types
export type DiscountType = 'FLAT' | 'PERCENTAGE';
export type CouponType = 'WELCOME_COUPON' | 'FIRST_FREE' | 'GROWTH_25' | 'ENTERPRISE_50K' | 'BLACK_FRIDAY' | 'BULK_10' | 'SAVE_15' | 'CUSTOM';
export type CouponStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'DISABLED' | 'FULLY_USED';
export type PlanType = 'STARTER' | 'GROWTH' | 'EXPANSION' | 'ENTERPRISE';

export interface CreateCouponPayload {
	code: string;
	description: string;
	type: CouponType;
	discountType: DiscountType;
	discount: number;
	validFrom?: string;
	expiryDate: string;
	maxUsage?: number;
	minPlanTier?: PlanType;
	excludedPlans?: PlanType[];
	isStackable?: boolean;
	isTransferable?: boolean;
	status?: CouponStatus;
	isActive?: boolean;
	metadata?: Record<string, any>;
	isSystemGenerated?: boolean;
}

export interface UpdateCouponPayload {
	code?: string;
	description?: string;
	type?: CouponType;
	discountType?: DiscountType;
	discount?: number;
	validFrom?: string;
	expiryDate?: string;
	maxUsage?: number;
	minPlanTier?: PlanType;
	excludedPlans?: PlanType[];
	isStackable?: boolean;
	isTransferable?: boolean;
	status?: CouponStatus;
	isActive?: boolean;
	metadata?: Record<string, any>;
	isSystemGenerated?: boolean;
}

export interface UsageHistoryEntry {
	churchId: string;
	subscriptionId: string;
	appliedAt: string;
	discountApplied: number;
	planType: PlanType;
	originalAmount: number;
	discountedAmount: number;
}

export interface Coupon {
	id: string;
	code: string;
	description: string;
	type: CouponType;
	discountType: DiscountType;
	discount: number;
	validFrom: string;
	expiryDate: string;
	maxUsage: number;
	usageCount: number;
	remainingUses: number | 'Infinity';
	status: CouponStatus;
	isActive: boolean;
	minPlanTier?: PlanType;
	excludedPlans: PlanType[];
	isStackable: boolean;
	isTransferable: boolean;
	isSystemGenerated: boolean;
	usagePercentage: number;
	createdBy?: {
		id: string;
		name: string;
		email: string;
	};
	updatedBy?: {
		id: string;
		name: string;
		email: string;
	};
	createdAt: string;
	updatedAt: string;
	usageHistory?: UsageHistoryEntry[];
	metadata?: Record<string, any>;
}

export interface CouponStats {
	totalCoupons: number;
	activeCoupons: number;
	expiringSoon: number;
	expiredCoupons: number;
	draftCoupons: number;
	totalUsage: number;
	usageByType: {
		type: CouponType;
		count: number;
		totalUsage: number;
	}[];
}

export interface CouponListResponse {
	data: Coupon[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

export interface CouponValidationResponse {
	valid: boolean;
	coupon?: Coupon;
	message?: string;
}

export interface UsageHistoryResponse {
	data: UsageHistoryEntry[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

// Create a new coupon
export async function createCoupon(payload: CreateCouponPayload): Promise<Coupon> {
	const response = await authenticatedFetch<Coupon>('/coupon', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
	return response;
}

// Get all coupons with pagination and filters
export async function fetchCoupons(params?: {
	page?: number;
	limit?: number;
	search?: string;
	filter?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'EXPIRING_SOON';
	type?: CouponType;
	status?: CouponStatus;
	sortBy?: string;
	sortOrder?: 'ASC' | 'DESC';
}): Promise<CouponListResponse> {
	const query = new URLSearchParams();
	if (params?.page) query.append('page', String(params.page));
	if (params?.limit) query.append('limit', String(params.limit));
	if (params?.search) query.append('search', params.search);
	if (params?.filter) query.append('filter', params.filter);
	if (params?.type) query.append('type', params.type);
	if (params?.status) query.append('status', params.status);
	if (params?.sortBy) query.append('sortBy', params.sortBy);
	if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

	const suffix = query.toString() ? `?${query.toString()}` : '';

	return authenticatedFetch<CouponListResponse>(`/coupon${suffix}`, {
		method: 'GET',
	});
}

// Get single coupon by ID
export async function fetchCouponById(id: string): Promise<Coupon> {
	const response = await authenticatedFetch<Coupon>(`/coupon/${id}`, {
		method: 'GET',
	});
	return response;
}

// Get coupon usage history
export async function fetchCouponUsageHistory(id: string, params?: { page?: number; limit?: number }): Promise<UsageHistoryResponse> {
	const query = new URLSearchParams();
	if (params?.page) query.append('page', String(params.page));
	if (params?.limit) query.append('limit', String(params.limit));

	const suffix = query.toString() ? `?${query.toString()}` : '';
	return authenticatedFetch<UsageHistoryResponse>(`/coupon/${id}/usage-history${suffix}`, {
		method: 'GET',
	});
}

// Update a coupon
export async function updateCoupon(id: string, payload: UpdateCouponPayload): Promise<Coupon> {
	const response = await authenticatedFetch<Coupon>(`/coupon/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(payload),
	});
	return response;
}

// Toggle coupon status
export async function toggleCouponStatus(id: string, isActive: boolean): Promise<Coupon> {
	const response = await authenticatedFetch<Coupon>(`/coupon/${id}/toggle-status`, {
		method: 'PATCH',
		body: JSON.stringify({ isActive }),
	});
	return response;
}

// Delete a coupon (soft delete)
export async function deleteCoupon(id: string): Promise<{ success: boolean; message: string; data?: Coupon }> {
	return authenticatedFetch<{ success: boolean; message: string; data?: Coupon }>(`/coupon/${id}`, {
		method: 'DELETE',
	});
}

// Restore a soft-deleted coupon
export async function restoreCoupon(id: string): Promise<Coupon> {
	const response = await authenticatedFetch<Coupon>(`/coupon/${id}/restore`, {
		method: 'POST',
	});
	return response;
}

// Get coupon statistics
export async function fetchCouponStats(): Promise<CouponStats> {
	return authenticatedFetch<CouponStats>('/coupon/stats', {
		method: 'GET',
	});
}

// Validate a coupon (for checkout/application)
export async function validateCoupon(code: string, planType?: PlanType, churchId?: string): Promise<CouponValidationResponse> {
	try {
		const body: any = { code };
		if (planType) body.planType = planType;
		if (churchId) body.churchId = churchId;

		const response = await authenticatedFetch<Coupon>('/coupon/validate', {
			method: 'POST',
			body: JSON.stringify(body),
		});
		return { valid: true, coupon: response };
	} catch (error: any) {
		return {
			valid: false,
			message: error.message || 'Invalid coupon',
			coupon: undefined,
		};
	}
}

// Validate a coupon by code (GET method - for quick validation)
export async function validateCouponByCode(code: string, planType?: PlanType, churchId?: string): Promise<CouponValidationResponse> {
	try {
		const query = new URLSearchParams();
		if (planType) query.append('planType', planType);
		if (churchId) query.append('churchId', churchId);

		const suffix = query.toString() ? `?${query.toString()}` : '';
		const response = await authenticatedFetch<Coupon>(`/coupon/validate/${code}${suffix}`, {
			method: 'GET',
		});
		return { valid: true, coupon: response };
	} catch (error: any) {
		return {
			valid: false,
			message: error.message || 'Invalid coupon',
			coupon: undefined,
		};
	}
}
