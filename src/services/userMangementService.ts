import { authenticatedFetch } from "@/lib/api";
export type AdminStats = {
  total: number;
  active: number;
  blocked: number;
  superAdmins: number;
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  lastActive: string;

  church?: {
    id: string;
    name: string;
    alias: string;
  };
}

export interface FetchAdminsResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    itemCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export async function getAdmins(params?: {
  search?: string;
  churchId?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<FetchAdminsResponse> {
  const query = new URLSearchParams();

  if (params?.search) {
    query.append("search", params.search);
  }
  if (params?.churchId) {
    query.append("churchId", params.churchId);
  }
  if (params?.role) {
    query.append("role", params.role);
  }
  if (params?.status) {
    query.append("status", params.status);
  }
  if (params?.page) {
    query.append("page", String(params.page));
  }
  if (params?.limit) {
    query.append("limit", String(params.limit));
  }

  return authenticatedFetch<FetchAdminsResponse>(`/admin?${query.toString()}`);
}

export async function getAdminStats() {
  return authenticatedFetch<AdminStats>("/admin/stats", {
    method: "GET",
  });
}

export async function blockAdmin(id: string) {
  return authenticatedFetch(`/admin/${id}/block`, {
    method: "PATCH",
  });
}

export async function unblockAdmin(id: string) {
  return authenticatedFetch(`/admin/${id}/unblock`, {
    method: "PATCH",
  });
}
