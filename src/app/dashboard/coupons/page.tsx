'use client';

import { format } from 'date-fns';
import {
    AlertCircle, Calendar, CheckCircle, Copy, DollarSign, Edit, Gift, Percent, Plus, Search, Tag,
    Trash2, Users, X, XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';
import {
    Coupon, CouponStats, CouponStatus, CouponType, createCoupon, CreateCouponPayload, deleteCoupon,
    DiscountType, fetchCoupons, fetchCouponStats, PlanType, toggleCouponStatus, updateCoupon
} from '@/services/couponService';
import { useSearchStore } from '@/stores/useSearchStore';

const typeConfig = {
	FLAT: { label: 'Fixed Amount', icon: DollarSign, suffix: 'off' },
	PERCENTAGE: { label: 'Percentage', icon: Percent, suffix: '%' },
};

const couponTypeOptions: { value: CouponType; label: string }[] = [
	{ value: 'WELCOME_COUPON', label: 'Welcome Coupon' },
	{ value: 'FIRST_FREE', label: 'First Free' },
	{ value: 'GROWTH_25', label: 'Growth 25' },
	{ value: 'ENTERPRISE_50K', label: 'Enterprise 50K' },
	{ value: 'BLACK_FRIDAY', label: 'Black Friday' },
	{ value: 'BULK_10', label: 'Bulk 10' },
	{ value: 'SAVE_15', label: 'Save 15' },
	{ value: 'CUSTOM', label: 'Custom' },
];

const planOptions: { value: PlanType; label: string }[] = [
	{ value: 'STARTER', label: 'Starter' },
	{ value: 'GROWTH', label: 'Growth' },
	{ value: 'EXPANSION', label: 'Expansion' },
	{ value: 'ENTERPRISE', label: 'Enterprise' },
];

const statusConfig: Record<string, { label: string; icon: any; class: string }> = {
	active: { label: 'Active', icon: CheckCircle, class: 'bg-green-100 text-green-700' },
	inactive: { label: 'Inactive', icon: XCircle, class: 'bg-gray-100 text-gray-700' },
	expired: { label: 'Expired', icon: AlertCircle, class: 'bg-red-100 text-red-700' },
	exhausted: { label: 'Exhausted', icon: XCircle, class: 'bg-yellow-100 text-yellow-700' },
	draft: { label: 'Draft', icon: Edit, class: 'bg-gray-100 text-gray-700' },
	expiring_soon: { label: 'Expiring Soon', icon: AlertCircle, class: 'bg-amber-100 text-amber-700' },
	disabled: { label: 'Disabled', icon: XCircle, class: 'bg-gray-100 text-gray-700' },
	fully_used: { label: 'Fully Used', icon: XCircle, class: 'bg-yellow-100 text-yellow-700' },
	published: { label: 'Published', icon: CheckCircle, class: 'bg-blue-100 text-blue-700' },
};

export default function CouponsPage() {
	// Use search store for global search state
	const { searchQuery, setSearchQuery, clearSearch } = useSearchStore();

	// Local state for search input (syncs with store)
	const [localSearch, setLocalSearch] = useState(searchQuery);
	const [statusFilter, setStatusFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [couponStats, setCouponStats] = useState<CouponStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [copiedCode, setCopiedCode] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		code: '',
		type: 'CUSTOM' as CouponType,
		discountType: 'FLAT' as DiscountType,
		discount: '',
		description: '',
		validFrom: '',
		expiryDate: '',
		maxUsage: '',
		minPlanTier: '' as PlanType | '',
		excludedPlans: [] as PlanType[],
		isStackable: false,
		isTransferable: false,
		isActive: true,
		status: 'ACTIVE' as CouponStatus,
	});

	// Sync local search with global store when store changes (from navbar)
	useEffect(() => {
		setLocalSearch(searchQuery);
	}, [searchQuery]);

	useEffect(() => {
		fetchCouponsData();
	}, [searchQuery]);

	const fetchCouponsData = async () => {
		setLoading(true);
		setError(null);
		try {
			const params: any = { limit: 100 };
			if (searchQuery) params.search = searchQuery;

			const [couponsData, statsData] = await Promise.all([fetchCoupons(params), fetchCouponStats()]);
			setCoupons(couponsData.data);
			setCouponStats(statsData);
		} catch (err) {
			console.error('Failed to fetch coupons:', err);
			setError(err instanceof Error ? err.message : 'Failed to load coupons');
			toast.error('Failed to load coupons');
		} finally {
			setLoading(false);
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

	const filteredCoupons = coupons.filter((coupon) => {
		// Search is now handled by the API, but we keep client-side filtering for additional filters
		let matchesStatus = true;
		if (statusFilter === 'active') {
			matchesStatus =
				coupon.isActive && (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date()) && (coupon.maxUsage === 0 || coupon.usageCount < coupon.maxUsage);
		} else if (statusFilter === 'inactive') {
			matchesStatus = !coupon.isActive;
		} else if (statusFilter === 'expired') {
			matchesStatus = coupon.expiryDate ? new Date(coupon.expiryDate) <= new Date() : false;
		} else if (statusFilter === 'exhausted') {
			matchesStatus = coupon.maxUsage > 0 && coupon.usageCount >= coupon.maxUsage;
		} else if (statusFilter === 'draft') {
			matchesStatus = coupon.status === 'DRAFT';
		} else if (statusFilter === 'expiring_soon') {
			matchesStatus = coupon.status === 'EXPIRING_SOON';
		} else if (statusFilter === 'fully_used') {
			matchesStatus = coupon.status === 'FULLY_USED';
		}

		let matchesType = true;
		if (typeFilter !== 'all') {
			matchesType = coupon.type === typeFilter;
		}

		return matchesStatus && matchesType;
	});

	const activeCoupons = couponStats?.activeCoupons || 0;
	const totalUsage = couponStats?.totalUsage || 0;
	const expiringSoon = couponStats?.expiringSoon || 0;

	const buildCouponPayload = (data: typeof formData): CreateCouponPayload => {
		const payload: CreateCouponPayload = {
			code: data.code.toUpperCase(),
			type: data.type,
			discountType: data.discountType,
			discount: parseFloat(data.discount),
			description: data.description || '',
			expiryDate: data.expiryDate,
			isStackable: data.isStackable,
			isTransferable: data.isTransferable,
			isActive: data.isActive,
			status: data.status,
		};

		if (data.validFrom) payload.validFrom = data.validFrom;
		if (data.maxUsage) payload.maxUsage = parseInt(data.maxUsage);
		if (data.minPlanTier) {
			payload.minPlanTier = data.minPlanTier as PlanType;
		}
		if (data.excludedPlans.length > 0) payload.excludedPlans = data.excludedPlans;

		return payload;
	};

	const handleCreateCoupon = async () => {
		if (!formData.code || !formData.discount || !formData.expiryDate) {
			setFormError('Please fill in all required fields');
			return;
		}

		setFormError(null);
		setIsSubmitting(true);
		try {
			const payload = buildCouponPayload(formData);
			const newCoupon = await createCoupon(payload);
			setCoupons([newCoupon, ...coupons]);
			toast.success(`${newCoupon.code} has been created successfully.`);
			setIsCreateModalOpen(false);
			resetForm();
			await fetchCouponsData();
		} catch (err: any) {
			console.error('Failed to create coupon:', err);
			let errorMessage = 'Failed to create coupon. Please try again.';
			if (err?.message) {
				errorMessage = err.message;
			} else if (err?.response?.data?.message) {
				const apiMessage = err.response.data.message;
				if (Array.isArray(apiMessage)) {
					errorMessage = apiMessage.join(', ');
				} else {
					errorMessage = apiMessage;
				}
			} else if (typeof err === 'string') {
				errorMessage = err;
			}
			setFormError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditCoupon = async () => {
		if (!selectedCoupon) {
			setFormError('No coupon selected for editing');
			return;
		}

		setFormError(null);
		setIsSubmitting(true);
		try {
			const payload = buildCouponPayload(formData);
			const updatedCoupon = await updateCoupon(selectedCoupon.id, payload);
			setCoupons(coupons.map((c) => (c.id === selectedCoupon.id ? updatedCoupon : c)));
			toast.success(`${selectedCoupon.code} has been updated successfully.`);
			setIsEditModalOpen(false);
			resetForm();
			await fetchCouponsData();
		} catch (err: any) {
			let errorMessage = 'Failed to update coupon. Please try again.';
			if (err?.message) {
				errorMessage = err.message;
			} else if (err?.response?.data?.message) {
				const apiMessage = err.response.data.message;
				if (Array.isArray(apiMessage)) {
					errorMessage = apiMessage.join(', ');
				} else {
					errorMessage = apiMessage;
				}
			} else if (typeof err === 'string') {
				errorMessage = err;
			}
			setFormError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteCoupon = async () => {
		if (!selectedCoupon) {
			toast.error('No coupon selected for deletion');
			return;
		}

		setIsSubmitting(true);
		try {
			await deleteCoupon(selectedCoupon.id);
			setCoupons(coupons.filter((coupon) => coupon.id !== selectedCoupon.id));
			toast.success(`${selectedCoupon.code} has been deleted.`);
			setIsDeleteDialogOpen(false);
			setSelectedCoupon(null);
			await fetchCouponsData();
		} catch (err) {
			console.error('Failed to delete coupon:', err);
			toast.error(err instanceof Error ? err.message : 'Failed to delete coupon');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleToggleStatus = async (coupon: Coupon) => {
		try {
			const newStatus = !coupon.isActive;
			const updatedCoupon = await toggleCouponStatus(coupon.id, newStatus);
			setCoupons(coupons.map((c) => (c.id === coupon.id ? updatedCoupon : c)));
			toast.success(`${coupon.code} has been ${newStatus ? 'activated' : 'deactivated'}.`);
			await fetchCouponsData();
		} catch (err) {
			console.error('Failed to toggle coupon status:', err);
			toast.error(err instanceof Error ? err.message : 'Failed to update coupon status');
		}
	};

	const handleCopyCode = async (code: string) => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(code);
			} else {
				const textArea = document.createElement('textarea');
				textArea.value = code;
				textArea.style.position = 'fixed';
				textArea.style.left = '-9999px';
				textArea.style.top = '-9999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}

			setCopiedCode(code);
			setTimeout(() => {
				setCopiedCode(null);
			}, 2000);
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	};

	const openEditModal = (coupon: Coupon) => {
		setSelectedCoupon(coupon);
		setFormError(null);
		setFormData({
			code: coupon.code,
			type: coupon.type,
			discountType: coupon.discountType,
			discount: coupon.discount.toString(),
			description: coupon.description || '',
			validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
			expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
			maxUsage: coupon.maxUsage?.toString() || '',
			minPlanTier: coupon.minPlanTier || '',
			excludedPlans: coupon.excludedPlans || [],
			isStackable: coupon.isStackable,
			isTransferable: coupon.isTransferable,
			isActive: coupon.isActive,
			status: coupon.status,
		});
		setIsEditModalOpen(true);
	};

	const resetForm = () => {
		setFormData({
			code: '',
			type: 'CUSTOM',
			discountType: 'FLAT',
			discount: '',
			description: '',
			validFrom: '',
			expiryDate: '',
			maxUsage: '',
			minPlanTier: '',
			excludedPlans: [],
			isStackable: false,
			isTransferable: false,
			isActive: true,
			status: 'ACTIVE',
		});
		setSelectedCoupon(null);
		setFormError(null);
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return 'Never';
		return format(new Date(dateString), 'MMM dd, yyyy');
	};

	const formatValue = (coupon: Coupon) => {
		if (coupon.discountType === 'PERCENTAGE') {
			return `${coupon.discount}% off`;
		}
		return `₦${coupon.discount.toLocaleString()} off`;
	};

	const getCouponStatus = (coupon: Coupon): string => {
		if (!coupon.isActive) return 'inactive';
		if (coupon.status === 'DRAFT') return 'draft';
		if (coupon.status === 'EXPIRING_SOON') return 'expiring_soon';
		if (coupon.status === 'FULLY_USED') return 'fully_used';
		if (coupon.status === 'DISABLED') return 'disabled';
		if (coupon.status === 'PUBLISHED') return 'published';
		if (coupon.expiryDate && new Date(coupon.expiryDate) <= new Date()) return 'expired';
		if (coupon.maxUsage > 0 && coupon.usageCount >= coupon.maxUsage) return 'exhausted';
		return 'active';
	};

	const getDaysRemaining = (expiryDate: string | null) => {
		if (!expiryDate) return 'No expiry';
		const expiry = new Date(expiryDate);
		const today = new Date();
		const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
		if (days < 0) return 'Expired';
		if (days === 0) return 'Expires today';
		return `${days} days left`;
	};

	const getCouponTypeLabel = (type: CouponType) => {
		return couponTypeOptions.find((t) => t.value === type)?.label || type;
	};

	const handleExcludedPlanToggle = (plan: PlanType) => {
		setFormData((prev) => ({
			...prev,
			excludedPlans: prev.excludedPlans.includes(plan) ? prev.excludedPlans.filter((p) => p !== plan) : [...prev.excludedPlans, plan],
		}));
	};

	const handleFormChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (formError) setFormError(null);
	};

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
				<div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-64 bg-gray-100 rounded-2xl animate-pulse"
						/>
					))}
				</div>
			</div>
		);
	}

	if (error && coupons.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="text-red-600 text-center">
					<p className="font-semibold">Failed to load coupons</p>
					<p className="text-sm mt-1">{error}</p>
				</div>
				<Button
					onClick={fetchCouponsData}
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
						text="Coupon Management"
					/>
					<Text
						text="Create and manage discount coupons for churches"
						variant="muted"
					/>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setIsCreateModalOpen(true);
					}}
					className="gap-2">
					<Plus className="h-4 w-4" />
					Create Coupon
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Active Coupons"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={activeCoupons.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
								<Gift className="w-5 h-5 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Total Usage"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={totalUsage.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
								<Users className="w-5 h-5 text-blue-600" />
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
									text={expiringSoon.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
								<Calendar className="w-5 h-5 text-amber-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Total Coupons"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={coupons.length.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
								<Tag className="w-5 h-5 text-purple-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="rounded-2xl mb-6">
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search by coupon code or description..."
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
							value={statusFilter}
							onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[160px]">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="expired">Expired</SelectItem>
								<SelectItem value="exhausted">Exhausted</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="expiring_soon">Expiring Soon</SelectItem>
								<SelectItem value="fully_used">Fully Used</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={typeFilter}
							onValueChange={setTypeFilter}>
							<SelectTrigger className="w-[160px]">
								<SelectValue placeholder="All Types" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								{couponTypeOptions.map((type) => (
									<SelectItem
										key={type.value}
										value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
				{filteredCoupons.map((coupon) => {
					const TypeIcon = typeConfig[coupon.discountType]?.icon || Percent;
					const status = getCouponStatus(coupon);
					const statusInfo = statusConfig[status] || statusConfig.inactive;
					const daysRemaining = getDaysRemaining(coupon.expiryDate);
					const isExpiringSoon =
						status === 'active' && daysRemaining !== 'Expired' && daysRemaining !== 'Expires today' && daysRemaining !== 'No expiry' && parseInt(daysRemaining) <= 30;
					const usagePercentage = coupon.maxUsage > 0 ? (coupon.usageCount / coupon.maxUsage) * 100 : 0;

					return (
						<Card
							key={coupon.id}
							className="rounded-2xl hover:shadow-md transition-shadow">
							<CardContent className="p-5">
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<code className="text-lg font-bold bg-gray-100 px-2 py-1 rounded-lg font-mono">{coupon.code}</code>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7"
												onClick={() => handleCopyCode(coupon.code)}>
												{copiedCode === coupon.code ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
											</Button>
										</div>
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className="text-xs">
												{getCouponTypeLabel(coupon.type)}
											</Badge>
											{coupon.description && (
												<Text
													text={coupon.description}
													variant="muted"
													className="text-xs"
												/>
											)}
										</div>
									</div>
									<span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', statusInfo?.class)}>
										{statusInfo && <statusInfo.icon className="h-3 w-3" />}
										{statusInfo?.label}
									</span>
								</div>

								<div className="flex items-center gap-2 mb-4">
									<div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 rounded-lg">
										<TypeIcon className="h-3.5 w-3.5 text-primary-600" />
										<span className="text-sm font-semibold text-primary-700">{formatValue(coupon)}</span>
									</div>
									{coupon.minPlanTier && (
										<div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 rounded-lg">
											<span className="text-xs font-medium text-blue-700">Min: {coupon.minPlanTier}</span>
										</div>
									)}
								</div>

								<div className="space-y-2 mb-4">
									<div className="flex justify-between text-sm">
										<Text
											text="Usage"
											variant="muted"
										/>
										<Text text={`${coupon.usageCount} / ${coupon.maxUsage === 0 ? '∞' : coupon.maxUsage}`} />
									</div>
									{coupon.maxUsage > 0 && (
										<div className="w-full bg-gray-100 rounded-full h-1.5">
											<div
												className="bg-primary-600 h-1.5 rounded-full transition-all"
												style={{ width: `${Math.min(usagePercentage, 100)}%` }}
											/>
										</div>
									)}
									<div className="flex justify-between text-xs">
										<div className="flex items-center gap-1">
											<Calendar className="h-3 w-3 text-gray-400" />
											<Text
												text={`Expires: ${formatDate(coupon.expiryDate)}`}
												variant="muted"
											/>
										</div>
										<Text
											text={daysRemaining}
											className={cn('text-xs', isExpiringSoon ? 'text-amber-600' : 'text-gray-500')}
										/>
									</div>
									{coupon.validFrom && (
										<div className="flex items-center gap-1 text-xs">
											<Calendar className="h-3 w-3 text-gray-400" />
											<Text
												text={`Valid from: ${formatDate(coupon.validFrom)}`}
												variant="muted"
											/>
										</div>
									)}
								</div>

								<Separator className="my-3" />

								<div className="flex items-center justify-end gap-2">
									<div className="flex items-center gap-2 mr-auto">
										<Switch
											checked={status === 'active' || status === 'published'}
											onCheckedChange={() => handleToggleStatus(coupon)}
											disabled={status === 'expired' || status === 'exhausted' || status === 'fully_used'}
										/>
										<Text
											text={status === 'active' || status === 'published' ? 'Active' : 'Inactive'}
											variant="muted"
											className="text-xs"
										/>
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1"
										onClick={() => openEditModal(coupon)}>
										<Edit className="h-3.5 w-3.5" />
										Edit
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
										onClick={() => {
											setSelectedCoupon(coupon);
											setIsDeleteDialogOpen(true);
										}}>
										<Trash2 className="h-3.5 w-3.5" />
										Delete
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{filteredCoupons.length === 0 && !loading && (
				<Card className="rounded-2xl">
					<CardContent className="text-center py-12">
						<Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
						<Text
							text="No coupons found"
							className="text-gray-500"
						/>
						<Text
							text={
								searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
									? 'Try adjusting your search or filters'
									: 'Create your first coupon to start offering discounts'
							}
							variant="muted"
							className="text-sm"
						/>
						{!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
							<Button
								onClick={() => {
									resetForm();
									setIsCreateModalOpen(true);
								}}
								className="mt-4 gap-2">
								<Plus className="h-4 w-4" />
								Create Coupon
							</Button>
						)}
					</CardContent>
				</Card>
			)}

			{/* Create/Edit Coupon Modal */}
			<Dialog
				open={isCreateModalOpen || isEditModalOpen}
				onOpenChange={(open) => {
					if (!open) {
						setIsCreateModalOpen(false);
						setIsEditModalOpen(false);
						resetForm();
					}
				}}>
				<DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{isCreateModalOpen ? 'Create New Coupon' : 'Edit Coupon'}</DialogTitle>
						<DialogDescription>{isCreateModalOpen ? 'Create a discount coupon for churches to use' : 'Modify the coupon details below'}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Error Alert */}
						{formError && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
								<div className="flex-shrink-0 mt-0.5">
									<AlertCircle className="h-4 w-4 text-red-500" />
								</div>
								<div className="flex-1 text-sm text-red-700 whitespace-pre-wrap">{formError}</div>
								<Button
									variant="ghost"
									size="sm"
									className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 flex-shrink-0"
									onClick={() => setFormError(null)}>
									<X className="h-4 w-4" />
								</Button>
							</div>
						)}

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="code">Coupon Code *</Label>
								<Input
									id="code"
									placeholder="e.g., SUMMER20"
									value={formData.code}
									onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
									maxLength={20}
									disabled={isSubmitting || isEditModalOpen}
									className={cn('mt-1.5 font-mono', formError && !formData.code ? 'border-red-500' : '')}
								/>
								<Text
									text="Only letters, numbers, and underscores"
									variant="muted"
									className="text-xs mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="type">Coupon Type *</Label>
								<Select
									value={formData.type}
									onValueChange={(value) => handleFormChange('type', value as CouponType)}
									disabled={isSubmitting}>
									<SelectTrigger className="mt-1.5">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										{couponTypeOptions.map((type) => (
											<SelectItem
												key={type.value}
												value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div>
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								placeholder="What is this coupon for?"
								value={formData.description}
								onChange={(e) => handleFormChange('description', e.target.value)}
								className="mt-1.5"
								disabled={isSubmitting}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="discountType">Discount Type *</Label>
								<Select
									value={formData.discountType}
									onValueChange={(value) => handleFormChange('discountType', value as DiscountType)}
									disabled={isSubmitting}>
									<SelectTrigger className="mt-1.5">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="FLAT">Fixed Amount (₦)</SelectItem>
										<SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="discount">Discount Value *</Label>
								<Input
									id="discount"
									type="number"
									placeholder={formData.discountType === 'PERCENTAGE' ? 'e.g., 20' : 'e.g., 5000'}
									value={formData.discount}
									onChange={(e) => handleFormChange('discount', e.target.value)}
									className={cn('mt-1.5', formError && !formData.discount ? 'border-red-500' : '')}
									disabled={isSubmitting}
									min="0.01"
									step="0.01"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="validFrom">Valid From</Label>
								<Input
									id="validFrom"
									type="date"
									value={formData.validFrom}
									onChange={(e) => handleFormChange('validFrom', e.target.value)}
									className="mt-1.5"
									disabled={isSubmitting}
								/>
							</div>
							<div>
								<Label htmlFor="expiryDate">Expiry Date *</Label>
								<Input
									id="expiryDate"
									type="date"
									value={formData.expiryDate}
									onChange={(e) => handleFormChange('expiryDate', e.target.value)}
									className={cn('mt-1.5', formError && !formData.expiryDate ? 'border-red-500' : '')}
									min={new Date().toISOString().split('T')[0]}
									disabled={isSubmitting}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="maxUsage">Usage Limit</Label>
								<Input
									id="maxUsage"
									type="number"
									placeholder="Leave empty for unlimited"
									value={formData.maxUsage}
									onChange={(e) => handleFormChange('maxUsage', e.target.value)}
									className="mt-1.5"
									disabled={isSubmitting}
									min="0"
								/>
							</div>
							<div>
								<Label htmlFor="minPlanTier">Minimum Plan Tier</Label>
								<Select
									value={formData.minPlanTier || 'none'}
									onValueChange={(value) => {
										handleFormChange('minPlanTier', value === 'none' ? '' : (value as PlanType));
									}}
									disabled={isSubmitting}>
									<SelectTrigger className="mt-1.5">
										<SelectValue placeholder="No minimum" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">No minimum</SelectItem>
										{planOptions.map((plan) => (
											<SelectItem
												key={plan.value}
												value={plan.value}>
												{plan.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div>
							<Label>Excluded Plans</Label>
							<div className="flex flex-wrap gap-2 mt-1.5">
								{planOptions.map((plan) => (
									<Button
										key={plan.value}
										type="button"
										variant={formData.excludedPlans.includes(plan.value) ? 'default' : 'outline'}
										size="sm"
										className="h-8"
										onClick={() => handleExcludedPlanToggle(plan.value)}
										disabled={isSubmitting}>
										{plan.label}
									</Button>
								))}
							</div>
							<Text
								text="Select plans that cannot use this coupon"
								variant="muted"
								className="text-xs mt-1"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="status">Status</Label>
								<Select
									value={formData.status}
									onValueChange={(value) => handleFormChange('status', value as CouponStatus)}
									disabled={isSubmitting}>
									<SelectTrigger className="mt-1.5">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="DRAFT">Draft</SelectItem>
										<SelectItem value="PUBLISHED">Published</SelectItem>
										<SelectItem value="ACTIVE">Active</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center justify-between pt-6">
								<div>
									<Label htmlFor="isActive">Active Status</Label>
									<Text
										text="Inactive coupons cannot be used"
										variant="muted"
										className="text-xs"
									/>
								</div>
								<Switch
									id="isActive"
									checked={formData.isActive}
									onCheckedChange={(checked) => handleFormChange('isActive', checked)}
									disabled={isSubmitting}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="isStackable">Stackable</Label>
									<Text
										text="Can be combined with other coupons"
										variant="muted"
										className="text-xs"
									/>
								</div>
								<Switch
									id="isStackable"
									checked={formData.isStackable}
									onCheckedChange={(checked) => handleFormChange('isStackable', checked)}
									disabled={isSubmitting}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="isTransferable">Transferable</Label>
									<Text
										text="Can be transferred to another church"
										variant="muted"
										className="text-xs"
									/>
								</div>
								<Switch
									id="isTransferable"
									checked={formData.isTransferable}
									onCheckedChange={(checked) => handleFormChange('isTransferable', checked)}
									disabled={isSubmitting}
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsCreateModalOpen(false);
								setIsEditModalOpen(false);
								resetForm();
							}}
							disabled={isSubmitting}>
							Cancel
						</Button>
						<Button
							onClick={isCreateModalOpen ? handleCreateCoupon : handleEditCoupon}
							disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
									{isCreateModalOpen ? 'Creating...' : 'Saving...'}
								</>
							) : isCreateModalOpen ? (
								'Create Coupon'
							) : (
								'Save Changes'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Coupon</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete <span className="font-mono font-semibold">{selectedCoupon?.code}</span>? This action cannot be undone and the coupon will no
							longer be usable.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteCoupon}
							className="bg-red-600 hover:bg-red-700"
							disabled={isSubmitting}>
							{isSubmitting ? 'Deleting...' : 'Delete'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
