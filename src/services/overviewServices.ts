import { authenticatedFetch } from "@/lib/api";

export interface OverviewResponse {
  totalChurches: number;
  newChurchesLast30Days: number;
  totalMembers: number;

  totalActivePlans: number;
  totalStarterPlans: number;

  churchesByPlan: {
    STARTER: number;
    GROWTH: number;
    ENTERPRISE: number;
  };

  topChurchesByMembers: {
    id: string;
    name: string;
    location: string;
    membersCount: number;
    plan: string;
  }[];
}

export async function fetchOverview(): Promise<OverviewResponse> {
  return authenticatedFetch<OverviewResponse>("/overview", {
    method: "GET",
  });
}
