// app/dashboard/activity-log/page.tsx
'use client';

import { format } from 'date-fns';
import { Activity, ChevronLeft, ChevronRight, ClipboardList, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { ActivityLogDetailDrawer } from '@/components/features/dashboard/admin/activity-log-detail-drawer';
import { formatActivityAction } from '@/lib/utils';
import { ActivityLog, ActivityLogStats, fetchActivityLogs, fetchActivityLogStats } from '@/services/activityLogService';

function adminLabel(adminId: ActivityLog['adminId']) {
	if (!adminId) return 'Unknown admin';
	if (typeof adminId === 'string') return adminId;
	return adminId.name || adminId.email || adminId._id;
}

export default function ActivityLogPage() {
	const [activities, setActivities] = useState<ActivityLog[]>([]);
	const [stats, setStats] = useState<ActivityLogStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);

	const loadData = async (targetPage: number) => {
		setIsLoading(true);
		try {
			const [logsData, statsData] = await Promise.all([fetchActivityLogs({ page: targetPage, limit: 20 }), fetchActivityLogStats()]);
			setActivities(logsData.data);
			setTotalPages(logsData.pagination.totalPages || 1);
			setStats(statsData);
		} catch (error: any) {
			toast.error(error.message || 'Failed to load activity log');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadData(page);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	return (
		<>
			<div className="mb-6">
				<Heading
					level={1}
					text="Activity Log"
				/>
				<Text
					text="A record of platform-admin actions across the system"
					variant="muted"
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Total Activities"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={(stats?.totalActivities ?? 0).toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
								<ClipboardList className="w-5 h-5 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Today"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={(stats?.activitiesToday ?? 0).toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
								<Zap className="w-5 h-5 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="This Week"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={(stats?.activitiesThisWeek ?? 0).toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
								<Activity className="w-5 h-5 text-amber-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<Text
									text="Active Admins (7d)"
									variant="muted"
									className="text-sm"
								/>
								<Heading
									level={2}
									text={(stats?.activeAdminsThisWeek ?? 0).toString()}
									className="text-2xl font-semibold mt-1"
								/>
							</div>
							<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
								<Users className="w-5 h-5 text-purple-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="rounded-2xl">
				<CardContent className="p-0">
					{isLoading ? (
						<div className="flex items-center justify-center py-16 gap-2">
							<Loader />
							<Text
								text="Loading activity..."
								variant="muted"
							/>
						</div>
					) : activities.length === 0 ? (
						<div className="flex items-center justify-center py-16">
							<Text
								text="No activity recorded yet"
								variant="muted"
							/>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Action</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">By</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Details</th>
										<th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">When</th>
									</tr>
								</thead>
								<tbody>
									{activities.map((activity) => (
										<tr
											key={activity._id}
											className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
											onClick={() => setSelectedActivity(activity)}>
											<td className="py-3 px-4">
												<Badge variant="outline">{formatActivityAction(activity.action)}</Badge>
											</td>
											<td className="py-3 px-4 font-medium">{adminLabel(activity.adminId)}</td>
											<td className="py-3 px-4 text-gray-500 max-w-xs truncate">{activity.details}</td>
											<td className="py-3 px-4 text-gray-500 text-sm whitespace-nowrap">{format(new Date(activity.createdAt), 'MMM d, yyyy p')}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{!isLoading && totalPages > 1 && (
						<div className="flex items-center justify-between border-t px-4 py-3">
							<Text
								text={`Page ${page} of ${totalPages}`}
								variant="muted"
								className="text-xs"
							/>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page === 1}
									className="h-8 px-2">
									<ChevronLeft className="h-4 w-4" />
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									disabled={page === totalPages}
									className="h-8 px-2">
									Next
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<ActivityLogDetailDrawer
				activity={selectedActivity}
				open={!!selectedActivity}
				onOpenChange={(open) => !open && setSelectedActivity(null)}
			/>
		</>
	);
}
