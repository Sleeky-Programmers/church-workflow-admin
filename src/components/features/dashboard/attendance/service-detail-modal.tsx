"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { RegularService } from "@/types";
import { getAttendanceCount } from "@/lib/utils";
import { OrderOfServiceModal } from "./order-of-service-modal";

type ServiceDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: RegularService | null;
  date: string | null;
  orderItems?: string[];
  canEditOrder?: boolean;
  onSaveOrder?: (items: string[]) => void;
};

const DEFAULT_ORDER = [
  "Opening Prayer",
  "Praise and Worship",
  "Bible Reading",
  "Sermon",
  "Offering",
  "Closing Prayer",
];

export function ServiceDetailModal({
  open,
  onOpenChange,
  service,
  date,
  orderItems = DEFAULT_ORDER,
  canEditOrder = false,
  onSaveOrder,
}: ServiceDetailModalProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsOrderModalOpen(false);
    }
  }, [open]);

  const parsedDate = date ? new Date(date) : null;
  const attendanceCount =
    service && date ? (getAttendanceCount(service, date) ?? 0) : 0;

  const maleCount = Math.floor(attendanceCount * 0.64);
  const femaleCount = Math.max(attendanceCount - maleCount, 0);

  const sections = useMemo(() => {
    if (service?.serviceName.toLowerCase() === "sunday service") {
      return ["First Service Attendance", "Second Service Attendance"];
    }
    return ["Service Attendance"];
  }, [service?.serviceName]);

  if (!service || !parsedDate) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showClose={false}
          mobileSheet
          className="max-w-md p-0 overflow-hidden max-sm:max-h-[88vh]"
        >
          <DialogHeader className="px-5 py-4 border-b">
            <DialogTitle className="text-2xl">
              {service.serviceName}
            </DialogTitle>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(parsedDate, "MMM. d, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {service.location ? "Offline" : "No location"}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {service.startTime}
                {service.endTime ? ` - ${service.endTime}` : ""}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {service.location || "No address provided"}
              </div>
            </div>

            <div className="space-y-5">
              {sections.map((section) => (
                <div key={section} className="space-y-3 border-t pt-4">
                  <div className="text-lg font-semibold">{section}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm">Male</label>
                      <Input value={maleCount} readOnly />
                    </div>
                    <div>
                      <label className="text-sm">Females</label>
                      <Input value={femaleCount} readOnly />
                    </div>
                    <div>
                      <label className="text-sm">First Time Members</label>
                      <Input
                        value={Math.max(Math.floor(attendanceCount * 0.05), 0)}
                        readOnly
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOrderModalOpen(true)}
                      >
                        {canEditOrder
                          ? "Manage Order of Service"
                          : "View Order of Service"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OrderOfServiceModal
        open={isOrderModalOpen}
        onOpenChange={setIsOrderModalOpen}
        serviceName={service.serviceName}
        items={orderItems}
        editable={canEditOrder}
        onSave={onSaveOrder}
      />
    </>
  );
}
