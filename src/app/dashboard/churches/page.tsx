'use client';

import { Church, CreditCard, Lock, Mail, MapPin, Search, Unlock, UserCog, Users } from 'lucide-react';
import { useState } from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/ui/typography/Heading';
import { Span, Text } from '@/components/ui/typography/Text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Extended churches data with super admin info
const allChurches = [
	{
		id: 1,
		name: 'Grace Chapel',
		initials: 'GC',
		initBg: 'bg-green-100',
		initColor: 'text-green-700',
		location: 'Lagos, NG',
		address: '123 Bishop Avenue, Ikeja, Lagos',
		members: 1240,
		userCount: 45,
		plan: 'Enterprise',
		status: 'active',
		isBlocked: false,
		expires: 'Dec 2025',
		email: 'info@gracechapel.org',
		phone: '+234 801 234 5678',
		pastor: 'Rev. Michael Okafor',
		founded: '2015',
		serviceTime: 'Sundays 9:00 AM & 11:00 AM',
		superAdmin: {
			name: 'Michael Okafor',
			email: 'michael@gracechapel.org',
			phone: '+234 801 234 5670',
		},
	},
	{
		id: 2,
		name: 'Harvest Fields',
		initials: 'HF',
		initBg: 'bg-blue-100',
		initColor: 'text-blue-700',
		location: 'Abuja, NG',
		address: '45 Gudu District, Abuja',
		members: 987,
		userCount: 32,
		plan: 'Growth',
		status: 'active',
		isBlocked: false,
		expires: 'Nov 2025',
		email: 'contact@harvestfields.org',
		phone: '+234 802 345 6789',
		pastor: 'Pastor Sarah Ibrahim',
		founded: '2018',
		serviceTime: 'Sundays 10:00 AM',
		superAdmin: {
			name: 'Sarah Ibrahim',
			email: 'sarah@harvestfields.org',
			phone: '+234 802 345 6780',
		},
	},
	{
		id: 3,
		name: 'Living Word Lagos',
		initials: 'LW',
		initBg: 'bg-amber-100',
		initColor: 'text-amber-700',
		location: 'Lagos, NG',
		address: '78 Surulere Road, Lagos',
		members: 743,
		userCount: 18,
		plan: 'Starter',
		status: 'active',
		isBlocked: false,
		expires: 'Free',
		email: 'hello@livingword.org',
		phone: '+234 803 456 7890',
		pastor: 'Pastor David Adeleke',
		founded: '2020',
		serviceTime: 'Sundays 8:00 AM & 10:00 AM',
		superAdmin: {
			name: 'David Adeleke',
			email: 'david@livingword.org',
			phone: '+234 803 456 7891',
		},
	},
	{
		id: 4,
		name: 'Redeemed Assembly',
		initials: 'RA',
		initBg: 'bg-red-100',
		initColor: 'text-red-700',
		location: 'Port Harcourt, NG',
		address: '12 Trans-Amadi Road, Port Harcourt',
		members: 621,
		userCount: 15,
		plan: 'Growth',
		status: 'expiring',
		isBlocked: false,
		expires: 'Apr 10, 2026',
		email: 'info@redeemedassembly.org',
		phone: '+234 804 567 8901',
		pastor: 'Pastor John Eze',
		founded: '2016',
		serviceTime: 'Sundays 9:00 AM',
		superAdmin: {
			name: 'John Eze',
			email: 'john@redeemedassembly.org',
			phone: '+234 804 567 8902',
		},
	},
	{
		id: 5,
		name: 'Mount Zion Church',
		initials: 'MZ',
		initBg: 'bg-pink-100',
		initColor: 'text-pink-700',
		location: 'Kano, NG',
		address: '5 Bompai Road, Kano',
		members: 510,
		userCount: 12,
		plan: 'Enterprise',
		status: 'overdue',
		isBlocked: true,
		expires: 'Mar 1, 2026',
		email: 'mountzion@church.org',
		phone: '+234 805 678 9012',
		pastor: 'Pastor Samuel Yusuf',
		founded: '2012',
		serviceTime: 'Sundays 8:30 AM',
		superAdmin: {
			name: 'Samuel Yusuf',
			email: 'samuel@mountzion.org',
			phone: '+234 805 678 9013',
		},
	},
	{
		id: 6,
		name: "Glory House Int'l",
		initials: 'GH',
		initBg: 'bg-lime-100',
		initColor: 'text-lime-700',
		location: 'Ibadan, NG',
		address: '34 Ring Road, Ibadan',
		members: 388,
		userCount: 10,
		plan: 'Growth',
		status: 'active',
		isBlocked: false,
		expires: 'Jan 2026',
		email: 'gloryhouse@outlook.com',
		phone: '+234 806 789 0123',
		pastor: 'Pastor Joshua Adebayo',
		founded: '2019',
		serviceTime: 'Sundays 9:00 AM',
		superAdmin: {
			name: 'Joshua Adebayo',
			email: 'joshua@gloryhouse.org',
			phone: '+234 806 789 0124',
		},
	},
	{
		id: 7,
		name: 'Cornerstone Chapel',
		initials: 'CC',
		initBg: 'bg-purple-100',
		initColor: 'text-purple-700',
		location: 'Lagos, NG',
		address: '89 Victoria Island, Lagos',
		members: 276,
		userCount: 8,
		plan: 'Starter',
		status: 'active',
		isBlocked: false,
		expires: 'Free',
		email: 'cornerstone@chapel.com',
		phone: '+234 807 890 1234',
		pastor: 'Pastor Femi Ogunlesi',
		founded: '2021',
		serviceTime: 'Sundays 10:00 AM',
		superAdmin: {
			name: 'Femi Ogunlesi',
			email: 'femi@cornerstone.org',
			phone: '+234 807 890 1235',
		},
	},
	{
		id: 8,
		name: 'New Life Fellowship',
		initials: 'NL',
		initBg: 'bg-green-100',
		initColor: 'text-green-700',
		location: 'Enugu, NG',
		address: '15 Independence Layout, Enugu',
		members: 201,
		userCount: 6,
		plan: 'Growth',
		status: 'active',
		isBlocked: false,
		expires: 'Feb 2026',
		email: 'newlife@fellowship.org',
		phone: '+234 808 901 2345',
		pastor: 'Pastor Chidi Okonkwo',
		founded: '2017',
		serviceTime: 'Sundays 8:00 AM',
		superAdmin: {
			name: 'Chidi Okonkwo',
			email: 'chidi@newlife.org',
			phone: '+234 808 901 2346',
		},
	},
];

