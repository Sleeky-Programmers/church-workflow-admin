export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export type ModuleActionPermissions = Record<PermissionAction, boolean>;

export enum ProductAdminModule {
	CHURCH_MANAGEMENT = 'CHURCH_MANAGEMENT',
	USER_MANAGEMENT = 'USER_MANAGEMENT',
	PAYMENT_MANAGEMENT = 'PAYMENT_MANAGEMENT',
	COUPON_MANAGEMENT = 'COUPON_MANAGEMENT',
}

export type ProductAdminPermissions = Partial<Record<ProductAdminModule, ModuleActionPermissions>>;

export function hasProductAdminPermission(
	permissions: ProductAdminPermissions | undefined,
	module: ProductAdminModule,
	action: PermissionAction = 'read'
): boolean {
	return Boolean(permissions?.[module]?.[action]);
}
