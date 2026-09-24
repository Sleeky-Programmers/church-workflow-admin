import { SuperAdminGuard } from '@/components/auth/super-admin-guard';

export default function PlansLayout({ children }: { children: React.ReactNode }) {
	return <SuperAdminGuard>{children}</SuperAdminGuard>;
}
