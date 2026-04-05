import { Column } from "@/components/features/dashboard/Table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DepartmentRow } from "@/types";
import { AVATAR_COLORS } from "@/lib/data";
import RowActionsMenu from "./row-actions-menu";

export type DepartmentTableColumn = Column<DepartmentRow>;

interface DepartmentColumnHandlers {
  onEdit: (row: DepartmentRow) => void;
  onExport: (row: DepartmentRow) => void;
  onDeleteRequest: (row: DepartmentRow) => void;
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

export function getDepartmentColumns({
  onEdit,
  onExport,
  onDeleteRequest,
}: DepartmentColumnHandlers): DepartmentTableColumn[] {
  return [
    {
      key: "name",
      header: "Department name",
      accessor: "name",
      width: "w-72",
    },
    {
      key: "hod",
      header: "HOD",
      render: (row) => {
        const name = row.hod?.name ?? "";
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
        <RowActionsMenu
          row={row}
          onEdit={onEdit}
          onExport={onExport}
          onDeleteRequest={onDeleteRequest}
        />
      ),
      width: "w-20",
      align: "right",
      contentClassName: "overflow-visible",
    },
  ];
}
