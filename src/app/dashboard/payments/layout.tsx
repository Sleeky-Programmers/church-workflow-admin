import { PermissionGuard } from '@/components/auth/permission-guard';
import { ProductAdminModule } from '@/types/productAdmin';

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
	return <PermissionGuard module={ProductAdminModule.PAYMENT_MANAGEMENT}>{children}</PermissionGuard>;
}
