"use client";

import { format } from "date-fns";
import { Loader } from "@/components/ui/loader";
import {
  AlertCircle,
  ArrowLeftRight,
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Receipt,
  RefreshCw,
  Search,
  Wallet,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  fetchPayments,
  fetchPaymentStats,
  verifyPayment,
  Payment,
} from "@/services/paymentService";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  success: {
    label: "Success",
    icon: CheckCircle,
    class: "bg-green-100 text-green-700",
  },
  failed: { label: "Failed", icon: XCircle, class: "bg-red-100 text-red-700" },
  pending: {
    label: "Pending",
    icon: Clock,
    class: "bg-amber-100 text-amber-700",
  },
  refunded: {
    label: "Refunded",
    icon: ArrowLeftRight,
    class: "bg-gray-100 text-gray-700",
  },
  pending_verification: {
    label: "Pending Verification",
    icon: AlertCircle,
    class: "bg-blue-100 text-blue-700",
  },
};

const paymentMethodConfig = {
  card: { label: "Card", icon: CreditCard },
  transfer: { label: "Bank Transfer", icon: Banknote },
  free: { label: "Free Tier", icon: Wallet },
};

const planOptions = ["All Plans", "Enterprise", "Growth", "Starter"];
const statusOptions = [
  "All Statuses",
  "Success",
  "Failed",
  "Pending",
  "Refunded",
  "Pending Verification",
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateRange, setDateRange] = useState<
    "all" | "week" | "month" | "quarter"
  >("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [verificationNote, setVerificationNote] = useState("");
  const { toast } = useToast();

  const loadPayments = async () => {
    try {
      setLoading(true);

      const response = await fetchPayments({
        page,
        limit: 20,
        plan: planFilter,
        status: statusFilter,
        timeframe:
          dateRange === "all"
            ? undefined
            : (dateRange as "week" | "month" | "quarter"),
      });

      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchPaymentStats(dateRange);
      setStats(response);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch paymentstats",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadPayments();
    loadStats();
  }, [page, planFilter, statusFilter, dateRange]);

  useEffect(() => {
    setPage(1);
  }, [planFilter, statusFilter, dateRange]);

  const totalRevenue = stats?.totalRevenue || 0;
  const pendingAmount = stats?.pendingAmount || 0;
  const successCount = stats?.successCount || 0;
  const failedCount = stats?.failedCount || 0;
  const successRate = stats?.successRate || 0;

  const filteredTransactions = transactions;

  const handleRefund = () => {
    toast({
      title: "Refund Processed",
      description: `Refund of ${refundAmount || "full amount"} for ${selectedTransaction?.churchName} has been initiated.`,
    });
    setIsRefundModalOpen(false);
    setRefundReason("");
    setRefundAmount("");
  };

  const handleVerifyPayment = () => {
    toast({
      title: "Payment Verified",
      description: `Payment ${selectedTransaction?.transactionId} has been marked as verified. ${verificationNote ? `Note: ${verificationNote}` : ""}`,
    });
    setIsVerifyModalOpen(false);
    setVerificationNote("");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy • h:mm a");
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Heading level={1} text="Payments & Subscriptions" />
              <Text
                text="Manage transactions, process refunds, and verify payments"
                variant="muted"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
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
                      text={formatAmount(totalRevenue, "NGN")}
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
                      text={formatAmount(pendingAmount, "NGN")}
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
                      text={filteredTransactions
                        .filter((t) => t.status === "pending_verification")
                        .length.toString()}
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

                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {planOptions.map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={dateRange === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange("all")}
                    className="px-3"
                  >
                    All
                  </Button>
                  <Button
                    variant={dateRange === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange("week")}
                    className="px-3"
                  >
                    Week
                  </Button>
                  <Button
                    variant={dateRange === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange("month")}
                    className="px-3"
                  >
                    Month
                  </Button>
                  <Button
                    variant={dateRange === "quarter" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange("quarter")}
                    className="px-3"
                  >
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
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Transaction
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Church
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Plan
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Payment Method
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => {
                      const StatusIcon =
                        statusConfig[
                          transaction.status as keyof typeof statusConfig
                        ]?.icon || CheckCircle;
                      const statusInfo =
                        statusConfig[
                          transaction.status as keyof typeof statusConfig
                        ] || statusConfig.success;
                      const methodInfo =
                        paymentMethodConfig[
                          transaction.paymentMethod as keyof typeof paymentMethodConfig
                        ] || paymentMethodConfig.card;
                      const MethodIcon = methodInfo.icon;

                      return (
                        <tr
                          key={transaction.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-mono text-xs font-medium">
                                {transaction.id}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {transaction.reference}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback
                                  className={cn(
                                    transaction.churchInitBg,
                                    transaction.churchInitColor,
                                  )}
                                >
                                  {transaction.churchInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {transaction.churchName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm">{transaction.plan}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            {transaction.amount === 0
                              ? "Free"
                              : formatAmount(
                                  transaction.amount,
                                  transaction.currency,
                                )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <MethodIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-sm">
                                {methodInfo.label}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                                statusInfo.class,
                              )}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {transaction.status === "failed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    setSelectedTransaction(transaction);
                                    setIsRefundModalOpen(true);
                                  }}
                                >
                                  Refund
                                </Button>
                              )}
                              {transaction.status ===
                                "pending_verification" && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    setSelectedTransaction(transaction);
                                    setIsVerifyModalOpen(true);
                                  }}
                                >
                                  Verify
                                </Button>
                              )}
                              {transaction.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    setSelectedTransaction(transaction);
                                    setIsVerifyModalOpen(true);
                                  }}
                                >
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
            {pagination && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-xs text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Refund Modal */}
          <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Process Refund</DialogTitle>
                <DialogDescription>
                  Refund payment for {selectedTransaction?.churchName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <Text text="Transaction ID" variant="muted" />
                    <Text
                      text={selectedTransaction?.transactionId}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <Text text="Original Amount" variant="muted" />
                    <Text
                      text={formatAmount(
                        selectedTransaction?.amount || 0,
                        "NGN",
                      )}
                      className="font-semibold"
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <Text text="Payment Method" variant="muted" />
                    <Text
                      text={
                        paymentMethodConfig[
                          selectedTransaction?.paymentMethod as keyof typeof paymentMethodConfig
                        ]?.label || "N/A"
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="refund-amount">
                    Refund Amount (Optional)
                  </Label>
                  <Input
                    id="refund-amount"
                    type="text"
                    placeholder={`Leave empty for full refund (${formatAmount(selectedTransaction?.amount || 0, "NGN")})`}
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
                  onClick={() => setIsRefundModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRefund}>
                  Process Refund
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Verify Payment Modal */}
          <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Verify Payment</DialogTitle>
                <DialogDescription>
                  Manually mark this payment as verified
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <Text text="Church" variant="muted" />
                    <Text text={selectedTransaction?.churchName} />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <Text text="Transaction ID" variant="muted" />
                    <Text
                      text={selectedTransaction?.transactionId}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <Text text="Amount" variant="muted" />
                    <Text
                      text={formatAmount(
                        selectedTransaction?.amount || 0,
                        "NGN",
                      )}
                      className="font-semibold"
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <Text text="Payment Method" variant="muted" />
                    <Text
                      text={
                        paymentMethodConfig[
                          selectedTransaction?.paymentMethod as keyof typeof paymentMethodConfig
                        ]?.label || "N/A"
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="verification-note">
                    Verification Note (Optional)
                  </Label>
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
                  onClick={() => setIsVerifyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleVerifyPayment}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Verified
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
