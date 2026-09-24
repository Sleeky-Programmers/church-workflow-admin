'use client';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';
import { formatActivityAction } from '@/lib/utils';
import { ActivityLog } from '@/services/activityLogService';

type ActivityLogDetailDrawerProps = {
	activity: ActivityLog | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function adminLabel(adminId: ActivityLog['adminId']) {
	if (!adminId) return 'Unknown admin';
	if (typeof adminId === 'string') return adminId;
	return adminId.name || adminId.email || adminId._id;
}

export function ActivityLogDetailDrawer({ activity, open, onOpenChange }: ActivityLogDetailDrawerProps) {
	return (
		<Drawer
			open={open}
			onOpenChange={onOpenChange}
			direction="right">
			<DrawerContent
				direction="right"
				className="p-0">
				<DrawerHeader className="text-left px-6 pt-6">
					<DrawerTitle>{activity ? formatActivityAction(activity.action) : 'Activity details'}</DrawerTitle>
				</DrawerHeader>

				<Separator />

				{activity && (
					<div className="space-y-5 px-6 py-5 overflow-y-auto">
						<div>
							<Text
								text="Performed by"
								variant="muted"
								className="text-xs uppercase tracking-wide"
							/>
							<Text
								text={adminLabel(activity.adminId)}
								className="text-sm mt-1"
							/>
							{typeof activity.adminId === 'object' && activity.adminId?.email && (
								<Text
									text={activity.adminId.email}
									variant="muted"
									className="text-xs"
								/>
							)}
						</div>

						<div>
							<Text
								text="Action"
								variant="muted"
								className="text-xs uppercase tracking-wide"
							/>
							<div className="mt-1">
								<Badge variant="outline">{formatActivityAction(activity.action)}</Badge>
							</div>
						</div>

						{activity.plan && (
							<div>
								<Text
									text="Plan"
									variant="muted"
									className="text-xs uppercase tracking-wide"
								/>
								<div className="mt-1">
									<Badge variant="outline">{activity.plan}</Badge>
								</div>
							</div>
						)}

						<div>
							<Text
								text="Details"
								variant="muted"
								className="text-xs uppercase tracking-wide"
							/>
							<Text
								text={activity.details || 'No further details recorded'}
								className="text-sm mt-1 whitespace-pre-wrap"
							/>
						</div>

						<div>
							<Text
								text="Timestamp"
								variant="muted"
								className="text-xs uppercase tracking-wide"
							/>
							<Text
								text={format(new Date(activity.createdAt), 'PPpp')}
								className="text-sm mt-1"
							/>
						</div>

						<div>
							<Text
								text="Log ID"
								variant="muted"
								className="text-xs uppercase tracking-wide"
							/>
							<Text
								text={activity._id}
								variant="muted"
								className="text-xs mt-1 font-mono"
							/>
						</div>
					</div>
				)}
			</DrawerContent>
		</Drawer>
	);
}
