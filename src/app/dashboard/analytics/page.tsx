'use client';

import { AlertCircle, ArrowDown, ArrowUp, Award, Building2, CreditCard, DollarSign, Download, RefreshCw, Target, TrendingUp, Users, Wallet } from 'lucide-react';
import { useState } from 'react';
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
import { cn } from '@/lib/utils';

// Mock data for charts
const revenueData = [
	{ month: 'Jan', revenue: 425000, subscriptions: 18 },
	{ month: 'Feb', revenue: 478000, subscriptions: 20 },
	{ month: 'Mar', revenue: 512000, subscriptions: 22 },
	{ month: 'Apr', revenue: 498000, subscriptions: 21 },
	{ month: 'May', revenue: 545000, subscriptions: 23 },
	{ month: 'Jun', revenue: 589000, subscriptions: 25 },
	{ month: 'Jul', revenue: 634000, subscriptions: 27 },
	{ month: 'Aug', revenue: 678000, subscriptions: 29 },
	{ month: 'Sep', revenue: 712000, subscriptions: 31 },
	{ month: 'Oct', revenue: 745000, subscriptions: 33 },
	{ month: 'Nov', revenue: 789000, subscriptions: 35 },
	{ month: 'Dec', revenue: 823000, subscriptions: 37 },
];

const planDistribution = [
	{ name: 'Enterprise', value: 8, color: '#1D9E75', churches: 8, percentage: 33.3 },
	{ name: 'Growth', value: 11, color: '#378ADD', churches: 11, percentage: 45.8 },
	{ name: 'Starter', value: 5, color: '#EF9F27', churches: 5, percentage: 20.9 },
];

const conversionData = [
	{ month: 'Jan', trial: 12, converted: 8, lost: 4 },
	{ month: 'Feb', trial: 15, converted: 11, lost: 4 },
	{ month: 'Mar', trial: 18, converted: 13, lost: 5 },
	{ month: 'Apr', trial: 14, converted: 10, lost: 4 },
	{ month: 'May', trial: 20, converted: 15, lost: 5 },
	{ month: 'Jun', trial: 22, converted: 17, lost: 5 },
	{ month: 'Jul', trial: 19, converted: 14, lost: 5 },
	{ month: 'Aug', trial: 25, converted: 20, lost: 5 },
	{ month: 'Sep', trial: 28, converted: 22, lost: 6 },
	{ month: 'Oct', trial: 30, converted: 24, lost: 6 },
	{ month: 'Nov', trial: 32, converted: 26, lost: 6 },
	{ month: 'Dec', trial: 35, converted: 29, lost: 6 },
];

const memberGrowthData = [
	{ month: 'Jan', active: 6200, total: 7200 },
	{ month: 'Feb', active: 6450, total: 7450 },
	{ month: 'Mar', active: 6780, total: 7780 },
	{ month: 'Apr', active: 7020, total: 8020 },
	{ month: 'May', active: 7350, total: 8350 },
	{ month: 'Jun', active: 7680, total: 8680 },
	{ month: 'Jul', active: 7910, total: 8910 },
	{ month: 'Aug', active: 8230, total: 9230 },
	{ month: 'Sep', active: 8560, total: 9560 },
	{ month: 'Oct', active: 8840, total: 9840 },
	{ month: 'Nov', active: 9120, total: 10120 },
	{ month: 'Dec', active: 9412, total: 10412 },
];

const planBreakdownData = [
	{ plan: 'Enterprise', churches: 8, revenue: 280000, growth: 12.5, members: 3850 },
	{ plan: 'Growth', churches: 11, revenue: 165000, growth: 8.3, members: 4120 },
	{ plan: 'Starter', churches: 5, revenue: 0, growth: 2.1, members: 1442 },
];

const recentActivities = [
	{ id: 1, type: 'upgrade', church: 'Grace Chapel', from: 'Growth', to: 'Enterprise', date: '2025-03-15', amount: 35000 },
	{ id: 2, type: 'new', church: 'Living Word Lagos', plan: 'Starter', date: '2025-03-10', amount: 0 },
	{ id: 3, type: 'payment', church: 'Harvest Fields', plan: 'Growth', date: '2025-03-14', amount: 15000 },
	{ id: 4, type: 'upgrade', church: 'New Life Fellowship', from: 'Starter', to: 'Growth', date: '2025-03-08', amount: 15000 },
];

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
						{p.name}: {p.name === 'revenue' ? `₦${p.value.toLocaleString()}` : p.value}
					</p>
				))}
			</div>
		);
	}
	return null;
};

