'use client';

import { format } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle, Copy, DollarSign, Edit, Gift, Percent, Plus, Search, Tag, Trash2, Users, XCircle } from 'lucide-react';
import { useState } from 'react';

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

// Mock coupons data
const allCoupons = [
	{
		id: 'CPN-001',
		code: 'WELCOME20',
		type: 'percentage',
		value: 20,
		description: 'Welcome discount for new churches',
		expiryDate: '2025-12-31',
		usageLimit: 50,
		usageCount: 23,
		planRestriction: 'all',
		status: 'active',
		createdAt: '2025-01-01',
	},
	{
		id: 'CPN-002',
		code: 'FIRSTFREE',
		type: 'percentage',
		value: 100,
		description: 'First month free for new subscribers',
		expiryDate: '2025-06-30',
		usageLimit: 100,
		usageCount: 45,
		planRestriction: 'all',
		status: 'active',
		createdAt: '2025-01-15',
	},
	{
		id: 'CPN-003',
		code: 'GROWTH25',
		type: 'percentage',
		value: 25,
		description: '25% off Growth plan',
		expiryDate: '2025-05-31',
		usageLimit: 30,
		usageCount: 12,
		planRestriction: 'Growth',
		status: 'active',
		createdAt: '2025-02-01',
	},
	{
		id: 'CPN-004',
		code: 'ENTERPRISE50K',
		type: 'fixed',
		value: 50000,
		description: '₦50,000 off Enterprise plan',
		expiryDate: '2025-04-15',
		usageLimit: 10,
		usageCount: 3,
		planRestriction: 'Enterprise',
		status: 'active',
		createdAt: '2025-02-10',
	},
	{
		id: 'CPN-005',
		code: 'BLACKFRIDAY',
		type: 'percentage',
		value: 30,
		description: 'Black Friday special - 30% off all plans',
		expiryDate: '2024-11-30',
		usageLimit: 200,
		usageCount: 187,
		planRestriction: 'all',
		status: 'expired',
		createdAt: '2024-11-01',
	},
	{
		id: 'CPN-006',
		code: 'BULK10',
		type: 'percentage',
		value: 10,
		description: '10% off for churches with 500+ members',
		expiryDate: '2025-08-31',
		usageLimit: 0,
		usageCount: 0,
		planRestriction: 'all',
		status: 'inactive',
		createdAt: '2025-03-01',
	},
	{
		id: 'CPN-007',
		code: 'SAVE15',
		type: 'percentage',
		value: 15,
		description: '15% off any annual plan',
		expiryDate: '2025-07-31',
		usageLimit: 75,
		usageCount: 8,
		planRestriction: 'all',
		status: 'active',
		createdAt: '2025-03-10',
	},
];

const typeConfig = {
	percentage: { label: 'Percentage', icon: Percent, suffix: '%' },
	fixed: { label: 'Fixed Amount', icon: DollarSign, suffix: 'off' },
};

const statusConfig = {
	active: { label: 'Active', icon: CheckCircle, class: 'bg-green-100 text-green-700' },
	inactive: { label: 'Inactive', icon: XCircle, class: 'bg-gray-100 text-gray-700' },
	expired: { label: 'Expired', icon: AlertCircle, class: 'bg-red-100 text-red-700' },
};

const planOptions = [
	{ value: 'all', label: 'All Plans' },
	{ value: 'Enterprise', label: 'Enterprise Only' },
	{ value: 'Growth', label: 'Growth Only' },
	{ value: 'Starter', label: 'Starter Only' },
];

