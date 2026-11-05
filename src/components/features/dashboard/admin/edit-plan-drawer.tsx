'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plan, updatePlanPricing } from '@/services/planService';

type EditPlanDrawerProps = {
	plan: Plan | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaved: (plan: Plan) => void;
};

type FormState = {
	name: string;
	monthlyPrice: string;
	yearlyPrice: string;
	memberLimit: string;
	guestLimit: string;
	userLimit: string;
	branchLimit: string;
	customRolesEnabled: boolean;
	popular: boolean;
	contactSales: boolean;
	features: string;
};

function toFormState(plan: Plan): FormState {
	return {
		name: plan.name,
		monthlyPrice: String(plan.monthlyPrice),
		yearlyPrice: String(plan.yearlyPrice),
		memberLimit: String(plan.memberLimit),
		guestLimit: String(plan.guestLimit ?? 0),
		userLimit: String(plan.userLimit),
		branchLimit: String(plan.branchLimit),
		customRolesEnabled: plan.customRolesEnabled,
		popular: !!plan.popular,
		contactSales: !!plan.contactSales,
		features: plan.features.join('\n'),
	};
}

export function EditPlanDrawer({ plan, open, onOpenChange, onSaved }: EditPlanDrawerProps) {
	const [form, setForm] = useState<FormState | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (plan) {
			setForm(toFormState(plan));
		}
	}, [plan]);

	const update = (patch: Partial<FormState>) => setForm((prev) => (prev ? { ...prev, ...patch } : prev));

	const handleSave = async () => {
		if (!plan || !form) return;

		setIsSaving(true);
		try {
			const updated = await updatePlanPricing(plan.type, {
				name: form.name,
				monthlyPrice: Number(form.monthlyPrice),
				yearlyPrice: Number(form.yearlyPrice),
				memberLimit: Number(form.memberLimit),
				guestLimit: Number(form.guestLimit),
				userLimit: Number(form.userLimit),
				branchLimit: Number(form.branchLimit),
				customRolesEnabled: form.customRolesEnabled,
				popular: form.popular,
				contactSales: form.contactSales,
				features: form.features
					.split('\n')
					.map((f) => f.trim())
					.filter(Boolean),
			});

			toast.success(`${plan.name} plan updated`);
			onSaved(updated);
			onOpenChange(false);
		} catch (error: any) {
			toast.error(error.message || 'Failed to update plan');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Drawer
			open={open}
			onOpenChange={onOpenChange}
			direction="right">
			<DrawerContent
				direction="right"
				className="p-0">
				<DrawerHeader className="text-left px-6 pt-6">
					<DrawerTitle>Edit {plan?.type} plan</DrawerTitle>
				</DrawerHeader>

				<Separator />

				{form && (
					<div className="space-y-4 px-6 py-5 overflow-y-auto">
						<div className="space-y-2">
							<Label htmlFor="name">Display name</Label>
							<Input
								id="name"
								value={form.name}
								onChange={(e) => update({ name: e.target.value })}
								disabled={isSaving}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="monthlyPrice">Monthly price</Label>
								<Input
									id="monthlyPrice"
									type="number"
									min={0}
									value={form.monthlyPrice}
									onChange={(e) => update({ monthlyPrice: e.target.value })}
									disabled={isSaving}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="yearlyPrice">Yearly price</Label>
								<Input
									id="yearlyPrice"
									type="number"
									min={0}
									value={form.yearlyPrice}
									onChange={(e) => update({ yearlyPrice: e.target.value })}
									disabled={isSaving}
								/>
							</div>
						</div>

						<p className="text-xs text-muted-foreground">
							Limits: -1 means unlimited. Saving a limit change applies it to every church on this plan straight away. Price changes
							also update live Paystack plans, so auto-renewals charge the new price.
						</p>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="memberLimit">Member limit</Label>
								<Input
									id="memberLimit"
									type="number"
									min={-1}
									value={form.memberLimit}
									onChange={(e) => update({ memberLimit: e.target.value })}
									disabled={isSaving}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="guestLimit">Guest limit</Label>
								<Input
									id="guestLimit"
									type="number"
									min={-1}
									value={form.guestLimit}
									onChange={(e) => update({ guestLimit: e.target.value })}
									disabled={isSaving}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="userLimit">User limit</Label>
								<Input
									id="userLimit"
									type="number"
									min={-1}
									value={form.userLimit}
									onChange={(e) => update({ userLimit: e.target.value })}
									disabled={isSaving}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="branchLimit">Branch limit</Label>
								<Input
									id="branchLimit"
									type="number"
									min={-1}
									value={form.branchLimit}
									onChange={(e) => update({ branchLimit: e.target.value })}
									disabled={isSaving}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="features">Features (one per line)</Label>
							<p className="text-xs text-muted-foreground">
								Member, guest, branch and user limits are added to plan cards automatically; don&apos;t repeat them here.
							</p>
							<Textarea
								id="features"
								rows={5}
								value={form.features}
								onChange={(e) => update({ features: e.target.value })}
								disabled={isSaving}
							/>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="customRolesEnabled">Custom roles enabled</Label>
							<Switch
								id="customRolesEnabled"
								checked={form.customRolesEnabled}
								onCheckedChange={(checked) => update({ customRolesEnabled: checked })}
								disabled={isSaving}
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<div>
								<Label htmlFor="contactSales">Contact sales (not self-serve)</Label>
								<p className="text-xs text-muted-foreground">
									Shows &quot;From {form.monthlyPrice ? `₦${Number(form.monthlyPrice).toLocaleString()}` : 'price'} / month&quot; with a Contact us
									button. Churches can&apos;t pay for it online; activate it from Churches.
								</p>
							</div>
							<Switch
								id="contactSales"
								checked={form.contactSales}
								onCheckedChange={(checked) => update({ contactSales: checked })}
								disabled={isSaving}
							/>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="popular">Marked as popular</Label>
							<Switch
								id="popular"
								checked={form.popular}
								onCheckedChange={(checked) => update({ popular: checked })}
								disabled={isSaving}
							/>
						</div>
					</div>
				)}

				<DrawerFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isSaving}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving || !form}>
						{isSaving ? 'Saving...' : 'Save changes'}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
