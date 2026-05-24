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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Church, fetchChurches } from '@/services/churchService';
import { fetchPayments, fetchPaymentStats, Payment, PaymentStats, PaymentStatus, PlanType } from '@/services/paymentService';

const statusConfig: Record<PaymentStatus, { label: string; icon: any; class: string }> = {
	PENDING: { label: 'Pending', icon: Clock, class: 'bg-amber-100 text-amber-700' },
	SUCCESS: { label: 'Success', icon: CheckCircle, class: 'bg-green-100 text-green-700' },
	FAILED: { label: 'Failed', icon: XCircle, class: 'bg-red-100 text-red-700' },
	REFUNDED: { label: 'Refunded', icon: ArrowLeftRight, class: 'bg-gray-100 text-gray-700' },
	CANCELLED: { label: 'Cancelled', icon: XCircle, class: 'bg-orange-100 text-orange-700' },
};

const paymentMethodConfig: Record<string, { label: string; icon: any }> = {
	card: { label: 'Card', icon: CreditCard },
	transfer: { label: 'Bank Transfer', icon: Banknote },
	manual: { label: 'Manual Entry', icon: FileText },
};

const planOptionsList = [
	{ value: 'STARTER', price: 0, currency: 'NGN' },
	{ value: 'GROWTH', price: 200000, currency: 'NGN' },
	{ value: 'EXPANSION', price: 500000, currency: 'NGN' },
	{ value: 'ENTERPRISE', price: 1000000, currency: 'NGN' },
];

const statusOptions = ['All Statuses', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'CANCELLED'];

