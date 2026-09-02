// app/dashboard/plans/page.tsx
'use client';

import { AlertCircle, CreditCard, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Reuse church data
const churchesData = [
	{
		id: 1,
		name: 'Grace Chapel',
		initials: 'GC',
		initBg: 'bg-green-100',
		initColor: 'text-green-700',
		location: 'Lagos, NG',
		members: 1240,
		plan: 'Enterprise',
		expires: 'Dec 2025',
	},
	{
		id: 2,
		name: 'Harvest Fields',
		initials: 'HF',
		initBg: 'bg-blue-100',
		initColor: 'text-blue-700',
		location: 'Abuja, NG',
		members: 987,
		plan: 'Growth',
		expires: 'Nov 2025',
	},
	{
		id: 3,
		name: 'Living Word Lagos',
		initials: 'LW',
		initBg: 'bg-amber-100',
		initColor: 'text-amber-700',
		location: 'Lagos, NG',
		members: 743,
		plan: 'Starter',
		expires: 'Free',
	},
	{
		id: 4,
		name: 'Redeemed Assembly',
		initials: 'RA',
		initBg: 'bg-red-100',
		initColor: 'text-red-700',
		location: 'Port Harcourt, NG',
		members: 621,
		plan: 'Growth',
		expires: 'Apr 10, 2026',
	},
	{
		id: 5,
		name: 'Mount Zion Church',
		initials: 'MZ',
		initBg: 'bg-pink-100',
		initColor: 'text-pink-700',
		location: 'Kano, NG',
		members: 510,
		plan: 'Enterprise',
		expires: 'Mar 1, 2026',
	},
	{
		id: 6,
		name: "Glory House Int'l",
		initials: 'GH',
		initBg: 'bg-lime-100',
		initColor: 'text-lime-700',
		location: 'Ibadan, NG',
		members: 388,
		plan: 'Growth',
		expires: 'Jan 2026',
	},
	{
		id: 7,
		name: 'Cornerstone Chapel',
		initials: 'CC',
		initBg: 'bg-purple-100',
		initColor: 'text-purple-700',
		location: 'Lagos, NG',
		members: 276,
		plan: 'Starter',
		expires: 'Free',
	},
	{
		id: 8,
		name: 'New Life Fellowship',
		initials: 'NL',
		initBg: 'bg-green-100',
		initColor: 'text-green-700',
		location: 'Enugu, NG',
		members: 201,
		plan: 'Growth',
		expires: 'Feb 2026',
	},
];

const planBadgeClass = {
	Enterprise: 'bg-green-100 text-green-700',
	Growth: 'bg-blue-100 text-blue-700',
	Starter: 'bg-amber-100 text-amber-700',
};

const planStats = [
	{ name: 'Enterprise', count: 8, color: 'bg-green-500' },
	{ name: 'Growth', count: 11, color: 'bg-blue-500' },
	{ name: 'Starter / Free', count: 5, color: 'bg-amber-500' },
];

const planOptions = [
	{ id: 'starter', name: 'Starter', description: 'Up to 100 members, basic features', price: 'Free', color: 'amber' },
	{ id: 'growth', name: 'Growth', description: 'Up to 500 members, full features', price: '₦15,000/mo', color: 'blue' },
	{ id: 'enterprise', name: 'Enterprise', description: 'Unlimited members, priority support', price: '₦35,000/mo', color: 'green' },
	{ id: 'custom', name: 'Custom', description: 'Negotiated pricing & features', price: 'Contact sales', color: 'gray' },
];

export default function PlansPage() {
	const [selectedChurch, setSelectedChurch] = useState<(typeof churchesData)[0] | null>(null);
	const [selectedPlan, setSelectedPlan] = useState('');
	const [planNote, setPlanNote] = useState('');
	const [churches, setChurches] = useState(churchesData);
	const { toast } = useToast();

	const handleOpenModal = (church: (typeof churchesData)[0]) => {
		setSelectedChurch(church);
		setSelectedPlan(church.plan);
		setPlanNote('');
	};

	const handleSavePlan = () => {
		if (!selectedChurch || !selectedPlan) return;

		setChurches((prev) => prev.map((c) => (c.id === selectedChurch.id ? { ...c, plan: selectedPlan } : c)));

		toast({
			title: 'Plan updated',
			description: `${selectedChurch.name} plan changed to ${selectedPlan}`,
		});

		setSelectedChurch(null);
		setSelectedPlan('');
		setPlanNote('');
	};

	return (
		<>
			<div className="mb-6">
				<Heading
					level={1}
					text="Plan Management"
				/>
				<Text
					text="Manually assign or change subscription plans for churches"
					variant="muted"
				/>
			</div>

			{/* Plan Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
				{planStats.map((stat) => (
					<Card
						key={stat.name}
						className="rounded-2xl">
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<Text
										text={stat.name}
										variant="muted"
										className="text-sm"
									/>
									<Heading
										level={2}
										text={stat.count.toString()}
										className="text-2xl font-semibold mt-1"
									/>
								</div>
								<div
									className={cn(
										'w-10 h-10 rounded-full flex items-center justify-center',
										stat.color === 'bg-green-500' ? 'bg-green-100' : stat.color === 'bg-blue-500' ? 'bg-blue-100' : 'bg-amber-100'
									)}>
									<CreditCard
										className={cn('w-5 h-5', stat.color === 'bg-green-500' ? 'text-green-600' : stat.color === 'bg-blue-500' ? 'text-blue-600' : 'text-amber-600')}
									/>
								</div>
							</div>
							<Text
								text="churches"
								variant="muted"
								className="text-xs mt-2"
							/>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Churches Table */}
			<Card className="rounded-2xl transition-shadow duration-200 hover:shadow-md">
				<CardHeader className="flex flex-row items-center justify-between pb-3">
					<CardTitle className="text-base font-medium">All Church Plans</CardTitle>
					<Text
						text="Click 'Change plan' to assign manually"
						variant="muted"
						className="text-xs"
					/>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Church</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Current Plan</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Members</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Plan Expires</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Action</th>
								</tr>
							</thead>
							<tbody>
								{churches.map((church) => (
									<tr
										key={church.id}
										className="border-b last:border-0 hover:bg-gray-50">
										<td className="py-3 px-4">
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarFallback className={cn(church.initBg, church.initColor)}>{church.initials}</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium">{church.name}</div>
													<div className="text-xs text-gray-500">{church.location}</div>
												</div>
											</div>
										</td>
										<td className="py-3 px-4">
											<span className={cn('px-2 py-1 rounded-full text-xs font-medium', planBadgeClass[church.plan as keyof typeof planBadgeClass])}>{church.plan}</span>
										</td>
										<td className="py-3 px-4 font-medium">{church.members.toLocaleString()}</td>
										<td className="py-3 px-4 text-gray-500 text-sm">{church.expires}</td>
										<td className="py-3 px-4">
											<Button
												variant="default"
												size="sm"
												onClick={() => handleOpenModal(church)}>
												Change plan
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Assign Plan Modal */}
			<Dialog
				open={!!selectedChurch}
				onOpenChange={() => setSelectedChurch(null)}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>
							Assign plan — <span className="text-primary">{selectedChurch?.name}</span>
						</DialogTitle>
						<DialogDescription>Select a subscription plan for this church</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<Label className="mb-3 block">Select plan</Label>
						<RadioGroup
							value={selectedPlan}
							onValueChange={setSelectedPlan}
							className="grid grid-cols-2 gap-3">
							{planOptions.map((plan) => (
								<div
									key={plan.id}
									className={cn(
										'border rounded-lg p-3 cursor-pointer transition-all',
										selectedPlan === plan.name ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'
									)}
									onClick={() => setSelectedPlan(plan.name)}>
									<div className="font-medium text-sm">{plan.name}</div>
									<div className="text-xs text-gray-500 mt-0.5">{plan.description}</div>
									<div className={cn('text-sm font-semibold mt-2', plan.name === 'Starter' ? 'text-amber-600' : 'text-primary')}>{plan.price}</div>
								</div>
							))}
						</RadioGroup>

						<div className="mt-4">
							<Label
								htmlFor="note"
								className="mb-1 block">
								Note (optional)
							</Label>
							<Input
								id="note"
								placeholder="e.g. Waived first month for new church"
								value={planNote}
								onChange={(e) => setPlanNote(e.target.value)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setSelectedChurch(null)}>
							Cancel
						</Button>
						<Button onClick={handleSavePlan}>Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
