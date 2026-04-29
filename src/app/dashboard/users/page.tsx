'use client';

import { Activity, Building2, CheckCircle, Crown, Lock, Mail, Search, Unlock, User, UserCheck, UserCog, Users, UserX } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Heading from '@/components/ui/typography/Heading';
import { Span, Text } from '@/components/ui/typography/Text';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock data: Churches with their users
const churchesWithUsers = [
	{
		id: 1,
		name: 'Grace Chapel',
		initials: 'GC',
		initBg: 'bg-green-100',
		initColor: 'text-green-700',
		users: [
			{
				id: 101,
				name: 'Michael Okafor',
				email: 'michael@gracechapel.org',
				phone: '+234 801 234 5670',
				role: 'Super Admin',
				isBlocked: false,
				lastActive: '2025-04-08T10:30:00Z',
			},
			{ id: 102, name: 'Sarah Okafor', email: 'sarah@gracechapel.org', phone: '+234 801 234 5671', role: 'Admin', isBlocked: false, lastActive: '2025-04-07T14:20:00Z' },
			{ id: 103, name: 'John Doe', email: 'john@gracechapel.org', phone: '+234 801 234 5672', role: 'Finance', isBlocked: false, lastActive: '2025-04-06T09:15:00Z' },
			{ id: 104, name: 'Jane Smith', email: 'jane@gracechapel.org', phone: '+234 801 234 5673', role: 'Media', isBlocked: true, lastActive: '2025-03-28T11:00:00Z' },
		],
	},
	{
		id: 2,
		name: 'Harvest Fields',
		initials: 'HF',
		initBg: 'bg-blue-100',
		initColor: 'text-blue-700',
		users: [
			{
				id: 201,
				name: 'Sarah Ibrahim',
				email: 'sarah@harvestfields.org',
				phone: '+234 802 345 6780',
				role: 'Super Admin',
				isBlocked: false,
				lastActive: '2025-04-08T08:45:00Z',
			},
			{ id: 202, name: 'Ahmed Musa', email: 'ahmed@harvestfields.org', phone: '+234 802 345 6781', role: 'Admin', isBlocked: false, lastActive: '2025-04-07T16:30:00Z' },
			{
				id: 203,
				name: 'Fatima Bello',
				email: 'fatima@harvestfields.org',
				phone: '+234 802 345 6782',
				role: 'Worship',
				isBlocked: false,
				lastActive: '2025-04-05T10:00:00Z',
			},
		],
	},
	{
		id: 3,
		name: 'Living Word Lagos',
		initials: 'LW',
		initBg: 'bg-amber-100',
		initColor: 'text-amber-700',
		users: [
			{
				id: 301,
				name: 'David Adeleke',
				email: 'david@livingword.org',
				phone: '+234 803 456 7891',
				role: 'Super Admin',
				isBlocked: false,
				lastActive: '2025-04-08T11:15:00Z',
			},
			{ id: 302, name: 'Grace Adeleke', email: 'grace@livingword.org', phone: '+234 803 456 7892', role: 'Admin', isBlocked: false, lastActive: '2025-04-06T13:45:00Z' },
		],
	},
	{
		id: 4,
		name: 'Redeemed Assembly',
		initials: 'RA',
		initBg: 'bg-red-100',
		initColor: 'text-red-700',
		users: [
			{
				id: 401,
				name: 'John Eze',
				email: 'john@redeemedassembly.org',
				phone: '+234 804 567 8902',
				role: 'Super Admin',
				isBlocked: false,
				lastActive: '2025-04-07T09:30:00Z',
			},
			{ id: 402, name: 'Paul Eze', email: 'paul@redeemedassembly.org', phone: '+234 804 567 8903', role: 'Admin', isBlocked: true, lastActive: '2025-03-25T14:00:00Z' },
			{
				id: 403,
				name: 'Peter Okonkwo',
				email: 'peter@redeemedassembly.org',
				phone: '+234 804 567 8904',
				role: 'Usher',
				isBlocked: false,
				lastActive: '2025-04-04T08:20:00Z',
			},
		],
	},
	{
		id: 5,
		name: 'Mount Zion Church',
		initials: 'MZ',
		initBg: 'bg-pink-100',
		initColor: 'text-pink-700',
		users: [
			{
				id: 501,
				name: 'Samuel Yusuf',
				email: 'samuel@mountzion.org',
				phone: '+234 805 678 9013',
				role: 'Super Admin',
				isBlocked: false,
				lastActive: '2025-04-08T12:00:00Z',
			},
			{ id: 502, name: 'Esther Yusuf', email: 'esther@mountzion.org', phone: '+234 805 678 9014', role: 'Admin', isBlocked: false, lastActive: '2025-04-07T10:30:00Z' },
			{ id: 503, name: 'David Johnson', email: 'david@mountzion.org', phone: '+234 805 678 9015', role: 'Children', isBlocked: true, lastActive: '2025-03-20T09:00:00Z' },
			{ id: 504, name: 'Mary Johnson', email: 'mary@mountzion.org', phone: '+234 805 678 9016', role: 'Women', isBlocked: false, lastActive: '2025-04-06T15:45:00Z' },
		],
	},
	{
		id: 6,
		name: "Glory House Int'l",
		initials: 'GH',
		initBg: 'bg-lime-100',
		initColor: 'text-lime-700',
		users: [
			{
				id: 601,
				name: 'Joshua Adebayo',
				email: 'joshua@gloryhouse.org',
				phone: '+234 806 789 0124',
				role: 'Super Admin',
				isBlocked: false,
				lastActive: '2025-04-08T09:15:00Z',
			},
			{
				id: 602,
				name: 'Deborah Adebayo',
				email: 'deborah@gloryhouse.org',
				phone: '+234 806 789 0125',
				role: 'Admin',
				isBlocked: false,
				lastActive: '2025-04-07T11:30:00Z',
			},
		],
	},
	{
		id: 7,
		name: 'Cornerstone Chapel',
		initials: 'CC',
		initBg: 'bg-purple-100',
		initColor: 'text-purple-700',
		users: [
			{
				id: 701,
				name: 'Femi Ogunlesi',
				email: 'femi@cornerstone.org',
				phone: '+234 807 890 1235',
				role: 'Super Admin',
				isBlocked: false,
				lastActive: '2025-04-08T13:45:00Z',
			},
			{ id: 702, name: 'Tolu Ogunlesi', email: 'tolu@cornerstone.org', phone: '+234 807 890 1236', role: 'Youth', isBlocked: false, lastActive: '2025-04-06T12:00:00Z' },
		],
	},
	{
		id: 8,
		name: 'New Life Fellowship',
		initials: 'NL',
		initBg: 'bg-green-100',
		initColor: 'text-green-700',
		users: [
			{
				id: 801,
				name: 'Chidi Okonkwo',
				email: 'chidi@newlife.org',
				phone: '+234 808 901 2346',
				role: 'Super Admin',
				isBlocked: false,
				lastActive: '2025-04-08T10:00:00Z',
			},
			{ id: 802, name: 'Ngozi Okonkwo', email: 'ngozi@newlife.org', phone: '+234 808 901 2347', role: 'Admin', isBlocked: false, lastActive: '2025-04-07T14:15:00Z' },
			{ id: 803, name: 'Emeka Okafor', email: 'emeka@newlife.org', phone: '+234 808 901 2348', role: 'Prayer', isBlocked: false, lastActive: '2025-04-05T08:30:00Z' },
		],
	},
];

