import { authenticatedFetch } from '@/lib/api';

// Types
export type DiscountType = 'FLAT' | 'PERCENTAGE';

export interface CreateCouponPayload {
	code: string;
	description?: string;
	discountType: DiscountType;
	discount: number;
	maxUsage?: number;
	expiryDate?: string;
	isActive?: boolean;
}

export interface UpdateCouponPayload {
	id: string;
	code?: string;
	description?: string;
	discountType?: DiscountType;
	discount?: number;
	maxUsage?: number;
	expiryDate?: string;
	isActive?: boolean;
}

export interface Coupon {
	id: string;
	code: string;
	description: string | null;
	discountType: DiscountType;
	discount: number;
	maxUsage: number | null;
	usageCount: number;
	expiryDate: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CouponStats {
	totalCoupons: number;
	activeCoupons: number;
	expiringSoon: number;
	totalUsage: number;
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

// Create a new coupon
export async function createCoupon(payload: CreateCouponPayload): Promise<Coupon> {
	const response = await authenticatedFetch<Coupon>('/coupon', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
	return response;
}

// Get all coupons with pagination
export async function fetchCoupons(params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<CouponListResponse> {
	const query = new URLSearchParams();
	if (params?.page) query.append('page', String(params.page));
	if (params?.limit) query.append('limit', String(params.limit));
	if (params?.search) query.append('search', params.search);
	if (params?.isActive !== undefined) query.append('isActive', String(params.isActive));

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

// Update a coupon
export async function updateCoupon(id: string, payload: Omit<UpdateCouponPayload, 'id'>): Promise<Coupon> {
	const response = await authenticatedFetch<Coupon>(`/coupon/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload),
	});
	return response;
}

// Delete a coupon
export async function deleteCoupon(id: string): Promise<{ success: boolean; message: string }> {
	return authenticatedFetch(`/coupon/${id}`, {
		method: 'DELETE',
	});
}

// Get coupon statistics
export async function fetchCouponStats(): Promise<CouponStats> {
	return authenticatedFetch<CouponStats>('/coupon/stats', {
		method: 'GET',
	});
}

// Validate a coupon (for checkout/application)
export async function validateCoupon(code: string): Promise<{
	valid: boolean;
	coupon?: Coupon;
	message?: string;
}> {
	try {
		const response = await authenticatedFetch<Coupon>(`/coupon/validate/${code}`, {
			method: 'GET',
		});
		return { valid: true, coupon: response };
	} catch (error: any) {
		return { valid: false, message: error.message || 'Invalid coupon' };
	}
}
