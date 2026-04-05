"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  fetchAdminInvites,
  createAdminInvite,
  updateAdminStatus,
  removeAdminUser,
  fetchRoles,
  deleteAdminInvite,
  changeAdminRole,
  resendAdminInvite,
} from "@/lib/api/admin-settings";
import { User, UserAction } from "@/types/user";
import { UserTable } from "@/components/features/dashboard/admin/users-table";
import { InviteUserDialog } from "@/components/features/dashboard/admin/invite-user";
import { RemoveUserDialog } from "@/components/features/dashboard/admin/mini-components/remove-user-dialog";
import { ChangeRoleDialog } from "@/components/features/dashboard/admin/mini-components/change-role-dialog";
import { useToast } from "@/hooks/use-toast";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Loader } from "@/components/ui/loader";
import { AdminOption } from "@/lib/enums";

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers: any = async () => {
    setIsLoading(true);
    try {
      const [data, rolesData] = await Promise.all([
        fetchAdminInvites(),
        fetchRoles(),
      ]);

      setRoles(rolesData);
      const mappedUsers: User[] = data.map((invite: any) => {
        const roleId =
          typeof invite.churchRole === "string"
            ? invite.churchRole
            : invite.churchRole?._id;
        const roleObj = rolesData.find((r: any) => r._id === roleId);

        return {
          id: invite._id,
          name: invite?.firstName
            ? `${invite.firstName} ${invite.lastName || ""}`.trim()
            : "-",
          email: invite.email,
          role: roleObj ? roleObj.roleName : "-",
          roleId: roleId,
          status: invite.status.toLowerCase() as
            | "active"
            | "pending"
            | "suspended",
          dateInvited: new Date(invite.createdAt).toLocaleString(),
        };
      });
      setUsers(mappedUsers);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async (data: {
    email: string;
    role: string;
    title?: string;
    firstName?: string;
    lastName?: string;
  }) => {
    setIsActionLoading(true);
    try {
      const payload: any = { email: data.email };
      if (data.title) {
        payload.title = data.title;
      }
      if (data.firstName) {
        payload.firstName = data.firstName;
      }
      if (data.lastName) {
        payload.lastName = data.lastName;
      }

      const result = await createAdminInvite(data.role, payload);
      if (result) {
        toast({
          title: "Success",
          description: "Invitation sent successfully",
        });
        loadUsers();
        return result;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleActionSelect = async (userId: string, action: UserAction) => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return;
    }

    if (action === "remove") {
      setSelectedUser(user);
      setIsRemoveDialogOpen(true);
      return;
    }

    if (action === "change_role") {
      setSelectedUser(user);
      setIsChangeRoleDialogOpen(true);
      return;
    }

    setIsActionLoading(true);
    try {
      let result;
      switch (action) {
        case "suspend":
          result = await updateAdminStatus(userId, AdminOption.SUSPEND);
          break;
        case "restore":
          result = await updateAdminStatus(userId, AdminOption.RESTORE);
          break;
        case "delete_invitation":
          result = await deleteAdminInvite(userId);
          break;
        case "resend_invite":
          result = await resendAdminInvite(userId);
          break;
        default:
          throw new Error("Action not supported locally yet");
      }

      toast({
        title: "Success",
        description: "Action completed successfully",
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Action failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) {
      return;
    }

    setIsActionLoading(true);
    try {
      await removeAdminUser(selectedUser.id);
      toast({
        title: "Success",
        description: "User removed successfully",
      });
      setIsRemoveDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to remove user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmChangeRole = async (newRoleId: string) => {
    if (!selectedUser) {
      return;
    }
    setIsActionLoading(true);
    try {
      await changeAdminRole(selectedUser.id, newRoleId);
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setIsChangeRoleDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2">
        <Loader />
        <Text variant="default">Loading users...</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level={2}>User Management</Heading>
        <Button onClick={() => setIsInviteDialogOpen(true)}>Invite User</Button>
      </div>

      <div className="bg-white rounded-lg border">
        <UserTable users={users} onActionSelect={handleActionSelect} />
      </div>

      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteUser}
        isLoading={isActionLoading}
        roles={roles}
      />

      <RemoveUserDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        userName={selectedUser?.name || ""}
        onConfirm={handleRemoveUser}
      />

      <ChangeRoleDialog
        open={isChangeRoleDialogOpen}
        onOpenChange={setIsChangeRoleDialogOpen}
        userName={selectedUser?.name || ""}
        currentRoleId={selectedUser?.roleId || ""}
        roles={roles}
        onConfirm={handleConfirmChangeRole}
        isLoading={isActionLoading}
      />
    </div>
  );
}
