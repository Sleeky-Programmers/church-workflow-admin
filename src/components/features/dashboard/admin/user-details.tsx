"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { StatusBadge } from "@/components/ui/status-badge";
import { ROLE_OPTIONS, ROLE_PERMISSIONS } from "@/lib/permissions";
import { fetchRoleById } from "@/lib/api/admin-settings";
import { backendToFrontendModule } from "@/lib/role-constants";
import { UserDetailsPermissionsView } from "./mini-components/user-permission";
import { UserActionZone } from "./mini-components/user-action-zone";
import { RemoveUserDialog } from "./mini-components/remove-user-dialog";
import Heading from "@/components/ui/typography/Heading";
import { Span, Text } from "@/components/ui/typography/Text";

type UserDetailsPageProps = {
  user: User;
  onBack: () => void;
  roles?: any[];
  onRoleChange?: (userId: string, newRole: string) => void;
  onSuspend?: (userId: string) => void;
  onRemove?: (userId: string) => void;
  onResendInvite?: (userId: string) => void;
  onDeleteInvite?: (userId: string) => void;
  onReinstate?: (userId: string) => void;
};

export function UserDetailsPage({
  user,
  onBack,
  roles = [],
  onRoleChange,
  onSuspend,
  onRemove,
  onResendInvite,
  onDeleteInvite,
  onReinstate,
}: UserDetailsPageProps) {
  const [selectedRole, setSelectedRole] = useState(user.roleId || user.role);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [roleData, setRoleData] = useState<any>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedRole(user.roleId || user.role);
  }, [user.roleId, user.role]);

  useEffect(() => {
    async function loadRole() {
      if (!selectedRole) {
        return;
      }

      setIsLoadingRole(true);
      try {
        if (/^[a-fA-F0-9]{24}$/.test(selectedRole)) {
          const fetchedRole = await fetchRoleById(selectedRole);
          setRoleData(fetchedRole);
        } else {
          const fallbackObj = roles.find(
            (r: any) => r._id === selectedRole || r.roleName === selectedRole,
          );
          setRoleData(fallbackObj || null);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load role data",
          variant: "destructive",
        });
        const fallbackObj = roles.find(
          (r: any) => r._id === selectedRole || r.roleName === selectedRole,
        );
        setRoleData(fallbackObj || null);
      } finally {
        setIsLoadingRole(false);
      }
    }
    loadRole();
  }, [selectedRole, roles]);

  let rolePermissions = null;
  if (roleData) {
    rolePermissions = {
      role: roleData.roleName,
      description:
        roleData.description ||
        "Permissions are automatically assigned based on role.",
      permissions:
        roleData.permissions?.map((p: any) => ({
          module: backendToFrontendModule[p.moduleSection] || p.moduleSection,
          level: p.accessLevel?.toLowerCase(),
          description: `Access Level: ${p.accessLevel}`,
        })) || [],
    };
  } else {
    rolePermissions = ROLE_PERMISSIONS[selectedRole];
  }

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    if (onRoleChange) {
      onRoleChange(user.id, newRole);
    }
  };

  const handleSuspend = () => {
    if (onSuspend) {
      onSuspend(user.id);
      toast({
        title: "Success",
        description: "User has been suspended",
      });
    }
  };

  const handleRemove = () => {
    setIsRemoveDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (onRemove) {
      onRemove(user.id);
      toast({
        title: "Success",
        description: "User has been removed",
      });
      onBack();
    }
  };

  const handleResendInvite = () => {
    if (onResendInvite) {
      onResendInvite(user.id);
      toast({
        title: "Success",
        description: "Invitation has been resent",
      });
    }
  };

  const handleDeleteInvite = () => {
    if (onDeleteInvite) {
      onDeleteInvite(user.id);
      toast({
        title: "Success",
        description: "Invitation has been deleted",
      });
      onBack();
    }
  };

  const handleReinstate = () => {
    if (onReinstate) {
      onReinstate(user.id);
      toast({
        title: "Success",
        description: "User has been reinstated",
      });
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b top-0">
        <div className="px-6 py-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 p-0 gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex-1 text-center">
            <Heading level={2}>User Details</Heading>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <Heading level={3} className="truncate">
                  {user.name}
                </Heading>
                <StatusBadge status={user.status} />
              </div>
              <Text variant="default" className="text-muted-foreground mt-1">
                {user.email}
              </Text>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div>
            <Heading level={3}>Role Assignment</Heading>
            <div className="space-y-2">
              <Label htmlFor="role">Assigned Role</Label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles && roles.length > 0
                    ? roles.map((r: any) => (
                        <SelectItem key={r._id} value={r._id}>
                          {r.roleName}
                        </SelectItem>
                      ))
                    : ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
              <Text variant="default">
                Permissions are automatically assigned based on role.
              </Text>
            </div>
          </div>

          {rolePermissions && (
            <div>
              <Heading level={4} className="mb-2">
                Description
              </Heading>
              <Text variant="default">{rolePermissions.description}</Text>
            </div>
          )}
        </div>

        {isLoadingRole ? (
          <div className="bg-white rounded-lg border p-6 flex justify-center py-10">
            <Text variant="default" className="text-muted-foreground">
              Loading permissions...
            </Text>
          </div>
        ) : rolePermissions ? (
          <div className="bg-white rounded-lg border p-6">
            <UserDetailsPermissionsView rolePermissions={rolePermissions} />
          </div>
        ) : null}

        <UserActionZone
          status={user.status}
          onSuspend={handleSuspend}
          onRemove={handleRemove}
          onResendInvite={handleResendInvite}
          onDeleteInvite={handleDeleteInvite}
          onReinstate={handleReinstate}
        />
      </main>

      <RemoveUserDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        userName={user.name}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