export default function AnalyticsPage() {
	const [timeRange, setTimeRange] = useState('year');
	const [chartMetric, setChartMetric] = useState('revenue');

	// Calculate key metrics
	const totalChurches = planDistribution.reduce((sum, p) => sum + p.churches, 0);
	const totalMembers = 10412;
	const activeMembers = 9412;
	const inactiveMembers = totalMembers - activeMembers;
	const activePercentage = (activeMembers / totalMembers) * 100;

	const mrr = 280000 + 165000; // Enterprise + Growth (Starter is free)
	const arr = mrr * 12;
	const mrrGrowth = 12.8; // percentage growth from last month

	const conversionRate = 82.9; // percentage
	const mostUsedPlan = 'Growth';
	const mostUsedPlanCount = 11;
	const mostUsedPlanPercentage = (mostUsedPlanCount / totalChurches) * 100;

	const avgRevenuePerChurch = mrr / totalChurches;

	const statsCards = [
		{
			title: 'Total Churches',
			value: totalChurches,
			change: '+3',
			changeType: 'positive',
			icon: Building2,
			iconBg: 'bg-green-100',
			iconColor: 'text-green-600',
			description: 'Active churches on platform',
		},
		{
			title: 'Active vs Total Members',
			value: `${activeMembers.toLocaleString()} / ${totalMembers.toLocaleString()}`,
			subValue: `${activePercentage.toFixed(1)}% active`,
			change: '+8.2%',
			changeType: 'positive',
			icon: Users,
			iconBg: 'bg-blue-100',
			iconColor: 'text-blue-600',
			description: 'Member engagement rate',
		},
		{
			title: 'Monthly Recurring Revenue (MRR)',
			value: `₦${mrr.toLocaleString()}`,
			subValue: `ARR: ₦${arr.toLocaleString()}`,
			change: `+${mrrGrowth}%`,
			changeType: 'positive',
			icon: DollarSign,
			iconBg: 'bg-primary-100',
			iconColor: 'text-primary-600',
			description: 'From paid subscriptions',
		},
		{
			title: 'Conversion Rate',
			value: `${conversionRate}%`,
			change: '+5.3%',
			changeType: 'positive',
			icon: Target,
			iconBg: 'bg-purple-100',
			iconColor: 'text-purple-600',
			description: 'Trial → Paid conversion',
		},
		{
			title: 'Most Used Plan',
			value: mostUsedPlan,
			subValue: `${mostUsedPlanCount} churches (${mostUsedPlanPercentage.toFixed(1)}%)`,
			icon: Award,
			iconBg: 'bg-amber-100',
			iconColor: 'text-amber-600',
			description: 'Most popular subscription',
		},
		{
			title: 'Avg Revenue / Church',
			value: `₦${Math.round(avgRevenuePerChurch).toLocaleString()}`,
			change: '+₦4,200',
			changeType: 'positive',
			icon: Wallet,
			iconBg: 'bg-indigo-100',
			iconColor: 'text-indigo-600',
			description: 'Average monthly revenue per church',
		},
	];

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
						onValueChange={setTimeRange}>
						<SelectTrigger className="w-[130px]">
							<SelectValue placeholder="Time Range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="month">Last Month</SelectItem>
							<SelectItem value="quarter">Last Quarter</SelectItem>
							<SelectItem value="year">Last Year</SelectItem>
							<SelectItem value="all">All Time</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						className="gap-2">
						<Download className="h-4 w-4" />
						Export
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="gap-2">
						<RefreshCw className="h-4 w-4" />
						Refresh
					</Button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
				{statsCards.map((stat, idx) => {
					const Icon = stat.icon;
					const isPositive = stat.changeType === 'positive';

					return (
						<Card
							key={idx}
							className="rounded-2xl">
							<CardContent className="pt-5 pb-4">
								<div className="flex items-start justify-between mb-2">
									<div className={cn('p-2 rounded-xl', stat.iconBg)}>
										<Icon className={cn('h-4 w-4', stat.iconColor)} />
									</div>
									{stat.change && (
										<div
											className={cn(
												'flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full',
												isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
											)}>
											{isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
											{stat.change}
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
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-base font-medium">Revenue & Subscriptions</CardTitle>
								<CardDescription>Monthly recurring revenue and active subscriptions</CardDescription>
							</div>
							<div className="flex gap-2">
								<Button
									variant={chartMetric === 'revenue' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setChartMetric('revenue')}
									className="h-7 px-2 text-xs">
									Revenue
								</Button>
								<Button
									variant={chartMetric === 'subscriptions' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setChartMetric('subscriptions')}
									className="h-7 px-2 text-xs">
									Subscriptions
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}>
							{chartMetric === 'revenue' ? (
								<AreaChart data={revenueData}>
									<defs>
										<linearGradient
											id="revenueGradient"
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
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#E5E7EB"
									/>
									<XAxis
										dataKey="month"
										tick={{ fontSize: 12 }}
									/>
									<YAxis
										tick={{ fontSize: 12 }}
										tickFormatter={(value) => `₦${value / 1000}k`}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Area
										type="monotone"
										dataKey="revenue"
										stroke="#1D9E75"
										strokeWidth={2}
										fill="url(#revenueGradient)"
										name="revenue"
									/>
								</AreaChart>
							) : (
								<BarChart data={revenueData}>
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
									<Bar
										dataKey="subscriptions"
										fill="#378ADD"
										radius={[4, 4, 0, 0]}
										name="subscriptions"
									/>
								</BarChart>
							)}
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Plan Distribution Pie Chart */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-medium">Plan Distribution</CardTitle>
						<CardDescription>Breakdown of churches by subscription plan</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col lg:flex-row items-center gap-6">
							<ResponsiveContainer
								width="100%"
								height={240}
								className="lg:w-1/2">
								<RePieChart>
									<Pie
										data={planDistribution}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={90}
										paddingAngle={2}
										dataKey="value"
										label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
										labelLine={false}>
										{planDistribution.map((entry, index) => (
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
								{planDistribution.map((plan) => (
									<div
										key={plan.name}
										className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: plan.color }}
											/>
											<Text
												text={plan.name}
												className="text-sm"
											/>
										</div>
										<div className="text-right">
											<Text
												text={`${plan.churches} churches`}
												className="text-sm font-medium"
											/>
											<Text
												text={`${plan.percentage}%`}
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
					</CardContent>
				</Card>
			</div>

			{/* Charts Row 2 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Conversion Rate Chart */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-medium">Trial to Paid Conversion</CardTitle>
						<CardDescription>Monthly trial signups vs converted customers</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<LineChart data={conversionData}>
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
									dataKey="converted"
									stroke="#1D9E75"
									strokeWidth={2}
									name="Converted"
								/>
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-4 p-3 bg-gray-50 rounded-xl">
							<div className="flex items-center justify-between">
								<div>
									<Text
										text="Conversion Rate"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={`${conversionRate}%`}
										className="text-xl font-bold text-primary-600"
									/>
								</div>
								<div className="text-right">
									<Text
										text="Total Trials"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text="250"
										className="text-lg font-semibold"
									/>
								</div>
								<div className="text-right">
									<Text
										text="Converted"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text="207"
										className="text-lg font-semibold text-green-600"
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Member Growth Chart */}
				<Card className="rounded-2xl">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-medium">Member Growth</CardTitle>
						<CardDescription>Active vs Total members over time</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<AreaChart data={memberGrowthData}>
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
					</CardContent>
				</Card>
			</div>

			{/* Plan Breakdown Table */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				<Card className="rounded-2xl lg:col-span-2">
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
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Revenue (MRR)</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Growth</th>
									</tr>
								</thead>
								<tbody>
									{planBreakdownData.map((plan) => (
										<tr
											key={plan.plan}
											className="border-b last:border-0 hover:bg-gray-50">
											<td className="py-3 px-4">
												<div className="flex items-center gap-2">
													<div
														className={cn('w-2 h-2 rounded-full', plan.plan === 'Enterprise' ? 'bg-green-500' : plan.plan === 'Growth' ? 'bg-blue-500' : 'bg-amber-500')}
													/>
													<span className="font-medium">{plan.plan}</span>
												</div>
											</td>
											<td className="py-3 px-4">{plan.churches} churches</td>
											<td className="py-3 px-4">{plan.members.toLocaleString()}</td>
											<td className="py-3 px-4 font-medium">{plan.revenue === 0 ? 'Free' : `₦${plan.revenue.toLocaleString()}`}</td>
											<td className="py-3 px-4">
												<div className="flex items-center gap-1 text-green-600">
													<ArrowUp className="h-3 w-3" />
													<span>{plan.growth}%</span>
												</div>
											</td>
										</tr>
									))}
								</tbody>
								<tfoot className="bg-gray-50">
									<tr>
										<td className="py-3 px-4 font-semibold">Total</td>
										<td className="py-3 px-4 font-semibold">{totalChurches} churches</td>
										<td className="py-3 px-4 font-semibold">{totalMembers.toLocaleString()}</td>
										<td className="py-3 px-4 font-semibold">₦{mrr.toLocaleString()}</td>
										<td className="py-3 px-4"></td>
									</tr>
								</tfoot>
							</table>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card className="rounded-2xl">
					<CardHeader>
						<CardTitle className="text-base font-medium">Recent Activity</CardTitle>
						<CardDescription>Latest subscription events</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{recentActivities.map((activity) => (
							<div
								key={activity.id}
								className="flex items-start gap-3">
								<div className={cn('p-1.5 rounded-full', activity.type === 'upgrade' ? 'bg-green-100' : activity.type === 'new' ? 'bg-blue-100' : 'bg-purple-100')}>
									{activity.type === 'upgrade' ? (
										<TrendingUp className="h-3 w-3 text-green-600" />
									) : activity.type === 'new' ? (
										<Building2 className="h-3 w-3 text-blue-600" />
									) : (
										<CreditCard className="h-3 w-3 text-purple-600" />
									)}
								</div>
								<div className="flex-1">
									<Text
										text={activity.church}
										className="text-sm font-medium"
									/>
									{activity.type === 'upgrade' ? (
										<Text
											text={`Upgraded from ${activity.from} to ${activity.to}`}
											variant="muted"
											className="text-xs"
										/>
									) : activity.type === 'new' ? (
										<Text
											text={`Signed up for ${activity.plan} plan`}
											variant="muted"
											className="text-xs"
										/>
									) : (
										<Text
											text={`Paid ${activity.plan} plan`}
											variant="muted"
											className="text-xs"
										/>
									)}
									<Text
										text={new Date(activity.date).toLocaleDateString()}
										variant="muted"
										className="text-xs mt-0.5"
									/>
								</div>
								{activity.amount > 0 && (
									<Text
										text={`₦${activity.amount.toLocaleString()}`}
										className="text-sm font-semibold"
									/>
								)}
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Key Insights Section */}
			<Card className="rounded-2xl">
				<CardHeader>
					<CardTitle className="text-base font-medium">Key Insights</CardTitle>
					<CardDescription>Actionable takeaways from your data</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="p-3 bg-green-50 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<TrendingUp className="h-4 w-4 text-green-600" />
								<Text
									text="Growth Opportunity"
									variant="blue"
									className="text-sm font-medium"
								/>
							</div>
							<Text
								text="Growth plan has highest adoption rate at 45.8% of churches"
								className="text-sm"
							/>
						</div>
						<div className="p-3 bg-blue-50 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<Target className="h-4 w-4 text-blue-600" />
								<Text
									text="Upsell Potential"
									variant="blue"
									className="text-sm font-medium"
								/>
							</div>
							<Text
								text="5 Starter churches ready for upgrade to Growth plan"
								className="text-sm"
							/>
						</div>
						<div className="p-3 bg-amber-50 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<AlertCircle className="h-4 w-4 text-amber-600" />
								<Text
									text="At Risk"
									variant="warning"
									className="text-sm font-medium"
								/>
							</div>
							<Text
								text="2 churches with overdue payments need attention"
								className="text-sm"
							/>
						</div>
						<div className="p-3 bg-purple-50 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<Award className="h-4 w-4 text-purple-600" />
								<Text
									text="Top Performer"
									variant="blue"
									className="text-sm font-medium"
								/>
							</div>
							<Text
								text="Grace Chapel leads with 1,240 members and Enterprise plan"
								className="text-sm"
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
