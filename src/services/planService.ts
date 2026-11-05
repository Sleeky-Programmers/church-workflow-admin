// planService.ts
import { authenticatedFetch } from '@/lib/api';

export type PlanType = 'STARTER' | 'GROWTH' | 'EXPANSION' | 'ENTERPRISE';

export interface Plan {
	type: PlanType;
	name: string;
	monthlyPrice: number;
	yearlyPrice: number;
	features: string[];
	popular?: boolean;
	memberLimit: number;
	/** Separate cap for guests (Visitor status). -1 = unlimited. */
	guestLimit?: number;
	userLimit: number;
	branchLimit: number;
	customRolesEnabled: boolean;
	/** Sales-led plan: "From ₦X / month" + Contact us, activated manually here. */
	contactSales?: boolean;
}

export interface UpdatePlanPricingPayload {
	name?: string;
	monthlyPrice?: number;
	yearlyPrice?: number;
	features?: string[];
	memberLimit?: number;
	guestLimit?: number;
	userLimit?: number;
	branchLimit?: number;
	customRolesEnabled?: boolean;
	popular?: boolean;
	contactSales?: boolean;
}

export const formatLimit = (value?: number) =>
	value === undefined || value === null ? '—' : value === -1 ? 'Unlimited' : value.toLocaleString();

export const formatNaira = (value: number) => `₦${value.toLocaleString()}`;

// Public endpoint — no product-admin auth required, but authenticatedFetch
// works fine here too since a logged-in admin always has a token.
export async function fetchPlans(): Promise<Plan[]> {
	return authenticatedFetch<Plan[]>('/subscription/plans', {
		method: 'GET',
	});
}

// SUPER_ADMIN product admins only — backend rejects anyone else with a 403.
export async function updatePlanPricing(plan: PlanType, payload: UpdatePlanPricingPayload): Promise<Plan> {
	return authenticatedFetch<Plan>(`/subscription/plans/${plan}`, {
		method: 'PATCH',
		body: JSON.stringify(payload),
	});
}
