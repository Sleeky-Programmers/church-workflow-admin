import { authenticatedFetch } from '@/lib/api';

// Updated to match actual API response
export interface OverviewMetrics {
	totalChurches: number;
	newChurchesLast30Days: number;
	totalMembers: number;
	totalActivePlans: number;
	totalStarterPlans: number;
	churchesByPlan: {
		GROWTH: number;
		STARTER: number;
	};
	attendanceTrend: { month: string; thisMonth: number; lastMonth: number }[];
}

export interface OverviewResponse {
	success: boolean;
	data: OverviewMetrics;
}

export async function fetchOverview(params?: { from?: string; to?: string }): Promise<OverviewMetrics> {
	const query = params?.from || params?.to ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';

	const response = await authenticatedFetch<OverviewMetrics>(`/analytics/overview${query}`, {
		method: 'GET',
	});

	return response;
}
