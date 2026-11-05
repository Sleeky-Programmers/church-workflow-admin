// app/dashboard/plans/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { EditPlanDrawer } from '@/components/features/dashboard/admin/edit-plan-drawer';
import { fetchPlans, formatLimit, Plan } from '@/services/planService';

function formatNaira(amount: number) {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
		maximumFractionDigits: 0,
	}).format(amount);
}

export default function PlansPage() {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

	const loadPlans = async () => {
		setIsLoading(true);
		try {
			const data = await fetchPlans();
			setPlans(data);
		} catch (error: any) {
			toast.error(error.message || 'Failed to load plans');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadPlans();
	}, []);

	return (
		<>
			<div className="mb-6">
				<Heading
					level={1}
					text="Plan Pricing"
				/>
				<Text
					text="Manage pricing, limits, and features for each subscription tier"
					variant="muted"
				/>
			</div>

			<Card className="rounded-2xl">
				<CardContent className="p-0">
					{isLoading ? (
						<div className="flex items-center justify-center py-16 gap-2">
							<Loader />
							<Text
								text="Loading plans..."
								variant="muted"
							/>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Plan</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Monthly</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Yearly</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Members</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Guests</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Users</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Branches</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Action</th>
									</tr>
								</thead>
								<tbody>
									{plans.map((plan) => (
										<tr
											key={plan.type}
											className="border-b last:border-0 hover:bg-gray-50">
											<td className="py-3 px-4 font-medium">{plan.name}</td>
											<td className="py-3 px-4">{formatNaira(plan.monthlyPrice)}</td>
											<td className="py-3 px-4">{formatNaira(plan.yearlyPrice)}</td>
											<td className="py-3 px-4">{plan.memberLimit === -1 ? 'Unlimited' : plan.memberLimit}</td>
											<td className="py-3 px-4">{formatLimit(plan.guestLimit)}</td>
											<td className="py-3 px-4">{plan.userLimit === -1 ? 'Unlimited' : plan.userLimit}</td>
											<td className="py-3 px-4">{plan.branchLimit === -1 ? 'Unlimited' : plan.branchLimit}</td>
											<td className="py-3 px-4">
												<Button
													variant="outline"
													size="sm"
													onClick={() => setEditingPlan(plan)}>
													Edit
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>

			<EditPlanDrawer
				plan={editingPlan}
				open={!!editingPlan}
				onOpenChange={(open) => !open && setEditingPlan(null)}
				onSaved={(updated) => setPlans((prev) => prev.map((p) => (p.type === updated.type ? updated : p)))}
			/>
		</>
	);
}
