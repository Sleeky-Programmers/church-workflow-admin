"use client";

import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { performUserAction } from "@/lib/api";
import {
  changeAdminRole,
  updateAdminStatus,
  removeAdminUser,
  deleteAdminInvite,
} from "@/lib/api/admin-settings";
import { useToast } from "@/hooks/use-toast";
import { UserDetailsPage } from "./user-details";
import { RouteConfig } from "@/config/routes";
import { AdminOption } from "@/lib/enums";

type UserDetailsPageClientProps = {
  user: User;
  roles?: any[];
};

export function UserDetailsPageClient({
  user,
  roles,
}: UserDetailsPageClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleBack = () => {
    router.push(RouteConfig.dashboard.admin.users);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await changeAdminRole(userId, newRole);
      router.refresh();
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async (userId: string) => {
    try {
      await updateAdminStatus(userId, AdminOption.SUSPEND);
      router.refresh();
      toast({
        title: "Success",
        description: "User has been suspended",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to suspend user",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeAdminUser(userId);
      toast({
        title: "Success",
        description: "User has been removed",
      });
      router.push(RouteConfig.dashboard.admin.users);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  const handleResendInvite = async (userId: string) => {
    try {
      await performUserAction(userId, "resend_invite");
      toast({
        title: "Success",
        description: "Invitation has been resent",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend invitation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvite = async (userId: string) => {
    try {
      await deleteAdminInvite(userId);
      toast({
        title: "Success",
        description: "Invitation has been deleted",
      });
      router.push(RouteConfig.dashboard.admin.users);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invitation",
        variant: "destructive",
      });
    }
  };

  const handleReinstate = async (userId: string) => {
    try {
      await updateAdminStatus(userId, AdminOption.RESTORE);
      router.refresh();
      toast({
        title: "Success",
        description: "User has been reinstated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reinstate user",
        variant: "destructive",
      });
    }
  };

  return (
    <UserDetailsPage
      user={user}
      roles={roles}
      onBack={handleBack}
      onRoleChange={handleRoleChange}
      onSuspend={handleSuspend}
      onRemove={handleRemove}
      onResendInvite={handleResendInvite}
      onDeleteInvite={handleDeleteInvite}
      onReinstate={handleReinstate}
    />
  );
}
