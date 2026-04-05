"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role, RoleAction } from "@/types";
import { RoleActionsMenu } from "./mini-components/role-action-menu";
import { RoleStatusBadge } from "./mini-components/role-status-badge";
import { RoleTypeBadge } from "./mini-components/role-type-badge";
import { Text } from "@/components/ui/typography/Text";

type RolesTableProps = {
  roles: Role[];
  onActionSelect: (roleId: string, action: RoleAction) => void;
};

export function RolesTable({ roles, onActionSelect }: RolesTableProps) {
  if (roles.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <div className="text-center">
          <Text variant="default">No roles found</Text>
          <Text variant="muted">Get started by creating your first role</Text>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="font-bold px-4">
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell className="py-2 px-4 ">
              <RoleTypeBadge type={role.type} />
            </TableCell>
            <TableCell className="py-2 px-4 ">{role.users}</TableCell>
            <TableCell className="py-2 px-4 ">
              <RoleStatusBadge status={role.status} />
            </TableCell>
            <TableCell className="text-right">
              <RoleActionsMenu
                status={role.status}
                onActionSelect={(action) => onActionSelect(role.id, action)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
