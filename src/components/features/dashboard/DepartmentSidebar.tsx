import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography/Text";
import { DepartmentTabs } from "@/lib/enums";
import { NotepadTextDashed, Users } from "lucide-react";

export default function DepartmentSidebar({
  tab,
  setTab,
}: {
  tab: DepartmentTabs;
  setTab: (tab: DepartmentTabs) => void;
}) {
  return (
    <aside className="col-span-1 mr-2">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setTab(DepartmentTabs.MEMBERS)}
            aria-pressed={tab === DepartmentTabs.MEMBERS}
            className={`w-full flex items-center justify-start gap-2 rounded-md px-3 py-2 
              ${tab === DepartmentTabs.MEMBERS ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:bg-neutral/5"}`}
          >
            <Users className="w-4 h-4" />
            <Text className="truncate" text="Members" />
          </Button>

          <Button
            onClick={() => setTab(DepartmentTabs.REQUISITIONS)}
            aria-pressed={tab === DepartmentTabs.REQUISITIONS}
            className={`w-full flex items-center justify-start gap-2 rounded-md px-3 py-2 
              ${tab === DepartmentTabs.REQUISITIONS ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:bg-neutral/5"}`}
          >
            <NotepadTextDashed className="w-4 h-4" />
            <Text className="truncate" text="Requests" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
