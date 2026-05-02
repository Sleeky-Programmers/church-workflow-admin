import { authenticatedFetch } from "@/lib/api";
import { ChurchStatus } from "@/lib/enums";

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
  subscriptionStatus: "ACTIVE" | "EXPIRING_SOON" | "OVERDUE" | string;
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
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
    memberLimit: number;
    userLimit: number;
  };
  superAdmin: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
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
