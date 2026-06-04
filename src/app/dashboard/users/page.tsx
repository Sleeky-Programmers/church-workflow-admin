'use client';

import { Activity, Building2, CheckCircle, Crown, Loader2, Lock, Mail, Search, Unlock, User, UserCheck, UserCog, Users, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import {
	fetchMemberDetailsForManagement,
	fetchMemberManagementStats,
	fetchMembersForManagement,
	MemberDetailsResponse,
	MemberManagementData,
	MemberStatsResponse,
	updateMemberStatus,
} from '@/services/memberService';

const roleBadgeClass: Record<string, string> = {
	'Leader': 'bg-purple-100 text-purple-700',
	'Volunteer': 'bg-green-100 text-green-700',
	'Worker': 'bg-blue-100 text-blue-700',
	'Member': 'bg-gray-100 text-gray-700',
	'Visitor': 'bg-amber-100 text-amber-700',
	'New Convert': 'bg-indigo-100 text-indigo-700',
	'Default': 'bg-gray-100 text-gray-700',
};

const roleIcon: Record<string, JSX.Element> = {
	Leader: <Crown className="h-3 w-3" />,
	Volunteer: <UserCheck className="h-3 w-3" />,
	Worker: <UserCog className="h-3 w-3" />,
	Default: <User className="h-3 w-3" />,
};

export default function UsersPage() {
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedChurchId, setSelectedChurchId] = useState<string>('all');
	const [roleFilter, setRoleFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [selectedUser, setSelectedUser] = useState<MemberManagementData | null>(null);
	const [selectedChurch, setSelectedChurch] = useState<any>(null);
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);

	// State for real data
	const [users, setUsers] = useState<MemberManagementData[]>([]);
	const [churches, setChurches] = useState<{ id: string; name: string }[]>([]);
	const [stats, setStats] = useState<MemberStatsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [viewLoading, setViewLoading] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		totalCount: 0,
		totalPages: 1,
	});
	const [memberDetails, setMemberDetails] = useState<MemberDetailsResponse | null>(null);
	const [loadingDetails, setLoadingDetails] = useState(false);

	// Load users with filters
	const loadUsers = async () => {
		setLoading(true);
		try {
			const response = await fetchMembersForManagement({
				page: pagination.page,
				limit: pagination.limit,
				churchId: selectedChurchId,
				status: statusFilter === 'active' ? true : statusFilter === 'blocked' ? false : undefined,
				role: roleFilter !== 'all' ? roleFilter : undefined,
				search: searchQuery || undefined,
			});

			setUsers(response.data);
			setChurches(response.churches);
			setPagination((prev) => ({
				...prev,
				totalCount: response.pagination.totalCount,
				totalPages: response.pagination.totalPages,
			}));
		} catch (error) {
			console.error('Failed to load users:', error);
			toast({
				title: 'Error',
				description: 'Failed to load users',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	// Load statistics
	const loadStats = async () => {
		try {
			const response = await fetchMemberManagementStats();
			setStats(response);
		} catch (error) {
			console.error('Failed to load stats:', error);
		}
	};

	// Load member details for view modal
	const loadMemberDetails = async (memberId: string) => {
		setLoadingDetails(true);
		try {
			const response = await fetchMemberDetailsForManagement(memberId);
			setMemberDetails(response);
		} catch (error) {
			console.error('Failed to load member details:', error);
			toast({
				title: 'Error',
				description: 'Failed to load member details',
				variant: 'destructive',
			});
		} finally {
			setLoadingDetails(false);
		}
	};

	// Handle status toggle (block/unblock)
	const handleToggleStatus = async () => {
		if (!selectedUser) return;

		const newStatus = !selectedUser.isActive;

		try {
			await updateMemberStatus(selectedUser.id, newStatus);

			// Update local state
			setUsers((prevUsers) => prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, isActive: newStatus } : user)));

			// Update selected user
			setSelectedUser({ ...selectedUser, isActive: newStatus });

			// Reload stats to update counts
			await loadStats();

			toast({
				title: newStatus ? 'User Activated' : 'User Deactivated',
				description: newStatus ? `${selectedUser.name} has been activated.` : `${selectedUser.name} has been deactivated.`,
				variant: newStatus ? 'default' : 'destructive',
			});
		} catch (error) {
			console.error('Failed to update status:', error);
			toast({
				title: 'Error',
				description: 'Failed to update user status',
				variant: 'destructive',
			});
		} finally {
			setIsBlockModalOpen(false);
		}
	};

	// Handle view user
	const handleViewUser = async (user: MemberManagementData) => {
		setViewLoading(user.id); // Set loading for this specific user
		setSelectedUser(user);
		const church = churches.find((c) => c.id === user.churchId);
		setSelectedChurch(church);
		await loadMemberDetails(user.id);
		setIsViewModalOpen(true);
		setViewLoading(null); // Clear loading state
	};

	// Handle page change
	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
	};

	// Handle limit change
	const handleLimitChange = (newLimit: number) => {
		setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
	};

	// Initial load and when filters change
	useEffect(() => {
		loadUsers();
		loadStats();
	}, [pagination.page, pagination.limit, selectedChurchId, roleFilter, statusFilter, searchQuery]);

	const formatDate = (dateString: string) => {
		if (!dateString) return 'Never';
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

	// Stats from API
	const totalUsers = stats?.totalMembers || 0;
	const activeUsers = stats?.activeMembers || 0;
	const blockedUsers = stats?.inactiveMembers || 0;
	const superAdmins = stats?.membersByStatus?.find((s) => s.status === 'LEADER')?.count || 0;

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
						text="Manage members across all churches"
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
									text="Total Members"
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
									text="Active Members"
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
									text="Inactive Members"
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
									text="Church Leaders"
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
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
						<div className="col-span-2 md:col-span-1 relative flex-1">
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
							<SelectTrigger className="w-full">
								<SelectValue placeholder="All Churches" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Churches</SelectItem>
								{churches.map((church) => (
									<SelectItem
										key={church.id}
										value={church.id}>
										{church.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={roleFilter}
							onValueChange={setRoleFilter}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="All Roles" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Roles</SelectItem>
								<SelectItem value="Leader">Leader</SelectItem>
								<SelectItem value="Volunteer">Volunteer</SelectItem>
								<SelectItem value="Worker">Worker</SelectItem>
								<SelectItem value="Member">Member</SelectItem>
								<SelectItem value="Visitor">Visitor</SelectItem>
								<SelectItem value="New Convert">New Convert</SelectItem>
							</SelectContent>
						</Select>

						<div className="col-span-2 md:col-span-1">
							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="All Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="blocked">Inactive</SelectItem>
								</SelectContent>
							</Select>
						</div>
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
								{loading ? (
									<tr>
										<td
											colSpan={8}
											className="text-center py-12">
											<div className="animate-pulse">Loading users...</div>
										</td>
									</tr>
								) : (
									users.map((user) => (
										<tr
											key={user.id}
											className={cn('border-b last:border-0 hover:bg-gray-50 transition-colors', !user.isActive && 'bg-red-50/30 hover:bg-red-50/50')}>
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
											<td className="py-3 px-4 text-gray-600 text-sm">{user.email || '—'}</td>
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
												{!user.isActive ? (
													<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
														<Lock className="h-3 w-3" />
														Inactive
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
														onClick={() => handleViewUser(user)}
														disabled={viewLoading === user.id}>
														{viewLoading === user.id ? (
															<>
																<Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
																Loading...
															</>
														) : (
															'View'
														)}
													</Button>
													{!user.isActive ? (
														<Button
															variant="ghost"
															size="sm"
															className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
															onClick={() => {
																setSelectedUser(user);
																setIsBlockModalOpen(true);
															}}>
															<Unlock className="h-3.5 w-3.5 mr-1" />
															Activate
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
															Deactivate
														</Button>
													)}
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{!loading && users.length === 0 && (
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

					{/* Pagination */}
					{!loading && pagination.totalPages > 1 && (
						<div className="flex items-center justify-between px-4 py-3 border-t">
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600">Rows per page:</span>
								<Select
									value={pagination.limit.toString()}
									onValueChange={(v) => handleLimitChange(parseInt(v))}>
									<SelectTrigger className="w-20 h-8">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{[5, 10, 20, 50].map((size) => (
											<SelectItem
												key={size}
												value={size.toString()}>
												{size}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="text-sm text-gray-600">
								Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount}{' '}
								results
							</div>

							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(pagination.page - 1)}
									disabled={pagination.page === 1}>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(pagination.page + 1)}
									disabled={pagination.page === pagination.totalPages}>
									Next
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* View User Details Modal */}
			<Dialog
				open={isViewModalOpen}
				onOpenChange={setIsViewModalOpen}>
				<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
											roleBadgeClass[selectedUser?.role || ''] || roleBadgeClass.Default
										)}>
										{selectedUser && getRoleIcon(selectedUser.role)}
										{selectedUser?.role}
									</span>
									{!selectedUser?.isActive ? (
										<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
											<Lock className="h-3 w-3" />
											Inactive
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
						<DialogDescription>Member details and attendance information</DialogDescription>
					</DialogHeader>

					<Separator className="my-5 mt-3" />

					{loadingDetails ? (
						<div className="py-8 text-center flex flex-col items-center gap-3">
							<Loader2 className="h-8 w-8 animate-spin text-primary-600" />
							<Text
								text="Loading member details..."
								variant="muted"
							/>
						</div>
					) : (
						memberDetails && (
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
										<div className="p-3 bg-gray-50 rounded-lg">
											<Text
												text={selectedChurch?.name || 'N/A'}
												className="font-medium"
											/>
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
												text={memberDetails.member.email || '—'}
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
												text={memberDetails.member.phone || '—'}
												className="text-sm"
											/>
										</div>
										<div className="flex items-center justify-between py-1">
											<Text
												text="Gender"
												variant="muted"
												className="text-xs"
											/>
											<Text
												text={memberDetails.member.gender || '—'}
												className="text-sm"
											/>
										</div>
									</div>
								</div>

								{/* Attendance Statistics */}
								<div>
									<div className="flex items-center gap-2 mb-2">
										<Activity className="h-4 w-4 text-gray-500" />
										<Text
											text="Attendance Statistics"
											variant="blue"
											className="font-medium text-sm"
										/>
									</div>
									<div className="pl-6 space-y-2">
										<div className="flex items-center justify-between py-1">
											<Text
												text="Attendance Rate"
												variant="muted"
												className="text-xs"
											/>
											<Text
												text={`${memberDetails.member.stats?.attendanceRate || 0}%`}
												className="text-sm font-semibold"
											/>
										</div>
										<div className="flex items-center justify-between py-1">
											<Text
												text="Services Attended"
												variant="muted"
												className="text-xs"
											/>
											<Text
												text={memberDetails.member.stats?.totalServicesAttended?.toString() || '0'}
												className="text-sm"
											/>
										</div>
										<div className="flex items-center justify-between py-1">
											<Text
												text="Services Missed"
												variant="muted"
												className="text-xs"
											/>
											<Text
												text={memberDetails.member.stats?.totalServicesMissed?.toString() || '0'}
												className="text-sm"
											/>
										</div>
										<div className="flex items-center justify-between py-1">
											<Text
												text="Joined Date"
												variant="muted"
												className="text-xs"
											/>
											<Text
												text={memberDetails.member.dateJoined ? formatDate(memberDetails.member.dateJoined) : '—'}
												className="text-sm"
											/>
										</div>
									</div>
								</div>
							</div>
						)
					)}

					<Separator className="my-5 mt-3" />

					<DialogFooter className="flex justify-between gap-3">
						<Button
							variant={!selectedUser?.isActive ? 'default' : 'destructive'}
							onClick={() => {
								setIsViewModalOpen(false);
								setIsBlockModalOpen(true);
							}}
							className="gap-2">
							{!selectedUser?.isActive ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
							{!selectedUser?.isActive ? 'Activate User' : 'Deactivate User'}
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
							{!selectedUser?.isActive ? <Unlock className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-red-600" />}
							{!selectedUser?.isActive ? 'Activate User' : 'Deactivate User'}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{!selectedUser?.isActive ? (
								<>
									Are you sure you want to activate <span className="font-semibold">{selectedUser?.name}</span>?
									<br />
									<br />
									<span className="text-green-600">✓</span> The user will regain full access to the platform.
									<br />
									<span className="text-green-600">✓</span> They will be able to participate in church activities.
								</>
							) : (
								<>
									Are you sure you want to deactivate <span className="font-semibold">{selectedUser?.name}</span>?
									<br />
									<br />
									<span className="text-red-600">⚠</span> The user will lose access to all platform features.
									<br />
									<span className="text-red-600">⚠</span> They will be unable to access their account.
									<br />
									<span className="text-red-600">⚠</span> This action can be reversed later.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleToggleStatus}
							className={!selectedUser?.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
							{!selectedUser?.isActive ? 'Yes, Activate User' : 'Yes, Deactivate User'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
