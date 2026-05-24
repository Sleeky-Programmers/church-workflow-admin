'use client';

import { format } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle, Copy, DollarSign, Edit, Gift, Percent, Plus, Search, Tag, Trash2, Users, XCircle } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Coupon, CouponStats, createCoupon, deleteCoupon, DiscountType, fetchCoupons, fetchCouponStats, updateCoupon } from '@/services/couponService';

const typeConfig = {
	FLAT: { label: 'Fixed Amount', icon: DollarSign, suffix: 'off' },
	PERCENTAGE: { label: 'Percentage', icon: Percent, suffix: '%' },
};

const statusConfig = {
	active: { label: 'Active', icon: CheckCircle, class: 'bg-green-100 text-green-700' },
	inactive: { label: 'Inactive', icon: XCircle, class: 'bg-gray-100 text-gray-700' },
	expired: { label: 'Expired', icon: AlertCircle, class: 'bg-red-100 text-red-700' },
	exhausted: { label: 'Exhausted', icon: XCircle, class: 'bg-yellow-100 text-yellow-700' },
};

export default function CouponsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [couponStats, setCouponStats] = useState<CouponStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false); // Add this state
	const { toast } = useToast();

	// Form state
	const [formData, setFormData] = useState({
		code: '',
		discountType: 'FLAT' as DiscountType,
		discount: '',
		description: '',
		expiryDate: '',
		maxUsage: '',
		isActive: true,
	});

	// Fetch coupons and stats on load
	useEffect(() => {
		fetchCouponsData();
	}, []);

	const fetchCouponsData = async () => {
		setLoading(true);
		setError(null);
		try {
			const [couponsData, statsData] = await Promise.all([fetchCoupons({ limit: 100 }), fetchCouponStats()]);
			setCoupons(couponsData.data);
			setCouponStats(statsData);
		} catch (err) {
			console.error('Failed to fetch coupons:', err);
			setError(err instanceof Error ? err.message : 'Failed to load coupons');
			toast({
				title: 'Error',
				description: 'Failed to load coupons',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const filteredCoupons = coupons.filter((coupon) => {
		const matchesSearch =
			!searchQuery ||
			coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(coupon.description && coupon.description.toLowerCase().includes(searchQuery.toLowerCase()));

		let matchesStatus = true;
		if (statusFilter === 'active') {
			matchesStatus =
				coupon.isActive && (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date()) && (coupon.maxUsage === null || coupon.usageCount < coupon.maxUsage);
		} else if (statusFilter === 'inactive') {
			matchesStatus = !coupon.isActive;
		} else if (statusFilter === 'expired') {
			matchesStatus = coupon.expiryDate ? new Date(coupon.expiryDate) <= new Date() : false;
		} else if (statusFilter === 'exhausted') {
			matchesStatus = coupon.maxUsage !== null && coupon.usageCount >= coupon.maxUsage;
		}

		return matchesSearch && matchesStatus;
	});

	// Stats calculations from real data
	const activeCoupons = couponStats?.activeCoupons || 0;
	const totalUsage = couponStats?.totalUsage || 0;
	const expiringSoon = couponStats?.expiringSoon || 0;

	const handleCreateCoupon = async () => {
		if (!formData.code || !formData.discount) {
			toast({
				title: 'Validation Error',
				description: 'Please fill in all required fields',
				variant: 'destructive',
			});
			return;
		}

		setIsSubmitting(true); // Disable button
		try {
			const payload = {
				code: formData.code.toUpperCase(),
				discountType: formData.discountType,
				discount: parseFloat(formData.discount),
				description: formData.description || undefined,
				expiryDate: formData.expiryDate || undefined,
				maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : undefined,
				isActive: formData.isActive,
			};

			const newCoupon = await createCoupon(payload);
			console.log(newCoupon);
			setCoupons([newCoupon, ...coupons]);
			toast({
				title: 'Coupon Created',
				description: `${newCoupon.code} has been created successfully.`,
			});
			setIsCreateModalOpen(false);
			resetForm();
			fetchCouponsData(); // Refresh stats
		} catch (err) {
			console.error('Failed to create coupon:', err);
			toast({
				title: 'Error',
				description: err instanceof Error ? err.message : 'Failed to create coupon',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false); // Re-enable button
		}
	};

	const handleEditCoupon = async () => {
		if (!selectedCoupon) return;

		setIsSubmitting(true); // Disable button
		try {
			const payload = {
				code: formData.code.toUpperCase(),
				discountType: formData.discountType,
				discount: parseFloat(formData.discount),
				description: formData.description || undefined,
				expiryDate: formData.expiryDate || undefined,
				maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : undefined,
				isActive: formData.isActive,
			};

			const updatedCoupon = await updateCoupon(selectedCoupon.id, payload);
			setCoupons(coupons.map((c) => (c.id === selectedCoupon.id ? updatedCoupon : c)));
			toast({
				title: 'Coupon Updated',
				description: `${selectedCoupon.code} has been updated successfully.`,
			});
			setIsEditModalOpen(false);
			resetForm();
			fetchCouponsData(); // Refresh stats
		} catch (err) {
			console.error('Failed to update coupon:', err);
			toast({
				title: 'Error',
				description: err instanceof Error ? err.message : 'Failed to update coupon',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false); // Re-enable button
		}
	};

	const handleDeleteCoupon = async () => {
		if (!selectedCoupon) return;

		setIsSubmitting(true); // Disable button
		try {
			await deleteCoupon(selectedCoupon.id);
			setCoupons(coupons.filter((coupon) => coupon.id !== selectedCoupon.id));
			toast({
				title: 'Coupon Deleted',
				description: `${selectedCoupon.code} has been deleted.`,
			});
			setIsDeleteDialogOpen(false);
			setSelectedCoupon(null);
			fetchCouponsData(); // Refresh stats
		} catch (err) {
			console.error('Failed to delete coupon:', err);
			toast({
				title: 'Error',
				description: err instanceof Error ? err.message : 'Failed to delete coupon',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false); // Re-enable button
		}
	};

	const handleToggleStatus = async (coupon: Coupon) => {
		try {
			const newStatus = !coupon.isActive;
			const updatedCoupon = await updateCoupon(coupon.id, { isActive: newStatus });
			setCoupons(coupons.map((c) => (c.id === coupon.id ? updatedCoupon : c)));
			toast({
				title: newStatus ? 'Coupon Activated' : 'Coupon Deactivated',
				description: `${coupon.code} has been ${newStatus ? 'activated' : 'deactivated'}.`,
			});
			fetchCouponsData(); // Refresh stats
		} catch (err) {
			console.error('Failed to toggle coupon status:', err);
			toast({
				title: 'Error',
				description: err instanceof Error ? err.message : 'Failed to update coupon status',
				variant: 'destructive',
			});
		}
	};

	const handleCopyCode = (code: string) => {
		navigator.clipboard.writeText(code);
		toast({
			title: 'Copied!',
			description: `${code} copied to clipboard.`,
		});
	};

	const openEditModal = (coupon: Coupon) => {
		setSelectedCoupon(coupon);
		setFormData({
			code: coupon.code,
			discountType: coupon.discountType,
			discount: coupon.discount.toString(),
			description: coupon.description || '',
			expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
			maxUsage: coupon.maxUsage?.toString() || '',
			isActive: coupon.isActive,
		});
		setIsEditModalOpen(true);
	};

	const resetForm = () => {
		setFormData({
			code: '',
			discountType: 'FLAT',
			discount: '',
			description: '',
			expiryDate: '',
			maxUsage: '',
			isActive: true,
		});
		setSelectedCoupon(null);
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

	const getCouponStatus = (coupon: Coupon): 'active' | 'inactive' | 'expired' | 'exhausted' => {
		if (!coupon.isActive) return 'inactive';
		if (coupon.expiryDate && new Date(coupon.expiryDate) <= new Date()) return 'expired';
		if (coupon.maxUsage !== null && coupon.usageCount >= coupon.maxUsage) return 'exhausted';
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
			{/* Header */}
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
					onClick={() => setIsCreateModalOpen(true)}
					className="gap-2">
					<Plus className="h-4 w-4" />
					Create Coupon
				</Button>
			</div>

			{/* Stats Cards from Real API */}
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

			{/* Filters */}
			<Card className="rounded-2xl mb-6">
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search by coupon code or description..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
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
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Coupons Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
				{filteredCoupons.map((coupon) => {
					const TypeIcon = typeConfig[coupon.discountType]?.icon || Percent;
					const status = getCouponStatus(coupon);
					const statusInfo = statusConfig[status];
					const daysRemaining = getDaysRemaining(coupon.expiryDate);
					const isExpiringSoon =
						status === 'active' && daysRemaining !== 'Expired' && daysRemaining !== 'Expires today' && daysRemaining !== 'No expiry' && parseInt(daysRemaining) <= 30;
					const usagePercentage = coupon.maxUsage ? (coupon.usageCount / coupon.maxUsage) * 100 : 0;

					return (
						<Card
							key={coupon.id}
							className="rounded-2xl hover:shadow-md transition-shadow">
							<CardContent className="p-5">
								{/* Header */}
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<code className="text-lg font-bold bg-gray-100 px-2 py-1 rounded-lg font-mono">{coupon.code}</code>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7"
												onClick={() => handleCopyCode(coupon.code)}>
												<Copy className="h-3.5 w-3.5" />
											</Button>
										</div>
										{coupon.description && (
											<Text
												text={coupon.description}
												variant="muted"
												className="text-xs"
											/>
										)}
									</div>
									<span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', statusInfo?.class)}>
										{statusInfo && <statusInfo.icon className="h-3 w-3" />}
										{statusInfo?.label}
									</span>
								</div>

								{/* Value Badge */}
								<div className="flex items-center gap-2 mb-4">
									<div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 rounded-lg">
										<TypeIcon className="h-3.5 w-3.5 text-primary-600" />
										<span className="text-sm font-semibold text-primary-700">{formatValue(coupon)}</span>
									</div>
								</div>

								{/* Stats */}
								<div className="space-y-2 mb-4">
									<div className="flex justify-between text-sm">
										<Text
											text="Usage"
											variant="muted"
										/>
										<Text text={`${coupon.usageCount} / ${coupon.maxUsage === null ? '∞' : coupon.maxUsage}`} />
									</div>
									{coupon.maxUsage && (
										<div className="w-full bg-gray-100 rounded-full h-1.5">
											<div
												className="bg-primary-600 h-1.5 rounded-full transition-all"
												style={{ width: `${usagePercentage}%` }}
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
								</div>

								<Separator className="my-3" />

								{/* Actions */}
								<div className="flex items-center justify-end gap-2">
									<div className="flex items-center gap-2 mr-auto">
										<Switch
											checked={status === 'active'}
											onCheckedChange={() => handleToggleStatus(coupon)}
											disabled={status === 'expired' || status === 'exhausted'}
										/>
										<Text
											text={status === 'active' ? 'Active' : 'Inactive'}
											variant="muted"
											className="text-xs"
										/>
									</div>
									{/* <Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1"
										onClick={() => openEditModal(coupon)}>
										<Edit className="h-3.5 w-3.5" />
										Edit
									</Button> */}
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
							text={searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first coupon to start offering discounts'}
							variant="muted"
							className="text-sm"
						/>
						{!searchQuery && statusFilter === 'all' && (
							<Button
								onClick={() => setIsCreateModalOpen(true)}
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
				<DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{isCreateModalOpen ? 'Create New Coupon' : 'Edit Coupon'}</DialogTitle>
						<DialogDescription>{isCreateModalOpen ? 'Create a discount coupon for churches to use' : 'Modify the coupon details below'}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Coupon Code */}
						<div>
							<Label htmlFor="code">Coupon Code *</Label>
							<Input
								id="code"
								placeholder="e.g., SUMMER20"
								value={formData.code}
								onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
								className="mt-1.5 font-mono"
								maxLength={20}
								disabled={isSubmitting}
							/>
							<Text
								text="Only letters, numbers, and underscores"
								variant="muted"
								className="text-xs mt-1"
							/>
						</div>

						{/* Description */}
						<div>
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								placeholder="What is this coupon for?"
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								className="mt-1.5"
								disabled={isSubmitting}
							/>
						</div>

						{/* Type and Value */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="discountType">Discount Type *</Label>
								<Select
									value={formData.discountType}
									onValueChange={(value) => setFormData({ ...formData, discountType: value as DiscountType })}
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
									onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
									className="mt-1.5"
									disabled={isSubmitting}
								/>
							</div>
						</div>

						{/* Expiry Date and Usage Limit */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="expiryDate">Expiry Date</Label>
								<Input
									id="expiryDate"
									type="date"
									value={formData.expiryDate}
									onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
									className="mt-1.5"
									min={new Date().toISOString().split('T')[0]}
									disabled={isSubmitting}
								/>
							</div>
							<div>
								<Label htmlFor="maxUsage">Usage Limit</Label>
								<Input
									id="maxUsage"
									type="number"
									placeholder="Leave empty for unlimited"
									value={formData.maxUsage}
									onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
									className="mt-1.5"
									disabled={isSubmitting}
								/>
							</div>
						</div>

						{/* Active Status */}
						<div className="flex items-center justify-between pt-2">
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
								onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
								disabled={isSubmitting}
							/>
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

			{/* Delete Confirmation Dialog */}
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
