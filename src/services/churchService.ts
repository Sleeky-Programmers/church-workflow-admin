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
	isBlocked?: boolean;
	blockedAt?: string;
	blockedBy?: string;
	blockReason?: string;
	blockHistory?: BlockHistoryEntry[];
}

export interface BlockHistoryEntry {
	action: 'BLOCK' | 'UNBLOCK';
	performedBy: {
		_id: string;
		name: string;
		email: string;
	};
	reason?: string;
	note?: string;
	timestamp: string;
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

export interface BlockChurchDto {
	reason: string;
	note?: string;
}

export interface UnblockChurchDto {
	reason?: string;
	note?: string;
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

// Block a church
export async function blockChurch(id: string, data: BlockChurchDto): Promise<{ success: boolean; message: string; data: Church }> {
	return authenticatedFetch<{ success: boolean; message: string; data: Church }>(`/church/${id}/block`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

// Unblock a church
export async function unblockChurch(id: string, data?: UnblockChurchDto): Promise<{ success: boolean; message: string; data: Church }> {
	return authenticatedFetch<{ success: boolean; message: string; data: Church }>(`/church/${id}/unblock`, {
		method: 'POST',
		body: JSON.stringify(data || {}),
	});
}

// Get block history for a church
export async function getChurchBlockHistory(id: string): Promise<BlockHistoryEntry[]> {
	const response = await authenticatedFetch<{ data: BlockHistoryEntry[] }>(`/church/${id}/block-history`, {
		method: 'GET',
	});
	return response.data;
}
