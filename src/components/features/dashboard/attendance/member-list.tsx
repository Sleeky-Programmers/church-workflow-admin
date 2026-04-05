"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Member } from "@/types";
import { Text } from "@/components/ui/typography/Text";

type MemberListItemProps = {
  member: Member;
  mode:
    | "select"
    | "view-present"
    | "view-absent"
    | "readonly-present"
    | "readonly-absent";
  isSelected?: boolean;
  onSelect?: (memberId: string, selected: boolean) => void;
  onRemove?: (memberId: string) => void;
};

export function MemberListItem({
  member,
  mode,
  isSelected = false,
  onSelect,
  onRemove,
}: MemberListItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 flex-1">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
            {member.initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <Text variant="default" className="truncate">
            {member.name}
          </Text>
          <Text variant="muted" className="truncate">
            {member.email}
          </Text>
        </div>
      </div>

      {(mode === "select" || mode === "view-absent") && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelect?.(member.id, checked as boolean)
          }
        />
      )}

      {mode === "view-present" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove?.(member.id)}
          className="text-destructive-600 hover:text-destructive-700 hover:bg-destructive-50"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
