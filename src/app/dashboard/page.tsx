'use client';

import { useEffect, useState } from 'react';

import { StatCard } from '@/components/features/dashboard/StatCard';
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

export default function OverviewDashboard() {
	const [displayName, setDisplayName] = useState('Admin');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State for real data
	const [overviewData, setOverviewData] = useState<OverviewMetrics | null>(null);
	const [couponStats, setCouponStats] = useState<CouponStats | null>(null);
	const [planDistribution, setPlanDistribution] = useState<PlanDistribution[]>([]);
	const [activities, setActivities] = useState<Activity[]>([]);

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
				// Fetch all data in parallel for speed
				const [overview, couponStatsData] = await Promise.all([fetchOverview(), fetchCouponStats()]);

				setOverviewData(overview);
				setCouponStats(couponStatsData);

				// Transform plan distribution from real data
				if (overview && overview.churchesByPlan) {
					const distribution = transformToPlanDistribution(overview);
					setPlanDistribution(distribution);
				}

				// Transform activities from real data
				const realActivities = transformToActivities(overview, couponStatsData);
				setActivities(realActivities);
			} catch (err) {
				console.error('Failed to fetch dashboard data:', err);
				setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
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

		// Map through churchesByPlan object
		Object.entries(data.churchesByPlan).forEach(([planName, count]) => {
			const percentage = totalChurches > 0 ? Math.round((count / totalChurches) * 100) : 0;

			let color = 'bg-gray-500';
			let displayName = planName;

			if (planName === 'GROWTH') {
				color = 'bg-blue-500';
				displayName = 'Growth Plan';
			} else if (planName === 'STARTER') {
				color = 'bg-amber-500';
				displayName = 'Starter Plan';
			}

			distribution.push({
				name: displayName,
				count,
				percentage,
				color,
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
		if (overview && overview.totalActivePlans > 0) {
			activitiesList.push({
				text: `${overview.totalActivePlans} church ${overview.totalActivePlans === 1 ? 'is' : 'are'} on active Growth plan`,
				time: 'Current',
				color: 'bg-purple-500',
			});
		}

		// Add coupon usage if available
		if (couponStats && couponStats.totalUsage > 0) {
			activitiesList.push({
				text: `${couponStats.totalUsage} coupons used`,
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

	// Loading state
	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-6">
					<div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
					<div className="h-5 w-80 bg-gray-200 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-32 bg-gray-100 rounded-2xl animate-pulse"
						/>
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
					<div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
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

			{/* Stats Grid - Using real data */}
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
					count={overviewData?.totalActivePlans?.toString() || '0'}
					growth={`${overviewData?.totalStarterPlans || 0} on Starter plan`}
				/>
			</div>

			{/* Two Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Churches by Plan Distribution */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-3">
						<CardTitle className="text-base font-medium">Churches by Plan</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{planDistribution.length > 0 ? (
							planDistribution.map((plan) => (
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
							))
						) : (
							<Text
								text="No plan data available"
								variant="muted"
								className="text-center py-8"
							/>
						)}

						{couponStats && couponStats.totalUsage > 0 && (
							<div className="pt-4 mt-2 border-t border-gray-100">
								<div className="flex justify-between text-sm">
									<Span text="Active Coupons" />
									<Span
										text={couponStats.activeCoupons.toString()}
										className="font-semibold"
									/>
								</div>
								<div className="flex justify-between text-sm mt-2">
									<Span text="Total Discount Given" />
									{/* This is needed, the backend needs to provide the data */}
									{/* <Span
										text={`$${couponStats.totalDiscountGiven.toLocaleString()}`}
										className="font-semibold text-green-600"
									/> */}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Recent Activity - Using real data */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-3">
						<CardTitle className="text-base font-medium">Recent Activity</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{activities.map((activity, i) => (
							<div
								key={i}
								className="flex gap-3">
								<div className={cn('w-2 h-2 rounded-full mt-1.5', activity.color)} />
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
						<p className="text-2xl font-bold text-gray-900">{couponStats?.totalUsage || 0}</p>
						<p className="text-xs text-gray-500 mt-1">Coupons Used</p>
					</div>
					<div className="bg-gray-50 rounded-lg p-4 text-center">
						<p className="text-2xl font-bold text-gray-900">{overviewData.totalActivePlans}</p>
						<p className="text-xs text-gray-500 mt-1">Active Growth Plans</p>
					</div>
				</div>
			)}
		</>
	);
}
