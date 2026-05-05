import { authenticatedFetch } from "@/lib/api";
import { ChurchStatus } from "@/lib/enums";
import { ChurchSubscriptionStatus } from "@/lib/enums";
export interface ChurchListItem {
  id: string;
  name: string;
  superAdmin: {
    id: string;
    fullName: string;
    email: string;
  };
  location: string;
  totalMembers: number;

  totalUsers: number;
  plan: string;
  subscriptionStatus:
    | ChurchSubscriptionStatus.ACTIVE
    | ChurchSubscriptionStatus.EXPIRING_SOON
    | ChurchSubscriptionStatus.OVERDUE
    | string;
  status: ChurchStatus;
}

export interface ChurchDetails {
  _id: string;
  name: string;
  alias?: string;
  address: string;
  email: string;
  founded: string;
  phone: string;
  pastor: string;
  country: string;
  serviceTime: string;
  location: string;
  state: string;
  totalMembers: number;
  totalUsers: number;
  status: ChurchStatus;
  subscription: {
    _id: string;
    churchId: string;
    plan: string;
    status: string;
    endDate: string;
    memberLimit: number;
    userLimit: number;
    customRolesEnabled: boolean;
    gracePeriodEndDate: string;
    isAutoRenew: boolean;
    originalPrice: number;
    price: number;
    discountAmount: number;
    discountValue: number;
    couponCode: number;
    startDate: string;
    createdAt: string;
    updatedAt: string;
  };
  superAdmin: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    lastActive: string;
    church: {
      id: string;
      name: string;
      alias: string;
    };
  };
}

export interface FetchChurchesResponse {
  data: ChurchListItem[];
  pagination: {
    page: number;
    limit: number;
    itemCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  totalCount: number;
}

export async function getChurches(params?: {
  page?: number;
  limit?: number;
  search?: string;
  plan?: string;
}): Promise<FetchChurchesResponse> {
  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    limit: String(params?.limit ?? 20),
  });

  if (params?.search) {
    query.append("search", params.search);
  }

  if (params?.plan && params.plan !== "all") {
    query.append("plan", params.plan);
  }
  return authenticatedFetch<FetchChurchesResponse>(`/church?${query}`, {
    method: "GET",
  });
}

export async function getChurchById(id: string): Promise<ChurchDetails> {
  return authenticatedFetch<ChurchDetails>(`/church/${id}`, {
    method: "GET",
  });
}

export async function blockChurch(
  churchId: string,
): Promise<{ message: string }> {
  return authenticatedFetch(`/church/${churchId}/block`, {
    method: "PATCH",
  });
}

export async function unblockChurch(
  churchId: string,
): Promise<{ message: string }> {
  return authenticatedFetch(`/church/${churchId}/unblock`, {
    method: "PATCH",
  });
}
