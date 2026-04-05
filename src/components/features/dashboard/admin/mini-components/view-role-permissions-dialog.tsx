"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchRoleById } from "@/lib/api/admin-settings";
import { RolePermissions as RolePermissionsType } from "@/types/user";
import { UserDetailsPermissionsView } from "./user-permission";
import { Loader } from "@/components/ui/loader";
import { Text } from "@/components/ui/typography/Text";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { backendToFrontendModule } from "@/lib/role-constants";
import { useToast } from "@/hooks/use-toast";

type ViewRolePermissionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string | null;
  roleName: string;
};

export function ViewRolePermissionsDialog({
  open,
  onOpenChange,
  roleId,
  roleName,
}: ViewRolePermissionsDialogProps) {
  const [rolePermissions, setRolePermissions] =
    useState<RolePermissionsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function loadRole() {
      if (!open || !roleId) {
        return;
      }

      setIsLoading(true);
      try {
        if (/^[a-fA-F0-9]{24}$/.test(roleId)) {
          const fetchedRole = await fetchRoleById(roleId);
          setRolePermissions({
            role: fetchedRole.roleName,
            description:
              fetchedRole.description ||
              "Permissions are automatically assigned based on role.",
            permissions:
              fetchedRole.permissions?.map((p: any) => ({
                module:
                  backendToFrontendModule[p.moduleSection] || p.moduleSection,
                level: p.accessLevel?.toLowerCase(),
                description: `Access Level: ${p.accessLevel}`,
              })) || [],
          });
        } else {
          setRolePermissions(ROLE_PERMISSIONS[roleName] || null);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load role permissions",
          variant: "destructive",
        });
        setRolePermissions(ROLE_PERMISSIONS[roleName] || null);
      } finally {
        setIsLoading(false);
      }
    }

    loadRole();
  }, [open, roleId, roleName]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Role Permissions: {roleName}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader />
              <Text variant="muted">Loading permissions...</Text>
            </div>
          ) : rolePermissions ? (
            <UserDetailsPermissionsView rolePermissions={rolePermissions} />
          ) : (
            <div className="flex justify-center py-10">
              <Text variant="muted">No permissions found for this role.</Text>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