export default function CouponsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedCoupon, setSelectedCoupon] = useState<(typeof allCoupons)[0] | null>(null);
	const [coupons, setCoupons] = useState(allCoupons);
	const { toast } = useToast();

	// Form state
	const [formData, setFormData] = useState({
		code: '',
		type: 'percentage',
		value: '',
		description: '',
		expiryDate: '',
		usageLimit: '',
		planRestriction: 'all',
	});

	const filteredCoupons = coupons.filter((coupon) => {
		const matchesSearch =
			!searchQuery || coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) || coupon.description.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	// Stats calculations
	const activeCoupons = coupons.filter((c) => c.status === 'active').length;
	const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);
	const expiringSoon = coupons.filter((c) => {
		if (c.status !== 'active') return false;
		const expiryDate = new Date(c.expiryDate);
		const today = new Date();
		const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
		return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
	}).length;

	const handleCreateCoupon = () => {
		const newCoupon = {
			id: `CPN-${String(coupons.length + 1).padStart(3, '0')}`,
			code: formData.code.toUpperCase(),
			type: formData.type as 'percentage' | 'fixed',
			value: parseFloat(formData.value),
			description: formData.description,
			expiryDate: formData.expiryDate,
			usageLimit: parseInt(formData.usageLimit) || 0,
			usageCount: 0,
			planRestriction: formData.planRestriction,
			status: 'active',
			createdAt: new Date().toISOString().split('T')[0],
		};

		setCoupons([newCoupon, ...coupons]);
		toast({
			title: 'Coupon Created',
			description: `${newCoupon.code} has been created successfully.`,
		});
		setIsCreateModalOpen(false);
		resetForm();
	};

	const handleEditCoupon = () => {
		if (!selectedCoupon) return;

		const updatedCoupons = coupons.map((coupon) =>
			coupon.id === selectedCoupon.id
				? {
						...coupon,
						code: formData.code.toUpperCase(),
						type: formData.type as 'percentage' | 'fixed',
						value: parseFloat(formData.value),
						description: formData.description,
						expiryDate: formData.expiryDate,
						usageLimit: parseInt(formData.usageLimit) || 0,
						planRestriction: formData.planRestriction,
					}
				: coupon
		);

		setCoupons(updatedCoupons);
		toast({
			title: 'Coupon Updated',
			description: `${selectedCoupon.code} has been updated successfully.`,
		});
		setIsEditModalOpen(false);
		resetForm();
	};

	const handleDeleteCoupon = () => {
		if (!selectedCoupon) return;

		setCoupons(coupons.filter((coupon) => coupon.id !== selectedCoupon.id));
		toast({
			title: 'Coupon Deleted',
			description: `${selectedCoupon.code} has been deleted.`,
			variant: 'destructive',
		});
		setIsDeleteDialogOpen(false);
		setSelectedCoupon(null);
	};

	const handleToggleStatus = (coupon: (typeof allCoupons)[0]) => {
		const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
		const updatedCoupons = coupons.map((c) => (c.id === coupon.id ? { ...c, status: newStatus } : c));
		setCoupons(updatedCoupons);
		toast({
			title: newStatus === 'active' ? 'Coupon Activated' : 'Coupon Deactivated',
			description: `${coupon.code} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
		});
	};

	const handleCopyCode = (code: string) => {
		navigator.clipboard.writeText(code);
		toast({
			title: 'Copied!',
			description: `${code} copied to clipboard.`,
		});
	};

	const openEditModal = (coupon: (typeof allCoupons)[0]) => {
		setSelectedCoupon(coupon);
		setFormData({
			code: coupon.code,
			type: coupon.type,
			value: coupon.value.toString(),
			description: coupon.description,
			expiryDate: coupon.expiryDate,
			usageLimit: coupon.usageLimit.toString(),
			planRestriction: coupon.planRestriction,
		});
		setIsEditModalOpen(true);
	};

	const resetForm = () => {
		setFormData({
			code: '',
			type: 'percentage',
			value: '',
			description: '',
			expiryDate: '',
			usageLimit: '',
			planRestriction: 'all',
		});
		setSelectedCoupon(null);
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMM dd, yyyy');
	};

	const formatValue = (coupon: (typeof allCoupons)[0]) => {
		if (coupon.type === 'percentage') {
			return `${coupon.value}% off`;
		}
		return `₦${coupon.value.toLocaleString()} off`;
	};

	const getDaysRemaining = (expiryDate: string) => {
		const expiry = new Date(expiryDate);
		const today = new Date();
		const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
		if (days < 0) return 'Expired';
		if (days === 0) return 'Expires today';
		return `${days} days left`;
	};

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

			{/* Stats Cards */}
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
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Coupons Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
				{filteredCoupons.map((coupon) => {
					const TypeIcon = typeConfig[coupon.type as keyof typeof typeConfig]?.icon || Percent;
					const StatusIcon = statusConfig[coupon.status as keyof typeof statusConfig]?.icon || CheckCircle;
					const statusInfo = statusConfig[coupon.status as keyof typeof statusConfig] || statusConfig.active;
					const daysRemaining = getDaysRemaining(coupon.expiryDate);
					const isExpiringSoon = coupon.status === 'active' && daysRemaining !== 'Expired' && daysRemaining !== 'Expires today' && parseInt(daysRemaining) <= 30;

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
										<Text
											text={coupon.description}
											variant="muted"
											className="text-xs"
										/>
									</div>
									<span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', statusInfo.class)}>
										<StatusIcon className="h-3 w-3" />
										{statusInfo.label}
									</span>
								</div>

								{/* Value Badge */}
								<div className="flex items-center gap-2 mb-4">
									<div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 rounded-lg">
										<TypeIcon className="h-3.5 w-3.5 text-primary-600" />
										<span className="text-sm font-semibold text-primary-700">{formatValue(coupon)}</span>
									</div>
									{coupon.planRestriction !== 'all' && (
										<Badge
											variant="outline"
											className="text-xs">
											{coupon.planRestriction} only
										</Badge>
									)}
								</div>

								{/* Stats */}
								<div className="space-y-2 mb-4">
									<div className="flex justify-between text-sm">
										<Text
											text="Usage"
											variant="muted"
										/>
										<Text text={`${coupon.usageCount} / ${coupon.usageLimit === 0 ? '∞' : coupon.usageLimit}`} />
									</div>
									<div className="w-full bg-gray-100 rounded-full h-1.5">
										<div
											className="bg-primary-600 h-1.5 rounded-full transition-all"
											style={{ width: `${coupon.usageLimit > 0 ? (coupon.usageCount / coupon.usageLimit) * 100 : 0}%` }}
										/>
									</div>
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
											variant={isExpiringSoon ? 'warning' : 'muted'}
											className="text-xs"
										/>
									</div>
								</div>

								<Separator className="my-3" />

								{/* Actions */}
								<div className="flex items-center justify-end gap-2">
									<div className="flex items-center gap-2 mr-auto">
										<Switch
											checked={coupon.status === 'active'}
											onCheckedChange={() => handleToggleStatus(coupon)}
											disabled={coupon.status === 'expired'}
										/>
										<Text
											text={coupon.status === 'active' ? 'Active' : 'Inactive'}
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

			{filteredCoupons.length === 0 && (
				<Card className="rounded-2xl">
					<CardContent className="text-center py-12">
						<Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
						<Text
							text="No coupons found"
							className="text-gray-500"
						/>
						<Text
							text="Create your first coupon to start offering discounts"
							variant="muted"
							className="text-sm"
						/>
						<Button
							onClick={() => setIsCreateModalOpen(true)}
							className="mt-4 gap-2">
							<Plus className="h-4 w-4" />
							Create Coupon
						</Button>
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
							/>
						</div>

						{/* Type and Value */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="type">Discount Type *</Label>
								<Select
									value={formData.type}
									onValueChange={(value) => setFormData({ ...formData, type: value })}>
									<SelectTrigger className="mt-1.5">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="percentage">Percentage (%)</SelectItem>
										<SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="value">Discount Value *</Label>
								<Input
									id="value"
									type="number"
									placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 5000'}
									value={formData.value}
									onChange={(e) => setFormData({ ...formData, value: e.target.value })}
									className="mt-1.5"
								/>
							</div>
						</div>

						{/* Expiry Date and Usage Limit */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="expiryDate">Expiry Date *</Label>
								<Input
									id="expiryDate"
									type="date"
									value={formData.expiryDate}
									onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
									className="mt-1.5"
									min={new Date().toISOString().split('T')[0]}
								/>
							</div>
							<div>
								<Label htmlFor="usageLimit">Usage Limit</Label>
								<Input
									id="usageLimit"
									type="number"
									placeholder="Leave empty for unlimited"
									value={formData.usageLimit}
									onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
									className="mt-1.5"
								/>
							</div>
						</div>

						{/* Plan Restriction */}
						<div>
							<Label htmlFor="planRestriction">Plan Restriction (Optional)</Label>
							<Select
								value={formData.planRestriction}
								onValueChange={(value) => setFormData({ ...formData, planRestriction: value })}>
								<SelectTrigger className="mt-1.5">
									<SelectValue placeholder="Select plan restriction" />
								</SelectTrigger>
								<SelectContent>
									{planOptions.map((plan) => (
										<SelectItem
											key={plan.value}
											value={plan.value}>
											{plan.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Text
								text="Leave as 'All Plans' to apply to any subscription"
								variant="muted"
								className="text-xs mt-1"
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
							}}>
							Cancel
						</Button>
						<Button onClick={isCreateModalOpen ? handleCreateCoupon : handleEditCoupon}>{isCreateModalOpen ? 'Create Coupon' : 'Save Changes'}</Button>
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
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteCoupon}
							className="bg-red-600 hover:bg-red-700">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