const planBadgeClass = {
	Enterprise: 'bg-green-100 text-green-700',
	Growth: 'bg-blue-100 text-blue-700',
	Starter: 'bg-amber-100 text-amber-700',
};

const statusBadgeClass = {
	active: 'bg-green-100 text-green-700',
	expiring: 'bg-amber-100 text-amber-700',
	overdue: 'bg-red-100 text-red-700',
};

const statusLabel = {
	active: 'Active',
	expiring: 'Expiring soon',
	overdue: 'Overdue',
};

const planOptions = [
	{ id: 'starter', name: 'Starter', price: 'Free', maxMembers: 100 },
	{ id: 'growth', name: 'Growth', price: '₦15,000/mo', maxMembers: 500 },
	{ id: 'enterprise', name: 'Enterprise', price: '₦35,000/mo', maxMembers: 'Unlimited' },
];

type SearchType = 'church' | 'admin' | 'both';

export default function ChurchesPage() {
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState('');
	const [searchType, setSearchType] = useState<SearchType>('both');
	const [planFilter, setPlanFilter] = useState<string>('all');
	const [selectedChurch, setSelectedChurch] = useState<(typeof allChurches)[0] | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState('');
	const [couponCode, setCouponCode] = useState('');
	const [discountApplied, setDiscountApplied] = useState<{ type: string; value: number } | null>(null);
	const [churches, setChurches] = useState(allChurches);

	// Enhanced search: by church name AND/OR super admin email/name
	const filteredChurches = churches.filter((church) => {
		const matchesPlan = planFilter === 'all' || church.plan === planFilter;

		if (!searchQuery) return matchesPlan;

		const query = searchQuery.toLowerCase();

		const matchesChurchName = church.name.toLowerCase().includes(query);
		const matchesAdminName = church.superAdmin.name.toLowerCase().includes(query);
		const matchesAdminEmail = church.superAdmin.email.toLowerCase().includes(query);

		let matchesSearch = false;
		switch (searchType) {
			case 'church':
				matchesSearch = matchesChurchName;
				break;
			case 'admin':
				matchesSearch = matchesAdminName || matchesAdminEmail;
				break;
			case 'both':
			default:
				matchesSearch = matchesChurchName || matchesAdminName || matchesAdminEmail;
				break;
		}

		return matchesSearch && matchesPlan;
	});

	const handleViewDetails = (church: (typeof allChurches)[0]) => {
		setSelectedChurch(church);
		setIsModalOpen(true);
	};

	const handlePlanChange = () => {
		if (!selectedChurch || !selectedPlan) return;

		const updatedChurches = churches.map((c) => (c.id === selectedChurch.id ? { ...c, plan: selectedPlan } : c));
		setChurches(updatedChurches);

		toast({
			title: 'Plan Updated',
			description: `${selectedChurch.name} plan changed from ${selectedChurch.plan} to ${selectedPlan}`,
		});

		setIsPlanModalOpen(false);
		setSelectedPlan('');
		setCouponCode('');
		setDiscountApplied(null);
	};

	const handleApplyCoupon = () => {
		if (couponCode === 'WELCOME20') {
			setDiscountApplied({ type: 'percentage', value: 20 });
			toast({
				title: 'Coupon Applied',
				description: '20% discount applied to this plan change',
			});
		} else if (couponCode === 'FIRSTFREE') {
			setDiscountApplied({ type: 'free', value: 100 });
			toast({
				title: 'Coupon Applied',
				description: 'First month free discount applied',
			});
		} else {
			toast({
				title: 'Invalid Coupon',
				description: 'The coupon code you entered is not valid',
				variant: 'destructive',
			});
		}
	};

	const handleToggleBlock = () => {
		if (!selectedChurch) return;

		const newBlockStatus = !selectedChurch.isBlocked;
		const updatedChurches = churches.map((c) => (c.id === selectedChurch.id ? { ...c, isBlocked: newBlockStatus } : c));
		setChurches(updatedChurches);
		setSelectedChurch({ ...selectedChurch, isBlocked: newBlockStatus });

		toast({
			title: newBlockStatus ? 'Church Blocked' : 'Church Unblocked',
			description: newBlockStatus
				? `${selectedChurch.name} has been blocked. They cannot access platform features.`
				: `${selectedChurch.name} has been unblocked and can now access all features.`,
			variant: newBlockStatus ? 'destructive' : 'default',
		});

		setIsBlockModalOpen(false);
	};

	const openPlanModal = () => {
		setSelectedPlan(selectedChurch?.plan || '');
		setIsPlanModalOpen(true);
	};

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
				<div>
					<Heading
						level={1}
						text="Churches"
					/>
					<Text
						text="24 registered churches across the platform"
						variant="muted"
					/>
				</div>
				<Select
					value={planFilter}
					onValueChange={setPlanFilter}>
					<SelectTrigger className="w-[140px]">
						<SelectValue placeholder="All Plans" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Plans</SelectItem>
						<SelectItem value="Enterprise">Enterprise</SelectItem>
						<SelectItem value="Growth">Growth</SelectItem>
						<SelectItem value="Starter">Starter</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Enhanced Search Bar with Type Selector */}
			<div className="flex flex-col sm:flex-row gap-3 mb-6">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder={
							searchType === 'church'
								? 'Search by church name...'
								: searchType === 'admin'
									? 'Search by super admin name or email...'
									: 'Search by church name, admin name, or email...'
						}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select
					value={searchType}
					onValueChange={(value: SearchType) => setSearchType(value)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Search by..." />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="both">Church & Admin</SelectItem>
						<SelectItem value="church">Church Name Only</SelectItem>
						<SelectItem value="admin">Super Admin Only</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Churches Table */}
			<Card className="rounded-2xl">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Church</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Super Admin</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Location</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Members</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Users</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Plan</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Status</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredChurches.map((church) => (
									<tr
										key={church.id}
										className={cn('border-b last:border-0 hover:bg-gray-50 transition-colors', church.isBlocked && 'bg-red-50/30 hover:bg-red-50/50')}>
										<td className="py-3 px-4">
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarFallback className={cn(church.initBg, church.initColor)}>{church.initials}</AvatarFallback>
												</Avatar>
												<div>
													<span className="font-medium">{church.name}</span>
													{church.isBlocked && (
														<Badge
															variant="destructive"
															className="ml-2 text-xs">
															Blocked
														</Badge>
													)}
												</div>
											</div>
										</td>
										<td className="py-3 px-4">
											<div>
												<div className="font-medium text-sm">{church.superAdmin.name}</div>
												<div className="text-xs text-gray-500">{church.superAdmin.email}</div>
											</div>
										</td>
										<td className="py-3 px-4 text-gray-500 text-sm">{church.location}</td>
										<td className="py-3 px-4 font-medium">{church.members.toLocaleString()}</td>
										<td className="py-3 px-4 font-medium">{church.userCount.toLocaleString()}</td>
										<td className="py-3 px-4">
											<span className={cn('px-2 py-1 rounded-full text-xs font-medium', planBadgeClass[church.plan as keyof typeof planBadgeClass])}>{church.plan}</span>
										</td>
										<td className="py-3 px-4">
											<span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusBadgeClass[church.status as keyof typeof statusBadgeClass])}>
												{statusLabel[church.status as keyof typeof statusLabel]}
											</span>
										</td>
										<td className="py-3 px-4">
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													className="h-8"
													onClick={() => handleViewDetails(church)}>
													View
												</Button>
												{church.isBlocked ? (
													<Button
														variant="ghost"
														size="sm"
														className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
														onClick={() => {
															setSelectedChurch(church);
															setIsBlockModalOpen(true);
														}}>
														<Unlock className="h-3.5 w-3.5 mr-1" />
														Unblock
													</Button>
												) : (
													<Button
														variant="ghost"
														size="sm"
														className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
														onClick={() => {
															setSelectedChurch(church);
															setIsBlockModalOpen(true);
														}}>
														<Lock className="h-3.5 w-3.5 mr-1" />
														Block
													</Button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{filteredChurches.length === 0 && (
						<div className="text-center py-12">
							<Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<Text
								text="No churches found"
								className="text-gray-500"
							/>
							<Text
								text="Try adjusting your search or filters"
								variant="muted"
								className="text-sm"
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Church Details Modal */}
			<Dialog
				open={isModalOpen}
				onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Avatar className="h-10 w-10">
									<AvatarFallback className={cn(selectedChurch?.initBg, selectedChurch?.initColor, 'text-sm')}>{selectedChurch?.initials}</AvatarFallback>
								</Avatar>
								<div>
									<div className="text-xl">{selectedChurch?.name}</div>
									<div className="flex items-center gap-2 mt-0.5">
										<span
											className={cn(
												'px-2 py-0.5 rounded-full text-xs font-medium',
												selectedChurch && planBadgeClass[selectedChurch.plan as keyof typeof planBadgeClass]
											)}>
											{selectedChurch?.plan}
										</span>
										<span
											className={cn(
												'px-2 py-0.5 rounded-full text-xs font-medium',
												selectedChurch && statusBadgeClass[selectedChurch.status as keyof typeof statusBadgeClass]
											)}>
											{selectedChurch && statusLabel[selectedChurch.status as keyof typeof statusLabel]}
										</span>
										{selectedChurch?.isBlocked && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Blocked</span>}
									</div>
								</div>
							</div>
						</DialogTitle>
						<DialogDescription>Church information and subscription details</DialogDescription>
					</DialogHeader>

					<Separator className="my-3" />

					<div className="space-y-4">
						{/* Location Section */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<MapPin className="h-4 w-4 text-gray-500" />
								<Text
									text="Location"
									variant="blue"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6 space-y-1">
								<Text
									text={selectedChurch?.address || selectedChurch?.location || 'N/A'}
									className="text-sm"
								/>
								<Text
									text={selectedChurch?.location || 'N/A'}
									variant="muted"
									className="text-xs"
								/>
							</div>
						</div>

						{/* Contact Section */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Mail className="h-4 w-4 text-gray-500" />
								<Text
									text="Contact"
									variant="blue"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6 space-y-1">
								<Text
									text={selectedChurch?.email || 'N/A'}
									className="text-sm"
								/>
								<Text
									text={selectedChurch?.phone || 'N/A'}
									className="text-sm"
								/>
							</div>
						</div>

						{/* Super Admin Section */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<UserCog className="h-4 w-4 text-gray-500" />
								<Text
									text="Super Administrator"
									variant="blue"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6">
								<div className="bg-gray-50 rounded-lg p-3 space-y-1">
									<div className="flex items-center justify-between">
										<Text
											text="Name"
											variant="muted"
											className="text-xs"
										/>
										<Text
											text={selectedChurch?.superAdmin.name || 'N/A'}
											className="text-sm font-medium"
										/>
									</div>
									<div className="flex items-center justify-between">
										<Text
											text="Email"
											variant="muted"
											className="text-xs"
										/>
										<Text
											text={selectedChurch?.superAdmin.email || 'N/A'}
											className="text-sm"
										/>
									</div>
									<div className="flex items-center justify-between">
										<Text
											text="Phone"
											variant="muted"
											className="text-xs"
										/>
										<Text
											text={selectedChurch?.superAdmin.phone || 'N/A'}
											className="text-sm"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Leadership Section */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Users className="h-4 w-4 text-gray-500" />
								<Text
									text="Leadership"
									variant="blue"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6">
								<Text
									text={`Pastor: ${selectedChurch?.pastor || 'N/A'}`}
									className="text-sm"
								/>
							</div>
						</div>

						{/* Church Stats */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Church className="h-4 w-4 text-gray-500" />
								<Text
									text="Church Information"
									variant="blue"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6 grid grid-cols-2 gap-3">
								<div>
									<Text
										text="Founded"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedChurch?.founded || 'N/A'}
										className="text-sm"
									/>
								</div>
								<div>
									<Text
										text="Total Members"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedChurch?.members.toLocaleString() || '0'}
										className="text-sm"
									/>
								</div>
								<div>
									<Text
										text="Total Users"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedChurch?.userCount.toLocaleString() || '0'}
										className="text-sm"
									/>
								</div>
								<div>
									<Text
										text="Service Time"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedChurch?.serviceTime || 'N/A'}
										className="text-sm"
									/>
								</div>
								<div>
									<Text
										text="Plan Expires"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedChurch?.expires || 'N/A'}
										className="text-sm"
									/>
								</div>
							</div>
						</div>
					</div>

					<Separator className="my-3" />

					<div className="flex justify-between gap-3">
						<Button
							variant={selectedChurch?.isBlocked ? 'default' : 'destructive'}
							onClick={() => setIsBlockModalOpen(true)}
							className="gap-2">
							{selectedChurch?.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
							{selectedChurch?.isBlocked ? 'Unblock Church' : 'Block Church'}
						</Button>
						<div className="flex gap-3">
							<Button
								variant="outline"
								onClick={() => setIsModalOpen(false)}>
								Close
							</Button>
							<Button onClick={openPlanModal}>
								<CreditCard className="h-4 w-4 mr-2" />
								Manage Plan
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Plan Management Modal */}
			<Dialog
				open={isPlanModalOpen}
				onOpenChange={setIsPlanModalOpen}>
				<DialogContent className="sm:max-w-[550px]">
					<DialogHeader>
						<DialogTitle>Manage Plan - {selectedChurch?.name}</DialogTitle>
						<DialogDescription>Change subscription plan or apply discounts</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Current Plan Display */}
						<div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
							<div>
								<Text
									text="Current Plan"
									variant="muted"
									className="text-xs"
								/>
								<Text
									text={selectedChurch?.plan || 'N/A'}
									className="text-sm font-medium mt-0.5"
								/>
							</div>
							<div className="text-right">
								<Text
									text="Expires"
									variant="muted"
									className="text-xs"
								/>
								<Text
									text={selectedChurch?.expires || 'N/A'}
									className="text-sm"
								/>
							</div>
						</div>

						{/* Plan Selection */}
						<div>
							<Text
								text="Change Plan"
								className="text-sm font-medium mb-2"
							/>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
								{planOptions.map((plan) => (
									<div
										key={plan.id}
										className={cn(
											'border rounded-xl p-3 cursor-pointer transition-all',
											selectedPlan === plan.name ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'
										)}
										onClick={() => setSelectedPlan(plan.name)}>
										<div className="font-medium text-sm">{plan.name}</div>
										<div className="text-xs text-gray-500 mt-0.5">{plan.price}</div>
										{selectedChurch?.plan === plan.name && <div className="text-xs text-primary-600 mt-1">✓ Current plan</div>}
									</div>
								))}
							</div>
						</div>

						{/* Coupon/Discount Section */}
						<div>
							<Text
								text="Apply Coupon / Discount"
								className="text-sm font-medium mb-2"
							/>
							<div className="flex gap-2">
								<Input
									placeholder="Enter coupon code"
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
									className="flex-1"
								/>
								<Button
									variant="outline"
									onClick={handleApplyCoupon}>
									Apply
								</Button>
							</div>
							{discountApplied && (
								<div className="mt-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
									✓ Discount applied! {discountApplied.type === 'percentage' ? `${discountApplied.value}% off` : 'First month free'}
								</div>
							)}
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsPlanModalOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handlePlanChange}
							disabled={!selectedPlan || selectedPlan === selectedChurch?.plan}>
							Confirm Change
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Block/Unblock Confirmation Dialog */}
			<AlertDialog
				open={isBlockModalOpen}
				onOpenChange={setIsBlockModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							{selectedChurch?.isBlocked ? <Unlock className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-red-600" />}
							{selectedChurch?.isBlocked ? 'Unblock Church' : 'Block Church'}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{selectedChurch?.isBlocked ? (
								<>
									Are you sure you want to unblock <span className="font-semibold">{selectedChurch?.name}</span>?
									<br />
									<br />
									<span className="text-green-600">✓</span> The church will regain full access to all platform features.
									<br />
									<span className="text-green-600">✓</span> All administrators will be able to log in.
									<br />
									<span className="text-green-600">✓</span> Subscription billing will resume normally.
								</>
							) : (
								<>
									Are you sure you want to block <span className="font-semibold">{selectedChurch?.name}</span>?
									<br />
									<br />
									<span className="text-red-600">⚠</span> The church will lose access to all platform features.
									<br />
									<span className="text-red-600">⚠</span> All administrators will be unable to log in.
									<br />
									<span className="text-red-600">⚠</span> Subscription billing will be paused.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleToggleBlock}
							className={selectedChurch?.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
							{selectedChurch?.isBlocked ? 'Yes, Unblock Church' : 'Yes, Block Church'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
