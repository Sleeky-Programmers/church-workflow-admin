import { PermissionGuard } from '@/components/auth/permission-guard';
import { ProductAdminModule } from '@/types/productAdmin';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
	return <PermissionGuard module={ProductAdminModule.USER_MANAGEMENT}>{children}</PermissionGuard>;
}
