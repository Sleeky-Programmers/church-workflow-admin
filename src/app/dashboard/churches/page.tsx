'use client';

import { Church as ChurchIcon, CreditCard, Lock, Mail, MapPin, Search, Unlock, UserCog, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Church, fetchChurchById, fetchChurches, PlanType, SubscriptionStatus } from '@/services/churchService';
import { validateCoupon } from '@/services/couponService';

// Helper function to get initials from church name
const getInitials = (name: string) => {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
};

// Helper function to get random color for avatar
const getAvatarColor = (name: string) => {
	const colors = [
		{ bg: 'bg-green-100', text: 'text-green-700' },
		{ bg: 'bg-blue-100', text: 'text-blue-700' },
		{ bg: 'bg-amber-100', text: 'text-amber-700' },
		{ bg: 'bg-purple-100', text: 'text-purple-700' },
		{ bg: 'bg-pink-100', text: 'text-pink-700' },
		{ bg: 'bg-indigo-100', text: 'text-indigo-700' },
		{ bg: 'bg-red-100', text: 'text-red-700' },
		{ bg: 'bg-lime-100', text: 'text-lime-700' },
	];
	const index = name.length % colors.length;
	return colors[index];
};

const planBadgeClass: Record<PlanType, string> = {
	ENTERPRISE: 'bg-green-100 text-green-700',
	GROWTH: 'bg-blue-100 text-blue-700',
	STARTER: 'bg-amber-100 text-amber-700',
	EXPANSION: 'bg-purple-100 text-purple-700',
};

const statusBadgeClass: Record<SubscriptionStatus, string> = {
	'Active': 'bg-green-100 text-green-700',
	'Expiring soon': 'bg-amber-100 text-amber-700',
	'Overdue': 'bg-red-100 text-red-700',
	'Expired': 'bg-gray-100 text-gray-700',
};

const planOptions = [
	{ id: 'STARTER', name: 'Starter', price: 'Free' },
	{ id: 'GROWTH', name: 'Growth', price: '₦15,000/mo' },
	{ id: 'EXPANSION', name: 'Expansion', price: '₦25,000/mo' },
	{ id: 'ENTERPRISE', name: 'Enterprise', price: '₦35,000/mo' },
];

type SearchType = 'church' | 'location' | 'both';

