import { ActivityDetailLabel } from "@/lib/enums";
import { ActivityRow } from "@/types";

export const activityDetailsConfig: {
  key: ActivityDetailLabel;
  getValue: (row: ActivityRow) => React.ReactNode;
}[] = [
  {
    key: ActivityDetailLabel.ACTION,
    getValue: (row) => row.action,
  },
  {
    key: ActivityDetailLabel.BY,
    getValue: (row) =>
      `${row.adminId?.firstName || "Unknown"} ${row.adminId?.lastName || ""}`,
  },
  {
    key: ActivityDetailLabel.MODULE,
    getValue: (row) => row.module,
  },
  {
    key: ActivityDetailLabel.AFFECTED_RECORD,
    getValue: (row) => row.details,
  },
  {
    key: ActivityDetailLabel.STATUS,
    getValue: () => "Approved",
  },
  {
    key: ActivityDetailLabel.TRIGGERED_FROM,
    getValue: () => "Requisition Form > Pending List",
  },
  {
    key: ActivityDetailLabel.DETAILS,
    getValue: (row) => `“${row.details}”`,
  },
];
