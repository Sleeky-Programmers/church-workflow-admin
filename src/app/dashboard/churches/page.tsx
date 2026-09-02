'use client';

import {
    Calendar, ChevronLeft, ChevronRight, Church as ChurchIcon, Clock, CreditCard, Lock, Mail, MapPin,
    Search, Unlock, UserCog, Users, X
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
    Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    blockChurch, Church, fetchChurchById, fetchChurches, PlanType, SubscriptionStatus, unblockChurch,
    updateChurchPlan
} from '@/services/churchService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSearchStore } from '@/stores/useSearchStore';

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

// Pagination state interface
interface PaginationState {
	page: number;
	limit: number;
	totalPages: number;
	itemCount: number;
	totalCount: number;
}

export default function ChurchesPage() {
	const { toast } = useToast();
	const { user } = useAuthStore();

	// Use search store for global search state
	const { searchQuery, setSearchQuery, clearSearch } = useSearchStore();

	// Local state for search input (syncs with store)
	const [localSearch, setLocalSearch] = useState(searchQuery);
	const [searchType, setSearchType] = useState<SearchType>('both');
	const [planFilter, setPlanFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
	const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
	const [isDetailsLoading, setIsDetailsLoading] = useState(false);
	const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);
	const [blockReason, setBlockReason] = useState('');
	const [blockNote, setBlockNote] = useState('');
	const [selectedPlan, setSelectedPlan] = useState('');
	const [churches, setChurches] = useState<Church[]>([]);
	const [loading, setLoading] = useState(true);
	const [tableLoading, setTableLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Pagination state
	const [pagination, setPagination] = useState<PaginationState>({
		page: 1,
		limit: 20,
		totalPages: 1,
		itemCount: 0,
		totalCount: 0,
	});
	const [itemsPerPage, setItemsPerPage] = useState(20);

	// Sync local search with global store when store changes (from navbar)
	useEffect(() => {
		setLocalSearch(searchQuery);
	}, [searchQuery]);

	// Fetch churches on load and when filters change
	useEffect(() => {
		fetchChurchesData();
	}, [planFilter, statusFilter, pagination.page, pagination.limit, searchQuery]);

	const fetchChurchesData = async (showTableLoader = true) => {
		if (showTableLoader) {
			setTableLoading(true);
		} else {
			setLoading(true);
		}
		setError(null);

		try {
			const params: any = {
				page: pagination.page,
				limit: pagination.limit,
			};
			if (planFilter !== 'all') params.plan = planFilter;
			if (statusFilter !== 'all') params.subscriptionStatus = statusFilter;
			if (searchQuery) params.search = searchQuery; // Use global search query

			const response = await fetchChurches(params);
			setChurches(response.data);
			setPagination((prev) => ({
				...prev,
				totalPages: response.pagination.totalPages,
				itemCount: response.pagination.itemCount,
				totalCount: response.totalCount,
			}));
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
			setTableLoading(false);
		}
	};

	const loadChurchDetails = async (id: string) => {
		setIsDetailsLoading(true);
		try {
			const extraDetails = await fetchChurchById(id);
			setSelectedChurch((prev) => (prev && prev.id === id ? { ...prev, ...extraDetails } : prev));
		} catch (err) {
			console.error('Failed to fetch church details:', err);
			toast({
				title: 'Error',
				description: 'Failed to load full church details',
				variant: 'destructive',
			});
		} finally {
			setIsDetailsLoading(false);
		}
	};

	// Handle local search change - syncs to global store
	const handleLocalSearchChange = (value: string) => {
		setLocalSearch(value);
		setSearchQuery(value); // Update global store
	};

	// Handle clear search - syncs to global store
	const handleClearSearch = () => {
		setLocalSearch('');
		clearSearch(); // Clear global store
	};

	// Search filtering (client-side) - only used for the search type filter
	// The API already handles the search query, but we keep client-side filtering for search type
	const filteredChurches = churches.filter((church) => {
		if (!localSearch) return true;

		const query = localSearch.toLowerCase();

		if (searchType === 'church') {
			return church.name.toLowerCase().includes(query);
		} else if (searchType === 'location') {
			return church.location.toLowerCase().includes(query);
		} else {
			return church.name.toLowerCase().includes(query) || church.location.toLowerCase().includes(query);
		}
	});

	// Pagination handlers
	const handlePageChange = (newPage: number) => {
		if (newPage < 1 || newPage > pagination.totalPages) return;
		setPagination((prev) => ({ ...prev, page: newPage }));
	};

	const handleItemsPerPageChange = (value: string) => {
		const newLimit = parseInt(value);
		setItemsPerPage(newLimit);
		setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 })); // Reset to first page when changing limit
	};

	const handleViewDetails = (church: Church) => {
		setSelectedChurch(church);
		setIsDetailsDrawerOpen(true);
		loadChurchDetails(church.id);
	};

	const handleOpenBlockConfirm = () => {
		setBlockReason('');
		setBlockNote('');
		setIsBlockConfirmOpen(true);
	};

	const handleToggleBlock = async () => {
		if (!selectedChurch) return;

		// If unblocking, confirm without reason
		if (selectedChurch.isBlocked) {
			setIsSubmitting(true);
			try {
				const result = await unblockChurch(selectedChurch.id, {
					reason: 'Church unblocked by administrator',
				});

				const updatedChurches = churches.map((c) => (c.id === selectedChurch.id ? { ...c, isBlocked: false, ...result.data } : c));
				setChurches(updatedChurches);
				setSelectedChurch({ ...selectedChurch, isBlocked: false });

				toast({
					title: 'Church Unblocked',
					description: `${selectedChurch.name} has been unblocked successfully.`,
				});

				setIsBlockModalOpen(false);
				setIsBlockConfirmOpen(false);
			} catch (err) {
				toast({
					title: 'Error',
					description: err instanceof Error ? err.message : 'Failed to unblock church',
					variant: 'destructive',
				});
			} finally {
				setIsSubmitting(false);
			}
			return;
		}

		// Blocking - validate reason
		if (!blockReason.trim()) {
			toast({
				title: 'Reason Required',
				description: 'Please provide a reason for blocking this church.',
				variant: 'destructive',
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await blockChurch(selectedChurch.id, {
				reason: blockReason.trim(),
				note: blockNote.trim() || `Blocked by ${user?.name || 'Administrator'}`,
			});

			const updatedChurches = churches.map((c) => (c.id === selectedChurch.id ? { ...c, isBlocked: true, ...result.data } : c));
			setChurches(updatedChurches);
			setSelectedChurch({ ...selectedChurch, isBlocked: true });

			toast({
				title: 'Church Blocked',
				description: `${selectedChurch.name} has been blocked.`,
			});

			setIsBlockModalOpen(false);
			setIsBlockConfirmOpen(false);
			setBlockReason('');
			setBlockNote('');
		} catch (err) {
			toast({
				title: 'Error',
				description: err instanceof Error ? err.message : 'Failed to block church',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePlanChange = async () => {
		if (!selectedChurch || !selectedPlan || selectedPlan === selectedChurch.plan) return;

		const previousPlan = selectedChurch.plan;
		setIsSubmitting(true);
		try {
			const result = await updateChurchPlan(selectedChurch.id, selectedPlan as PlanType);

			const updatedChurches = churches.map((c) =>
				c.id === selectedChurch.id ? { ...c, plan: result.plan, subscriptionStatus: 'Active' as SubscriptionStatus } : c
			);
			setChurches(updatedChurches);
			setSelectedChurch((prev) => (prev ? { ...prev, plan: result.plan, subscriptionStatus: 'Active' } : prev));

			toast({
				title: 'Plan Updated',
				description: `${selectedChurch.name} plan changed from ${previousPlan} to ${result.plan}.`,
			});

			setIsPlanModalOpen(false);
			setSelectedPlan('');
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

	const openPlanModal = () => {
		setSelectedPlan(selectedChurch?.plan || '');
		setIsPlanModalOpen(true);
	};

	const getStatusBadge = (status: SubscriptionStatus) => {
		return statusBadgeClass[status] || 'bg-gray-100 text-gray-700';
	};

	// Calculate stats (from all churches data)
	const activeChurches = churches.filter((c) => c.subscriptionStatus === 'Active').length;
	const expiringChurches = churches.filter((c) => c.subscriptionStatus === 'Expiring soon').length;
	const overdueChurches = churches.filter((c) => c.subscriptionStatus === 'Overdue').length;
	const totalMembers = churches.reduce((sum, c) => sum + c.totalMembers, 0);

	// Table skeleton loader
	const TableSkeleton = () => (
		<div className="space-y-2 p-4">
			{[1, 2, 3, 4, 5].map((i) => (
				<div
					key={i}
					className="h-16 bg-gray-100 rounded animate-pulse"
				/>
			))}
		</div>
	);

	// Initial loading state (full page)
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
						<TableSkeleton />
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
					onClick={() => fetchChurchesData(false)}
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
						text={`${pagination.totalCount} registered churches across the platform`}
						variant="muted"
					/>
				</div>
				<div className="flex gap-2">
					<Select
						value={planFilter}
						onValueChange={(value) => {
							setPlanFilter(value);
							setPagination((prev) => ({ ...prev, page: 1 }));
						}}>
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
						onValueChange={(value) => {
							setStatusFilter(value);
							setPagination((prev) => ({ ...prev, page: 1 }));
						}}>
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
				<Card className="rounded-2xl transition-shadow duration-200 hover:shadow-md">
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
									text={pagination.totalCount.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
								<ChurchIcon className="w-5 h-5 text-primary-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl transition-shadow duration-200 hover:shadow-md">
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

				<Card className="rounded-2xl transition-shadow duration-200 hover:shadow-md">
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

				<Card className="rounded-2xl transition-shadow duration-200 hover:shadow-md">
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
						value={localSearch}
						onChange={(e) => handleLocalSearchChange(e.target.value)}
						className="pl-9 pr-8"
					/>
					{localSearch && (
						<Button
							size="icon"
							variant="ghost"
							className="absolute right-0 top-0 h-full px-3 w-auto rounded-full hover:bg-transparent hover:scale-110"
							onClick={handleClearSearch}
							aria-label="Clear search">
							<X className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
						</Button>
					)}
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
					{tableLoading ? (
						<TableSkeleton />
					) : (
						<>
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
															{church.isBlocked && <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Blocked</span>}
														</div>
													</td>
													<td className="py-3 px-4 text-gray-500 text-sm">{church.location}</td>
													<td className="py-3 px-4 font-medium">{church.totalMembers.toLocaleString()}</td>
													<td className="py-3 px-4 font-medium">{church.totalUsers.toLocaleString()}</td>
													<td className="py-3 px-4">
														<span className={cn('px-2 py-1 rounded-full text-xs font-medium', planBadgeClass[church.plan])}>{church.plan}</span>
													</td>
													<td className="py-3 px-4">
														<span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusBadge(church.subscriptionStatus))}>
															{church.subscriptionStatus}
														</span>
													</td>
													<td className="py-3 px-4">
														<Button
															variant="outline"
															size="sm"
															className="h-8 transition-all hover:scale-105 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700"
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

							{filteredChurches.length === 0 && !tableLoading && (
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
						</>
					)}
				</CardContent>
			</Card>

			{/* Pagination Component */}
			{!tableLoading && pagination.totalCount > 0 && (
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl mt-4">
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600 whitespace-nowrap">Rows per page:</span>
						<Select
							value={pagination.limit.toString()}
							onValueChange={handleItemsPerPageChange}>
							<SelectTrigger className="w-20 h-8">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{[5, 10, 20, 50, 100].map((size) => (
									<SelectItem
										key={size}
										value={size.toString()}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="text-sm text-gray-600 whitespace-nowrap">
						Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount}{' '}
						results
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(pagination.page - 1)}
							disabled={pagination.page === 1}
							className="h-8 px-2">
							<ChevronLeft className="h-4 w-4" />
							<span className="hidden sm:inline">Previous</span>
						</Button>

						<div className="flex gap-1">
							{(() => {
								const totalPages = pagination.totalPages;
								const currentPage = pagination.page;
								const pageNumbers = [];

								if (totalPages <= 5) {
									for (let i = 1; i <= totalPages; i++) {
										pageNumbers.push(i);
									}
								} else if (currentPage <= 3) {
									for (let i = 1; i <= 5; i++) {
										pageNumbers.push(i);
									}
								} else if (currentPage >= totalPages - 2) {
									for (let i = totalPages - 4; i <= totalPages; i++) {
										pageNumbers.push(i);
									}
								} else {
									for (let i = currentPage - 2; i <= currentPage + 2; i++) {
										pageNumbers.push(i);
									}
								}

								return pageNumbers.map((pageNum) => (
									<Button
										key={pageNum}
										variant={currentPage === pageNum ? 'default' : 'outline'}
										size="sm"
										onClick={() => handlePageChange(pageNum)}
										className="h-8 w-8 p-0">
										{pageNum}
									</Button>
								));
							})()}
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(pagination.page + 1)}
							disabled={pagination.page === pagination.totalPages}
							className="h-8 px-2">
							<span className="hidden sm:inline">Next</span>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Church Details Drawer */}
			<Drawer
				open={isDetailsDrawerOpen}
				onOpenChange={setIsDetailsDrawerOpen}
				direction="right">
				<DrawerContent
					direction="right"
					className="p-0">
					<DrawerHeader className="text-left px-6 pt-6">
						<DrawerTitle className="flex items-center gap-3">
							<Avatar className="h-10 w-10">
								<AvatarFallback className={cn('text-sm', getAvatarColor(selectedChurch?.name || '').bg, getAvatarColor(selectedChurch?.name || '').text)}>
									{getInitials(selectedChurch?.name || '')}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="text-xl">{selectedChurch?.name}</div>
								<div className="flex flex-wrap items-center gap-2 mt-0.5">
									<span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', selectedChurch && planBadgeClass[selectedChurch.plan])}>
										{selectedChurch?.plan}
									</span>
									<span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', selectedChurch && getStatusBadge(selectedChurch.subscriptionStatus))}>
										{selectedChurch?.subscriptionStatus}
									</span>
									{selectedChurch?.isBlocked && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Blocked</span>}
								</div>
							</div>
						</DrawerTitle>
						<DrawerDescription>Church information and subscription details</DrawerDescription>
					</DrawerHeader>

					<Separator />

					<div className="space-y-5 px-6 py-5">
						{/* Location Section */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<MapPin className="h-4 w-4 text-gray-500" />
								<Text
									text="Location"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6 space-y-1">
								<Text
									text={selectedChurch?.address || selectedChurch?.location || 'N/A'}
									className="text-sm"
								/>
								{(selectedChurch?.state || selectedChurch?.country) && (
									<Text
										text={[selectedChurch?.state, selectedChurch?.country].filter(Boolean).join(', ')}
										variant="muted"
										className="text-xs"
									/>
								)}
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
								{selectedChurch?.alias && (
									<div>
										<Text
											text="Alias"
											variant="muted"
											className="text-xs"
										/>
										<Text
											text={selectedChurch.alias}
											className="text-sm font-medium"
										/>
									</div>
								)}
								{selectedChurch?.defaultCurrency && (
									<div>
										<Text
											text="Currency"
											variant="muted"
											className="text-xs"
										/>
										<Text
											text={selectedChurch.defaultCurrency}
											className="text-sm font-medium"
										/>
									</div>
								)}
							</div>
						</div>

						{/* Owner / Contact Section */}
						{(selectedChurch?.superAdmin || isDetailsLoading) && (
							<div>
								<div className="flex items-center gap-2 mb-2">
									<UserCog className="h-4 w-4 text-gray-500" />
									<Text
										text="Church Owner"
										className="font-medium text-sm"
									/>
								</div>
								<div className="pl-6 space-y-1">
									{isDetailsLoading && !selectedChurch?.superAdmin ? (
										<div className="space-y-2">
											<div className="h-3.5 w-32 bg-gray-100 rounded animate-pulse" />
											<div className="h-3.5 w-44 bg-gray-100 rounded animate-pulse" />
										</div>
									) : selectedChurch?.superAdmin ? (
										<>
											<Text
												text={selectedChurch.superAdmin.fullName}
												className="text-sm font-medium"
											/>
											<div className="flex items-center gap-1.5 text-gray-500">
												<Mail className="h-3.5 w-3.5" />
												<Text
													text={selectedChurch.superAdmin.email}
													className="text-sm"
												/>
											</div>
										</>
									) : null}
								</div>
							</div>
						)}

						{/* Timezone */}
						{selectedChurch?.timeZone && (
							<div>
								<div className="flex items-center gap-2 mb-2">
									<Clock className="h-4 w-4 text-gray-500" />
									<Text
										text="Timezone"
										className="font-medium text-sm"
									/>
								</div>
								<Text
									text={selectedChurch.timeZone}
									className="text-sm pl-6"
								/>
							</div>
						)}

						{/* Registered date */}
						{selectedChurch?.createdAt && (
							<div>
								<div className="flex items-center gap-2 mb-2">
									<Calendar className="h-4 w-4 text-gray-500" />
									<Text
										text="Registered On"
										className="font-medium text-sm"
									/>
								</div>
								<Text
									text={new Date(selectedChurch.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
									className="text-sm pl-6"
								/>
							</div>
						)}

						{/* Block Info if blocked */}
						{selectedChurch?.isBlocked && selectedChurch?.blockReason && (
							<div>
								<div className="flex items-center gap-2 mb-2">
									<Lock className="h-4 w-4 text-red-500" />
									<Text
										text="Block Reason"
										className="font-medium text-sm text-red-600"
									/>
								</div>
								<div className="pl-6 p-3 bg-red-50 rounded-lg border border-red-200">
									<Text
										text={selectedChurch.blockReason}
										className="text-sm text-red-700"
									/>
									{selectedChurch.blockedAt && (
										<Text
											text={`Blocked on: ${new Date(selectedChurch.blockedAt).toLocaleDateString()}`}
											variant="muted"
											className="text-xs mt-1"
										/>
									)}
								</div>
							</div>
						)}
					</div>

					<DrawerFooter className="flex-row justify-between gap-3 border-t px-6 py-4">
						{selectedChurch?.isBlocked ? (
							<Button
								variant="outline"
								className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
								onClick={handleOpenBlockConfirm}>
								<Unlock className="h-4 w-4" />
								Unblock Church
							</Button>
						) : (
							<Button
								variant="outline"
								className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
								onClick={handleOpenBlockConfirm}>
								<Lock className="h-4 w-4" />
								Block Church
							</Button>
						)}
						<div className="flex gap-3">
							<DrawerClose asChild>
								<Button variant="outline">Close</Button>
							</DrawerClose>
							<Button
								onClick={openPlanModal}
								className="transition-transform hover:scale-[1.02]">
								<CreditCard className="h-4 w-4 mr-2" />
								Manage Plan
							</Button>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			{/* Block/Unblock Confirmation Dialog with Reason Input */}
			<AlertDialog
				open={isBlockConfirmOpen}
				onOpenChange={setIsBlockConfirmOpen}>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							{selectedChurch?.isBlocked ? <Unlock className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-red-600" />}
							{selectedChurch?.isBlocked ? 'Unblock Church' : 'Block Church'}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{selectedChurch?.isBlocked ? (
								<>
									You are about to unblock <span className="font-semibold">{selectedChurch?.name}</span>.
									<br />
									<br />
									<span className="text-green-600">✓</span> The church will regain access to all platform features.
									<br />
									<span className="text-green-600">✓</span> All administrators will be able to log in again.
									<br />
									<span className="text-green-600">✓</span> Subscription billing will resume.
								</>
							) : (
								<>
									You are about to block <span className="font-semibold">{selectedChurch?.name}</span>.
									<br />
									<br />
									<span className="text-red-600">⚠</span> The church will lose access to all platform features.
									<br />
									<span className="text-red-600">⚠</span> All administrators will be unable to log in.
									<br />
									<span className="text-red-600">⚠</span> Subscription billing will be paused.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className="space-y-4 py-4">
						{!selectedChurch?.isBlocked && (
							<>
								<div className="space-y-2">
									<Label
										htmlFor="block-reason"
										className="text-sm font-medium">
										Reason for blocking <span className="text-red-500">*</span>
									</Label>
									<Input
										id="block-reason"
										placeholder="e.g., Terms of service violation, Payment default, etc."
										value={blockReason}
										onChange={(e) => setBlockReason(e.target.value)}
										disabled={isSubmitting}
										className="w-full"
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="block-note"
										className="text-sm font-medium">
										Additional Notes (Optional)
									</Label>
									<Textarea
										id="block-note"
										placeholder="Add any additional context or notes..."
										value={blockNote}
										onChange={(e) => setBlockNote(e.target.value)}
										disabled={isSubmitting}
										rows={3}
										className="w-full resize-none"
									/>
								</div>
							</>
						)}
					</div>

					<AlertDialogFooter>
						<AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleToggleBlock}
							className={`${!selectedChurch?.isBlocked ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white-600`}
							disabled={isSubmitting || (!selectedChurch?.isBlocked && !blockReason.trim())}>
							{isSubmitting ? 'Processing...' : selectedChurch?.isBlocked ? 'Yes, Unblock Church' : 'Yes, Block Church'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Plan Management Modal */}
			<Dialog
				open={isPlanModalOpen}
				onOpenChange={setIsPlanModalOpen}>
				<DialogContent
					className="sm:max-w-[550px]"
					showClose={false}>
					<DialogHeader>
						<DialogTitle>Manage Plan - {selectedChurch?.name}</DialogTitle>
						<DialogDescription>Change this church's subscription plan. This is an administrative override and takes effect immediately, without payment.</DialogDescription>
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
											'border rounded-xl p-3 cursor-pointer transition-all hover:shadow-sm',
											selectedPlan === plan.id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'
										)}
										onClick={() => setSelectedPlan(plan.id)}>
										<div className="font-medium text-sm">{plan.name}</div>
										<div className="text-xs text-gray-500 mt-0.5">{plan.price}</div>
										{selectedChurch?.plan === plan.id && <div className="text-xs text-primary-600 mt-1">✓ Current plan</div>}
									</div>
								))}
							</div>
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
		</>
	);
}
