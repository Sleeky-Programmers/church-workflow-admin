import { PermissionGuard } from '@/components/auth/permission-guard';
import { ProductAdminModule } from '@/types/productAdmin';

export default function ChurchesLayout({ children }: { children: React.ReactNode }) {
	return <PermissionGuard module={ProductAdminModule.CHURCH_MANAGEMENT}>{children}</PermissionGuard>;
}
