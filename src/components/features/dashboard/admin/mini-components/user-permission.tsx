"use client";

import { RolePermissions as RolePermissionsType } from "../../../../../types/user";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { PermissionModuleSelector } from "./permission-selector";
import { MODULE_PERMISSIONS } from "@/lib/role-constants";
import { PermissionLevel } from "@/types";

type UserDetailsPermissionsViewProps = {
  rolePermissions: RolePermissionsType;
};

export function UserDetailsPermissionsView({
  rolePermissions,
}: UserDetailsPermissionsViewProps) {
  return (
    <div className="space-y-4">
      <div>
        <Heading level={3}>Permissions (Read-only)</Heading>
        <Text variant="default" className="mt-1">
          Permissions shown are inherited from the assigned role and cannot be
          edited here.
        </Text>
      </div>

      <div className="space-y-6">
        {MODULE_PERMISSIONS.map((moduleDef) => {
          const matchedPerm = rolePermissions.permissions.find(
            (p) => p.module === moduleDef.module,
          );
          const level: PermissionLevel = matchedPerm
            ? (matchedPerm.level as PermissionLevel)
            : "no_access";

          if (level === "no_access") return null;

          return (
            <PermissionModuleSelector
              key={moduleDef.module}
              module={moduleDef}
              value={level}
              disabled={true}
            />
          );
        })}

        {rolePermissions.permissions.length === 0 ||
        rolePermissions.permissions.every((p) => p.level === "no_access") ? (
          <div className="text-gray-500 py-4 italic">
            No specific permissions granted yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
