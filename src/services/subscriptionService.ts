import { authenticatedFetch } from "@/lib/api";

export interface Plan {
  type: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular: boolean;
}

export interface BillingOverview {
  plans: Plan[];
  currentPlan: string;
  subscriptionStatus: string;
  billingCycle: "MONTHLY" | "YEARLY";
}

export async function getBillingOverview(): Promise<BillingOverview> {
  return authenticatedFetch("/subscription/overview", {
    method: "GET",
  });
}

export async function updateSubscription(payload: {
  churchId: string;
  plan: string;
  billingCycle: "MONTHLY" | "YEARLY";
  couponCode?: string;
}) {
  return authenticatedFetch("/subscription/update", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
