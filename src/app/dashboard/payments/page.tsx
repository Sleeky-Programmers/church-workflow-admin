'use client';

import { format } from 'date-fns';
import {
	AlertCircle,
	ArrowLeftRight,
	Banknote,
	CheckCircle,
	Clock,
	CreditCard,
	Download,
	FileText,
	Plus,
	Receipt,
	RefreshCw,
	Search,
	Wallet,
	XCircle,
} from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Extended mock data
const allTransactions = [
	{
		id: 'TXN-001',
		churchId: 1,
		churchName: 'Grace Chapel',
		churchInitials: 'GC',
		churchInitBg: 'bg-green-100',
		churchInitColor: 'text-green-700',
		plan: 'Enterprise',
		amount: 35000,
		currency: 'NGN',
		status: 'success',
		paymentMethod: 'card',
		date: '2025-03-15T10:30:00Z',
		reference: 'PAY_GC_001',
		description: 'Enterprise Plan - March 2025',
		duration: 'monthly',
		notes: '',
	},
	{
		id: 'TXN-002',
		churchId: 2,
		churchName: 'Harvest Fields',
		churchInitials: 'HF',
		churchInitBg: 'bg-blue-100',
		churchInitColor: 'text-blue-700',
		plan: 'Growth',
		amount: 15000,
		currency: 'NGN',
		status: 'success',
		paymentMethod: 'transfer',
		date: '2025-03-14T14:45:00Z',
		reference: 'PAY_HF_002',
		description: 'Growth Plan - March 2025',
		duration: 'monthly',
		notes: '',
	},
	{
		id: 'TXN-003',
		churchId: 3,
		churchName: 'Living Word Lagos',
		churchInitials: 'LW',
		churchInitBg: 'bg-amber-100',
		churchInitColor: 'text-amber-700',
		plan: 'Starter',
		amount: 0,
		currency: 'NGN',
		status: 'success',
		paymentMethod: 'free',
		date: '2025-03-10T09:00:00Z',
		reference: 'PAY_LW_003',
		description: 'Starter Plan - Free Tier',
		duration: 'monthly',
		notes: '',
	},
	{
		id: 'TXN-004',
		churchId: 4,
		churchName: 'Redeemed Assembly',
		churchInitials: 'RA',
		churchInitBg: 'bg-red-100',
		churchInitColor: 'text-red-700',
		plan: 'Growth',
		amount: 15000,
		currency: 'NGN',
		status: 'failed',
		paymentMethod: 'card',
		date: '2025-03-12T11:20:00Z',
		reference: 'PAY_RA_004',
		description: 'Growth Plan - March 2025',
		duration: 'monthly',
		notes: '',
		failureReason: 'Insufficient funds',
	},
	{
		id: 'TXN-005',
		churchId: 5,
		churchName: 'Mount Zion Church',
		churchInitials: 'MZ',
		churchInitBg: 'bg-pink-100',
		churchInitColor: 'text-pink-700',
		plan: 'Enterprise',
		amount: 35000,
		currency: 'NGN',
		status: 'pending',
		paymentMethod: 'transfer',
		date: '2025-03-16T08:15:00Z',
		reference: 'PAY_MZ_005',
		description: 'Enterprise Plan - March 2025',
		duration: 'monthly',
		notes: '',
	},
	{
		id: 'TXN-006',
		churchId: 6,
		churchName: "Glory House Int'l",
		churchInitials: 'GH',
		churchInitBg: 'bg-lime-100',
		churchInitColor: 'text-lime-700',
		plan: 'Growth',
		amount: 15000,
		currency: 'NGN',
		status: 'refunded',
		paymentMethod: 'card',
		date: '2025-03-01T16:30:00Z',
		reference: 'PAY_GH_006',
		description: 'Growth Plan - March 2025 (Refunded)',
		duration: 'monthly',
		notes: '',
		refundReason: 'Customer requested',
	},
	{
		id: 'TXN-007',
		churchId: 7,
		churchName: 'Cornerstone Chapel',
		churchInitials: 'CC',
		churchInitBg: 'bg-purple-100',
		churchInitColor: 'text-purple-700',
		plan: 'Starter',
		amount: 0,
		currency: 'NGN',
		status: 'success',
		paymentMethod: 'free',
		date: '2025-03-05T13:00:00Z',
		reference: 'PAY_CC_007',
		description: 'Starter Plan - Free Tier',
		duration: 'monthly',
		notes: '',
	},
	{
		id: 'TXN-008',
		churchId: 8,
		churchName: 'New Life Fellowship',
		churchInitials: 'NL',
		churchInitBg: 'bg-green-100',
		churchInitColor: 'text-green-700',
		plan: 'Growth',
		amount: 15000,
		currency: 'NGN',
		status: 'success',
		paymentMethod: 'card',
		date: '2025-03-08T10:45:00Z',
		reference: 'PAY_NL_008',
		description: 'Growth Plan - March 2025',
		duration: 'monthly',
		notes: '',
	},
	{
		id: 'TXN-009',
		churchId: 1,
		churchName: 'Grace Chapel',
		churchInitials: 'GC',
		churchInitBg: 'bg-green-100',
		churchInitColor: 'text-green-700',
		plan: 'Enterprise',
		amount: 35000,
		currency: 'NGN',
		status: 'success',
		paymentMethod: 'card',
		date: '2025-02-15T10:30:00Z',
		reference: 'PAY_GC_001_FEB',
		description: 'Enterprise Plan - February 2025',
		duration: 'monthly',
		notes: '',
	},
	{
		id: 'TXN-010',
		churchId: 4,
		churchName: 'Redeemed Assembly',
		churchInitials: 'RA',
		churchInitBg: 'bg-red-100',
		churchInitColor: 'text-red-700',
		plan: 'Growth',
		amount: 15000,
		currency: 'NGN',
		status: 'pending_verification',
		paymentMethod: 'transfer',
		date: '2025-03-17T09:30:00Z',
		reference: 'PAY_RA_004_RETRY',
		description: 'Growth Plan - March 2025 (Retry)',
		duration: 'monthly',
		notes: '',
	},
];

