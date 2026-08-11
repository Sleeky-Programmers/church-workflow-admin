'use client';

import { useEffect, useState } from 'react';

import { StatCard } from '@/components/features/dashboard/StatCard';
import { TrendChart } from '@/components/features/dashboard/trend-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/typography/Heading';
import { Span, Text } from '@/components/ui/typography/Text';
import { getCurrentUserProfile } from '@/lib/auth/session';
import { cn } from '@/lib/utils';
import { CouponStats, fetchCouponStats } from '@/services/couponService';
import { fetchOverview, OverviewMetrics } from '@/services/overviewService';

interface PlanDistribution {
	name: string;
	count: number;
	percentage: number;
	color: string;
}

interface Activity {
	text: string;
	time: string;
	color: string;
}

// Plan color mapping
const PLAN_COLORS: Record<string, string> = {
	GROWTH: 'bg-blue-500',
	STARTER: 'bg-amber-500',
	EXPANSION: 'bg-purple-500',
	ENTERPRISE: 'bg-emerald-500',
};

// Plan display names
const PLAN_DISPLAY_NAMES: Record<string, string> = {
	GROWTH: 'Growth Plan',
	STARTER: 'Starter Plan',
	EXPANSION: 'Expansion Plan',
	ENTERPRISE: 'Enterprise Plan',
};

