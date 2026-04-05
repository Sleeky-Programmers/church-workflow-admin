"use client";

import { format } from "date-fns";
import { CalendarDay, RegularService, SpecialServiceEvent } from "@/types";
import { ServicePopover } from "./service-popover";
import { ServiceItem } from "./service";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Text } from "@/components/ui/typography/Text";

type CalendarDayCellProps = {
  day: CalendarDay;
  specialServices?: SpecialServiceEvent[];
  givingTotals?: Record<string, number>;
  onAddAttendance: (service: RegularService, date: string) => void;
  onViewServiceDetails: (service: RegularService, date: string) => void;
  onAddGivingRecord: (service: RegularService, date: string) => void;
};

export function CalendarDayCell({
  day,
  specialServices = [],
  givingTotals = {},
  onAddAttendance,
  onViewServiceDetails,
  onAddGivingRecord,
}: CalendarDayCellProps) {
  const hasMultipleRegularServices = day.services.length > 1;
  const hasAnyService = day.services.length > 0 || specialServices.length > 0;
  const dayPalette = [
    "bg-primary-50",
    "bg-emerald-50",
    "bg-violet-50",
    "bg-amber-50",
    "bg-sky-50",
    "bg-fuchsia-50",
    "bg-rose-50",
  ];
  const dayTintClass = dayPalette[day.date.getDay()];

  return (
    <div
      className={`
        min-h-[120px] p-2 border-b border-r
        ${!day.isCurrentMonth ? "bg-gray-50" : hasAnyService ? dayTintClass : "bg-white"}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className={`
            text-sm font-medium
            ${
              day.isToday
                ? "flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full"
                : day.isCurrentMonth
                  ? "text-gray-500"
                  : "text-gray-400"
            }
          `}
        >
          {format(day.date, "d")}
        </div>

        {hasMultipleRegularServices && (
          <ServicePopover services={day.services} date={day.dateString}>
            <Button className="text-xs text-primary-600 hover:text-primary-700">
              {day.services.length} services
            </Button>
          </ServicePopover>
        )}
      </div>

      <div className="space-y-1">
        {day.services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            date={day.dateString}
            givingTotal={givingTotals[`${service.id}|${day.dateString}`]}
            onAddAttendance={() => onAddAttendance(service, day.dateString)}
            onViewServiceDetails={() =>
              onViewServiceDetails(service, day.dateString)
            }
            onAddGivingRecord={() => onAddGivingRecord(service, day.dateString)}
          />
        ))}

        {specialServices.map((service) => (
          <div
            key={service.id}
            className="text-xs mb-2 p-2 border border-primary/30 bg-primary/5 rounded"
          >
            <div className="flex items-center gap-1 font-semibold mb-1">
              <Star className="h-3 w-3 text-primary" />
              <Text className="font-semibold">{service.serviceName}</Text>
            </div>
            <Text variant="muted">Special Service</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
