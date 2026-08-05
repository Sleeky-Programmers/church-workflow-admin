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
import { PermissionAction, ProductAdminModule } from '@/types/productAdmin';

type PermissionGuardProps = {
	module: ProductAdminModule;
	action?: PermissionAction;
	children: ReactNode;
};

export function PermissionGuard({ module, action = 'read', children }: PermissionGuardProps) {
	const { admin, isLoading, fetchAdminData, hasPermission } = useProductAdminStore();

	useEffect(() => {
		fetchAdminData();
	}, [fetchAdminData]);

	if (!admin && isLoading) {
		return (
			<div className="min-h-[50vh] w-full flex items-center justify-center gap-3">
				<Loader />
				<Text variant="muted">Checking permissions...</Text>
			</div>
		);
	}

	if (!hasPermission(module, action)) {
		return (
			<div className="min-h-[50vh] w-full flex items-center justify-center p-4">
				<Card className="max-w-md w-full text-center">
					<CardHeader className="items-center">
						<div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-2">
							<ShieldAlert className="w-7 h-7 text-red-500" />
						</div>
						<CardTitle>Access restricted</CardTitle>
						<CardDescription>You don&apos;t have permission to view this section. Contact a super admin if you think this is a mistake.</CardDescription>
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
