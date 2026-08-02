import { PermissionGuard } from '@/components/auth/permission-guard';
import { ProductAdminModule } from '@/types/productAdmin';

export default function CouponsLayout({ children }: { children: React.ReactNode }) {
	return <PermissionGuard module={ProductAdminModule.COUPON_MANAGEMENT}>{children}</PermissionGuard>;
}
