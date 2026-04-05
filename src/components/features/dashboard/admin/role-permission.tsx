"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RolePermissions as RolePermissionsType } from "../../../../types/user";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { UserDetailsPermissionsView } from "./mini-components/user-permission";

type RolePermissionsViewProps = {
  rolePermissions: RolePermissionsType;
  onBack: () => void;
};

export function RolePermissionsView({
  rolePermissions,
  onBack,
}: RolePermissionsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Heading level={3}>{rolePermissions.role} Role Permissions</Heading>
      </div>

      <div>
        <Heading level={4} className=" mb-1">
          Description
        </Heading>
        <Text variant="muted">{rolePermissions.description}</Text>
      </div>

      <div>
        <UserDetailsPermissionsView rolePermissions={rolePermissions} />
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onBack}>Done</Button>
      </div>
    </div>
  );
}
