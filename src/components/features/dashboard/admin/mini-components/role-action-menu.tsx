"use client";

import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RoleAction, RoleStatus } from "@/types";

type RoleActionsMenuProps = {
  status: RoleStatus;
  onActionSelect: (action: RoleAction) => void;
};

export function RoleActionsMenu({
  status,
  onActionSelect,
}: RoleActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onActionSelect("view_permissions")}>
          View permissions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onActionSelect("edit")}>
          Edit
        </DropdownMenuItem>
        {status === "active" ? (
          <DropdownMenuItem
            onClick={() => onActionSelect("disable")}
            className="text-destructive-600"
          >
            Disable
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => onActionSelect("enable")}
            className="text-success-600"
          >
            Enable
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
