"use client";

import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RegularService } from "@/types";
import { formatTimeRange } from "@/lib/utils";

type ServicePopoverProps = {
  services: RegularService[];
  date: string;
  children: ReactNode;
};

export function ServicePopover({
  services,
  date,
  children,
}: ServicePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
            >
              <div className="font-medium text-gray-900">
                {service.serviceName}
              </div>
              <div className="text-xs text-gray-600">
                {formatTimeRange(service.startTime, service.endTime)}
                {service.location && ` · ${service.location}`}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
