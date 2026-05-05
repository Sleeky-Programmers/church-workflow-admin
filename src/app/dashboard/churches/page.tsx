"use client";
import { formatDate } from "@/utils/helpers";
import { Loader } from "@/components/ui/loader";
import {
  Church,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Search,
  Unlock,
  UserCog,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getInitials } from "@/lib/utils";
import { normalizePlan } from "@/utils/helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/typography/Heading";
import { Span, Text } from "@/components/ui/typography/Text";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  BillingCycle,
  ChurchStatus,
  ChurchSubscriptionStatus,
} from "@/lib/enums";
import {
  getBillingOverview,
  Plan,
  updateSubscription,
  previewSubscriptionPrice,
} from "@/services/subscriptionService";

import {
  getChurches,
  getChurchById,
  ChurchListItem,
  ChurchDetails,
  blockChurch,
  unblockChurch,
} from "@/services/churchServices";
type SearchType = "church" | "admin" | "both";

const planBadgeClass = {
  ENTERPRISE: "bg-green-100 text-green-700",
  GROWTH: "bg-blue-100 text-blue-700",
  STARTER: "bg-amber-100 text-amber-700",
};

const statusBadgeClass = {
  ACTIVE: "bg-green-100 text-green-700",
  BLOCKED: "bg-amber-100 text-amber-700",
  Overdue: "bg-red-100 text-red-700",
};

const statusLabel = {
  active: "Active",
  expiring: "Expiring soon",
  overdue: "Overdue",
};

