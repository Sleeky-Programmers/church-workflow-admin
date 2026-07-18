'use client';
import { Bell, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import Heading from '@/components/ui/typography/Heading';
import { Span, Text } from '@/components/ui/typography/Text';
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/lib/api';
import { notificationConfig } from '@/lib/utils';
import { ApiNotification, NotificationApiResponse, NotificationTypes } from '@/types';

type FilterType = 'all' | 'unread' | 'read';

export default function Notification() {
	const [notifications, setNotifications] = useState<NotificationTypes[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<NotificationApiResponse['pagination'] | null>(null);

	const [filter, setFilter] = useState<FilterType>('all');

	const filteredNotifications = notifications.filter((n) => {
		if (filter === 'unread') return !n.isRead;
		if (filter === 'read') return n.isRead;
		return true;
	});

	const markAsRead = async (id: string) => {
		markNotificationAsRead(id);
		getAllNotifications();
	};

	const markAllAsRead = async () => {
		await markAllNotificationsAsRead();
		getAllNotifications();
	};

	const getAllNotifications = async (page: number = 1) => {
		setIsLoading(true);
		const allNotifications = await fetchNotifications();

		if (!allNotifications.data) {
			setIsLoading(false);
			return;
		}

		const notificationPayload = allNotifications.data.map((notification: ApiNotification) => ({
			_id: notification._id,
			icon: notificationConfig[notification.type].icon,
			title: notification.title,
			description: notification.body,
			type: notification.type,
			isRead: notification.isRead,
			iconBg: notificationConfig[notification.type].background,
			iconColor: notificationConfig[notification.type].color,
			date: new Date(notification.createdAt).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}),
		}));
		setNotifications(notificationPayload);
		setPagination(allNotifications.pagination);
		setCurrentPage(page);
		setIsLoading(false);
	};

	useEffect(() => {
		getAllNotifications();
	}, []);

	return (
		<div className="w-full space-y-6">
			<div className="flex md:items-center justify-between md:flex-row flex-col items-start mb-6">
				<Heading
					level={1}
					text="Notifications"
				/>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						className="hidden sm:flex items-center gap-2"
						onClick={() => setFilter(filter === 'all' ? 'unread' : filter === 'unread' ? 'read' : 'all')}>
						{filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : 'Read'}
						<ChevronDown className="w-4 h-4" />
					</Button>

					<Button onClick={markAllAsRead}>Mark all as read</Button>
				</div>
			</div>

			<div className="flex flex-col gap-2 w-full">
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader />
					</div>
				) : filteredNotifications.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="mb-4 p-4 bg-gray-100 rounded-full">
							<Bell className="w-8 h-8 text-gray-500" />
						</div>
						<Text className="text-lg font-medium text-gray-900 mb-1">No notifications</Text>
						<Text
							variant="muted"
							className="text-sm">
							{filter === 'all' ? "You're all caught up!" : filter === 'unread' ? 'No unread notifications' : 'No read notifications'}
						</Text>
					</div>
				) : (
					filteredNotifications.map((notification: NotificationTypes) => {
						const Icon = notification.icon;

						return (
							<div
								key={notification._id}
								className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors
                    hover:bg-sky-50
                  `}
								onClick={() => markAsRead(notification._id)}>
								<Span className={`mt-2 w-2 h-2 rounded-full ${notification.isRead ? 'bg-transparent' : 'bg-sky-500'}`} />

								<div
									className={`flex items-center justify-center w-10 h-10 rounded-md
                      ${notification.iconBg} ${notification.iconColor}`}>
									<Icon className="w-5 h-5" />
								</div>

								<div className="flex items-center gap-6 min-w-0 flex-1">
									<div className="flex-shrink-0 w-48">
										<Text className={`text-sm truncate ${notification.isRead ? 'font-normal text-gray-700' : 'font-semibold text-gray-900'}`}>{notification.title}</Text>
									</div>

									<div className="flex-1 min-w-0">
										<Text
											variant="muted"
											className="truncate">
											{notification.description}
										</Text>
									</div>

									<div className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">{notification.date}</div>
								</div>
							</div>
						);
					})
				)}
			</div>

			{pagination && pagination.totalPages > 1 && !isLoading && filteredNotifications.length > 0 && (
				<div className="mt-8 flex items-center justify-between">
					<Text
						variant="muted"
						className="text-sm">
						Page {currentPage} of {pagination.totalPages}
					</Text>
					<Pagination className="justify-end m-0">
						<PaginationContent>
							<PaginationItem>
								<Button
									variant="outline"
									size="icon"
									disabled={!pagination.hasPreviousPage}
									onClick={() => getAllNotifications(currentPage - 1)}>
									<ChevronLeft className="w-4 h-4" />
								</Button>
							</PaginationItem>

							{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
								<PaginationItem key={page}>
									<Button
										variant={currentPage === page ? 'default' : 'outline'}
										size="sm"
										onClick={() => getAllNotifications(page)}
										className="w-10">
										{page}
									</Button>
								</PaginationItem>
							))}

							<PaginationItem>
								<Button
									variant="outline"
									size="icon"
									disabled={!pagination.hasNextPage}
									onClick={() => getAllNotifications(currentPage + 1)}>
									<ChevronRight className="w-4 h-4" />
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