export default function OverviewDashboard() {
	const [displayName, setDisplayName] = useState('Admin');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State for real data
	const [overviewData, setOverviewData] = useState<OverviewMetrics | null>(null);
	const [couponStats, setCouponStats] = useState<CouponStats | null>(null);
	const [planDistribution, setPlanDistribution] = useState<PlanDistribution[]>([]);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [attendanceTrendData, setAttendanceTrendData] = useState<{ month: string; thisMonth: number; lastMonth: number }[]>([]);
	const [incomeTrendData, setIncomeTrendData] = useState<{ month: string; thisMonth: number; lastMonth: number }[]>([]);

	// Decoupled loading states for better UX
	const [statsLoading, setStatsLoading] = useState(true);
	const [trendLoading, setTrendLoading] = useState(true);
	const [distributionLoading, setDistributionLoading] = useState(true);
	const [activitiesLoading, setActivitiesLoading] = useState(true);

	useEffect(() => {
		const profile = getCurrentUserProfile();
		if (profile?.firstName) setDisplayName(profile.firstName);
		else if (profile?.fullName) setDisplayName(profile.fullName);
	}, []);

	useEffect(() => {
		async function fetchDashboardData() {
			setLoading(true);
			setError(null);

			try {
				// Fetch overview data
				const overview = await fetchOverview();
				setOverviewData(overview);

				// Set individual loading states
				setStatsLoading(false);

				// Transform plan distribution
				if (overview && overview.churchesByPlan) {
					const distribution = transformToPlanDistribution(overview);
					setPlanDistribution(distribution);
					setDistributionLoading(false);
				} else {
					setDistributionLoading(false);
				}

				// Set attendance trend data
				if (overview?.attendanceTrend) {
					setAttendanceTrendData(overview.attendanceTrend);
					setTrendLoading(false);
				} else {
					setTrendLoading(false);
				}

				// Fetch coupon stats separately
				const couponStatsData = await fetchCouponStats();
				setCouponStats(couponStatsData);

				// Transform activities
				const realActivities = transformToActivities(overview, couponStatsData);
				setActivities(realActivities);
				setActivitiesLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
				// Set all loading states to false on error
				setStatsLoading(false);
				setTrendLoading(false);
				setDistributionLoading(false);
				setActivitiesLoading(false);
			} finally {
				setLoading(false);
			}
		}

		fetchDashboardData();
	}, []);

	// Helper functions to transform API data to UI format
	const transformToPlanDistribution = (data: OverviewMetrics): PlanDistribution[] => {
		const distribution: PlanDistribution[] = [];
		const totalChurches = data.totalChurches;

		const sortedPlans = Object.entries(data.churchesByPlan).sort((a, b) => b[1] - a[1]);

		sortedPlans.forEach(([planName, count]) => {
			const percentage = totalChurches > 0 ? Math.round((count / totalChurches) * 100) : 0;

			distribution.push({
				name: PLAN_DISPLAY_NAMES[planName] || planName,
				count,
				percentage,
				color: PLAN_COLORS[planName] || 'bg-gray-500',
			});
		});

		return distribution;
	};

	const transformToActivities = (overview: OverviewMetrics | null, couponStats: CouponStats | null): Activity[] => {
		const activitiesList: Activity[] = [];

		// Add new churches activity
		if (overview && overview.newChurchesLast30Days > 0) {
			activitiesList.push({
				text: `${overview.newChurchesLast30Days} new ${overview.newChurchesLast30Days === 1 ? 'church' : 'churches'} joined in the last 30 days`,
				time: 'Recent',
				color: 'bg-green-500',
			});
		}

		// Add total churches activity
		if (overview && overview.totalChurches > 0) {
			activitiesList.push({
				text: `Total of ${overview.totalChurches} churches on the platform`,
				time: 'Current',
				color: 'bg-blue-500',
			});
		}

		// Add plan distribution insight
		if (overview && overview.totalActiveGrowthPlans > 0) {
			const planText = overview.totalActiveGrowthPlans === 1 ? 'church is' : 'churches are';
			activitiesList.push({
				text: `${overview.totalActiveGrowthPlans} ${planText} on active Growth plan`,
				time: 'Current',
				color: 'bg-purple-500',
			});
		}

		// Add starter plans insight
		if (overview && overview.totalStarterPlans > 0) {
			activitiesList.push({
				text: `${overview.totalStarterPlans} ${overview.totalStarterPlans === 1 ? 'church is' : 'churches are'} on Starter plan`,
				time: 'Current',
				color: 'bg-amber-500',
			});
		}

		// Add coupon usage if available
		if (couponStats && couponStats.totalUsage > 0) {
			activitiesList.push({
				text: `${couponStats.totalUsage} coupon${couponStats.totalUsage === 1 ? '' : 's'} used`,
				time: 'All time',
				color: 'bg-purple-500',
			});
		}

		return activitiesList.length > 0
			? activitiesList
			: [
					{ text: 'Welcome to your dashboard', time: 'Now', color: 'bg-gray-500' },
					{ text: 'Data will appear as churches join', time: 'Now', color: 'bg-gray-400' },
				];
	};

	const hour = new Date().getHours();
	const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

	// Trend Chart Skeleton Component
	const TrendChartSkeleton = () => (
		<Card className="rounded-3xl p-3">
			<CardContent>
				<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
					<div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
				</div>
				<div className="mt-4 h-[260px] sm:h-[300px] bg-gray-100 rounded-lg animate-pulse" />
			</CardContent>
		</Card>
	);

	// Stats Card Skeleton
	const StatsSkeleton = () => (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="h-32 bg-gray-100 rounded-2xl animate-pulse"
				/>
			))}
		</div>
	);

	// Plan Distribution Skeleton
	const PlanDistributionSkeleton = () => (
		<Card className="rounded-2xl">
			<CardHeader className="pb-3">
				<div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
			</CardHeader>
			<CardContent className="space-y-4">
				{[1, 2].map((i) => (
					<div key={i}>
						<div className="flex justify-between text-sm mb-1.5">
							<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
							<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
						</div>
						<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
							<div className="h-full w-3/4 bg-gray-200 rounded-full animate-pulse" />
						</div>
					</div>
				))}
				<div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
					<div className="flex justify-between text-sm">
						<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
					</div>
					<div className="flex justify-between text-sm">
						<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Activities Skeleton
	const ActivitiesSkeleton = () => (
		<Card className="rounded-2xl">
			<CardHeader className="pb-3">
				<div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
			</CardHeader>
			<CardContent className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="flex gap-3 items-start">
						<div className="w-2 h-2 rounded-full bg-gray-200 mt-2 animate-pulse" />
						<div className="flex-1 space-y-1">
							<div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
							<div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);

	// Full page loading state (only on initial load)
	if (loading && !overviewData) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-6">
					<div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
					<div className="h-5 w-80 bg-gray-200 rounded animate-pulse" />
				</div>

				{/* Stats Skeleton */}
				<StatsSkeleton />

				{/* Trend Chart Skeleton */}
				<TrendChartSkeleton />

				{/* Two Column Layout Skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<PlanDistributionSkeleton />
					<ActivitiesSkeleton />
				</div>

				{/* Quick Stats Footer Skeleton */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-24 bg-gray-100 rounded-lg animate-pulse"
						/>
					))}
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="text-red-600 text-center">
					<p className="font-semibold">Failed to load dashboard</p>
					<p className="text-sm mt-1">{error}</p>
				</div>
				<Button
					onClick={() => window.location.reload()}
					variant="outline">
					Try Again
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-6">
				<div>
					<Heading
						level={1}
						text={`${greeting}, ${displayName}`}
					/>
					{overviewData && (
						<Text
							text={`Welcome back! ${overviewData.newChurchesLast30Days} new ${overviewData.newChurchesLast30Days === 1 ? 'church has' : 'churches have'} joined this month.`}
							variant="muted"
							className="mt-1"
						/>
					)}
				</div>
			</div>

			{/* Stats Grid - Skeleton or Data */}
			{statsLoading ? (
				<StatsSkeleton />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<StatCard
						title="Total Churches"
						count={overviewData?.totalChurches?.toString() || '0'}
						growth={`+${overviewData?.newChurchesLast30Days || 0} this month`}
					/>
					<StatCard
						title="Total Members"
						count={overviewData?.totalMembers?.toLocaleString() || '0'}
						growth="Across all churches"
					/>
					<StatCard
						title="Active Growth Plans"
						count={String(overviewData?.churchesByPlan.GROWTH) || '0'}
						growth={`${overviewData?.totalStarterPlans || 0} on Starter plan`}
					/>
				</div>
			)}

			{/* Trend Chart - Skeleton or Data */}
			{trendLoading ? (
				<TrendChartSkeleton />
			) : (
				<div className="my-6 mt-2">
					<TrendChart
						attendanceData={attendanceTrendData}
						incomeData={incomeTrendData}
					/>
				</div>
			)}

			{/* Two Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Churches by Plan Distribution */}
				{distributionLoading ? (
					<PlanDistributionSkeleton />
				) : (
					<Card className="rounded-2xl">
						<CardHeader className="pb-3">
							<CardTitle className="text-base font-medium">Churches by Plan</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{planDistribution.length > 0 ? (
								<>
									{planDistribution.map((plan) => (
										<div key={plan.name}>
											<div className="flex justify-between text-sm mb-1.5">
												<Span text={plan.name} />
												<Span
													text={`${plan.count} ${plan.count === 1 ? 'church' : 'churches'}`}
													variant="muted"
												/>
											</div>
											<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
												<div
													className={cn('h-full rounded-full', plan.color)}
													style={{ width: `${plan.percentage}%` }}
												/>
											</div>
										</div>
									))}
								</>
							) : (
								<div className="text-center py-8">
									<Text
										text="No plan data available"
										variant="muted"
									/>
								</div>
							)}

							{/* Summary Statistics */}
							{overviewData && overviewData.totalChurches > 0 && (
								<div className="pt-4 mt-2 border-t border-gray-100">
									<div className="flex justify-between text-sm mb-2">
										<Span text="Total Churches" />
										<Span
											text={overviewData.totalChurches.toString()}
											className="font-semibold"
										/>
									</div>
									<div className="flex justify-between text-sm">
										<Span text="Active Growth Plans" />
										<Span
											text={String(overviewData.churchesByPlan.GROWTH || 1)}
											className="font-semibold text-blue-600"
										/>
									</div>
									<div className="flex justify-between text-sm mt-2">
										<Span text="Starter Plans" />
										<Span
											text={overviewData.totalStarterPlans.toString()}
											className="font-semibold text-amber-600"
										/>
									</div>
								</div>
							)}

							{couponStats && couponStats.totalUsage > 0 && (
								<div className="pt-4 mt-2 border-t border-gray-100">
									<div className="flex justify-between text-sm">
										<Span text="Total Coupons Used" />
										<Span
											text={couponStats.totalUsage.toString()}
											className="font-semibold"
										/>
									</div>
									{couponStats.activeCoupons > 0 && (
										<div className="flex justify-between text-sm mt-2">
											<Span text="Active Coupons" />
											<Span
												text={couponStats.activeCoupons.toString()}
												className="font-semibold text-green-600"
											/>
										</div>
									)}
								</div>
							)}
						</CardContent>
					</Card>
				)}

				{/* Recent Activity */}
				{activitiesLoading ? (
					<ActivitiesSkeleton />
				) : (
					<Card className="rounded-2xl">
						<CardHeader className="pb-3">
							<CardTitle className="text-base font-medium">Recent Activity</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{activities.map((activity, i) => (
								<div
									key={i}
									className="flex gap-3 items-start">
									<div className={cn('w-2 h-2 rounded-full mt-2', activity.color)} />
									<div className="flex-1">
										<Text
											text={activity.text}
											className="text-sm"
										/>
										<Span
											text={activity.time}
											variant="muted"
											className="text-xs"
										/>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				)}
			</div>

			{/* Quick Stats Footer */}
			{overviewData && (
				<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-gray-50 rounded-lg p-4 text-center">
						<p className="text-2xl font-bold text-gray-900">{overviewData.totalChurches}</p>
						<p className="text-xs text-gray-500 mt-1">Total Churches</p>
					</div>
					<div className="bg-gray-50 rounded-lg p-4 text-center">
						<p className="text-2xl font-bold text-gray-900">{overviewData.newChurchesLast30Days}</p>
						<p className="text-xs text-gray-500 mt-1">New Churches (30d)</p>
					</div>
					<div className="bg-gray-50 rounded-lg p-4 text-center">
						<p className="text-2xl font-bold text-gray-900">{overviewData.churchesByPlan.GROWTH || 0}</p>
						<p className="text-xs text-gray-500 mt-1">Active Growth Plans</p>
					</div>
					<div className="bg-gray-50 rounded-lg p-4 text-center">
						<p className="text-2xl font-bold text-gray-900">{couponStats?.totalUsage || 0}</p>
						<p className="text-xs text-gray-500 mt-1">Coupons Used</p>
					</div>
				</div>
			)}
		</>
	);
}