export default function PaymentsPage() {
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState('');
	const [planFilter, setPlanFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [churchFilter, setChurchFilter] = useState<string>('all');
	const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
	const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
	const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
	const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
	const [isPaymentLogsModalOpen, setIsPaymentLogsModalOpen] = useState(false);
	const [selectedChurchForLogs, setSelectedChurchForLogs] = useState<Church | null>(null);
	const [refundReason, setRefundReason] = useState('');
	const [refundAmount, setRefundAmount] = useState('');

	// State for real data
	const [payments, setPayments] = useState<Payment[]>([]);
	const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
	const [churches, setChurches] = useState<Church[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Manual payment form state
	const [manualPaymentForm, setManualPaymentForm] = useState({
		churchId: '',
		plan: 'GROWTH' as PlanType,
		notes: '',
	});

	// Fetch data on load and when filters change
	useEffect(() => {
		fetchPaymentsData();
		fetchChurchesData();
	}, [planFilter, statusFilter, churchFilter, dateRange]);

	const fetchPaymentsData = async () => {
		setLoading(true);
		setError(null);
		try {
			// Calculate date range filter
			let fromDate: string | undefined;
			if (dateRange !== 'all') {
				const now = new Date();
				if (dateRange === 'week') {
					fromDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
				} else if (dateRange === 'month') {
					fromDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
				} else if (dateRange === 'quarter') {
					fromDate = new Date(now.setMonth(now.getMonth() - 3)).toISOString();
				}
			}

			const [paymentsData, statsData] = await Promise.all([
				fetchPayments({
					limit: 100,
					status: statusFilter !== 'all' ? (statusFilter as PaymentStatus) : undefined,
					plan: planFilter !== 'all' ? (planFilter as PlanType) : undefined,
					from: fromDate,
				}),
				fetchPaymentStats(dateRange !== 'all' ? (dateRange as any) : undefined),
			]);
			setPayments(paymentsData.data);
			setPaymentStats(statsData);
		} catch (err) {
			console.error('Failed to fetch payments:', err);
			setError(err instanceof Error ? err.message : 'Failed to load payments');
			toast({
				title: 'Error',
				description: 'Failed to load payment data',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchChurchesData = async () => {
		try {
			const response = await fetchChurches({ limit: 100 });
			setChurches(response.data);
		} catch (err) {
			console.error('Failed to fetch churches:', err);
		}
	};

	// Filter transactions locally for search
	const filteredPayments = payments.filter((payment) => {
		const matchesSearch =
			!searchQuery ||
			payment.churchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
			payment.reference.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesChurch = churchFilter === 'all' || payment.churchName === churches.find((c) => c.id === churchFilter)?.name;

		return matchesSearch && matchesChurch;
	});

	// Get payment logs for a specific church
	const getChurchPaymentLogs = (churchName: string) => {
		return payments.filter((p) => p.churchName === churchName).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	};

	// Stats from real data
	const totalRevenue = paymentStats?.totalRevenue || 0;
	const pendingAmount = paymentStats?.pendingAmount || 0;
	const pendingCount = paymentStats?.pendingCount || 0;
	const successCount = 0; //paymentStats?.totalCount - paymentStats?.pendingCount - (paymentStats?.failedCount || 0) || 0;
	const failedCount = paymentStats?.failedCount || 0;
	const successRate = paymentStats?.successRate || '0%';
	const totalCount = paymentStats?.totalCount || 0;

	const handleRefund = async () => {
		if (!selectedPayment) return;

		setIsSubmitting(true);
		try {
			// TODO: Call API to process refund when endpoint is available
			// await processRefund(selectedPayment._id, { amount: refundAmount, reason: refundReason });

			toast({
				title: 'Refund Processed',
				description: `Refund of ${refundAmount || 'full amount'} for ${selectedPayment.churchName} has been initiated.`,
			});
			setIsRefundModalOpen(false);
			setRefundReason('');
			setRefundAmount('');
			fetchPaymentsData(); // Refresh data
		} catch (err) {
			console.error('Failed to process refund:', err);
			toast({
				title: 'Error',
				description: err instanceof Error ? err.message : 'Failed to process refund',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleViewPaymentLogs = (church: Church) => {
		setSelectedChurchForLogs(church);
		setIsPaymentLogsModalOpen(true);
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
	};

	const formatAmount = (amount: number, currency: string = 'NGN') => {
		return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const getAvatarColor = (name: string) => {
		const colors = [
			{ bg: 'bg-green-100', text: 'text-green-700' },
			{ bg: 'bg-blue-100', text: 'text-blue-700' },
			{ bg: 'bg-amber-100', text: 'text-amber-700' },
			{ bg: 'bg-purple-100', text: 'text-purple-700' },
			{ bg: 'bg-pink-100', text: 'text-pink-700' },
			{ bg: 'bg-indigo-100', text: 'text-indigo-700' },
		];
		const index = name.length % colors.length;
		return colors[index];
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
					<div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
					<div className="flex gap-2">
						{/* <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" /> */}
						<div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-32 bg-gray-100 rounded-2xl animate-pulse"
						/>
					))}
				</div>
				<div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
				<div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
			</div>
		);
	}

	if (error && payments.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="text-red-600 text-center">
					<p className="font-semibold">Failed to load payments</p>
					<p className="text-sm mt-1">{error}</p>
				</div>
				<Button
					onClick={fetchPaymentsData}
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
						text="Payments & Subscriptions"
					/>
					<Text
						text="Manage transactions, process refunds, record manual payments, and verify payments"
						variant="muted"
					/>
				</div>
				<div className="flex gap-2">
					{/* <Button
						onClick={() => setIsManualPaymentModalOpen(true)}
						className="gap-2">
						<Plus className="h-4 w-4" />
						Record Manual Payment
					</Button> */}
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
						onClick={fetchPaymentsData}>
						<RefreshCw className="h-4 w-4" />
						Refresh
					</Button>
				</div>
			</div>

			{/* Stats Cards - From Real API */}
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
									text={formatAmount(totalRevenue)}
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
									text={formatAmount(pendingAmount)}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
								<Clock className="w-5 h-5 text-amber-600" />
							</div>
						</div>
						<Text
							text={`${pendingCount} transaction${pendingCount !== 1 ? 's' : ''} awaiting confirmation`}
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
									text={successRate}
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
									text="Total Transactions"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={totalCount.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
								<CreditCard className="w-5 h-5 text-purple-600" />
							</div>
						</div>
						<Text
							text="All time transactions"
							variant="muted"
							className="text-xs mt-2"
						/>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card className="rounded-2xl mb-6">
				<CardContent className="p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
						<div className="relative md:col-span-2 flex-1">
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
										value={church.id}>
										{church.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={planFilter}
							onValueChange={setPlanFilter}>
							<SelectTrigger className="w-[160px]">
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
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="PENDING">Pending</SelectItem>
								<SelectItem value="SUCCESS">Success</SelectItem>
								<SelectItem value="FAILED">Failed</SelectItem>
								<SelectItem value="REFUNDED">Refunded</SelectItem>
								<SelectItem value="CANCELLED">Cancelled</SelectItem>
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
					<div
						className="overflow-x-auto"
						style={{ maxHeight: '500px', overflowY: 'auto' }}>
						<table className="w-full text-sm">
							<thead className="sticky top-0 z-10 backdrop-blur-sm bg-white/95 shadow-sm">
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Transaction</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Church</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Plan</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Amount</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Status</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Date</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Reference</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredPayments.map((payment) => {
									const StatusIcon = statusConfig[payment.status]?.icon || CheckCircle;
									const statusInfo = statusConfig[payment.status] || statusConfig.SUCCESS;
									const avatarColor = getAvatarColor(payment.churchName);

									return (
										<tr
											key={payment._id}
											className="border-b last:border-0 hover:bg-gray-50">
											<td className="py-3 px-4">
												<div>
													<div className="font-mono text-xs font-medium">{payment.transactionId}</div>
												</div>
											</td>
											<td className="py-3 px-4">
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8">
														<AvatarFallback className={cn(avatarColor.bg, avatarColor.text)}>{getInitials(payment.churchName)}</AvatarFallback>
													</Avatar>
													<div>
														<span className="font-medium">{payment.churchName}</span>
														<Button
															variant="link"
															size="sm"
															className="h-auto p-0 ml-2 text-xs text-primary-600"
															onClick={() => {
																const church = churches.find((c) => c.name === payment.churchName);
																if (church) handleViewPaymentLogs(church);
															}}>
															View logs
														</Button>
													</div>
												</div>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm">{payment.plan}</span>
											</td>
											<td className="py-3 px-4 font-semibold">{payment.amount === 0 ? 'Free' : formatAmount(payment.amount)}</td>
											<td className="py-3 px-4">
												<span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', statusInfo.class)}>
													<StatusIcon className="h-3 w-3" />
													{statusInfo.label}
												</span>
											</td>
											<td className="py-3 px-4 text-gray-500 text-xs">{formatDate(payment.date)}</td>
											<td className="py-3 px-4">
												<span className="font-mono text-xs text-gray-500">{payment.reference}</span>
											</td>
											<td className="py-3 px-4">
												<div className="flex gap-2">
													{payment.status === 'FAILED' && (
														<Button
															variant="ghost"
															size="sm"
															className="h-7 text-xs"
															onClick={() => {
																setSelectedPayment(payment);
																setIsRefundModalOpen(true);
															}}>
															Refund
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

					{filteredPayments.length === 0 && !loading && (
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
											value={church.id}>
											{church.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="plan">Plan *</Label>
							<Select
								value={manualPaymentForm.plan}
								onValueChange={(value) => setManualPaymentForm({ ...manualPaymentForm, plan: value as PlanType })}>
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
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Payment Logs Modal */}
			<Dialog
				open={isPaymentLogsModalOpen}
				onOpenChange={setIsPaymentLogsModalOpen}>
				<DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3">
							<div className="text-xl">Payment Logs - {selectedChurchForLogs?.name}</div>
							<DialogDescription>Complete payment history for this church</DialogDescription>
						</DialogTitle>
					</DialogHeader>

					<Separator />

					{selectedChurchForLogs && (
						<div className="space-y-4">
							{getChurchPaymentLogs(selectedChurchForLogs.name).length === 0 ? (
								<div className="text-center py-8">
									<Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
									<Text
										text="No payment records found"
										className="text-gray-500"
									/>
								</div>
							) : (
								<div className="space-y-3">
									{getChurchPaymentLogs(selectedChurchForLogs.name).map((log) => {
										const StatusIcon = statusConfig[log.status]?.icon || CheckCircle;
										const statusInfo = statusConfig[log.status] || statusConfig.SUCCESS;

										return (
											<div
												key={log._id}
												className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<span className="font-mono text-xs font-medium">{log.transactionId}</span>
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
																	text={log.amount === 0 ? 'Free' : formatAmount(log.amount)}
																	className="text-sm font-semibold"
																/>
															</div>
															<div>
																<Text
																	text="Reference"
																	variant="muted"
																	className="text-xs"
																/>
																<Text
																	text={log.reference}
																	className="text-sm font-mono"
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
						<DialogDescription>Refund payment for {selectedPayment?.churchName}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="bg-gray-50 rounded-lg p-3">
							<div className="flex justify-between text-sm">
								<Text
									text="Transaction ID"
									variant="muted"
								/>
								<Text
									text={selectedPayment?.transactionId}
									className="font-mono"
								/>
							</div>
							<div className="flex justify-between text-sm mt-2">
								<Text
									text="Original Amount"
									variant="muted"
								/>
								<Text
									text={formatAmount(selectedPayment?.amount || 0)}
									className="font-semibold"
								/>
							</div>
							<div className="flex justify-between text-sm mt-2">
								<Text
									text="Status"
									variant="muted"
								/>
								<Text text={selectedPayment?.status || 'N/A'} />
							</div>
						</div>

						<div>
							<Label htmlFor="refund-amount">Refund Amount (Optional)</Label>
							<Input
								id="refund-amount"
								type="text"
								placeholder={`Leave empty for full refund (${formatAmount(selectedPayment?.amount || 0)})`}
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
							onClick={handleRefund}
							disabled={isSubmitting}>
							{isSubmitting ? 'Processing...' : 'Process Refund'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
