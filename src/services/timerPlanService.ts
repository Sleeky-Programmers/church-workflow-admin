// timerPlanService.ts — the Service Timer's own plans (Free and Church).
import { authenticatedFetch } from "@/lib/api";

export type TimerPlanType = "FREE" | "CHURCH";

export interface TimerPlan {
  plan: TimerPlanType;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  /** 0 = unlimited (the timer's convention). */
  userLimit: number;
  /** Smart imports a month; 0 = unlimited. */
  importLimit: number;
  branchLimit: number;
  /** Own logo and colours; without it, presets and a small Service Timer mark. */
  customBranding: boolean;
  updatedAt: string | null;
  /** Churches whose Church plan renews by itself (Church plan only). */
  autoRenewing: { monthly: number; yearly: number } | null;
}

export type UpdateTimerPlanPayload = Partial<
  Pick<
    TimerPlan,
    | "name"
    | "monthlyPrice"
    | "yearlyPrice"
    | "userLimit"
    | "importLimit"
    | "branchLimit"
    | "customBranding"
  >
>;

export interface UpdateTimerPlanResult extends TimerPlan {
  /** Paystack plans moved to the new price, per billing cycle whose price changed. */
  paystack: { cycle: "monthly" | "yearly"; updated: number; failed: number }[];
}

export const formatTimerLimit = (value: number) =>
  value === 0 ? "Unlimited" : value.toLocaleString();

export async function fetchTimerPlans(): Promise<TimerPlan[]> {
  return authenticatedFetch<TimerPlan[]>("/service-timer/admin/plans", {
    method: "GET",
  });
}

// SUPER_ADMIN product admins only — the backend rejects anyone else with a 403.
export async function updateTimerPlan(
  plan: TimerPlanType,
  payload: UpdateTimerPlanPayload,
): Promise<UpdateTimerPlanResult> {
  return authenticatedFetch<UpdateTimerPlanResult>(
    `/service-timer/admin/plans/${plan.toLowerCase()}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}
