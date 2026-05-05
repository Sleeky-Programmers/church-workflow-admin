import { authenticatedFetch } from "@/lib/api";
import { CouponData, couponPayload, GetCouponStat } from "@/types";
import { CouponDiscount } from "@/lib/enums";
export interface GetAllCouponResponse {
  data: CouponData[];
  pagination: {
    page: number;
    limit: number;
    itemCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

interface GetAllCouponParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
}

export interface Coupon {
  code: string;
  discountType: CouponDiscount.PERCENTAGE | CouponDiscount.FLAT;
  discount: number;
}

export async function getAllCoupon({
  page = 1,
  limit = 10,
  search,
  filter,
}: GetAllCouponParams): Promise<GetAllCouponResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.append("search", search);
  }

  if (filter && filter !== "all") {
    params.append("filter", filter);
  }
  const response = await authenticatedFetch<GetAllCouponResponse>(
    `/coupon?${params.toString()}`,
    {
      method: "GET",
    },
  );

  return {
    data: response.data,
    pagination: response.pagination,
  };
}

export async function getCouponStats(): Promise<GetCouponStat> {
  return await authenticatedFetch(`/coupon/stats`, {
    method: "GET",
  });
}

export async function createCoupon(payload: couponPayload) {
  return await authenticatedFetch("/coupon", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function validateCoupon(code: string): Promise<Coupon> {
  return authenticatedFetch(`/coupon/validate?code=${code}`, {
    method: "GET",
  });
}

export async function updateCoupon(
  id: string,
  payload: Partial<couponPayload>,
) {
  return await authenticatedFetch(`/coupon/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCoupon(id: string) {
  return await authenticatedFetch(`/coupon/${id}`, {
    method: "DELETE",
  });
}
