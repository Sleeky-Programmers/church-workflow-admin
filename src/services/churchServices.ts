import { authenticatedFetch } from "@/lib/api";

/**
 * TYPES
 */

export interface ChurchListItem {
  id: string;
  name: string;
  location: string;
  totalMembers: number;
  totalUsers: number;
  plan: string;
  subscriptionStatus: "ACTIVE" | "EXPIRING_SOON" | "OVERDUE" | string;
}

export interface ChurchDetails {
  _id: string;
  name: string;
  alias?: string;
  address: string;
  country: string;
  state: string;
  totalMembers: number;
  totalUsers: number;
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

/**
 * GET ALL CHURCHES
 */
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

  if (params?.search) query.append("search", params.search);
  if (params?.plan && params.plan !== "all") query.append("plan", params.plan);

  return authenticatedFetch<FetchChurchesResponse>(`/church?${query}`, {
    method: "GET",
  });
}

export async function getChurchById(id: string): Promise<ChurchDetails> {
  return authenticatedFetch<ChurchDetails>(`/church/${id}`, {
    method: "GET",
  });
}
