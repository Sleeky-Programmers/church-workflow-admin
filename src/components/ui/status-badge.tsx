import { UserStatus } from "../../types/user";
import { getStatusBadgeClasses, capitalize } from "../../lib/utils";

type StatusBadgeProps = {
  status: UserStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={getStatusBadgeClasses(status)}>{capitalize(status)}</span>
  );
}
