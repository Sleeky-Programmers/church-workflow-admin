'use client';

import { ArrowDown, ArrowUp, Award, Building2, DollarSign, Download, RefreshCw, Target, TrendingUp, Users, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart as RePieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { cn, toSentenceCase } from '@/lib/utils';
import { AnalyticsMetrics, fetchAnalytics } from '@/services/analyticsService';

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
				<p className="font-medium text-sm">{label}</p>
				{payload.map((p: any, idx: number) => (
					<p
						key={idx}
						className="text-sm"
						style={{ color: p.color }}>
						{p.name}: {typeof p.value === 'number' ? (p.name === 'Revenue' || p.name === 'revenue' ? `₦${p.value.toLocaleString()}` : p.value.toLocaleString()) : p.value}
					</p>
				))}
			</div>
		);
	}
	return null;
};

export default function AnalyticsPage() {
	const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('yearly');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State for real analytics data
	const [analyticsData, setAnalyticsData] = useState<AnalyticsMetrics | null>(null);

	useEffect(() => {
		fetchAnalyticsData();
	}, [timeRange]);

	const fetchAnalyticsData = async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await fetchAnalytics({ period: timeRange });
			setAnalyticsData(data);
		} catch (err) {
			console.error('Failed to fetch analytics:', err);
			setError(err instanceof Error ? err.message : 'Failed to load analytics data');
		} finally {
			setLoading(false);
		}
	};

	const handleExport = async () => {
		try {
			const { exportAnalytics } = await import('@/services/analyticsService');
			const blob = await exportAnalytics({ period: timeRange });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Export failed:', err);
		}
	};

	const handleRefresh = () => {
		fetchAnalyticsData();
	};

	// ✅ Calculate total churches from planPerformanceBreakdown summation
	const totalChurchesFromPlans = analyticsData?.planPerformanceBreakdown ? analyticsData.planPerformanceBreakdown.reduce((sum, plan) => sum + plan.churchesCount, 0) : 0;

	// Use the calculated total instead of API value
	const totalChurches = totalChurchesFromPlans || 0;
	const churchesGrowth = analyticsData?.totalChurches.growth || '0%';

	const totalMembers = analyticsData?.members.total.count || 0;
	const membersGrowth = analyticsData?.members.total.growth || '0%';
	const activeMembers = analyticsData?.members.active.count || 0;
	const activePercentage = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0;

	const mrr = analyticsData?.revenue.monthlyRecurringRevenue.amount || 0;
	const mrrGrowth = analyticsData?.revenue.monthlyRecurringRevenue.growth || '0%';
	const totalRevenue = analyticsData?.revenue.totalRevenue.amount || 0;

	const conversionRate = parseFloat(analyticsData?.conversionRate.value || '0');
	const conversionGrowth = analyticsData?.conversionRate.growth || '0%';

	const mostUsedPlan = analyticsData?.mostUsedPlan.plan || 'N/A';
	const mostUsedPlanCount = analyticsData?.mostUsedPlan.count || 0;
	const mostUsedPlanGrowth = analyticsData?.mostUsedPlan.growth || '0%';
	const totalPlans = Object.values(analyticsData?.planDistribution || {}).reduce((a, b) => a + b, 0);
	const mostUsedPlanPercentage = totalPlans > 0 ? (mostUsedPlanCount / totalPlans) * 100 : 0;

	const avgRevenuePerChurch = totalChurches > 0 ? mrr / totalChurches : 0;

	// Prepare plan distribution for pie chart - using actual counts from planPerformanceBreakdown
	const planDistributionData = analyticsData?.planPerformanceBreakdown
		? analyticsData.planPerformanceBreakdown
				.filter((plan) => plan.churchesCount > 0)
				.map((plan) => ({
					name: plan.plan,
					value: (plan.churchesCount / totalChurches) * 100, // Recalculate percentage from actual counts
					color: plan.plan === 'ENTERPRISE' ? '#1D9E75' : plan.plan === 'GROWTH' ? '#378ADD' : plan.plan === 'EXPANSION' ? '#9B59B6' : '#EF9F27',
					churches: plan.churchesCount,
				}))
		: [];

	const statsCards = [
		{
			title: 'Total Churches',
			value: totalChurches,
			growth: churchesGrowth,
			icon: Building2,
			iconBg: 'bg-green-100',
			iconColor: 'text-green-600',
			description: 'Active churches on platform',
		},
		{
			title: 'Total Members',
			value: totalMembers.toLocaleString(),
			subValue: `${activePercentage.toFixed(1)}% active (${activeMembers} active)`,
			growth: membersGrowth,
			icon: Users,
			iconBg: 'bg-blue-100',
			iconColor: 'text-blue-600',
			description: 'Total registered members',
		},
		{
			title: 'Monthly Revenue (MRR)',
			value: `₦${Math.round(mrr).toLocaleString()}`,
			subValue: `Total: ₦${Math.round(totalRevenue).toLocaleString()}`,
			growth: mrrGrowth,
			icon: DollarSign,
			iconBg: 'bg-primary-100',
			iconColor: 'text-primary-600',
			description: 'Monthly recurring revenue',
		},
		{
			title: 'Conversion Rate',
			value: `${conversionRate}%`,
			growth: conversionGrowth,
			icon: Target,
			iconBg: 'bg-purple-100',
			iconColor: 'text-purple-600',
			description: 'Trial → Paid conversion',
		},
		{
			title: 'Most Used Plan',
			value: mostUsedPlan,
			subValue: `${mostUsedPlanCount} churches (${mostUsedPlanPercentage.toFixed(1)}%)`,
			growth: mostUsedPlanGrowth,
			icon: Award,
			iconBg: 'bg-amber-100',
			iconColor: 'text-amber-600',
			description: 'Most popular subscription',
		},
		{
			title: 'Avg Revenue / Church',
			value: `₦${Math.round(avgRevenuePerChurch).toLocaleString()}`,
			icon: Wallet,
			iconBg: 'bg-indigo-100',
			iconColor: 'text-indigo-600',
			description: 'Average monthly revenue per church',
		},
	];

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
					<div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
					<div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="h-32 bg-gray-100 rounded-2xl animate-pulse"
						/>
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
					<div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="text-red-600 text-center">
					<p className="font-semibold">Failed to load analytics</p>
					<p className="text-sm mt-1">{error}</p>
				</div>
				<Button
					onClick={handleRefresh}
					variant="outline">
					Try Again
				</Button>
			</div>
		);
	}

	return (
		<>
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
				<div>
					<Heading
						level={1}
						text="Analytics Dashboard"
					/>
					<Text
						text="Monitor platform performance, revenue, and growth metrics"
						variant="muted"
					/>
				</div>
				<div className="flex gap-2">
					<Select
						value={timeRange}
						onValueChange={(value) => setTimeRange(value as any)}>
						<SelectTrigger className="w-[130px]">
							<SelectValue placeholder="Time Range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="daily">Last Day</SelectItem>
							<SelectItem value="weekly">Last Week</SelectItem>
							<SelectItem value="monthly">Last Month</SelectItem>
							<SelectItem value="yearly">Last Year</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
						onClick={handleExport}>
						<Download className="h-4 w-4" />
						Export
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
						onClick={handleRefresh}>
						<RefreshCw className="h-4 w-4" />
						Refresh
					</Button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
				{statsCards.map((stat, idx) => {
					const Icon = stat.icon;
					const isPositive = stat.growth && stat.growth.startsWith('+');

					return (
						<Card
							key={idx}
							className="rounded-2xl">
							<CardContent className="pt-5 pb-4">
								<div className="flex items-start justify-between mb-2">
									<div className={cn('p-2 rounded-xl', stat.iconBg)}>
										<Icon className={cn('h-4 w-4', stat.iconColor)} />
									</div>
									{stat.growth && (
										<div
											className={cn(
												'flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full',
												isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
											)}>
											{isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
											{stat.growth}
										</div>
									)}
								</div>
								<div>
									<Text
										text={stat.title}
										variant="muted"
										className="text-xs"
									/>
									<div className="mt-1">
										<Heading
											level={3}
											text={stat.value.toString()}
											className="text-lg font-semibold"
										/>
										{stat.subValue && (
											<Text
												text={stat.subValue}
												variant="muted"
												className="text-xs mt-0.5"
											/>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Charts Row 1 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Revenue & Subscriptions Chart */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-2">
						<div>
							<CardTitle className="text-base font-medium">Revenue & Subscriptions</CardTitle>
							<CardDescription>Monthly revenue and active subscriptions over time</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						{analyticsData?.revenueSubscriptionData && analyticsData.revenueSubscriptionData.length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height={300}>
								<BarChart data={analyticsData.revenueSubscriptionData.filter((d) => d.revenue > 0 || d.subscription > 0)}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#E5E7EB"
									/>
									<XAxis
										dataKey="month"
										tick={{ fontSize: 12 }}
									/>
									<YAxis
										yAxisId="left"
										tick={{ fontSize: 12 }}
										tickFormatter={(value) => `₦${value / 1000}k`}
									/>
									<YAxis
										yAxisId="right"
										orientation="right"
										tick={{ fontSize: 12 }}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Legend />
									<Bar
										yAxisId="left"
										dataKey="revenue"
										fill="#1D9E75"
										radius={[4, 4, 0, 0]}
										name="Revenue (₦)"
									/>
									<Bar
										yAxisId="right"
										dataKey="subscription"
										fill="#378ADD"
										radius={[4, 4, 0, 0]}
										name="Subscriptions"
									/>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="h-300 flex items-center justify-center text-gray-400">No revenue data available</div>
						)}
					</CardContent>
				</Card>

				{/* Plan Distribution Pie Chart */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-medium">Plan Distribution</CardTitle>
						<CardDescription>Breakdown of churches by subscription plan</CardDescription>
					</CardHeader>
					<CardContent>
						{planDistributionData.length > 0 ? (
							<div className="flex flex-col lg:flex-row items-center gap-6">
								<ResponsiveContainer
									width="100%"
									height={240}
									className="lg:w-1/2">
									<RePieChart>
										<Pie
											data={planDistributionData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={90}
											paddingAngle={2}
											dataKey="value"
											label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
											labelLine={false}>
											{planDistributionData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={entry.color}
												/>
											))}
										</Pie>
										<Tooltip />
									</RePieChart>
								</ResponsiveContainer>
								<div className="flex-1 space-y-3">
									{planDistributionData.map((plan) => (
										<div
											key={plan.name}
											className="flex items-center justify-between gap-8">
											<div className="flex items-center gap-2">
												<div
													className="w-3 h-3 rounded-full"
													style={{ backgroundColor: plan.color }}
												/>
												<Text
													text={toSentenceCase(plan.name)}
													className="text-sm"
												/>
											</div>
											<div className="text-right">
												<Text
													text={`${plan.churches} churches`}
													className="text-sm font-medium"
												/>
												<Text
													text={`${plan.value.toFixed(2)}%`}
													variant="muted"
													className="text-xs"
												/>
											</div>
										</div>
									))}
									<Separator className="my-2" />
									<div className="flex items-center justify-between pt-1">
										<Text
											text="Total"
											className="text-sm font-medium"
										/>
										<Text
											text={`${totalChurches} churches`}
											className="text-sm font-semibold"
										/>
									</div>
								</div>
							</div>
						) : (
							<div className="h-240 flex items-center justify-center text-gray-400">No plan distribution data available</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Charts Row 2 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Trial to Paid Conversion Chart */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-medium">Trial to Paid Conversion</CardTitle>
						<CardDescription>Monthly trial signups vs converted customers</CardDescription>
					</CardHeader>
					<CardContent>
						{analyticsData?.trialToPaidData && analyticsData.trialToPaidData.filter((d) => d.trial > 0 || d.conversion > 0).length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height={300}>
								<LineChart data={analyticsData.trialToPaidData.filter((d) => d.trial > 0 || d.conversion > 0)}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#E5E7EB"
									/>
									<XAxis
										dataKey="month"
										tick={{ fontSize: 12 }}
									/>
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip content={<CustomTooltip />} />
									<Legend />
									<Line
										type="monotone"
										dataKey="trial"
										stroke="#EF9F27"
										strokeWidth={2}
										name="Trial Signups"
									/>
									<Line
										type="monotone"
										dataKey="conversion"
										stroke="#1D9E75"
										strokeWidth={2}
										name="Converted"
									/>
								</LineChart>
							</ResponsiveContainer>
						) : (
							<div className="h-300 flex items-center justify-center text-gray-400">No conversion data available</div>
						)}
					</CardContent>
				</Card>

				{/* Member Growth Chart */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-medium">Member Growth</CardTitle>
						<CardDescription>Active vs Total members over time</CardDescription>
					</CardHeader>
					<CardContent>
						{analyticsData?.membersGrowth && analyticsData.membersGrowth.filter((d) => d.active > 0 || d.total > 0).length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height={300}>
								<AreaChart data={analyticsData.membersGrowth.filter((d) => d.active > 0 || d.total > 0)}>
									<defs>
										<linearGradient
											id="activeGradient"
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop
												offset="5%"
												stopColor="#1D9E75"
												stopOpacity={0.3}
											/>
											<stop
												offset="95%"
												stopColor="#1D9E75"
												stopOpacity={0}
											/>
										</linearGradient>
										<linearGradient
											id="totalGradient"
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop
												offset="5%"
												stopColor="#378ADD"
												stopOpacity={0.2}
											/>
											<stop
												offset="95%"
												stopColor="#378ADD"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#E5E7EB"
									/>
									<XAxis
										dataKey="month"
										tick={{ fontSize: 12 }}
									/>
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip content={<CustomTooltip />} />
									<Legend />
									<Area
										type="monotone"
										dataKey="active"
										stroke="#1D9E75"
										strokeWidth={2}
										fill="url(#activeGradient)"
										name="Active Members"
									/>
									<Area
										type="monotone"
										dataKey="total"
										stroke="#378ADD"
										strokeWidth={2}
										fill="url(#totalGradient)"
										name="Total Members"
									/>
								</AreaChart>
							</ResponsiveContainer>
						) : (
							<div className="h-300 flex items-center justify-center text-gray-400">No member growth data available</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Plan Performance Breakdown Table */}
			{analyticsData?.planPerformanceBreakdown && analyticsData.planPerformanceBreakdown.length > 0 && (
				<Card className="rounded-2xl mb-6">
					<CardHeader>
						<CardTitle className="text-base font-medium">Plan Performance Breakdown</CardTitle>
						<CardDescription>Detailed metrics by subscription plan</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Plan</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Churches</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Members</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Monthly Revenue</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Growth</th>
									</tr>
								</thead>
								<tbody>
									{analyticsData.planPerformanceBreakdown.map((plan) => (
										<tr
											key={plan.plan}
											className="border-b last:border-0 hover:bg-gray-50">
											<td className="py-3 px-4">
												<div className="flex items-center gap-2">
													<div
														className={cn(
															'w-2 h-2 rounded-full',
															plan.plan === 'ENTERPRISE'
																? 'bg-green-500'
																: plan.plan === 'GROWTH'
																	? 'bg-blue-500'
																	: plan.plan === 'EXPANSION'
																		? 'bg-purple-500'
																		: 'bg-amber-500'
														)}
													/>
													<span className="font-medium">{plan.plan}</span>
												</div>
											</td>
											<td className="py-3 px-4">{plan.churchesCount} churches</td>
											<td className="py-3 px-4">{plan.membersCount.toLocaleString()}</td>
											<td className="py-3 px-4 font-medium">
												{plan.plan === 'STARTER' && plan.monthlyRevenue === 0 ? 'Free' : `₦${Math.round(plan.monthlyRevenue).toLocaleString()}`}
											</td>
											<td className="py-3 px-4">
												{plan.growth !== '0%' && (
													<div className={cn('flex items-center gap-1', plan.growth.startsWith('+') ? 'text-green-600' : 'text-red-600')}>
														{plan.growth.startsWith('+') ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
														<span>{plan.growth}</span>
													</div>
												)}
												{plan.growth === '0%' && <span className="text-gray-400">0%</span>}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot className="bg-gray-50">
									<tr>
										<td className="py-3 px-4 font-semibold">Total</td>
										<td className="py-3 px-4 font-semibold">{totalChurches} churches</td>
										<td className="py-3 px-4 font-semibold">{totalMembers.toLocaleString()}</td>
										<td className="py-3 px-4 font-semibold">₦{Math.round(mrr).toLocaleString()}</td>
										<td className="py-3 px-4"></td>
									</tr>
								</tfoot>
							</table>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Key Insights */}
			{analyticsData && (
				<Card className="rounded-2xl">
					<CardHeader>
						<CardTitle className="text-base font-medium">Key Insights</CardTitle>
						<CardDescription>Actionable takeaways from your data</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{totalChurches > 0 && (
								<div className="p-3 bg-green-50 rounded-xl">
									<div className="flex items-center gap-2 mb-2">
										<TrendingUp className="h-4 w-4 text-green-600" />
										<Text
											text="Church Growth"
											className="text-sm font-medium"
										/>
									</div>
									<Text
										text={`${totalChurches} total churches with ${churchesGrowth} growth`}
										className="text-sm"
									/>
								</div>
							)}

							{conversionRate > 0 && (
								<div className="p-3 bg-blue-50 rounded-xl">
									<div className="flex items-center gap-2 mb-2">
										<Target className="h-4 w-4 text-blue-600" />
										<Text
											text="Conversion Rate"
											className="text-sm font-medium"
										/>
									</div>
									<Text
										text={`${conversionRate}% conversion rate (${conversionGrowth})`}
										className="text-sm"
									/>
								</div>
							)}

							{mrr > 0 && (
								<div className="p-3 bg-purple-50 rounded-xl">
									<div className="flex items-center gap-2 mb-2">
										<DollarSign className="h-4 w-4 text-purple-600" />
										<Text
											text="Monthly Revenue"
											className="text-sm font-medium"
										/>
									</div>
									<Text
										text={`₦${Math.round(mrr).toLocaleString()} MRR (${mrrGrowth})`}
										className="text-sm"
									/>
								</div>
							)}

							{mostUsedPlanCount > 0 && (
								<div className="p-3 bg-amber-50 rounded-xl">
									<div className="flex items-center gap-2 mb-2">
										<Award className="h-4 w-4 text-amber-600" />
										<Text
											text="Most Used Plan"
											className="text-sm font-medium"
										/>
									</div>
									<Text
										text={`${mostUsedPlan} plan with ${mostUsedPlanCount} churches`}
										className="text-sm"
									/>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}
