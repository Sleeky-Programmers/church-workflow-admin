// /services/analytics.ts

import { authenticatedFetch } from "@/lib/api";

export interface AnalyticsResponse {
  timestamp: string;

  totalChurches: {
    count: number;
    growth: string;
  };

  members: {
    active: { count: number; growth: string };
    total: { count: number; growth: string };
  };

  revenue: {
    monthlyRecurringRevenue: { amount: number; growth: string };
    totalRevenue: { amount: number; growth: string };
  };

  conversionRate: {
    value: string;
    growth: string;
  };

  mostUsedPlan: {
    plan: string;
    count: number;
    growth: string;
  };

  planDistribution: Record<string, number>;

  planPerformanceBreakdown: {
    plan: string;
    churchesCount: number;
    membersCount: number;
    monthlyRevenue: number;
    growth: string;
  }[];

  revenueSubscriptionData: {
    month: string;
    revenue: number;
    subscription: number;
  }[];

  trialToPaidData: {
    month: string;
    trial: number;
    conversion: number;
  }[];

  membersGrowth: {
    month: string;
    active: number;
    total: number;
  }[];

  recentActivities: {
    action: string;
    details: string;
    plan: string;
    churchName: string;
    createdAt: string;
  }[];
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  return authenticatedFetch<AnalyticsResponse>("/analytics", {
    method: "GET",
  });
}
