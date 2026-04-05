"use client";

import { MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserStatus, UserAction } from "@/types/user";
import { getAvailableActions, getActionItemClasses } from "@/lib/utils";
import { Span } from "@/components/ui/typography/Text";
import { RouteConfig } from "@/config/routes";

type UserActionsMenuProps = {
  userId: string;
  userStatus: UserStatus;
  onActionSelect: (action: UserAction) => void;
};

export function UserActionsMenu({
  userId,
  userStatus,
  onActionSelect,
}: UserActionsMenuProps) {
  const availableActions = getAvailableActions(userStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Span className="sr-only">Open menu</Span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableActions.map((action) => {
          if (action.value === "view_details") {
            return (
              <Link
                key={action.value}
                href={RouteConfig.dashboard.admin.userDetails(userId)}
              >
                <DropdownMenuItem
                  className={getActionItemClasses(action.variant)}
                >
                  {action.label}
                </DropdownMenuItem>
              </Link>
            );
          }

          return (
            <DropdownMenuItem
              key={action.value}
              onClick={() => onActionSelect(action.value)}
              className={getActionItemClasses(action.variant)}
            >
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
