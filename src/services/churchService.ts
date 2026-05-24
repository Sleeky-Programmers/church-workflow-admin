import { authenticatedFetch } from '@/lib/api';

// Types
export type PlanType = 'STARTER' | 'GROWTH' | 'EXPANSION' | 'ENTERPRISE';
export type SubscriptionStatus = 'Active' | 'Expiring soon' | 'Overdue' | 'Expired';

export interface Church {
	id: string;
	name: string;
	location: string;
	totalMembers: number;
	totalUsers: number;
	plan: PlanType;
	subscriptionStatus: SubscriptionStatus;
}

export interface ChurchListResponse {
	data: Church[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
	totalCount: number;
}

export interface ChurchFilters {
	page?: number;
	limit?: number;
	search?: string;
	plan?: PlanType;
	subscriptionStatus?: SubscriptionStatus;
	sortBy?: 'name' | 'totalMembers' | 'createdAt';
	sortOrder?: 'ASC' | 'DESC';
}

// Get all churches with pagination and filters
export async function fetchChurches(params?: ChurchFilters): Promise<ChurchListResponse> {
	const query = new URLSearchParams();

	if (params?.page) query.append('page', String(params.page));
	if (params?.limit) query.append('limit', String(params.limit));
	if (params?.search) query.append('search', params.search);
	if (params?.plan) query.append('plan', params.plan);
	if (params?.subscriptionStatus) query.append('subscriptionStatus', params.subscriptionStatus);
	if (params?.sortBy) query.append('sortBy', params.sortBy);
	if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

	const suffix = query.toString() ? `?${query.toString()}` : '';

	return authenticatedFetch<ChurchListResponse>(`/church${suffix}`, {
		method: 'GET',
	});
}

// Get single church by ID
export async function fetchChurchById(id: string): Promise<Church> {
	const response = await authenticatedFetch<{ success: boolean; data: Church }>(`/church/${id}`, {
		method: 'GET',
	});
	return response.data;
}
