// activityLogService.ts
import { authenticatedFetch } from '@/lib/api';

export interface ActivityLogAdmin {
	_id: string;
	name: string;
	email: string;
}

export interface ActivityLog {
	_id: string;
	adminId: ActivityLogAdmin | string | null;
	action: string;
	details: string;
	plan?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ActivityLogListResponse {
	data: ActivityLog[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

export interface ActivityLogStats {
	totalActivities: number;
	activitiesToday: number;
	activitiesThisWeek: number;
	activeAdminsThisWeek: number;
}

export async function fetchActivityLogs(params?: { page?: number; limit?: number; adminId?: string; action?: string; plan?: string }): Promise<ActivityLogListResponse> {
	const query = new URLSearchParams();
	if (params?.page) query.append('page', String(params.page));
	if (params?.limit) query.append('limit', String(params.limit));
	if (params?.adminId) query.append('adminId', params.adminId);
	if (params?.action) query.append('action', params.action);
	if (params?.plan) query.append('plan', params.plan);

	const suffix = query.toString() ? `?${query.toString()}` : '';
	return authenticatedFetch<ActivityLogListResponse>(`/admin-activity-log${suffix}`, {
		method: 'GET',
	});
}

export async function fetchActivityLogStats(): Promise<ActivityLogStats> {
	return authenticatedFetch<ActivityLogStats>('/admin-activity-log/stats', {
		method: 'GET',
	});
}

export async function fetchActivityLogById(id: string): Promise<ActivityLog> {
	return authenticatedFetch<ActivityLog>(`/admin-activity-log/${id}`, {
		method: 'GET',
	});
}
