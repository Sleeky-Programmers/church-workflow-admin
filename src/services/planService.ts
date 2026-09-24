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
	userLimit: number;
	branchLimit: number;
	customRolesEnabled: boolean;
}

export interface UpdatePlanPricingPayload {
	name?: string;
	monthlyPrice?: number;
	yearlyPrice?: number;
	features?: string[];
	memberLimit?: number;
	userLimit?: number;
	branchLimit?: number;
	customRolesEnabled?: boolean;
	popular?: boolean;
}

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
