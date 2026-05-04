"use client";

import { format } from "date-fns";
import { Loader } from "@/components/ui/loader";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Copy,
  DollarSign,
  Edit,
  Gift,
  Percent,
  Plus,
  Search,
  Tag,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  createCoupon,
  getAllCoupon,
  getCouponStats,
  updateCoupon,
  deleteCoupon,
} from "@/services/couponService";
import { useEffect } from "react";
import { CouponData, GetCouponStat } from "@/types";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CouponFilter, CouponDiscount } from "@/lib/enums";
import * as Yup from "yup";
import { useFormik } from "formik";

const typeConfig = {
  percentage: { label: "Percentage", icon: Percent, suffix: "%" },
  fixed: { label: "Fixed Amount", icon: DollarSign, suffix: "off" },
};

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle,
    class: "bg-green-100 text-green-700",
  },
  inactive: {
    label: "Inactive",
    icon: XCircle,
    class: "bg-gray-100 text-gray-700",
  },
  expired: {
    label: "Expired",
    icon: AlertCircle,
    class: "bg-red-100 text-red-700",
  },
};

export default function CouponsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CouponFilter>(
    CouponFilter.ALL,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<
    (typeof coupons)[0] | null
  >(null);
  const [couponStats, setCouponsStats] = useState<GetCouponStat | null>(null);

  const { toast } = useToast();

  const formik = useFormik<{
    code: string;
    description: string;
    type: CouponDiscount;
    value: string;
    expiryDate: string;
    maxUsage: string;
  }>({
    enableReinitialize: true,

    initialValues: {
      code: selectedCoupon?.code || "",
      description: selectedCoupon?.description || "",
      type:
        (selectedCoupon?.discountType as CouponDiscount) ||
        CouponDiscount.PERCENTAGE,
      value: selectedCoupon?.discount?.toString() || "",
      expiryDate: selectedCoupon?.expiryDate || "",
      maxUsage: selectedCoupon?.maxUsage?.toString() || "",
    },

    validationSchema: Yup.object({
      code: Yup.string().required("Coupon code is required"),
      value: Yup.number()
        .typeError("Must be a number")
        .required("Discount value is required"),
      expiryDate: Yup.string().required("Expiry date is required"),
    }),

    onSubmit: async (values) => {
      const payload = {
        code: values.code,
        description: values.description,
        discountType: values.type,
        discount: parseFloat(values.value),
        maxUsage: parseInt(values.maxUsage) || 0,
        expiryDate: values.expiryDate,
      };

      try {
        if (selectedCoupon) {
          await updateCoupon(selectedCoupon.id, payload);

          toast({
            title: "Coupon Updated",
            description: `${selectedCoupon.code} updated successfully`,
          });
        } else {
          await createCoupon(payload);

          toast({
            title: "Coupon Created",
            description: `${payload.code} created successfully`,
          });
        }

        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedCoupon(null);

        formik.resetForm();
        loadCoupons();
      } catch {
        toast({
          title: "Error",
          description: "Operation failed",
          variant: "destructive",
        });
      }
    },
  });
  const loadCoupons = async (searchValue?: string) => {
    setIsLoading(true);

    try {
      const [couponRes, statsRes] = await Promise.all([
        getAllCoupon({
          page,
          limit: 20,
          search: searchValue,
          filter: statusFilter,
        }),
        getCouponStats(),
      ]);

      setCoupons(couponRes.data);
      setPagination(couponRes.pagination);
      setCouponsStats(statsRes);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch coupons",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadCoupons(searchQuery);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery, statusFilter, page]);

  const filteredCoupons = coupons;

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;

    try {
      await deleteCoupon(selectedCoupon.id);

      toast({
        title: "Coupon Deleted",
        description: `${selectedCoupon.code} deleted`,
        variant: "destructive",
      });

      setIsDeleteDialogOpen(false);
      setSelectedCoupon(null);
      loadCoupons();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = (coupon: (typeof coupons)[0]) => {
    const newStatus = coupon.isActive === true ? "inactive" : "active";
    const updatedCoupons = coupons.map((c) =>
      c.id === coupon.id ? { ...c, status: newStatus } : c,
    );
    setCoupons(updatedCoupons);
    toast({
      title: newStatus === "active" ? "Coupon Activated" : "Coupon Deactivated",
      description: `${coupon.code} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `${code} copied to clipboard.`,
    });
  };
  const openEditModal = (coupon: CouponData) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };
  const resetForm = () => {
    formik.resetForm();
    setSelectedCoupon(null);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatValue = (coupon: (typeof coupons)[0]) => {
    if (coupon.discountType === CouponDiscount.PERCENTAGE) {
      return `${coupon.discount}% off`;
    }
    return `₦${coupon.discount.toLocaleString()} off`;
  };

  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const days = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24),
    );
    if (days < 0) return "Expired";
    if (days === 0) return "Expires today";
    return `${days} days left`;
  };
  const getCouponStatus = (coupon: CouponData) => {
    const now = new Date();
    const expiry = new Date(coupon.expiryDate);

    if (expiry < now) {
      return "expired";
    }
    if (coupon.isActive) {
      return "active";
    }
    return "inactive";
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <Heading level={1} text="Coupon Management" />
            <Text
              text="Create and manage discount coupons for churches"
              variant="muted"
            />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
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
                    text={couponStats?.activeCoupons}
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
                    text={couponStats?.totalUsage}
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
                    text={couponStats?.expiringSoon}
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
                    text={couponStats?.totalCoupons}
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
                onValueChange={(value) =>
                  setStatusFilter(value as CouponFilter)
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CouponFilter.ALL}>All Status</SelectItem>
                  <SelectItem value={CouponFilter.ACTIVE}>Active</SelectItem>
                  <SelectItem value={CouponFilter.INACTIVE}>
                    Inactive
                  </SelectItem>
                  <SelectItem value={CouponFilter.EXPIRED}>Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {isLoading ? (
          <div className="p-6">
            {" "}
            <Loader /> Loading Coupon...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCoupons.map((coupon) => {
              const TypeIcon =
                typeConfig[coupon.discountType as keyof typeof typeConfig]
                  ?.icon || Percent;
              const status = getCouponStatus(coupon);
              const StatusIcon =
                statusConfig[status as keyof typeof statusConfig]?.icon ||
                CheckCircle;

              const statusInfo =
                statusConfig[status as keyof typeof statusConfig];
              const daysRemaining = getDaysRemaining(coupon.expiryDate);
              const isExpiringSoon =
                coupon.isActive === true &&
                daysRemaining !== "Expired" &&
                daysRemaining !== "Expires today" &&
                parseInt(daysRemaining) <= 30;

              return (
                <Card
                  key={coupon.id}
                  className="rounded-2xl hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-lg font-bold bg-gray-100 px-2 py-1 rounded-lg font-mono">
                            {coupon.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleCopyCode(coupon.code)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Text
                          text={coupon.description}
                          variant="muted"
                          className="text-xs"
                        />
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                          statusInfo.class,
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Value Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 rounded-lg">
                        <TypeIcon className="h-3.5 w-3.5 text-primary-600" />
                        <span className="text-sm font-semibold text-primary-700">
                          {formatValue(coupon)}
                        </span>
                      </div>
                      {/* {coupon.planRestriction !== "all" && (
                    <Badge variant="outline" className="text-xs">
                      {coupon.planRestriction} only
                    </Badge>
                  )} */}
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <Text text="Usage" variant="muted" />
                        <Text
                          text={`${coupon.usageCount} / ${coupon.maxUsage === 0 ? "∞" : coupon.maxUsage}`}
                        />
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${coupon.maxUsage > 0 ? (coupon.usageCount / coupon.maxUsage) * 100 : 0}%`,
                          }}
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
                          variant={isExpiringSoon ? "warning" : "muted"}
                          className="text-xs"
                        />
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex items-center gap-2 mr-auto">
                        <Switch
                          checked={coupon.isActive === true}
                          onCheckedChange={() => handleToggleStatus(coupon)}
                          disabled={getCouponStatus(coupon) === "expired"}
                        />
                        <Text
                          text={
                            coupon.isActive === true ? "Active" : "Inactive"
                          }
                          variant="muted"
                          className="text-xs"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => openEditModal(coupon)}
                      >
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
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {/* <div className="flex items-center  mt-6">
            <Button
              variant="outline"
              disabled={!pagination?.hasPreviousPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-gray-500">
              Page {pagination?.page} of {pagination?.totalPages}
            </span>

            <Button
              variant="outline"
              disabled={!pagination?.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div> */}
            {filteredCoupons.length === 0 && (
              <Card className="rounded-2xl">
                <CardContent className="text-center py-12">
                  <Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <Text text="No coupons found" className="text-gray-500" />
                  <Text
                    text="Create your first coupon to start offering discounts"
                    variant="muted"
                    className="text-sm"
                  />
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Coupon
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        {/* Coupons Grid */}

        {/* Create/Edit Coupon Modal */}
        <Dialog
          open={isCreateModalOpen || isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
              setSelectedCoupon(null);
              formik.resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreateModalOpen ? "Create New Coupon" : "Edit Coupon"}
              </DialogTitle>
              <DialogDescription>
                {isCreateModalOpen
                  ? "Create a discount coupon for churches to use"
                  : "Modify the coupon details below"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
              {/* Coupon Code */}
              <div>
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  name="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.code && formik.errors.code && (
                  <p className="text-red-500 text-xs">{formik.errors.code}</p>
                )}
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
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />

                {formik.touched.description && formik.errors.description && (
                  <Text
                    text={formik.errors.description}
                    className="text-red-500 text-xs mt-1"
                  />
                )}
              </div>

              {/* Type and Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Discount Type *</Label>
                  <Select
                    value={formik.values.type}
                    onValueChange={(value) =>
                      formik.setFieldValue("type", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CouponDiscount.PERCENTAGE}>
                        Percentage (%)
                      </SelectItem>
                      <SelectItem value={CouponDiscount.FLAT}>
                        Fixed Amount (₦)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Discount Value *</Label>
                  <Input
                    name="value"
                    type="number"
                    value={formik.values.value}
                    onChange={formik.handleChange}
                  />

                  {formik.touched.value && formik.errors.value && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.value}
                    </p>
                  )}
                </div>
              </div>

              {/* Expiry Date and Usage Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    name="expiryDate"
                    type="date"
                    value={formik.values.expiryDate}
                    onChange={formik.handleChange}
                  />

                  {formik.touched.expiryDate && formik.errors.expiryDate && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.expiryDate}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    name="maxUsage"
                    type="number"
                    value={formik.values.maxUsage}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              {/* Plan Restriction */}
              {/* <div>
              <Label htmlFor="planRestriction">
                Plan Restriction (Optional)
              </Label>
              <Select
                value={formData.planRestriction}
                onValueChange={(value) =>
                  setFormData({ ...formData, planRestriction: value })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select plan restriction" />
                </SelectTrigger>
                <SelectContent>
                  {planOptions.map((plan) => (
                    <SelectItem key={plan.value} value={plan.value}>
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
            </div> */}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isCreateModalOpen ? "Create Coupon" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-mono font-semibold">
                  {selectedCoupon?.code}
                </span>
                ? This action cannot be undone and the coupon will no longer be
                usable.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCoupon}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
