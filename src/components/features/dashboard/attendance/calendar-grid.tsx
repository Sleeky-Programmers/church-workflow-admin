"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateCalendarDays, mapServicesToCalendar } from "@/lib/utils";
import { RegularService } from "@/types";
import { CalendarDayCell } from "./calendar-day-cell";
import { Span, Text } from "@/components/ui/typography/Text";
import { SpecialServiceEvent } from "@/types";

type CalendarGridProps = {
  services: RegularService[];
  specialServices?: SpecialServiceEvent[];
  searchQuery?: string;
  givingTotals?: Record<string, number>;
  onAddAttendance: (service: RegularService, date: string) => void;
  onViewServiceDetails: (service: RegularService, date: string) => void;
  onAddGivingRecord: (service: RegularService, date: string) => void;
  onAddService: () => void;
};

type CalendarView = "week" | "month" | "year";

const DAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
const WEEKDAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => i + 1);

function parseHour(value: string): number {
  const input = value.trim().toLowerCase();

  const ampmMatch = input.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (ampmMatch) {
    let hour = Number(ampmMatch[1]);
    const suffix = ampmMatch[3];
    if (suffix === "pm" && hour < 12) hour += 12;
    if (suffix === "am" && hour === 12) hour = 0;
    return hour;
  }

  const hhmmMatch = input.match(/^(\d{1,2})(?::(\d{2}))$/);
  if (hhmmMatch) return Number(hhmmMatch[1]);

  const numeric = Number(input);
  return Number.isNaN(numeric) ? 0 : numeric;
}

function isServiceOnDate(service: RegularService, date: Date): boolean {
  return service.days.includes(format(date, "EEEE"));
}

function getServicesForDate(
  services: RegularService[],
  date: Date,
): RegularService[] {
  return services.filter((service) => isServiceOnDate(service, date));
}

function isFirstSunday(date: Date): boolean {
  return date.getDay() === 0 && date.getDate() <= 7;
}

function isSpecialServiceOnDate(
  service: SpecialServiceEvent,
  date: Date,
): boolean {
  const dateString = format(date, "yyyy-MM-dd");
  if (service.recurrence === "monthly-first-sunday") {
    return date >= new Date(service.startDate) && isFirstSunday(date);
  }
  return service.daySchedules.some((schedule) => schedule.date === dateString);
}

function getSpecialServicesForDate(
  services: SpecialServiceEvent[],
  date: Date,
): SpecialServiceEvent[] {
  return services.filter((service) => isSpecialServiceOnDate(service, date));
}

