import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Check, Trash2, X } from "lucide-react";
import { ActivityRow } from "@/types";
import Heading from "@/components/ui/typography/Heading";
import { Span, Text } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button";
import { activityDetailsConfig } from "@/config/activity-log";
import { formatDateTime12h } from "@/lib/utils";

export default function ActivityLogPopup({
  selectedRow,
  setSelectedRow,
}: {
  selectedRow: ActivityRow | null;
  setSelectedRow: (row: ActivityRow | null) => void;
}) {
  const handleDelete = () => {
    setSelectedRow(null);
  };

  return (
    <Dialog
      open={!!selectedRow}
      onOpenChange={(open) => {
        if (!open) setSelectedRow(null);
      }}
    >
      <DialogContent showClose={false}>
        {selectedRow && (
          <div>
            <div className="flex items-start  gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-success-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <Heading
                    level={3}
                    text={`${selectedRow.action} by ${selectedRow.adminId?.firstName || "Unknown"} ${selectedRow.adminId?.lastName || ""}`}
                    className="text-lg font-semibold"
                  />
                  <Text variant="default" className=" mt-1">
                    {`${formatDateTime12h(selectedRow.createdAt).toUpperCase()} • Module: ${selectedRow.module}`}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="p-2 rounded-md"
                  size="icon"
                  variant="ghost"
                  onClick={handleDelete}
                  aria-label="Delete activity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <DialogClose asChild>
                  <Button
                    className="p-2 rounded-md"
                    size="icon"
                    variant="outline"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>

            <div className="border-t my-4" />

            <Heading
              level={4}
              text="Activity Details"
              className="text-base font-semibold mb-3"
            />

            <div className="divide-y">
              {activityDetailsConfig.map(({ key, getValue }) => (
                <div key={key} className="flex items-start gap-4 py-3">
                  <Span variant="indicator" className="mt-1" />
                  <Text variant="label" className="w-40">
                    {key}:
                  </Text>
                  <div className="flex-1 text-right">
                    {getValue(selectedRow)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
