'use client';

import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/typography/Text';
import { RouteConfig } from '@/config/routes';
import { useProductAdminStore } from '@/stores/useProductAdminStore';

// Mirrors the backend's RolesGuard, which restricts plan-pricing writes to
// role.name === 'SUPER_ADMIN' specifically (not the module-permission system
// PermissionGuard checks) — so this guard checks the role name directly.
export function SuperAdminGuard({ children }: { children: ReactNode }) {
	const { admin, isLoading, fetchAdminData } = useProductAdminStore();

	useEffect(() => {
		fetchAdminData();
	}, [fetchAdminData]);

	if (!admin && isLoading) {
		return (
			<div className="min-h-[50vh] w-full flex items-center justify-center gap-3">
				<Loader />
				<Text variant="muted" text="Checking permissions..." />
			</div>
		);
	}

	if (admin?.role?.name !== 'SUPER_ADMIN') {
		return (
			<div className="min-h-[50vh] w-full flex items-center justify-center p-4">
				<Card className="max-w-md w-full text-center">
					<CardHeader className="items-center">
						<div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-2">
							<ShieldAlert className="w-7 h-7 text-red-500" />
						</div>
						<CardTitle>Access restricted</CardTitle>
						<CardDescription>Only super admins can manage plan pricing.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild>
							<Link href={RouteConfig.dashboard.home}>Back to Overview</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return <>{children}</>;
}
