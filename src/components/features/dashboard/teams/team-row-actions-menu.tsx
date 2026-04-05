"use client";

import {
  MoreVertical,
  Pencil,
  Users,
  CalendarCheck,
  BarChart3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamRow } from "@/types";
import { Text } from "@/components/ui/typography/Text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamRowActionsMenuProps {
  row: TeamRow;
  onEdit: (row: TeamRow) => void;
  onManageMembers: (row: TeamRow) => void;
  onMarkAttendance: (row: TeamRow) => void;
  onViewReport: (row: TeamRow) => void;
  onDeleteRequest: (row: TeamRow) => void;
}

export default function TeamRowActionsMenu({
  row,
  onEdit,
  onManageMembers,
  onMarkAttendance,
  onViewReport,
  onDeleteRequest,
}: TeamRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-52">
        <DropdownMenuItem className="gap-2" onClick={() => onEdit(row)}>
          <Pencil className="h-4 w-4" />
          <Text variant="default">Edit Team</Text>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onClick={() => onManageMembers(row)}
        >
          <Users className="h-4 w-4" />
          <Text variant="default">Manage Members</Text>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onClick={() => onMarkAttendance(row)}
        >
          <CalendarCheck className="h-4 w-4" />
          <Text variant="default">Mark Attendance</Text>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={() => onViewReport(row)}>
          <BarChart3 className="h-4 w-4" />
          <Text variant="default">View Report</Text>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onClick={() => onDeleteRequest(row)}
        >
          <Trash2 className="h-4 w-4 text-destructive-600" />
          <Text variant="error">Delete Team</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
