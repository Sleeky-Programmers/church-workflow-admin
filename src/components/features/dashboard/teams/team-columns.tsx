import { Column } from "@/components/features/dashboard/Table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TeamRow } from "@/types";
import { AVATAR_COLORS } from "@/lib/data";
import TeamRowActionsMenu from "./team-row-actions-menu";

export type TeamTableColumn = Column<TeamRow>;

interface TeamColumnHandlers {
  onEdit: (row: TeamRow) => void;
  onManageMembers: (row: TeamRow) => void;
  onMarkAttendance: (row: TeamRow) => void;
  onViewReport: (row: TeamRow) => void;
  onDeleteRequest: (row: TeamRow) => void;
}

function getAvatarColor(name: string) {
  if (!name) return AVATAR_COLORS[0];
  const code = name.charCodeAt(0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getTeamColumns({
  onEdit,
  onManageMembers,
  onMarkAttendance,
  onViewReport,
  onDeleteRequest,
}: TeamColumnHandlers): TeamTableColumn[] {
  return [
    {
      key: "name",
      header: "Small Teams",
      accessor: "name",
      width: "w-72",
    },
    {
      key: "leader",
      header: "Team Lead",
      render: (row) => {
        const name = row.leader?.name ?? "";
        const color = getAvatarColor(name);
        return (
          <div className="flex items-center gap-3">
            <Avatar className={`h-8 w-8 ${color.bg}`}>
              <AvatarFallback
                className={`text-xs font-semibold ${color.bg} ${color.text}`}
              >
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700">{name || "-"}</span>
          </div>
        );
      },
      width: "w-48",
    },
    {
      key: "members",
      header: "Members",
      accessor: "members",
      width: "w-24",
      align: "center",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge
          variant="outline"
          className={
            row.status.toLowerCase() === "active"
              ? "border-success-400 text-success-600 bg-transparent font-normal"
              : "border-gray-300 text-gray-500 bg-transparent font-normal"
          }
        >
          {row.status}
        </Badge>
      ),
      width: "w-40",
      align: "center",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <TeamRowActionsMenu
          row={row}
          onEdit={onEdit}
          onManageMembers={onManageMembers}
          onMarkAttendance={onMarkAttendance}
          onViewReport={onViewReport}
          onDeleteRequest={onDeleteRequest}
        />
      ),
      width: "w-20",
      align: "right",
      contentClassName: "overflow-visible",
    },
  ];
}
