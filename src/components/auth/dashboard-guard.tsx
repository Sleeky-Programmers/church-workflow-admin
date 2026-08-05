'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/typography/Text';
import { RouteConfig } from '@/config/routes';
import { getAccessToken } from '@/lib/auth/session';

type DashboardGuardProps = {
	children: ReactNode;
};

export function DashboardGuard({ children }: DashboardGuardProps) {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const checkAccess = async () => {
			const token = getAccessToken();
			if (!token) {
				router.replace(RouteConfig.auth.signIn);
				return;
			}

			setIsChecking(false);
		};

		checkAccess();
	}, [router]);

	if (isChecking) {
		return (
			<div className="min-h-[50vh] w-full flex items-center justify-center gap-3">
				<Loader />
				<Text variant="muted">Preparing your dashboard...</Text>
			</div>
		);
	}

	return <>{children}</>;
}
