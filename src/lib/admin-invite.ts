import { apiFetch } from "@/lib/api";

export interface AdminInviteData {
  firstName: string;
  lastName: string;
  email: string;
  churchName?: string;
  churchId?: string;
  role?: "admin" | "administrator" | string;
  invitedAt?: number;
  expiresAt?: number;
}

export function decodeInviteToken(): AdminInviteData | null {
  try {
    return null;
  } catch {
    return null;
  }
}

export function isInviteTokenValid(inviteData: AdminInviteData): boolean {
  const now = Date.now();
  if (!inviteData.expiresAt) {
    return true;
  }
  return now < inviteData.expiresAt;
}

export async function fetchAdminInviteData(
  inviteToken: string,
): Promise<AdminInviteData | null> {
  try {
    const query = `?token=${encodeURIComponent(inviteToken)}`;
    return await apiFetch<AdminInviteData>(`/auth/preview${query}`, {
      method: "GET",
    });
  } catch {
    return null;
  }
}

export function validateInvitedEmail(
  inputEmail: string,
  invitedEmail: string,
): boolean {
  return inputEmail.toLowerCase() === invitedEmail.toLowerCase();
}
