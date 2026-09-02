import { authenticatedFetch } from '@/lib/api';

// Types
export type PlanType = 'STARTER' | 'GROWTH' | 'EXPANSION' | 'ENTERPRISE';
export type SubscriptionStatus = 'Active' | 'Expiring soon' | 'Overdue' | 'Expired';

export interface ChurchAdminContact {
	fullName: string;
	email: string;
}

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
	// Fields only present on the detail response (GET /church/:id)
	alias?: string;
	address?: string;
	country?: string;
	state?: string;
	defaultCurrency?: string;
	timeZone?: string;
	logoUrl?: string;
	createdAt?: string;
	updatedAt?: string;
	superAdmin?: ChurchAdminContact;
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

// Raw shape returned by GET /church/:id (unwrapped Mongo document + computed fields)
interface ChurchDetailsRaw {
	_id: string;
	alias?: string;
	address?: string;
	country?: string;
	state?: string;
	defaultCurrency?: string;
	timeZone?: string;
	logoUrl?: string;
	createdAt?: string;
	updatedAt?: string;
	superAdmin?: { id?: string; fullName: string; email: string } | null;
}

// Get single church by ID — returns the detail-only fields not present on the list row
// (list-derived fields like plan/subscriptionStatus/totalMembers are kept from the table row,
// since the detail endpoint doesn't recompute subscriptionStatus).
export async function fetchChurchById(id: string): Promise<Partial<Church>> {
	const raw = await authenticatedFetch<ChurchDetailsRaw>(`/church/${id}`, {
		method: 'GET',
	});

	return {
		id: raw._id,
		alias: raw.alias,
		address: raw.address,
		country: raw.country,
		state: raw.state,
		defaultCurrency: raw.defaultCurrency,
		timeZone: raw.timeZone,
		logoUrl: raw.logoUrl,
		createdAt: raw.createdAt,
		updatedAt: raw.updatedAt,
		superAdmin: raw.superAdmin ? { fullName: raw.superAdmin.fullName, email: raw.superAdmin.email } : undefined,
	};
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

export type BillingCycle = 'MONTHLY' | 'YEARLY';

export interface UpdateChurchPlanResponse {
	plan: PlanType;
	billingCycle: BillingCycle;
	status: string;
	startDate: string;
	endDate: string;
}

// Product-admin override: sets a church's plan directly (no payment involved).
export async function updateChurchPlan(id: string, plan: PlanType, billingCycle: BillingCycle = 'MONTHLY'): Promise<UpdateChurchPlanResponse> {
	return authenticatedFetch<UpdateChurchPlanResponse>(`/church/${id}/plan`, {
		method: 'PATCH',
		body: JSON.stringify({ plan, billingCycle }),
	});
}

export async function updateChurch(data: any, file?: File) {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value) formData.append(key, value as string);
	});

	if (file) {
		formData.append('file', file);
	}

	return await authenticatedFetch('/church/me', {
		method: 'PATCH',
		body: formData,
	});
}
