import { authenticatedFetch } from "@/lib/api";
import { BillingCycle } from "@/lib/enums";
export interface Plan {
  type: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular: boolean;
}

export interface SubscriptionPriceResponse {
  discountAmount: number;
  finalAmount: number;
  currency?: string;
}

export interface BillingOverview {
  plans: Plan[];
  currentPlan: string;
  subscriptionStatus: string;
  billingCycle: BillingCycle.MONTHLY | BillingCycle.YEARLY;
}

export async function getBillingOverview(): Promise<BillingOverview> {
  return authenticatedFetch("/subscription/overview", {
    method: "GET",
  });
}

export async function updateSubscription(payload: {
  churchId: string;
  plan: string;
  billingCycle: BillingCycle.MONTHLY | BillingCycle.YEARLY;
  couponCode?: string;
}) {
  return authenticatedFetch("/subscription/update", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function calculateSubscriptionPrice(payload: {
  plan: string;
  billingCycle: string;
  couponCode?: string;
}): Promise<SubscriptionPriceResponse> {
  return authenticatedFetch<SubscriptionPriceResponse>(
    "/subscription/calculate",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