const roleBadgeClass: Record<string, string> = {
	'Super Admin': 'bg-purple-100 text-purple-700',
	'Admin': 'bg-blue-100 text-blue-700',
	'Finance': 'bg-green-100 text-green-700',
	'Media': 'bg-pink-100 text-pink-700',
	'Worship': 'bg-indigo-100 text-indigo-700',
	'Youth': 'bg-amber-100 text-amber-700',
	'Children': 'bg-orange-100 text-orange-700',
	'Usher': 'bg-gray-100 text-gray-700',
	'Women': 'bg-rose-100 text-rose-700',
	'Prayer': 'bg-cyan-100 text-cyan-700',
	'Default': 'bg-gray-100 text-gray-700',
};

const roleIcon: Record<string, JSX.Element> = {
	'Super Admin': <Crown className="h-3 w-3" />,
	'Admin': <UserCog className="h-3 w-3" />,
	'Default': <User className="h-3 w-3" />,
};

export default function UsersPage() {
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedChurchId, setSelectedChurchId] = useState<string>('all');
	const [roleFilter, setRoleFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [selectedUser, setSelectedUser] = useState<any>(null);
	const [selectedChurch, setSelectedChurch] = useState<any>(null);
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [usersData, setUsersData] = useState(churchesWithUsers);

	// Get all users with church info
	const getAllUsers = () => {
		const allUsers: any[] = [];
		usersData.forEach((church) => {
			church.users.forEach((user) => {
				allUsers.push({
					...user,
					churchId: church.id,
					churchName: church.name,
					churchInitials: church.initials,
					churchInitBg: church.initBg,
					churchInitColor: church.initColor,
				});
			});
		});
		return allUsers;
	};

	const allUsers = getAllUsers();

	// Filter users
	const filteredUsers = allUsers.filter((user) => {
		const matchesSearch = !searchQuery || user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesChurch = selectedChurchId === 'all' || user.churchId.toString() === selectedChurchId;
		const matchesRole = roleFilter === 'all' || user.role === roleFilter;
		const matchesStatus = statusFilter === 'all' || (statusFilter === 'blocked' && user.isBlocked) || (statusFilter === 'active' && !user.isBlocked);

		return matchesSearch && matchesChurch && matchesRole && matchesStatus;
	});

	// Stats
	const totalUsers = allUsers.length;
	const activeUsers = allUsers.filter((u) => !u.isBlocked).length;
	const blockedUsers = allUsers.filter((u) => u.isBlocked).length;
	const superAdmins = allUsers.filter((u) => u.role === 'Super Admin').length;

	const handleToggleBlock = () => {
		if (!selectedUser) return;

		const newBlockStatus = !selectedUser.isBlocked;

		// Update local state
		const updatedChurches = usersData.map((church) => {
			if (church.id === selectedUser.churchId) {
				return {
					...church,
					users: church.users.map((user) => (user.id === selectedUser.id ? { ...user, isBlocked: newBlockStatus } : user)),
				};
			}
			return church;
		});

		setUsersData(updatedChurches);
		setSelectedUser({ ...selectedUser, isBlocked: newBlockStatus });

		toast({
			title: newBlockStatus ? 'User Blocked' : 'User Unblocked',
			description: newBlockStatus
				? `${selectedUser.name} has been blocked from accessing the platform.`
				: `${selectedUser.name} has been unblocked and can now access the platform.`,
			variant: newBlockStatus ? 'destructive' : 'default',
		});

		setIsBlockModalOpen(false);
	};

	const handleViewUser = (user: any) => {
		setSelectedUser(user);
		const church = usersData.find((c) => c.id === user.churchId);
		setSelectedChurch(church);
		setIsViewModalOpen(true);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-NG', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getRoleIcon = (role: string) => {
		return roleIcon[role] || roleIcon['Default'];
	};

	return (
		<>
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
				<div>
					<Heading
						level={1}
						text="User Management"
					/>
					<Text
						text="Manage users across all churches"
						variant="muted"
					/>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Total Users"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={totalUsers.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
								<Users className="w-5 h-5 text-primary-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Active Users"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={activeUsers.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
								<UserCheck className="w-5 h-5 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Blocked Users"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={blockedUsers.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
								<UserX className="w-5 h-5 text-red-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Super Admins"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={superAdmins.toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
								<Crown className="w-5 h-5 text-purple-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card className="rounded-2xl mb-6">
				<CardContent className="p-4">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search by name or email..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>

						<Select
							value={selectedChurchId}
							onValueChange={setSelectedChurchId}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="All Churches" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Churches</SelectItem>
								{usersData.map((church) => (
									<SelectItem
										key={church.id}
										value={church.id.toString()}>
										{church.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={roleFilter}
							onValueChange={setRoleFilter}>
							<SelectTrigger className="w-[160px]">
								<SelectValue placeholder="All Roles" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Roles</SelectItem>
								<SelectItem value="Super Admin">Super Admin</SelectItem>
								<SelectItem value="Admin">Admin</SelectItem>
								<SelectItem value="Finance">Finance</SelectItem>
								<SelectItem value="Media">Media</SelectItem>
								<SelectItem value="Worship">Worship</SelectItem>
								<SelectItem value="Youth">Youth</SelectItem>
								<SelectItem value="Children">Children</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="blocked">Blocked</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Users Table */}
			<Card className="rounded-2xl">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">User</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Church</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Email</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Phone</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Role</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Last Active</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Status</th>
									<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map((user) => (
									<tr
										key={user.id}
										className={cn('border-b last:border-0 hover:bg-gray-50 transition-colors', user.isBlocked && 'bg-red-50/30 hover:bg-red-50/50')}>
										<td className="py-3 px-4">
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarFallback className="bg-gray-100 text-gray-600">
														{user.name
															.split(' ')
															.map((n: string) => n[0])
															.join('')
															.toUpperCase()
															.slice(0, 2)}
													</AvatarFallback>
												</Avatar>
												<span className="font-medium">{user.name}</span>
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-2">
												<div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium', user.churchInitBg, user.churchInitColor)}>
													{user.churchInitials}
												</div>
												<span className="text-sm">{user.churchName}</span>
											</div>
										</td>
										<td className="py-3 px-4 text-gray-600 text-sm">{user.email}</td>
										<td className="py-3 px-4 text-gray-500 text-sm">{user.phone || '—'}</td>
										<td className="py-3 px-4">
											<span
												className={cn(
													'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
													roleBadgeClass[user.role] || roleBadgeClass.Default
												)}>
												{getRoleIcon(user.role)}
												{user.role}
											</span>
										</td>
										<td className="py-3 px-4 text-gray-500 text-xs">{formatDate(user.lastActive)}</td>
										<td className="py-3 px-4">
											{user.isBlocked ? (
												<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
													<Lock className="h-3 w-3" />
													Blocked
												</span>
											) : (
												<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
													<CheckCircle className="h-3 w-3" />
													Active
												</span>
											)}
										</td>
										<td className="py-3 px-4">
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													className="h-8"
													onClick={() => handleViewUser(user)}>
													View
												</Button>
												{user.isBlocked ? (
													<Button
														variant="ghost"
														size="sm"
														className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
														onClick={() => {
															setSelectedUser(user);
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
															setSelectedUser(user);
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

					{filteredUsers.length === 0 && (
						<div className="text-center py-12">
							<Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<Text
								text="No users found"
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

			{/* View User Details Modal */}
			<Dialog
				open={isViewModalOpen}
				onOpenChange={setIsViewModalOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3">
							<Avatar className="h-10 w-10">
								<AvatarFallback className="bg-gray-100 text-gray-600">
									{selectedUser?.name
										?.split(' ')
										.map((n: string) => n[0])
										.join('')
										.toUpperCase()
										.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="text-xl">{selectedUser?.name}</div>
								<div className="flex items-center gap-2 mt-0.5">
									<span
										className={cn(
											'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
											roleBadgeClass[selectedUser?.role] || roleBadgeClass.Default
										)}>
										{selectedUser && getRoleIcon(selectedUser.role)}
										{selectedUser?.role}
									</span>
									{selectedUser?.isBlocked ? (
										<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
											<Lock className="h-3 w-3" />
											Blocked
										</span>
									) : (
										<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
											<CheckCircle className="h-3 w-3" />
											Active
										</span>
									)}
								</div>
							</div>
						</DialogTitle>
						<DialogDescription>User details and access information</DialogDescription>
					</DialogHeader>

					<Separator />

					<div className="space-y-4">
						{/* Church Information */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Building2 className="h-4 w-4 text-gray-500" />
								<Text
									text="Church"
									variant="blue"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6">
								<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
									<div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', selectedChurch?.initBg, selectedChurch?.initColor)}>
										{selectedChurch?.initials}
									</div>
									<div>
										<Text
											text={selectedChurch?.name}
											className="font-medium"
										/>
										<Text
											text={`ID: ${selectedChurch?.id}`}
											variant="muted"
											className="text-xs"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Contact Information */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Mail className="h-4 w-4 text-gray-500" />
								<Text
									text="Contact Information"
									variant="blue"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6 space-y-2">
								<div className="flex items-center justify-between py-1">
									<Text
										text="Email"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedUser?.email || '—'}
										className="text-sm"
									/>
								</div>
								<div className="flex items-center justify-between py-1">
									<Text
										text="Phone"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedUser?.phone || '—'}
										className="text-sm"
									/>
								</div>
							</div>
						</div>

						{/* Activity Information */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Activity className="h-4 w-4 text-gray-500" />
								<Text
									text="Activity"
									variant="blue"
									className="font-medium text-sm"
								/>
							</div>
							<div className="pl-6">
								<div className="flex items-center justify-between py-1">
									<Text
										text="Last Active"
										variant="muted"
										className="text-xs"
									/>
									<Text
										text={selectedUser?.lastActive ? formatDate(selectedUser.lastActive) : '—'}
										className="text-sm"
									/>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					<DialogFooter className="flex justify-between gap-3">
						<Button
							variant={selectedUser?.isBlocked ? 'default' : 'destructive'}
							onClick={() => {
								setIsViewModalOpen(false);
								setIsBlockModalOpen(true);
							}}
							className="gap-2">
							{selectedUser?.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
							{selectedUser?.isBlocked ? 'Unblock User' : 'Block User'}
						</Button>
						<Button
							variant="outline"
							onClick={() => setIsViewModalOpen(false)}>
							Close
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
							{selectedUser?.isBlocked ? <Unlock className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-red-600" />}
							{selectedUser?.isBlocked ? 'Unblock User' : 'Block User'}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{selectedUser?.isBlocked ? (
								<>
									Are you sure you want to unblock <span className="font-semibold">{selectedUser?.name}</span>?
									<br />
									<br />
									<span className="text-green-600">✓</span> The user will regain full access to the platform.
									<br />
									<span className="text-green-600">✓</span> They will be able to log in and access church features.
								</>
							) : (
								<>
									Are you sure you want to block <span className="font-semibold">{selectedUser?.name}</span>?
									<br />
									<br />
									<span className="text-red-600">⚠</span> The user will lose access to all platform features.
									<br />
									<span className="text-red-600">⚠</span> They will be unable to log in to their account.
									<br />
									<span className="text-red-600">⚠</span> This action can be reversed later.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleToggleBlock}
							className={selectedUser?.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
							{selectedUser?.isBlocked ? 'Yes, Unblock User' : 'Yes, Block User'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
