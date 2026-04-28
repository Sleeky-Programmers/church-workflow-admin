"use client";

import { Church, CreditCard, Mail, MapPin, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { normalizePlan, normalizeStatus } from "@/utils/helpers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Text } from "@/components/ui/typography/Text";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/helpers";
import { getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";

import { ChurchSubscriptionStatus } from "@/lib/enums";
import {
  getChurches,
  getChurchById,
  ChurchListItem,
  ChurchDetails,
} from "@/services/churchServices";

const planBadgeClass = {
  ENTERPRISE: "bg-green-100 text-green-700",
  GROWTH: "bg-blue-100 text-blue-700",
  STARTER: "bg-amber-100 text-amber-700",
};

const statusBadgeClass = {
  Active: "bg-green-100 text-green-700",
  Expiring: "bg-amber-100 text-amber-700",
  Overdue: "bg-red-100 text-red-700",
};

const statusLabel = {
  active: "Active",
  expiring: "Expiring soon",
  overdue: "Overdue",
};

const planOptions = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    maxMembers: 100,
    features: ["Basic features", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "₦15,000/mo",
    maxMembers: 500,
    features: ["Full features", "Priority email support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₦35,000/mo",
    maxMembers: "Unlimited",
    features: [
      "All features",
      "24/7 priority support",
      "Dedicated account manager",
    ],
  },
];

export default function ChurchesPage() {
  const [churches, setChurches] = useState<ChurchListItem[]>([]);
  const [selectedChurch, setSelectedChurch] = useState<ChurchDetails | null>(
    null,
  );

  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState<{
    type: string;
    value: number;
  } | null>(null);

  const filteredChurches = churches;

  const fetchChurches = async () => {
    try {
      setLoading(true);

      const response = await getChurches({
        page,
        search: searchQuery,
        plan: planFilter === "all" ? undefined : planFilter,
      });

      setChurches(response.data);
      setPagination(response.pagination);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch Churches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleViewDetails = async (church: ChurchListItem) => {
    try {
      setLoading(true);

      const response = await getChurchById(church.id);

      setSelectedChurch(response);
      setIsModalOpen(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch Churches details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChurches();
  }, [page, searchQuery, planFilter]);

  const handlePlanChange = () => {
    // API call to update plan

    if (discountApplied) {
    }
    // Update local state, close modal, show toast
    setIsPlanModalOpen(false);
    setCouponCode("");
    setDiscountApplied(null);
  };

  // Apply coupon handler
  const handleApplyCoupon = () => {
    // Mock coupon validation
    if (couponCode === "WELCOME20") {
      setDiscountApplied({ type: "percentage", value: 20 });
    } else if (couponCode === "FIRSTFREE") {
      setDiscountApplied({ type: "free", value: 100 });
    } else {
      alert("Invalid coupon code");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Heading level={1} text="Churches" />
          <Text variant="muted">
            {`${churches.length}`} registered churches across the platform
          </Text>
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

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search churches by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div>
          <Loader />
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChurches.map((church) => (
                    <tr
                      key={church.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={cn("text-sm text-blue-700")}
                            >
                              {getInitials(church.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{church.name}</span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => handleViewDetails(church)}
                        >
                          View details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Page {pagination?.page || 1} of {pagination?.totalPages || 1}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination?.hasPreviousPage || loading}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!pagination?.hasNextPage || loading}
                onClick={() =>
                  setPage((prev) =>
                    pagination?.totalPages
                      ? Math.min(prev + 1, pagination.totalPages)
                      : prev + 1,
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Church Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader className="flex gap-2 md:pb-3">
            <DialogTitle className="flex items-center gap-3">
              <div>
                <div className="text-xl">{selectedChurch?.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                    {selectedChurch?.subscription?.plan || "N/A"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                    {selectedChurch?.subscription?.status || "N/A"}
                  </span>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Church information and subscription details
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {/* Church Details Content */}
          <div className="space-y-4">
            {/* Location Section */}
            <div>
              <div className="flex items-center gap-2 mt-3 mb-2">
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
                  text={`${selectedChurch?.state || ""}, ${selectedChurch?.country || ""}`}
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
                  text={selectedChurch?.superAdmin?.email || "N/A"}
                  className="text-sm"
                />
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
                  text={`Admin: ${selectedChurch?.superAdmin?.fullName || "N/A"}`}
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
              <div className="pl-6 my-3 grid grid-cols-2 gap-2">
                <div>
                  <Text
                    text="Total Members"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text
                    text={selectedChurch?.totalMembers?.toLocaleString() || "0"}
                  />
                </div>

                <div>
                  <Text
                    text="Total Users"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text
                    text={selectedChurch?.totalUsers?.toLocaleString() || "0"}
                  />
                </div>

                <div>
                  <Text text="Plan" variant="muted" className="text-xs" />
                  <Text text={selectedChurch?.subscription?.plan || "N/A"} />
                </div>

                <div>
                  <Text text="Status" variant="muted" className="text-xs" />
                  <Text text={selectedChurch?.subscription?.status || "N/A"} />
                </div>

                <div>
                  <Text text="Expires On" variant="muted" className="text-xs" />
                  <Text
                    text={
                      formatDate(selectedChurch?.subscription?.endDate) || "N/A"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4 mt-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <Text
                text="Plan Management"
                variant="blue"
                className="font-medium text-sm"
              />
            </div>

            <div className="pl-6 space-y-4">
              {/* Current Plan Display */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <Text
                    text="Current Plan"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text text={selectedChurch?.subscription?.plan || "N/A"} />
                </div>
                <div className="text-right">
                  <Text text="Expires" variant="muted" className="text-xs" />
                  <Text
                    text={
                      formatDate(selectedChurch?.subscription?.endDate) || "N/A"
                    }
                  />
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <Text text="Change Plan" className="text-sm font-medium mb-2" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {planOptions.map((plan) => (
                    <div
                      key={plan.id}
                      className={cn(
                        "border rounded-xl p-3 cursor-pointer transition-all",
                        selectedPlan === plan.name
                          ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      onClick={() => setSelectedPlan(plan.name)}
                    >
                      <div className="font-medium text-sm">{plan.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {plan.price}
                      </div>
                      {selectedChurch?.subscription?.plan === plan.name && (
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
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
                {discountApplied && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                    ✓ Discount applied!{" "}
                    {discountApplied.type === "percentage"
                      ? `${discountApplied.value}% off`
                      : "First month free"}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Plan
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