// Churches list for manual payment
const churches = [
	{ id: 1, name: 'Grace Chapel', initials: 'GC', initBg: 'bg-green-100', initColor: 'text-green-700' },
	{ id: 2, name: 'Harvest Fields', initials: 'HF', initBg: 'bg-blue-100', initColor: 'text-blue-700' },
	{ id: 3, name: 'Living Word Lagos', initials: 'LW', initBg: 'bg-amber-100', initColor: 'text-amber-700' },
	{ id: 4, name: 'Redeemed Assembly', initials: 'RA', initBg: 'bg-red-100', initColor: 'text-red-700' },
	{ id: 5, name: 'Mount Zion Church', initials: 'MZ', initBg: 'bg-pink-100', initColor: 'text-pink-700' },
	{ id: 6, name: "Glory House Int'l", initials: 'GH', initBg: 'bg-lime-100', initColor: 'text-lime-700' },
	{ id: 7, name: 'Cornerstone Chapel', initials: 'CC', initBg: 'bg-purple-100', initColor: 'text-purple-700' },
	{ id: 8, name: 'New Life Fellowship', initials: 'NL', initBg: 'bg-green-100', initColor: 'text-green-700' },
];

const planOptionsList = [
	{ value: 'Starter', price: 0, currency: 'NGN' },
	{ value: 'Growth', price: 15000, currency: 'NGN' },
	{ value: 'Enterprise', price: 35000, currency: 'NGN' },
];

const durationOptions = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'quarterly', label: 'Quarterly (3 months)' },
	{ value: 'biannually', label: 'Biannually (6 months)' },
	{ value: 'annually', label: 'Annually (12 months)' },
];

const statusConfig = {
	success: { label: 'Success', icon: CheckCircle, class: 'bg-green-100 text-green-700' },
	failed: { label: 'Failed', icon: XCircle, class: 'bg-red-100 text-red-700' },
	pending: { label: 'Pending', icon: Clock, class: 'bg-amber-100 text-amber-700' },
	refunded: { label: 'Refunded', icon: ArrowLeftRight, class: 'bg-gray-100 text-gray-700' },
	pending_verification: { label: 'Pending Verification', icon: AlertCircle, class: 'bg-blue-100 text-blue-700' },
};

const paymentMethodConfig = {
	card: { label: 'Card', icon: CreditCard },
	transfer: { label: 'Bank Transfer', icon: Banknote },
	free: { label: 'Free Tier', icon: Wallet },
	manual: { label: 'Manual Entry', icon: FileText },
};

const statusOptions = ['All Statuses', 'Success', 'Failed', 'Pending', 'Refunded', 'Pending Verification'];

