import { Span } from "@/components/ui/typography/Text";
import { RoleStatus } from "@/types";

type RoleStatusBadgeProps = {
  status: RoleStatus;
};

export function RoleStatusBadge({ status }: RoleStatusBadgeProps) {
  const getClasses = () => {
    if (status === "active") {
      return "bg-green-50 text-green-700 border-green-200";
    }
    return "bg-red-50 text-red-700 border-red-200";
  };

  const getLabel = () => {
    return status === "active" ? "Active" : "Disabled";
  };

  return (
    <Span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${getClasses()}`}
    >
      {getLabel()}
    </Span>
  );
}
