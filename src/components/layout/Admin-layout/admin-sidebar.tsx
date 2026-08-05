'use client';

import { UserCog, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { RouteConfig } from '@/config/routes';
import { cn } from '@/lib/utils';

type NavItem = {
	id: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	href: string;
};

const NAV_ITEMS: NavItem[] = [
	{
		id: 'admin-profile',
		label: 'Admin Profile',
		icon: UserCog,
		href: RouteConfig.dashboard.admin.profile,
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<nav className="md:w-52 w-full border-r bg-white">
			<div className="space-y-1 p-4">
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								'w-full flex items-center gap-3 px-3 py-2.5 border rounded-lg text-xs font-medium transition-colors',
								isActive ? 'bg-primary-500 text-white-600' : 'text-gray-700 hover:bg-gray-100'
							)}>
							<Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-gray-600')} />
							{item.label}
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
