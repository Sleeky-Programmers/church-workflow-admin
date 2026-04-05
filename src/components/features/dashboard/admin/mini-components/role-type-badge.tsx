import { Span } from "@/components/ui/typography/Text";
import { RoleType } from "@/types";

type RoleTypeBadgeProps = {
  type: RoleType;
};

export function RoleTypeBadge({ type }: RoleTypeBadgeProps) {
  const getClasses = () => {
    if (type === "system") {
      return "bg-gray-100 text-gray-700 border-gray-300";
    }
    return "bg-blue-50 text-blue-700 border-blue-300";
  };

  return (
    <Span
      variant="default"
      className={`inline-flex items-center px-3 py-1 rounded-md border ${getClasses()}`}
    >
      {type === "system" ? "System" : "Custom"}
    </Span>
  );
}