export default function ChurchesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("both");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [churches, setChurches] = useState<ChurchListItem[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<ChurchDetails | null>(
    null,
  );
  const [pricePreview, setPricePreview] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState<{
    type: string;
    value: number;
  } | null>(null);

  const filteredChurches = churches;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [churchData, plansData] = await Promise.all([
        getChurches({
          page,
          search: searchQuery,
          plan: planFilter === "all" ? undefined : planFilter,
        }),
        getBillingOverview(),
      ]);

      const response = setChurches(churchData.data);
      setPagination(churchData.pagination);
      setPlans(plansData.plans);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch Data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery, planFilter]);

  useEffect(() => {
    setDiscountApplied(null);
    setCouponCode("");
    setPricePreview(null);
  }, [selectedPlan]);

  const handleViewDetails = async (church: ChurchListItem) => {
    try {
      setLoading(true);
      const response = await getChurchById(church.id);
      setSelectedChurch(response);
      setIsModalOpen(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch church details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async () => {
    if (!selectedPlan || !selectedChurch) return;

    try {
      const payload = {
        churchId: selectedChurch._id,
        plan: selectedPlan,
        billingCycle: BillingCycle.MONTHLY,
        couponCode: couponCode || undefined,
      };

      await updateSubscription(payload);

      toast({
        title: "Success",
        description: "Plan updated successfully",
      });

      setIsPlanModalOpen(false);
      setDiscountApplied(null);
      setCouponCode("");

      fetchData();
      const updatedChurch = await getChurchById(selectedChurch._id);
      setSelectedChurch(updatedChurch);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan",
        variant: "destructive",
      });
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await previewSubscriptionPrice({
        plan: selectedPlan,
        billingCycle: BillingCycle.MONTHLY,
        couponCode,
      });

      setPricePreview(response);

      setDiscountApplied({
        type: response.discountType || "",
        value: response.discountAmount || 0,
      });

      toast({
        title: "Success",
        description: "Coupon applied successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleToggleBlock = async () => {
    if (!selectedChurch) return;

    const isBlocked = selectedChurch.status === ChurchStatus.BLOCKED;

    try {
      if (isBlocked) {
        await unblockChurch(selectedChurch._id);
      } else {
        await blockChurch(selectedChurch._id);
      }

      const newStatus = isBlocked ? ChurchStatus.ACTIVE : ChurchStatus.BLOCKED;

      setSelectedChurch({
        ...selectedChurch,
        status: newStatus,
      });

      setChurches((prev) =>
        prev.map((c) =>
          c.id === selectedChurch._id ? { ...c, status: newStatus } : c,
        ),
      );

      toast({
        title: isBlocked ? "Church Unblocked" : "Church Blocked",
        description: isBlocked
          ? `${selectedChurch.name} is now active`
          : `${selectedChurch.name} has been blocked`,
        variant: isBlocked ? "default" : "destructive",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update church status",
        variant: "destructive",
      });
    } finally {
      setIsBlockModalOpen(false);
    }
  };
  const openPlanModal = () => {
    setSelectedPlan(selectedChurch?.subscription?.plan || "");
    setIsPlanModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Heading level={1} text="Churches" />
          <Text
            text={`${churches.length} registered churches across the platform`}
            variant="muted"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
            <SelectItem value="Growth">Growth</SelectItem>
            <SelectItem value="Starter">Starter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Search Bar with Type Selector */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={
              searchType === "church"
                ? "Search by church name..."
                : searchType === "admin"
                  ? "Search by super admin name or email..."
                  : "Search by church name, admin name, or email..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={searchType}
          onValueChange={(value: SearchType) => setSearchType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="both">Church & Admin</SelectItem>
            <SelectItem value="church">Church Name Only</SelectItem>
            <SelectItem value="admin">Super Admin Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="p-6">
          {" "}
          <Loader /> Loading Churches...
        </div>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Church
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Super Admin
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Members
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Users
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Plan
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChurches.map((church) => (
                    <tr
                      key={church.id}
                      className={cn(
                        "border-b last:border-0 hover:bg-gray-50 transition-colors",
                        church.status == ChurchStatus.BLOCKED &&
                          "bg-red-50/30 hover:bg-red-50/50",
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={cn("text-sm text-blue-700")}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback
                                  className={cn("text-sm text-blue-700")}
                                >
                                  {getInitials(church.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{church.name}</span>
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{church.name}</span>
                            {church.status == ChurchStatus.BLOCKED && (
                              <Badge
                                variant="destructive"
                                className="ml-2 text-xs"
                              >
                                Blocked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-sm">
                            {church.superAdmin.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {church.superAdmin.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {church.location}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {church.totalMembers.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {church.totalUsers.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            planBadgeClass[
                              church.plan as keyof typeof planBadgeClass
                            ],
                          )}
                        >
                          {" "}
                          {normalizePlan(church.plan)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            church.subscriptionStatus ===
                              ChurchSubscriptionStatus.ACTIVE &&
                              "bg-green-100 text-green-700",
                            church.subscriptionStatus ===
                              ChurchSubscriptionStatus.EXPIRING_SOON &&
                              "bg-amber-100 text-amber-700",
                            church.subscriptionStatus ===
                              ChurchSubscriptionStatus.OVERDUE &&
                              "bg-red-100 text-red-700",
                          )}
                        >
                          {church.subscriptionStatus ===
                          ChurchSubscriptionStatus.ACTIVE
                            ? "Active"
                            : church.subscriptionStatus ===
                                ChurchSubscriptionStatus.EXPIRING_SOON
                              ? "Expiring soon"
                              : "Overdue"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleViewDetails(church)}
                          >
                            View
                          </Button>
                          {church.status == ChurchStatus.BLOCKED ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={async () => {
                                const response = await getChurchById(church.id);
                                setSelectedChurch(response);
                                setIsBlockModalOpen(true);
                              }}
                            >
                              <Unlock className="h-3.5 w-3.5 mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={async () => {
                                const response = await getChurchById(church.id);
                                setSelectedChurch(response);
                                setIsBlockModalOpen(true);
                              }}
                            >
                              <Lock className="h-3.5 w-3.5 mr-1" />
                              Block
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredChurches.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <Text text="No churches found" className="text-gray-500" />
                <Text
                  text="Try adjusting your search or filters"
                  variant="muted"
                  className="text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Churches Table */}

      {/* Church Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {/* { getInitials(selectedChurch?.name)} */}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl">{selectedChurch?.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        selectedChurch &&
                          planBadgeClass[
                            selectedChurch?.subscription
                              ?.plan as keyof typeof planBadgeClass
                          ],
                      )}
                    >
                      {selectedChurch?.subscription?.plan}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        selectedChurch &&
                          statusBadgeClass[
                            selectedChurch.status as keyof typeof statusBadgeClass
                          ],
                      )}
                    >
                      {/* {selectedChurch &&
                        statusLabel[
                          selectedChurch.status as keyof typeof status
                        ]} */}
                    </span>
                    {selectedChurch?.status == ChurchStatus.BLOCKED && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Church information and subscription details
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-3" />

          <div className="space-y-4">
            {/* Location Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Text
                  text="Location"
                  variant="blue"
                  className="font-medium text-sm"
                />
              </div>
              <div className="pl-6 space-y-1">
                <Text
                  text={selectedChurch?.address || "N/A"}
                  className="text-sm"
                />
                <Text
                  text={selectedChurch?.location || "N/A"}
                  variant="muted"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Text
                  text="Contact"
                  variant="blue"
                  className="font-medium text-sm"
                />
              </div>
              <div className="pl-6 space-y-1">
                <Text
                  text={selectedChurch?.email || "N/A"}
                  className="text-sm"
                />
                <Text
                  text={selectedChurch?.phone || "N/A"}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Super Admin Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UserCog className="h-4 w-4 text-gray-500" />
                <Text
                  text="Super Administrator"
                  variant="blue"
                  className="font-medium text-sm"
                />
              </div>
              <div className="pl-6">
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <Text text="Name" variant="muted" className="text-xs" />
                    <Text
                      text={selectedChurch?.superAdmin.name || "N/A"}
                      className="text-sm font-medium"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Text text="Email" variant="muted" className="text-xs" />
                    <Text
                      text={selectedChurch?.superAdmin.email || "N/A"}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Text text="Phone" variant="muted" className="text-xs" />
                    <Text
                      text={selectedChurch?.superAdmin.phone || "N/A"}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-gray-500" />
                <Text
                  text="Leadership"
                  variant="blue"
                  className="font-medium text-sm"
                />
              </div>
              <div className="pl-6">
                <Text
                  text={`Pastor: ${selectedChurch?.pastor || "N/A"}`}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Church Stats */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Church className="h-4 w-4 text-gray-500" />
                <Text
                  text="Church Information"
                  variant="blue"
                  className="font-medium text-sm"
                />
              </div>
              <div className="pl-6 grid grid-cols-2 gap-3">
                <div>
                  <Text text="Founded" variant="muted" className="text-xs" />
                  <Text
                    text={selectedChurch?.founded || "N/A"}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Text
                    text="Total Members"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text
                    text={selectedChurch?.totalMembers?.toString() || "0"}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Text
                    text="Total Users"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text
                    text={selectedChurch?.totalUsers.toLocaleString() || "0"}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Text
                    text="Service Time"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text
                    text={selectedChurch?.serviceTime || "N/A"}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Text
                    text="Plan Expires"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text
                    text={
                      formatDate(selectedChurch?.subscription?.endDate) || "N/A"
                    }
                    className="text-sm"
                  />
                </div>
                <div>
                  <Text
                    text="Subscription Price"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text
                    text={`₦${selectedChurch?.subscription?.price?.toLocaleString() || "0"}`}
                    className="text-sm"
                  />

                  {(selectedChurch?.subscription?.discountAmount ?? 0) > 0 && (
                    <Text
                      text={`Saved ₦${selectedChurch?.subscription?.discountAmount}`}
                      className="text-xs text-green-600"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between gap-3">
            <Button
              variant={
                selectedChurch?.status == ChurchStatus.BLOCKED
                  ? "default"
                  : "destructive"
              }
              onClick={() => setIsBlockModalOpen(true)}
              className="gap-2"
            >
              {selectedChurch?.status == ChurchStatus.BLOCKED ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {selectedChurch?.status == ChurchStatus.BLOCKED
                ? "Unblock Church"
                : "Block Church"}
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
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
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Manage Plan - {selectedChurch?.name}</DialogTitle>
            <DialogDescription>
              Change subscription plan or apply discounts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Plan Display */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <Text text="Current Plan" variant="muted" className="text-xs" />
                <Text
                  text={
                    formatDate(selectedChurch?.subscription?.endDate) || "N/A"
                  }
                  className="text-sm font-medium mt-0.5"
                />
              </div>
              <div className="text-right">
                <Text text="Expires" variant="muted" className="text-xs" />
                <Text
                  text={
                    formatDate(selectedChurch?.subscription?.endDate) || "N/A"
                  }
                  className="text-sm"
                />
              </div>
            </div>

            {/* Plan Selection */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {plans.map((plan, i) => (
                  <div
                    key={i}
                    className={cn(
                      "border rounded-xl p-3 cursor-pointer transition-all",
                      selectedPlan === plan.type
                        ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    onClick={() => setSelectedPlan(plan.type)}
                  >
                    <div className="font-medium text-sm">{plan.type}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {plan.type === selectedPlan && pricePreview ? (
                        <div>
                          <div className="font-semibold">
                            ₦{pricePreview?.finalAmount?.toLocaleString()}
                          </div>

                          {pricePreview?.discountAmount > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                              ₦{pricePreview?.originalAmount?.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>₦{plan?.monthlyPrice.toLocaleString()}</div>
                      )}
                    </div>
                    {selectedChurch?.subscription?.plan === plan.type && (
                      <div className="text-xs text-primary-600 mt-1">
                        ✓ Current plan
                      </div>
                    )}
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
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode}
                >
                  Apply
                </Button>
              </div>
              {discountApplied && (
                <div className="text-xs text-green-600">
                  ₦{discountApplied.value.toLocaleString()} off
                </div>
              )}{" "}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePlanChange}
              disabled={
                !selectedPlan ||
                selectedPlan === selectedChurch?.subscription.plan
              }
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
      <AlertDialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {selectedChurch?.status == ChurchStatus.BLOCKED ? (
                <Unlock className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-red-600" />
              )}
              {selectedChurch?.status == ChurchStatus.BLOCKED
                ? "Unblock Church"
                : "Block Church"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedChurch?.status == ChurchStatus.BLOCKED ? (
                <>
                  Are you sure you want to unblock{" "}
                  <span className="font-semibold">{selectedChurch?.name}</span>?
                  <br />
                  <br />
                  <span className="text-green-600">✓</span> The church will
                  regain full access to all platform features.
                  <br />
                  <span className="text-green-600">✓</span> All administrators
                  will be able to log in.
                  <br />
                  <span className="text-green-600">✓</span> Subscription billing
                  will resume normally.
                </>
              ) : (
                <>
                  Are you sure you want to block{" "}
                  <span className="font-semibold">{selectedChurch?.name}</span>?
                  <br />
                  <br />
                  <span className="text-red-600">⚠</span> The church will lose
                  access to all platform features.
                  <br />
                  <span className="text-red-600">⚠</span> All administrators
                  will be unable to log in.
                  <br />
                  <span className="text-red-600">⚠</span> Subscription billing
                  will be paused.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleBlock}
              className={
                selectedChurch?.status == ChurchStatus.BLOCKED
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {selectedChurch?.status == ChurchStatus.BLOCKED
                ? "Yes, Unblock Church"
                : "Yes, Block Church"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