export function CalendarGrid({
  services,
  specialServices = [],
  searchQuery = "",
  givingTotals = {},
  onAddAttendance,
  onViewServiceDetails,
  onAddGivingRecord,
  onAddService,
}: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MMMM"),
  );
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<CalendarView>("month");
  const [filterServiceId, setFilterServiceId] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoDate, setInfoDate] = useState<Date | null>(null);
  const [infoSpecialServices, setInfoSpecialServices] = useState<
    SpecialServiceEvent[]
  >([]);

  const filteredRegularServices = useMemo(() => {
    let next = services;

    if (selectedType === "special") next = [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      next = next.filter(
        (service) =>
          service.serviceName.toLowerCase().includes(query) ||
          (service.location || "").toLowerCase().includes(query),
      );
    }

    if (filterServiceId !== "all") {
      next = next.filter(
        (service, index) =>
          (service.id || `service-option-${index}`) === filterServiceId,
      );
    }

    if (filterDate) {
      const date = new Date(filterDate);
      next = getServicesForDate(next, date);
    }

    return next;
  }, [services, selectedType, searchQuery, filterServiceId, filterDate]);

  const filteredSpecialServices = useMemo(() => {
    let next = specialServices;

    if (selectedType === "regular") next = [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      next = next.filter(
        (service) =>
          service.serviceName.toLowerCase().includes(query) ||
          (service.location || "").toLowerCase().includes(query),
      );
    }

    if (filterServiceId !== "all") {
      next = next.filter((service) => service.id === filterServiceId);
    }

    if (filterDate) {
      const date = new Date(filterDate);
      next = getSpecialServicesForDate(next, date);
    }

    return next;
  }, [specialServices, selectedType, searchQuery, filterServiceId, filterDate]);

  const calendarDays = useMemo(() => {
    const days = generateCalendarDays(currentMonth);
    return mapServicesToCalendar(days, filteredRegularServices);
  }, [currentMonth, filteredRegularServices]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentMonth, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentMonth]);

  const infoServices = useMemo(() => {
    if (!infoDate) return [];
    return getServicesForDate(filteredRegularServices, infoDate);
  }, [infoDate, filteredRegularServices]);

  useEffect(() => {
    setSelectedMonth(format(currentMonth, "MMMM"));
  }, [currentMonth]);

  useEffect(() => {
    if (!filterDate) return;
    const date = new Date(filterDate);
    if (!Number.isNaN(date.getTime())) setCurrentMonth(date);
  }, [filterDate]);

  const openInfoModal = (date: Date) => {
    setInfoDate(date);
    setInfoSpecialServices(
      getSpecialServicesForDate(filteredSpecialServices, date),
    );
    setIsInfoModalOpen(true);
  };

  const handleToday = () => setCurrentMonth(new Date());
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleMonthSelect = (monthName: string) => {
    setSelectedMonth(monthName);
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
  };

  const handleClearFilters = () => {
    setViewMode("month");
    setSelectedType("all");
    setFilterServiceId("all");
    setFilterDate("");
    setCurrentMonth(new Date());
  };

  const renderYearView = () => {
    const year = currentMonth.getFullYear();
    const months = Array.from({ length: 12 }, (_, month) => {
      const first = new Date(year, month, 1);
      const start = startOfWeek(startOfMonth(first), { weekStartsOn: 0 });
      const end = endOfMonth(first);
      const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
      return { month: first, days, end };
    });

    return (
      <div className="grid grid-cols-4 gap-6 p-4">
        {months.map(({ month, days, end }) => (
          <div key={format(month, "MMMM")} className="space-y-2">
            <Text className="text-base font-semibold">
              {format(month, "MMMM")}
            </Text>
            <div className="grid grid-cols-7 text-[10px] text-muted-foreground">
              {WEEKDAY_HEADERS.map((day) => (
                <div key={day} className="text-center py-1">
                  {day[0]}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const hasRegular =
                  getServicesForDate(filteredRegularServices, day).length > 0;
                const hasSpecial =
                  getSpecialServicesForDate(filteredSpecialServices, day)
                    .length > 0;
                const hasService = hasRegular || hasSpecial;
                const isInMonth = isSameMonth(day, month);
                const isAfterMonth = day > end;
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => openInfoModal(day)}
                    className={`h-6 w-6 rounded text-xs ${
                      hasService ? "bg-primary/10 text-primary font-medium" : ""
                    } ${!isInMonth || isAfterMonth ? "text-muted-foreground/40" : "text-foreground"}`}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => (
    <div className="p-4">
      <div className="grid grid-cols-8 border-b">
        <div />
        {weekDays.map((day) => (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => openInfoModal(day)}
            className="text-center py-2 border-l text-sm font-medium hover:bg-accent"
          >
            <div className="text-xs text-muted-foreground">
              {format(day, "EEE")}
            </div>
            <div>{format(day, "d")}</div>
          </button>
        ))}
      </div>

      {TIME_SLOTS.map((slot) => (
        <div key={slot} className="grid grid-cols-8 min-h-10 border-b">
          <div className="text-xs text-muted-foreground py-1">
            {format(new Date(2024, 0, 1, slot), "ha")}
          </div>
          {weekDays.map((day) => {
            const regularAtTime = getServicesForDate(
              filteredRegularServices,
              day,
            ).filter((service) => parseHour(service.startTime) === slot);

            const specialAtTime = getSpecialServicesForDate(
              filteredSpecialServices,
              day,
            ).filter((service) => {
              const schedule =
                service.daySchedules.find(
                  (item) => item.date === format(day, "yyyy-MM-dd"),
                ) || service.daySchedules[0];
              return parseHour(schedule?.startTime || "") === slot;
            });

            return (
              <button
                key={`${day.toISOString()}-${slot}`}
                type="button"
                onClick={() => openInfoModal(day)}
                className="border-l px-1 text-left hover:bg-accent"
              >
                {regularAtTime.map((service) => (
                  <div
                    key={service.id}
                    className="text-xs bg-secondary/10 text-secondary rounded px-1 py-0.5 my-0.5 truncate"
                  >
                    {service.serviceName}
                  </div>
                ))}
                {specialAtTime.map((service) => (
                  <div
                    key={service.id}
                    className="text-xs bg-primary/10 text-primary rounded px-1 py-0.5 my-0.5 truncate"
                  >
                    {service.serviceName} (Special)
                  </div>
                ))}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="bg-background rounded-lg border">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="h-8"
            >
              Today
            </Button>

            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Span className="text-sm font-medium px-2 min-w-[120px] text-center">
                {format(currentMonth, "MMMM yyyy")}
              </Span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={handleMonthSelect}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 space-y-4">
                <div className="flex items-center justify-between">
                  <Text>Filters</Text>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-destructive"
                    onClick={handleClearFilters}
                  >
                    Clear all
                  </Button>
                </div>

                <div className="space-y-2">
                  <Text className="font-medium">By View</Text>
                  <div className="flex items-center gap-2">
                    {(["week", "month", "year"] as CalendarView[]).map(
                      (view) => (
                        <Button
                          key={view}
                          size="sm"
                          variant={viewMode === view ? "default" : "outline"}
                          onClick={() => setViewMode(view)}
                          className="h-7 capitalize"
                        >
                          {view}
                        </Button>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Text className="font-medium">By Date</Text>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full h-9 rounded-md border border-input px-3 text-sm bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Text className="font-medium">By Service</Text>
                  <Select
                    value={filterServiceId}
                    onValueChange={setFilterServiceId}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All services</SelectItem>
                      {services.map((service, index) => {
                        const safeValue =
                          service.id || `service-option-${index}`;
                        return (
                          <SelectItem
                            key={`${safeValue}-${index}`}
                            value={safeValue}
                          >
                            {service.serviceName}
                          </SelectItem>
                        );
                      })}
                      {specialServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.serviceName} (Special)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={onAddService} className="h-8">
              Add service
            </Button>
          </div>
        </div>

        {viewMode === "year" && renderYearView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "month" && (
          <div>
            <div className="grid grid-cols-7 bg-muted/30">
              {DAY_HEADERS.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs font-medium text-muted-foreground border-b"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <CalendarDayCell
                  key={index}
                  day={day}
                  specialServices={getSpecialServicesForDate(
                    filteredSpecialServices,
                    day.date,
                  )}
                  givingTotals={givingTotals}
                  onAddAttendance={onAddAttendance}
                  onViewServiceDetails={onViewServiceDetails}
                  onAddGivingRecord={onAddGivingRecord}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <DialogContent
          showClose={false}
          className="max-w-xs p-0 overflow-hidden"
        >
          <DialogHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">
                {infoDate ? format(infoDate, "EEE, MMM d") : "Service Info"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Services scheduled for the selected date.
              </DialogDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsInfoModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-4 space-y-2">
            {infoServices.length === 0 && infoSpecialServices.length === 0 && (
              <Text variant="muted">No services on this date.</Text>
            )}
            {infoServices.map((service) => (
              <button
                key={service.id}
                type="button"
                className="w-full text-left rounded-md border p-2 hover:bg-accent"
                onClick={() => {
                  if (!infoDate) return;
                  onViewServiceDetails(service, format(infoDate, "yyyy-MM-dd"));
                  setIsInfoModalOpen(false);
                }}
              >
                <Text className="font-medium">{service.serviceName}</Text>
                <Text variant="muted">
                  {service.startTime}
                  {service.endTime ? ` - ${service.endTime}` : ""}
                </Text>
              </button>
            ))}
            {infoSpecialServices.map((service) => (
              <div
                key={service.id}
                className="w-full rounded-md border p-2 bg-primary/5"
              >
                <Text className="font-medium">
                  {service.serviceName} (Special)
                </Text>
                <Text variant="muted">{service.location || "No location"}</Text>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
