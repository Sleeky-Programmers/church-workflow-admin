import { authenticatedFetch } from '@/lib/api';

// Updated types to match actual API response
export interface AnalyticsDataPoint {
	month: string;
	revenue?: number;
	subscription?: number;
	trial?: number;
	conversion?: number;
	active?: number;
	total?: number;
}

export interface AnalyticsMetrics {
	timestamp: string;
	totalChurches: {
		count: number;
		growth: string;
	};
	members: {
		active: {
			count: number;
			growth: string;
		};
		total: {
			count: number;
			growth: string;
		};
	};
	revenue: {
		monthlyRecurringRevenue: {
			amount: number;
			growth: string;
		};
		totalRevenue: {
			amount: number;
			growth: string;
		};
	};
	conversionRate: {
		value: string;
		growth: string;
	};
	mostUsedPlan: {
		plan: string;
		count: number;
		growth: string;
	};
	planDistribution: {
		STARTER: number;
		GROWTH: number;
		EXPANSION: number;
		ENTERPRISE: number;
	};
	planPerformanceBreakdown: Array<{
		plan: string;
		churchesCount: number;
		membersCount: number;
		monthlyRevenue: number;
		growth: string;
	}>;
	revenueSubscriptionData: Array<{
		month: string;
		revenue: number;
		subscription: number;
	}>;
	trialToPaidData: Array<{
		month: string;
		trial: number;
		conversion: number;
	}>;
	membersGrowth: Array<{
		month: string;
		active: number;
		total: number;
	}>;
}

export interface AnalyticsFilterParams {
	from?: string;
	to?: string;
	period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
	serviceId?: string;
	teamId?: string;
}

export interface AnalyticsResponse {
	success: boolean;
	data: AnalyticsMetrics;
	period: {
		from: string;
		to: string;
	};
}

// Fetch main analytics data
export async function fetchAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsMetrics> {
	const query = new URLSearchParams();
	if (params?.from) query.append('from', params.from);
	if (params?.to) query.append('to', params.to);
	if (params?.period) query.append('period', params.period);
	if (params?.serviceId) query.append('serviceId', params.serviceId);
	if (params?.teamId) query.append('teamId', params.teamId);

	const suffix = query.toString() ? `?${query.toString()}` : '';

	const response = await authenticatedFetch<AnalyticsResponse>(`/analytics${suffix}`, {
		method: 'GET',
	});

	return response.data;
}

// Export analytics data (for reports)
export async function exportAnalytics(params?: AnalyticsFilterParams): Promise<Blob> {
	const query = new URLSearchParams();
	if (params?.from) query.append('from', params.from);
	if (params?.to) query.append('to', params.to);
	if (params?.period) query.append('period', params.period);
	if (params?.serviceId) query.append('serviceId', params.serviceId);
	if (params?.teamId) query.append('teamId', params.teamId);
	query.append('format', 'csv');

	const suffix = query.toString() ? `?${query.toString()}` : '';

	const token = localStorage.getItem('accessToken');
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/export${suffix}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error('Export failed');
	}

	return response.blob();
}

// import { authenticatedFetch } from '@/lib/api';

// // Types
// export interface AnalyticsDataPoint {
// 	date: string;
// 	value: number;
// 	label?: string;
// }

// export interface AnalyticsMetrics {
// 	totalRevenue: number;
// 	totalMembers: number;
// 	totalAttendance: number;
// 	conversionRate: number;
// 	activeCoupons: number;
// 	revenueByPeriod: AnalyticsDataPoint[];
// 	memberGrowth: AnalyticsDataPoint[];
// 	attendanceTrend: AnalyticsDataPoint[];
// 	popularServices: {
// 		serviceName: string;
// 		attendance: number;
// 		percentage: number;
// 	}[];
// 	demographics: {
// 		gender: {
// 			male: number;
// 			female: number;
// 			other: number;
// 		};
// 		ageGroups: {
// 			'18-25': number;
// 			'26-35': number;
// 			'36-50': number;
// 			'50+': number;
// 		};
// 	};
// }

// export interface AnalyticsFilterParams {
// 	from?: string;
// 	to?: string;
// 	period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
// 	serviceId?: string;
// 	teamId?: string;
// }

// export interface AnalyticsResponse {
// 	success: boolean;
// 	data: AnalyticsMetrics;
// 	period: {
// 		from: string;
// 		to: string;
// 	};
// }

// // Fetch main analytics data
// export async function fetchAnalytics(params?: AnalyticsFilterParams): Promise<AnalyticsMetrics> {
// 	const query = new URLSearchParams();
// 	if (params?.from) query.append('from', params.from);
// 	if (params?.to) query.append('to', params.to);
// 	if (params?.period) query.append('period', params.period);
// 	if (params?.serviceId) query.append('serviceId', params.serviceId);
// 	if (params?.teamId) query.append('teamId', params.teamId);

// 	const suffix = query.toString() ? `?${query.toString()}` : '';

// 	const response = await authenticatedFetch<AnalyticsResponse>(`/analytics${suffix}`, {
// 		method: 'GET',
// 	});

// 	return response.data;
// }

// // Export analytics data (for reports)
// export async function exportAnalytics(params?: AnalyticsFilterParams): Promise<Blob> {
// 	const query = new URLSearchParams();
// 	if (params?.from) query.append('from', params.from);
// 	if (params?.to) query.append('to', params.to);
// 	if (params?.period) query.append('period', params.period);
// 	if (params?.serviceId) query.append('serviceId', params.serviceId);
// 	if (params?.teamId) query.append('teamId', params.teamId);
// 	query.append('format', 'csv');

// 	const suffix = query.toString() ? `?${query.toString()}` : '';

// 	const token = localStorage.getItem('accessToken');
// 	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/export${suffix}`, {
// 		method: 'GET',
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 		},
// 	});

// 	if (!response.ok) {
// 		throw new Error('Export failed');
// 	}

// 	return response.blob();
// }

// // Get real-time analytics (for live dashboard)
// export async function fetchRealTimeAnalytics(): Promise<{
// 	activeUsers: number;
// 	currentAttendance: number;
// 	recentActivities: {
// 		id: string;
// 		action: string;
// 		timestamp: string;
// 	}[];
// }> {
// 	return authenticatedFetch('/analytics/realtime', {
// 		method: 'GET',
// 	});
// }