export default function ChurchesPage() {
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState('');
	const [searchType, setSearchType] = useState<SearchType>('both');
	const [planFilter, setPlanFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState('');
	const [couponCode, setCouponCode] = useState('');
	const [discountApplied, setDiscountApplied] = useState<{ type: string; value: number } | null>(null);
	const [churches, setChurches] = useState<Church[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch churches on load and when filters change
	useEffect(() => {
		fetchChurchesData();
	}, [planFilter, statusFilter]);

	const fetchChurchesData = async () => {
		setLoading(true);
		setError(null);
		try {
			const params: any = { limit: 100 };
			if (planFilter !== 'all') params.plan = planFilter;
			if (statusFilter !== 'all') params.subscriptionStatus = statusFilter;

			const response = await fetchChurches(params);
			setChurches(response.data);
			setTotalCount(response.totalCount);
		} catch (err) {
			console.error('Failed to fetch churches:', err);
			setError(err instanceof Error ? err.message : 'Failed to load churches');
			toast({
				title: 'Error',
				description: 'Failed to load churches',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchSingleChurch = async (id: string) => {
		try {
			const church = await fetchChurchById(id);
			setSelectedChurch(church);
		} catch (err) {
			console.error('Failed to fetch church details:', err);
			toast({
				title: 'Error',
				description: 'Failed to load church details',
				variant: 'destructive',
			});
		}
	};

	const filteredChurches = churches.filter((church) => {
		if (!searchQuery) return true;

		const query = searchQuery.toLowerCase();

		if (searchType === 'church') {
			return church.name.toLowerCase().includes(query);
		} else if (searchType === 'location') {
			return church.location.toLowerCase().includes(query);
		} else {
			return church.name.toLowerCase().includes(query) || church.location.toLowerCase().includes(query);
		}
	});

	const handleViewDetails = (church: Church) => {
		setSelectedChurch(church);
		setIsModalOpen(true);
	};

	const handlePlanChange = async () => {
		if (!selectedChurch || !selectedPlan) return;

		setIsSubmitting(true);
		try {
			// TODO: Call API to update church plan when endpoint is available
			// const updatedChurch = await updateChurchPlan(selectedChurch.id, { plan: selectedPlan });

			// For now, update locally
			const updatedChurches = churches.map((c) => (c.id === selectedChurch.id ? { ...c, plan: selectedPlan as PlanType } : c));
			setChurches(updatedChurches);

			toast({
				title: 'Plan Updated',
				description: `${selectedChurch.name} plan changed from ${selectedChurch.plan} to ${selectedPlan}`,
			});

			setIsPlanModalOpen(false);
			setSelectedPlan('');
			setCouponCode('');
			setDiscountApplied(null);
		} catch (err) {
			console.error('Failed to update plan:', err);
			toast({
				title: 'Error',
				description: err instanceof Error ? err.message : 'Failed to update plan',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleApplyCoupon = async () => {
		if (!couponCode) return;

		setIsSubmitting(true);
		try {
			const result = await validateCoupon(couponCode);
			if (result.valid && result.coupon) {
				setDiscountApplied({
					type: result.coupon.discountType === 'PERCENTAGE' ? 'percentage' : 'fixed',
					value: result.coupon.discount,
				});
				toast({
					title: 'Coupon Applied',
					description: `${result.coupon.discount}${result.coupon.discountType === 'PERCENTAGE' ? '%' : '₦'} discount applied`,
				});
			} else {
				toast({
					title: 'Invalid Coupon',
					description: result.message || 'The coupon code you entered is not valid',
					variant: 'destructive',
				});
			}
		} catch (err) {
			console.error('Failed to validate coupon:', err);
			toast({
				title: 'Error',
				description: 'Failed to validate coupon',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleToggleBlock = async () => {
		if (!selectedChurch) return;

		setIsSubmitting(true);
		try {
			// TODO: Call API to block/unblock church when endpoint is available
			// For now, just show toast
			// toast({
			// 	title: selectedChurch.isBlocked ? 'Church Unblocked' : 'Church Blocked',
			// 	description: selectedChurch.isBlocked ? `${selectedChurch.name} has been unblocked.` : `${selectedChurch.name} has been blocked.`,
			// });
			setIsBlockModalOpen(false);
		} catch (err) {
			console.error('Failed to toggle block status:', err);
			toast({
				title: 'Error',
				description: err instanceof Error ? err.message : 'Failed to update block status',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const openPlanModal = () => {
		setSelectedPlan(selectedChurch?.plan || '');
		setIsPlanModalOpen(true);
	};

	const getStatusBadge = (status: SubscriptionStatus) => {
		return statusBadgeClass[status] || 'bg-gray-100 text-gray-700';
	};

	// Calculate stats
	const activeChurches = churches.filter((c) => c.subscriptionStatus === 'Active').length;
	const expiringChurches = churches.filter((c) => c.subscriptionStatus === 'Expiring soon').length;
	const overdueChurches = churches.filter((c) => c.subscriptionStatus === 'Overdue').length;
	const totalMembers = churches.reduce((sum, c) => sum + c.totalMembers, 0);

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
					<div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
					<div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-24 bg-gray-100 rounded-2xl animate-pulse"
						/>
					))}
				</div>
				<div className="flex flex-col sm:flex-row gap-3 mb-6">
					<div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
					<div className="h-10 w-[180px] bg-gray-200 rounded animate-pulse" />
				</div>
				<Card className="rounded-2xl">
					<CardContent className="p-0">
						<div className="space-y-2 p-4">
							{[1, 2, 3, 4, 5].map((i) => (
								<div
									key={i}
									className="h-16 bg-gray-100 rounded animate-pulse"
								/>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error && churches.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="text-red-600 text-center">
					<p className="font-semibold">Failed to load churches</p>
					<p className="text-sm mt-1">{error}</p>
				</div>
				<Button
					onClick={fetchChurchesData}
					variant="outline">
					Try Again
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
				<div>
					<Heading
						level={1}
						text="Churches"
					/>
					<Text
						text={`${totalCount} registered churches across the platform`}
						variant="muted"
					/>
				</div>
				<div className="flex gap-2">
					<Select
						value={planFilter}
						onValueChange={setPlanFilter}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="All Plans" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Plans</SelectItem>
							<SelectItem value="ENTERPRISE">Enterprise</SelectItem>
							<SelectItem value="EXPANSION">Expansion</SelectItem>
							<SelectItem value="GROWTH">Growth</SelectItem>
							<SelectItem value="STARTER">Starter</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={statusFilter}
						onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="All Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="Active">Active</SelectItem>
							<SelectItem value="Expiring soon">Expiring Soon</SelectItem>
							<SelectItem value="Overdue">Overdue</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Total Churches"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={totalCount.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
								<ChurchIcon className="w-5 h-5 text-primary-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Active Churches"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={activeChurches.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
								<Badge className="bg-green-500">✓</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Expiring Soon"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={expiringChurches.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
								<Badge className="bg-amber-500">!</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Total Members"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={totalMembers.toLocaleString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
								<Users className="w-5 h-5 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Enhanced Search Bar with Type Selector */}
			<div className="flex flex-col sm:flex-row gap-3 mb-6">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder={
							searchType === 'church' ? 'Search by church name...' : searchType === 'location' ? 'Search by location...' : 'Search by church name or location...'
						}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select
					value={searchType}
					onValueChange={(value: SearchType) => setSearchType(value)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Search by..." />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="both">Church & Location</SelectItem>
						<SelectItem value="church">Church Name Only</SelectItem>
						<SelectItem value="location">Location Only</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Churches Table */}
			<Card className="rounded-2xl">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Church</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Location</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Members</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Users</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Plan</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Status</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredChurches.map((church) => {
									const avatarColor = getAvatarColor(church.name);

									return (
										<tr
											key={church.id}
											className="border-b last:border-0 hover:bg-gray-50 transition-colors">
											<td className="py-3 px-4">
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8">
														<AvatarFallback className={cn(avatarColor.bg, avatarColor.text)}>{getInitials(church.name)}</AvatarFallback>
													</Avatar>
													<span className="font-medium">{church.name}</span>
												</div>
											</td>
											<td className="py-3 px-4 text-gray-500 text-sm">{church.location}</td>
											<td className="py-3 px-4 font-medium">{church.totalMembers.toLocaleString()}</td>
											<td className="py-3 px-4 font-medium">{church.totalUsers.toLocaleString()}</td>
											<td className="py-3 px-4">
												<span className={cn('px-2 py-1 rounded-full text-xs font-medium', planBadgeClass[church.plan])}>{church.plan}</span>
											</td>
											<td className="py-3 px-4">
												<span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusBadge(church.subscriptionStatus))}>{church.subscriptionStatus}</span>
											</td>
											<td className="py-3 px-4">
												<Button
													variant="outline"
													size="sm"
													className="h-8"
													onClick={() => handleViewDetails(church)}>
													View
												</Button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{filteredChurches.length === 0 && !loading && (
						<div className="text-center py-12">
							<Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<Text
								text="No churches found"
								className="text-gray-500"
							/>
							<Text
								text="Try adjusting your search or filters"
								variant="muted"
								className="text-sm"
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Church Details Modal */}
			<Dialog
				open={isModalOpen}
				onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Avatar className="h-10 w-10">
									<AvatarFallback className={cn('text-sm', getAvatarColor(selectedChurch?.name || '').bg, getAvatarColor(selectedChurch?.name || '').text)}>
										{getInitials(selectedChurch?.name || '')}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="text-xl">{selectedChurch?.name}</div>
									<div className="flex items-center gap-2 mt-0.5">
										<span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', selectedChurch && planBadgeClass[selectedChurch.plan])}>
											{selectedChurch?.plan}
										</span>
										<span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', selectedChurch && getStatusBadge(selectedChurch.subscriptionStatus))}>
											{selectedChurch?.subscriptionStatus}
										</span>
									</div>
								</div>
							</div>
						</DialogTitle>
						<DialogDescription>Church information and subscription details</DialogDescription>
					</DialogHeader>

					<Separator className="my-3" />

					<div className="space-y-4">
						{/* Location Section */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<MapPin className="h-4 w-4 text-gray-500" />
								<Text
									text="Location"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6">
								<Text
									text={selectedChurch?.location || 'N/A'}
									className="text-sm"
								/>
							</div>
						</div>

						{/* Church Stats */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<ChurchIcon className="h-4 w-4 text-gray-500" />
								<Text
									text="Church Information"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6 grid grid-cols-2 gap-3">
								<div>
									<Text
										text="Total Members"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedChurch?.totalMembers?.toLocaleString() || '0'}
										className="text-sm font-medium"
									/>
								</div>
								<div>
									<Text
										text="Total Users"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedChurch?.totalUsers?.toLocaleString() || '0'}
										className="text-sm font-medium"
									/>
								</div>
							</div>
						</div>
					</div>

					<Separator className="my-3" />

					<div className="flex justify-between gap-3">
						<Button
							variant="outline"
							className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
							onClick={() => setIsBlockModalOpen(true)}>
							<Lock className="h-4 w-4" />
							Block Church
						</Button>
						<div className="flex gap-3">
							<Button
								variant="outline"
								onClick={() => setIsModalOpen(false)}>
								Close
							</Button>
							<Button onClick={openPlanModal}>
								<CreditCard className="h-4 w-4 mr-2" />
								Manage Plan
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Plan Management Modal */}
			<Dialog
				open={isPlanModalOpen}
				onOpenChange={setIsPlanModalOpen}>
				<DialogContent className="sm:max-w-[550px]">
					<DialogHeader>
						<DialogTitle>Manage Plan - {selectedChurch?.name}</DialogTitle>
						<DialogDescription>Change subscription plan or apply discounts</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Current Plan Display */}
						<div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
							<div>
								<Text
									text="Current Plan"
									variant="muted"
									className="text-xs"
								/>
								<Text
									text={selectedChurch?.plan || 'N/A'}
									className="text-sm font-medium mt-0.5"
								/>
							</div>
							<div className="text-right">
								<Text
									text="Status"
									variant="muted"
									className="text-xs"
								/>
								<span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', selectedChurch && getStatusBadge(selectedChurch.subscriptionStatus))}>
									{selectedChurch?.subscriptionStatus}
								</span>
							</div>
						</div>

						{/* Plan Selection */}
						<div>
							<Text
								text="Change Plan"
								className="text-sm font-medium mb-2"
							/>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{planOptions.map((plan) => (
									<div
										key={plan.id}
										className={cn(
											'border rounded-xl p-3 cursor-pointer transition-all',
											selectedPlan === plan.name ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'
										)}
										onClick={() => setSelectedPlan(plan.name)}>
										<div className="font-medium text-sm">{plan.name}</div>
										<div className="text-xs text-gray-500 mt-0.5">{plan.price}</div>
										{selectedChurch?.plan === plan.name && <div className="text-xs text-primary-600 mt-1">✓ Current plan</div>}
									</div>
								))}
							</div>
						</div>

						{/* Coupon/Discount Section */}
						<div>
							<Text
								text="Apply Coupon / Discount"
								className="text-sm font-medium mb-2"
							/>
							<div className="flex gap-2">
								<Input
									placeholder="Enter coupon code"
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
									className="flex-1"
									disabled={isSubmitting}
								/>
								<Button
									variant="outline"
									onClick={handleApplyCoupon}
									disabled={isSubmitting}>
									Apply
								</Button>
							</div>
							{discountApplied && (
								<div className="mt-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
									✓ Discount applied! {discountApplied.type === 'percentage' ? `${discountApplied.value}% off` : `₦${discountApplied.value.toLocaleString()} off`}
								</div>
							)}
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsPlanModalOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handlePlanChange}
							disabled={!selectedPlan || selectedPlan === selectedChurch?.plan || isSubmitting}>
							{isSubmitting ? 'Updating...' : 'Confirm Change'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Block Confirmation Dialog */}
			<AlertDialog
				open={isBlockModalOpen}
				onOpenChange={setIsBlockModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<Lock className="h-5 w-5 text-red-600" />
							Block Church
						</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to block <span className="font-semibold">{selectedChurch?.name}</span>?
							<br />
							<br />
							<span className="text-red-600">⚠</span> The church will lose access to all platform features.
							<br />
							<span className="text-red-600">⚠</span> All administrators will be unable to log in.
							<br />
							<span className="text-red-600">⚠</span> Subscription billing will be paused.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleToggleBlock}
							className="bg-red-600 hover:bg-red-700"
							disabled={isSubmitting}>
							{isSubmitting ? 'Processing...' : 'Yes, Block Church'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
