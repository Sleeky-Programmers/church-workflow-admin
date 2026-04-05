export type UserStatus = "active" | "pending" | "suspended";

export type UserRole = "admin" | "finance" | "pastor" | string;

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleId?: string;
  status: UserStatus;
  dateInvited: string;
  avatar?: string;
};

export type PendingInvite = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "pending";
};

export type UserAction =
  | "view_details"
  | "change_role"
  | "resend_invite"
  | "delete_invitation"
  | "suspend"
  | "restore"
  | "remove";

export type ActionItem = {
  label: string;
  value: UserAction;
  variant?: "default" | "primary" | "warning" | "danger";
  showFor: UserStatus[];
};

export type PermissionLevel = "no_access" | "view" | "manage" | "full_access";

export type ModulePermission = {
  module: string;
  level: PermissionLevel;
  description: string;
};

export type RolePermissions = {
  role: string;
  description: string;
  permissions: ModulePermission[];
};

export type InviteFormData = {
  title?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
};
