import { AdminOption } from "../enums";
import { apiFetch } from "./index";

export interface Role {
  _id: string;
  churchId: string | null;
  roleName: string;
  description: string | null;
  type: "SYSTEM" | "CUSTOM";
  status: "ACTIVE" | "DISABLED";
  permissions: {
    moduleSection: string;
    accessLevel: string;
  }[];
  __v: number;
}

export interface AdminInvite {
  _id: string;
  churchId: string;
  churchRole: string | any;
  firstName?: string;
  lastName?: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountSettings {
  _id: string;
  adminId: string;
  personalPreferences: {
    birthday: boolean;
    event: boolean;
    requisitionApproval: boolean;
    _id?: string;
  };
  personalPrivacy: {
    birthdayCalendarDisplay: boolean;
    birthdayShoutOut: boolean;
    emailAlerts: boolean;
    _id?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function fetchRoles() {
  return apiFetch<Role[]>("/roles", { method: "GET" });
}

export async function fetchRoleById(roleId: string) {
  return apiFetch<Role>(`/roles/${roleId}`, { method: "GET" });
}

export async function createRole(payload: {
  roleName: string;
  permissions: any[];
}) {
  return apiFetch<Role>("/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRole(
  roleId: string,
  payload: { roleName?: string; description?: string; permissions?: any[] },
) {
  return apiFetch<Role>(`/roles/${roleId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateRoleStatus(
  roleId: string,
  status: "ACTIVE" | "DISABLED",
) {
  return apiFetch<Role>(`/roles/${roleId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function fetchAdminInvites() {
  return apiFetch<AdminInvite[]>("/admin-invite", { method: "GET" });
}

export async function createAdminInvite(
  churchRoleId: string,
  payload: {
    email: string;
    title?: string;
    firstName?: string;
    lastName?: string;
  },
) {
  return apiFetch<AdminInvite>(`/admin-invite/${churchRoleId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function changeAdminRole(inviteId: string, churchRoleId: string) {
  return apiFetch<AdminInvite>(`/admin-invite/${inviteId}/${churchRoleId}`, {
    method: "PUT",
  });
}

export async function deleteAdminInvite(inviteId: string) {
  return apiFetch<AdminInvite>(`/admin-invite/${inviteId}`, {
    method: "DELETE",
  });
}

export async function updateAdminStatus(inviteId: string, option: AdminOption) {
  return apiFetch<AdminInvite>(`/admin-invite/update/${inviteId}`, {
    method: "PUT",
    body: JSON.stringify({ option }),
  });
}

export async function removeAdminUser(inviteId: string) {
  return apiFetch<{ message: string }>(`/admin-invite/remove/${inviteId}`, {
    method: "DELETE",
    body: JSON.stringify({ key: "remove user" }),
  });
}

export async function resendAdminInvite(inviteId: string) {
  return apiFetch<{ message: string }>(`/admin-invite/resend/${inviteId}`, {
    method: "PUT",
  });
}

export async function fetchAccountSettings() {
  return apiFetch<AccountSettings>("/account-settings", { method: "GET" });
}

export async function updateAccountSettings(payload: {
  personalPreferences?: any;
  personalPrivacy?: any;
}) {
  return apiFetch<AccountSettings>("/account-settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getDeletionSchedule() {
  return apiFetch<any>("/account-deletion/schedule", { method: "GET" });
}

export async function scheduleAccountDeletion(waitingPeriod: number) {
  return apiFetch<{ message: string; schedule: any }>(
    "/account-deletion/schedule",
    { method: "POST", body: JSON.stringify({ waitingPeriod }) },
  );
}

export async function unscheduleAccountDeletion() {
  return apiFetch<{ message: string }>("/account-deletion/unschedule", {
    method: "DELETE",
  });
}