export default function PaymentsPage() {
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState('');
	const [planFilter, setPlanFilter] = useState('All Plans');
	const [statusFilter, setStatusFilter] = useState('All Statuses');
	const [churchFilter, setChurchFilter] = useState<string>('all');
	const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
	const [selectedTransaction, setSelectedTransaction] = useState<(typeof allTransactions)[0] | null>(null);
	const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
	const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
	const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
	const [isPaymentLogsModalOpen, setIsPaymentLogsModalOpen] = useState(false);
	const [selectedChurchForLogs, setSelectedChurchForLogs] = useState<(typeof churches)[0] | null>(null);
	const [refundReason, setRefundReason] = useState('');
	const [refundAmount, setRefundAmount] = useState('');
	const [verificationNote, setVerificationNote] = useState('');
	const [transactions, setTransactions] = useState(allTransactions);

	// Manual payment form state
	const [manualPaymentForm, setManualPaymentForm] = useState({
		churchId: '',
		plan: 'Growth',
		amount: '',
		duration: 'monthly',
		notes: '',
		paymentMethod: 'manual',
	});

	// Filter transactions
	const filteredTransactions = transactions.filter((transaction) => {
		const matchesSearch =
			!searchQuery ||
			transaction.churchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesPlan = planFilter === 'All Plans' || transaction.plan === planFilter;
		const matchesChurch = churchFilter === 'all' || transaction.churchId.toString() === churchFilter;
		const matchesStatus =
			statusFilter === 'All Statuses' || statusFilter === 'Pending Verification'
				? transaction.status === 'pending_verification'
				: transaction.status === statusFilter.toLowerCase();

		let matchesDate = true;
		const transactionDate = new Date(transaction.date);
		const now = new Date();
		if (dateRange === 'week') {
			const weekAgo = new Date(now.setDate(now.getDate() - 7));
			matchesDate = transactionDate >= weekAgo;
		} else if (dateRange === 'month') {
			const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
			matchesDate = transactionDate >= monthAgo;
		} else if (dateRange === 'quarter') {
			const quarterAgo = new Date(now.setMonth(now.getMonth() - 3));
			matchesDate = transactionDate >= quarterAgo;
		}

		return matchesSearch && matchesPlan && matchesChurch && matchesStatus && matchesDate;
	});

	// Get payment logs for a specific church
	const getChurchPaymentLogs = (churchId: number) => {
		return transactions.filter((t) => t.churchId === churchId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	};

	// Stats calculations
	const totalRevenue = filteredTransactions.filter((t) => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
	const pendingAmount = filteredTransactions.filter((t) => t.status === 'pending' || t.status === 'pending_verification').reduce((sum, t) => sum + t.amount, 0);
	const successCount = filteredTransactions.filter((t) => t.status === 'success').length;
	const failedCount = filteredTransactions.filter((t) => t.status === 'failed').length;

	const handleRefund = () => {
		toast({
			title: 'Refund Processed',
			description: `Refund of ${refundAmount || 'full amount'} for ${selectedTransaction?.churchName} has been initiated.`,
		});
		setIsRefundModalOpen(false);
		setRefundReason('');
		setRefundAmount('');
	};

	const handleVerifyPayment = () => {
		toast({
			title: 'Payment Verified',
			description: `Payment ${selectedTransaction?.id} has been marked as verified. ${verificationNote ? `Note: ${verificationNote}` : ''}`,
		});
		setIsVerifyModalOpen(false);
		setVerificationNote('');
	};

	const handleManualPayment = () => {
		if (!manualPaymentForm.churchId) {
			toast({
				title: 'Error',
				description: 'Please select a church',
				variant: 'destructive',
			});
			return;
		}

		const selectedChurch = churches.find((c) => c.id.toString() === manualPaymentForm.churchId);
		const selectedPlan = planOptionsList.find((p) => p.value === manualPaymentForm.plan);

		const newTransaction = {
			id: `TXN-${String(transactions.length + 1).padStart(3, '0')}`,
			churchId: parseInt(manualPaymentForm.churchId),
			churchName: selectedChurch?.name || '',
			churchInitials: selectedChurch?.initials || '',
			churchInitBg: selectedChurch?.initBg || '',
			churchInitColor: selectedChurch?.initColor || '',
			plan: manualPaymentForm.plan,
			amount: selectedPlan?.price || 0,
			currency: 'NGN',
			status: 'success',
			paymentMethod: 'manual',
			date: new Date().toISOString(),
			reference: `MANUAL_${Date.now()}`,
			description: `Manual payment for ${manualPaymentForm.plan} Plan`,
			duration: manualPaymentForm.duration,
			notes: manualPaymentForm.notes,
		};

		setTransactions([newTransaction, ...transactions]);

		toast({
			title: 'Payment Recorded',
			description: `Manual payment of ${formatAmount(selectedPlan?.price || 0, 'NGN')} recorded for ${selectedChurch?.name}`,
		});

		setIsManualPaymentModalOpen(false);
		setManualPaymentForm({
			churchId: '',
			plan: 'Growth',
			amount: '',
			duration: 'monthly',
			notes: '',
			paymentMethod: 'manual',
		});
	};

	const handleViewPaymentLogs = (church: (typeof churches)[0]) => {
		setSelectedChurchForLogs(church);
		setIsPaymentLogsModalOpen(true);
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
	};

	const formatAmount = (amount: number, currency: string) => {
		return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);
	};

	const getDurationLabel = (duration: string) => {
		return durationOptions.find((d) => d.value === duration)?.label || duration;
	};

	return (
		<>
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
				<div>
					<Heading
						level={1}
						text="Payments & Subscriptions"
					/>
					<Text
						text="Manage transactions, process refunds, record manual payments, and verify payments"
						variant="muted"
					/>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => setIsManualPaymentModalOpen(true)}
						className="gap-2">
						<Plus className="h-4 w-4" />
						Record Manual Payment
					</Button>
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
						Sync
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Total Revenue"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={formatAmount(totalRevenue, 'NGN')}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
								<Receipt className="w-5 h-5 text-green-600" />
							</div>
						</div>
						<Text
							text={`From ${successCount} successful transactions`}
							variant="muted"
							className="text-xs mt-2"
						/>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Pending Payments"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={formatAmount(pendingAmount, 'NGN')}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
								<Clock className="w-5 h-5 text-amber-600" />
							</div>
						</div>
						<Text
							text="Awaiting confirmation"
							variant="muted"
							className="text-xs mt-2"
						/>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Success Rate"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={`${filteredTransactions.length ? ((successCount / filteredTransactions.length) * 100).toFixed(1) : 0}%`}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
								<CheckCircle className="w-5 h-5 text-blue-600" />
							</div>
						</div>
						<Text
							text={`${failedCount} failed transactions`}
							variant="muted"
							className="text-xs mt-2"
						/>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Pending Verification"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={filteredTransactions.filter((t) => t.status === 'pending_verification').length.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
								<AlertCircle className="w-5 h-5 text-purple-600" />
							</div>
						</div>
						<Text
							text="Need manual review"
							variant="muted"
							className="text-xs mt-2"
						/>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card className="rounded-2xl mb-6">
				<CardContent className="p-4">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search by church, transaction ID, or reference..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>

						<Select
							value={churchFilter}
							onValueChange={setChurchFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Churches" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Churches</SelectItem>
								{churches.map((church) => (
									<SelectItem
										key={church.id}
										value={church.id.toString()}>
										{church.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={planFilter}
							onValueChange={setPlanFilter}>
							<SelectTrigger className="w-[160px]">
								<SelectValue placeholder="Plan" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All Plans">All Plans</SelectItem>
								<SelectItem value="Enterprise">Enterprise</SelectItem>
								<SelectItem value="Growth">Growth</SelectItem>
								<SelectItem value="Starter">Starter</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								{statusOptions.map((status) => (
									<SelectItem
										key={status}
										value={status}>
										{status}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<div className="flex gap-2">
							<Button
								variant={dateRange === 'all' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setDateRange('all')}
								className="px-3">
								All
							</Button>
							<Button
								variant={dateRange === 'week' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setDateRange('week')}
								className="px-3">
								Week
							</Button>
							<Button
								variant={dateRange === 'month' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setDateRange('month')}
								className="px-3">
								Month
							</Button>
							<Button
								variant={dateRange === 'quarter' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setDateRange('quarter')}
								className="px-3">
								Quarter
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Transactions Table */}
			<Card className="rounded-2xl">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Transaction</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Church</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Plan</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Amount</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Payment Method</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Status</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Date</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredTransactions.map((transaction) => {
									const StatusIcon = statusConfig[transaction.status as keyof typeof statusConfig]?.icon || CheckCircle;
									const statusInfo = statusConfig[transaction.status as keyof typeof statusConfig] || statusConfig.success;
									const methodInfo = paymentMethodConfig[transaction.paymentMethod as keyof typeof paymentMethodConfig] || paymentMethodConfig.card;
									const MethodIcon = methodInfo.icon;

									return (
										<tr
											key={transaction.id}
											className="border-b last:border-0 hover:bg-gray-50">
											<td className="py-3 px-4">
												<div>
													<div className="font-mono text-xs font-medium">{transaction.id}</div>
													<div className="text-xs text-gray-500 mt-0.5">{transaction.reference}</div>
												</div>
											</td>
											<td className="py-3 px-4">
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8">
														<AvatarFallback className={cn(transaction.churchInitBg, transaction.churchInitColor)}>{transaction.churchInitials}</AvatarFallback>
													</Avatar>
													<div>
														<span className="font-medium">{transaction.churchName}</span>
														<Button
															variant="link"
															size="sm"
															className="h-auto p-0 ml-2 text-xs text-primary-600"
															onClick={() => {
																const church = churches.find((c) => c.id === transaction.churchId);
																if (church) handleViewPaymentLogs(church);
															}}>
															View logs
														</Button>
													</div>
												</div>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm">{transaction.plan}</span>
												{transaction.duration && <div className="text-xs text-gray-400">{getDurationLabel(transaction.duration)}</div>}
											</td>
											<td className="py-3 px-4 font-semibold">{transaction.amount === 0 ? 'Free' : formatAmount(transaction.amount, transaction.currency)}</td>
											<td className="py-3 px-4">
												<div className="flex items-center gap-1.5">
													<MethodIcon className="h-3.5 w-3.5 text-gray-500" />
													<span className="text-sm">{methodInfo.label}</span>
												</div>
											</td>
											<td className="py-3 px-4">
												<span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', statusInfo.class)}>
													<StatusIcon className="h-3 w-3" />
													{statusInfo.label}
												</span>
											</td>
											<td className="py-3 px-4 text-gray-500 text-xs">{formatDate(transaction.date)}</td>
											<td className="py-3 px-4">
												<div className="flex gap-2">
													{transaction.status === 'failed' && (
														<Button
															variant="ghost"
															size="sm"
															className="h-7 text-xs"
															onClick={() => {
																setSelectedTransaction(transaction);
																setIsRefundModalOpen(true);
															}}>
															Refund
														</Button>
													)}
													{transaction.status === 'pending_verification' && (
														<Button
															variant="default"
															size="sm"
															className="h-7 text-xs"
															onClick={() => {
																setSelectedTransaction(transaction);
																setIsVerifyModalOpen(true);
															}}>
															Verify
														</Button>
													)}
													{transaction.status === 'pending' && (
														<Button
															variant="outline"
															size="sm"
															className="h-7 text-xs"
															onClick={() => {
																setSelectedTransaction(transaction);
																setIsVerifyModalOpen(true);
															}}>
															Mark Verified
														</Button>
													)}
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{filteredTransactions.length === 0 && (
						<div className="text-center py-12">
							<Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<Text
								text="No transactions found"
								className="text-gray-500"
							/>
							<Text
								text="Try adjusting your filters"
								variant="muted"
								className="text-sm"
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Record Manual Payment Modal */}
			<Dialog
				open={isManualPaymentModalOpen}
				onOpenChange={setIsManualPaymentModalOpen}>
				<DialogContent className="sm:max-w-[550px]">
					<DialogHeader>
						<DialogTitle>Record Manual Payment</DialogTitle>
						<DialogDescription>Manually record a payment received from a church</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Church Selection */}
						<div>
							<Label htmlFor="church">Church *</Label>
							<Select
								value={manualPaymentForm.churchId}
								onValueChange={(value) => setManualPaymentForm({ ...manualPaymentForm, churchId: value })}>
								<SelectTrigger className="mt-1.5">
									<SelectValue placeholder="Select church" />
								</SelectTrigger>
								<SelectContent>
									{churches.map((church) => (
										<SelectItem
											key={church.id}
											value={church.id.toString()}>
											<div className="flex items-center gap-2">
												<div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-xs', church.initBg, church.initColor)}>{church.initials}</div>
												{church.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Plan Selection */}
						<div>
							<Label htmlFor="plan">Plan *</Label>
							<Select
								value={manualPaymentForm.plan}
								onValueChange={(value) => setManualPaymentForm({ ...manualPaymentForm, plan: value })}>
								<SelectTrigger className="mt-1.5">
									<SelectValue placeholder="Select plan" />
								</SelectTrigger>
								<SelectContent>
									{planOptionsList.map((plan) => (
										<SelectItem
											key={plan.value}
											value={plan.value}>
											{plan.value} - {formatAmount(plan.price, plan.currency)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Duration Selection */}
						<div>
							<Label htmlFor="duration">Duration *</Label>
							<Select
								value={manualPaymentForm.duration}
								onValueChange={(value) => setManualPaymentForm({ ...manualPaymentForm, duration: value })}>
								<SelectTrigger className="mt-1.5">
									<SelectValue placeholder="Select duration" />
								</SelectTrigger>
								<SelectContent>
									{durationOptions.map((duration) => (
										<SelectItem
											key={duration.value}
											value={duration.value}>
											{duration.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Notes */}
						<div>
							<Label htmlFor="notes">Notes (Optional)</Label>
							<Textarea
								id="notes"
								placeholder="Add any notes about this payment..."
								value={manualPaymentForm.notes}
								onChange={(e) => setManualPaymentForm({ ...manualPaymentForm, notes: e.target.value })}
								className="mt-1.5"
								rows={3}
							/>
						</div>

						<div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
							<div className="flex items-start gap-2">
								<AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
								<Text
									text="Recording a manual payment will mark the church's subscription as paid and update their billing status."
									variant="muted"
									className="text-xs"
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsManualPaymentModalOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleManualPayment}>
							<FileText className="h-4 w-4 mr-2" />
							Record Payment
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Payment Logs Modal - View per Church */}
			<Dialog
				open={isPaymentLogsModalOpen}
				onOpenChange={setIsPaymentLogsModalOpen}>
				<DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3">
							<div
								className={cn(
									'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
									selectedChurchForLogs?.initBg,
									selectedChurchForLogs?.initColor
								)}>
								{selectedChurchForLogs?.initials}
							</div>
							<div>
								<div className="text-xl">Payment Logs - {selectedChurchForLogs?.name}</div>
								<DialogDescription>Complete payment history for this church</DialogDescription>
							</div>
						</DialogTitle>
					</DialogHeader>

					<Separator />

					{selectedChurchForLogs && (
						<div className="space-y-4">
							{getChurchPaymentLogs(selectedChurchForLogs.id).length === 0 ? (
								<div className="text-center py-8">
									<Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
									<Text
										text="No payment records found"
										className="text-gray-500"
									/>
								</div>
							) : (
								<div className="space-y-3">
									{getChurchPaymentLogs(selectedChurchForLogs.id).map((log) => {
										const StatusIcon = statusConfig[log.status as keyof typeof statusConfig]?.icon || CheckCircle;
										const statusInfo = statusConfig[log.status as keyof typeof statusConfig] || statusConfig.success;

										return (
											<div
												key={log.id}
												className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<span className="font-mono text-xs font-medium">{log.id}</span>
															<span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', statusInfo.class)}>
																<StatusIcon className="h-3 w-3" />
																{statusInfo.label}
															</span>
														</div>
														<div className="grid grid-cols-2 gap-2 text-sm">
															<div>
																<Text
																	text="Plan"
																	variant="muted"
																	className="text-xs"
																/>
																<Text
																	text={log.plan}
																	className="text-sm font-medium"
																/>
															</div>
															<div>
																<Text
																	text="Amount"
																	variant="muted"
																	className="text-xs"
																/>
																<Text
																	text={log.amount === 0 ? 'Free' : formatAmount(log.amount, log.currency)}
																	className="text-sm font-semibold"
																/>
															</div>
															<div>
																<Text
																	text="Payment Method"
																	variant="muted"
																	className="text-xs"
																/>
																<Text
																	text={paymentMethodConfig[log.paymentMethod as keyof typeof paymentMethodConfig]?.label || log.paymentMethod}
																	className="text-sm"
																/>
															</div>
															<div>
																<Text
																	text="Date"
																	variant="muted"
																	className="text-xs"
																/>
																<Text
																	text={formatDate(log.date)}
																	className="text-sm"
																/>
															</div>
															{log.duration && (
																<div>
																	<Text
																		text="Duration"
																		variant="muted"
																		className="text-xs"
																	/>
																	<Text
																		text={getDurationLabel(log.duration)}
																		className="text-sm"
																	/>
																</div>
															)}
															{log.notes && (
																<div className="col-span-2">
																	<Text
																		text="Notes"
																		variant="muted"
																		className="text-xs"
																	/>
																	<Text
																		text={log.notes}
																		className="text-sm text-gray-600"
																	/>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					)}

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsPaymentLogsModalOpen(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Refund Modal */}
			<Dialog
				open={isRefundModalOpen}
				onOpenChange={setIsRefundModalOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Process Refund</DialogTitle>
						<DialogDescription>Refund payment for {selectedTransaction?.churchName}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="bg-gray-50 rounded-lg p-3">
							<div className="flex justify-between text-sm">
								<Text
									text="Transaction ID"
									variant="muted"
								/>
								<Text
									text={selectedTransaction?.id}
									className="font-mono"
								/>
							</div>
							<div className="flex justify-between text-sm mt-2">
								<Text
									text="Original Amount"
									variant="muted"
								/>
								<Text
									text={formatAmount(selectedTransaction?.amount || 0, selectedTransaction?.currency || 'NGN')}
									className="font-semibold"
								/>
							</div>
							<div className="flex justify-between text-sm mt-2">
								<Text
									text="Payment Method"
									variant="muted"
								/>
								<Text text={paymentMethodConfig[selectedTransaction?.paymentMethod as keyof typeof paymentMethodConfig]?.label || 'N/A'} />
							</div>
						</div>

						<div>
							<Label htmlFor="refund-amount">Refund Amount (Optional)</Label>
							<Input
								id="refund-amount"
								type="text"
								placeholder={`Leave empty for full refund (${formatAmount(selectedTransaction?.amount || 0, selectedTransaction?.currency || 'NGN')})`}
								value={refundAmount}
								onChange={(e) => setRefundAmount(e.target.value)}
								className="mt-1.5"
							/>
						</div>

						<div>
							<Label htmlFor="refund-reason">Refund Reason</Label>
							<Textarea
								id="refund-reason"
								placeholder="Why is this payment being refunded?"
								value={refundReason}
								onChange={(e) => setRefundReason(e.target.value)}
								className="mt-1.5"
								rows={3}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsRefundModalOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleRefund}>
							Process Refund
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Verify Payment Modal */}
			<Dialog
				open={isVerifyModalOpen}
				onOpenChange={setIsVerifyModalOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Verify Payment</DialogTitle>
						<DialogDescription>Manually mark this payment as verified</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="bg-gray-50 rounded-lg p-3">
							<div className="flex justify-between text-sm">
								<Text
									text="Church"
									variant="muted"
								/>
								<Text text={selectedTransaction?.churchName} />
							</div>
							<div className="flex justify-between text-sm mt-2">
								<Text
									text="Transaction ID"
									variant="muted"
								/>
								<Text
									text={selectedTransaction?.id}
									className="font-mono"
								/>
							</div>
							<div className="flex justify-between text-sm mt-2">
								<Text
									text="Amount"
									variant="muted"
								/>
								<Text
									text={formatAmount(selectedTransaction?.amount || 0, selectedTransaction?.currency || 'NGN')}
									className="font-semibold"
								/>
							</div>
							<div className="flex justify-between text-sm mt-2">
								<Text
									text="Payment Method"
									variant="muted"
								/>
								<Text text={paymentMethodConfig[selectedTransaction?.paymentMethod as keyof typeof paymentMethodConfig]?.label || 'N/A'} />
							</div>
						</div>

						<div>
							<Label htmlFor="verification-note">Verification Note (Optional)</Label>
							<Textarea
								id="verification-note"
								placeholder="Add any notes about this verification..."
								value={verificationNote}
								onChange={(e) => setVerificationNote(e.target.value)}
								className="mt-1.5"
								rows={3}
							/>
						</div>

						<div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
							<div className="flex items-start gap-2">
								<AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
								<Text
									text="Marking a payment as verified will immediately update the church's subscription status and grant access to plan features."
									variant="muted"
									className="text-xs"
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsVerifyModalOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleVerifyPayment}>
							<CheckCircle className="h-4 w-4 mr-2" />
							Mark as Verified
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
