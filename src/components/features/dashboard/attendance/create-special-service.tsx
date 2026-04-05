"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Span, Text } from "@/components/ui/typography/Text";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Clock3, X } from "lucide-react";
import { SpecialServiceDaySchedule, SpecialServiceEvent } from "@/types";

type CreateSpecialServiceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateService: (service: SpecialServiceEvent) => void;
};

const DEFAULT_START_TIME = "";
const DEFAULT_END_TIME = "";

function listDates(startDate: string, endDate?: string): string[] {
  if (!startDate) return [];
  const start = new Date(startDate);
  const end = new Date(endDate || startDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const normalizedEnd = end < start ? start : end;
  const dates: string[] = [];
  let cursor = start;

  while (cursor <= normalizedEnd) {
    dates.push(format(cursor, "yyyy-MM-dd"));
    cursor = addDays(cursor, 1);
  }

  return dates;
}

export function CreateSpecialServiceModal({
  open,
  onOpenChange,
  onCreateService,
}: CreateSpecialServiceModalProps) {
  const [serviceName, setServiceName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState<"none" | "monthly-first-sunday">(
    "none",
  );
  const [applySameTime, setApplySameTime] = useState(true);
  const [daySchedules, setDaySchedules] = useState<SpecialServiceDaySchedule[]>(
    [],
  );

  const dateRange = useMemo(
    () => listDates(startDate, endDate || startDate),
    [startDate, endDate],
  );

  useEffect(() => {
    if (!dateRange.length) {
      setDaySchedules([]);
      return;
    }

    setDaySchedules((prev) =>
      dateRange.map((date, index) => {
        const existing = prev.find((schedule) => schedule.date === date);
        if (existing) return existing;

        const first = prev[0];
        return {
          date,
          startTime:
            applySameTime && index > 0
              ? first?.startTime || DEFAULT_START_TIME
              : DEFAULT_START_TIME,
          endTime:
            applySameTime && index > 0
              ? first?.endTime || DEFAULT_END_TIME
              : DEFAULT_END_TIME,
        };
      }),
    );
  }, [dateRange, applySameTime]);

  const updateScheduleTime = (
    date: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setDaySchedules((prev) =>
      prev.map((schedule) => {
        if (schedule.date !== date) return schedule;
        return { ...schedule, [field]: value };
      }),
    );

    if (applySameTime && dateRange[0] === date) {
      setDaySchedules((prev) =>
        prev.map((schedule, index) =>
          index === 0 ? schedule : { ...schedule, [field]: value },
        ),
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setServiceName("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setDescription("");
    setRecurrence("none");
    setApplySameTime(true);
    setDaySchedules([]);
  };

  const handleCreate = () => {
    if (!serviceName.trim()) {
      alert("Service name is required");
      return;
    }

    if (!startDate) {
      alert("Start date is required");
      return;
    }

    if (!daySchedules[0]?.startTime) {
      alert("Start time is required");
      return;
    }

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `special-${Date.now()}`;

    onCreateService({
      id,
      serviceName: serviceName.trim(),
      startDate,
      endDate: endDate || startDate,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      recurrence,
      daySchedules,
    });

    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showClose={false}
        mobileSheet
        className="max-w-2xl p-0 overflow-hidden max-sm:max-h-[88vh]"
      >
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Special Service</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <Label>
              Service Name <Span variant="error">*</Span>
            </Label>
            <Input
              placeholder="e.g. Anointing Service"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Start Date <Span variant="error">*</Span>
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (!endDate) setEndDate(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Repeat</Label>
            <Select
              value={recurrence}
              onValueChange={(value) =>
                setRecurrence(value as "none" | "monthly-first-sunday")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select repeat rule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">One-time</SelectItem>
                <SelectItem value="monthly-first-sunday">
                  Every first Sunday of the month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={applySameTime}
              onCheckedChange={(checked) => setApplySameTime(Boolean(checked))}
            />
            <Text>Apply the same time for others</Text>
          </div>

          <div className="space-y-3">
            {daySchedules.map((schedule) => (
              <div
                key={schedule.date}
                className="space-y-2 border rounded-lg p-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4" />
                  {format(new Date(schedule.date), "do MMMM, yyyy")}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>
                      Start Time <Span variant="error">*</Span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) =>
                          updateScheduleTime(
                            schedule.date,
                            "startTime",
                            e.target.value,
                          )
                        }
                      />
                      <Clock3 className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>End Time</Label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) =>
                          updateScheduleTime(
                            schedule.date,
                            "endTime",
                            e.target.value,
                          )
                        }
                      />
                      <Clock3 className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="e.g. Main Auditorium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleCreate}>Create event</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
