"use client";

import { useEffect, useMemo, useState } from "react";
import { EventRecurrence, EventReminderType, EventType } from "@/lib/enums";
import { EventFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  EVENT_REMINDER_MINUTES_OPTIONS,
  EVENT_REMINDER_TYPE_OPTIONS,
  EVENT_TYPE_OPTIONS,
  getEventRecurrenceOptions,
} from "./constants";
import { Text } from "@/components/ui/typography/Text";
import { X } from "lucide-react";

type EventFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: EventFormData) => void;
  initialData?: EventFormData | null;
};

const DEFAULT_FORM_DATA: EventFormData = {
  title: "",
  type: EventType.WORSHIP_SERVICE,
  recurrence: EventRecurrence.NONE,
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  description: "",
  sendReminder: true,
  reminderType: EventReminderType.IN_APP,
  remindBeforeMinutes: 30,
};

export function EventFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: EventFormModalProps) {
  const [formData, setFormData] = useState<EventFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = useMemo(() => Boolean(initialData), [initialData]);
  const recurrenceOptions = useMemo(
    () => getEventRecurrenceOptions(formData.date),
    [formData.date],
  );

  useEffect(() => {
    if (!open) return;
    setFormData(initialData ?? DEFAULT_FORM_DATA);
    setErrors({});
  }, [open, initialData]);

  const handleFieldChange = <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.title.trim()) nextErrors.title = "Title is required";
    if (!formData.date) nextErrors.date = "Date is required";
    if (!formData.startTime) nextErrors.startTime = "Start time is required";

    if (
      formData.endTime &&
      formData.startTime &&
      formData.endTime <= formData.startTime
    ) {
      nextErrors.endTime = "End time must be after start time";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="max-w-2xl p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isEditMode ? "Update Event Form" : "Add/Edit Event Form"}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                className="p-2"
                size="icon"
                variant="outline"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="event-title">Title *</Label>
            <Input
              id="event-title"
              placeholder="Event title..."
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />
            {errors.title ? <Text variant="error">{errors.title}</Text> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  handleFieldChange("type", value as EventType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event Recurrence</Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value) =>
                  handleFieldChange("recurrence", value as EventRecurrence)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Does not repeat" />
                </SelectTrigger>
                <SelectContent>
                  {recurrenceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-date">Date *</Label>
            <Input
              id="event-date"
              type="date"
              value={formData.date}
              onChange={(e) => handleFieldChange("date", e.target.value)}
            />
            {errors.date ? <Text variant="error">{errors.date}</Text> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-start">Start Time *</Label>
              <Input
                id="event-start"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleFieldChange("startTime", e.target.value)}
              />
              {errors.startTime ? (
                <Text variant="error">{errors.startTime}</Text>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-end">End Time</Label>
              <Input
                id="event-end"
                type="time"
                value={formData.endTime || ""}
                onChange={(e) => handleFieldChange("endTime", e.target.value)}
              />
              {errors.endTime ? (
                <Text variant="error">{errors.endTime}</Text>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-location">Location</Label>
            <Input
              id="event-location"
              placeholder="e.g. Main Auditorium"
              value={formData.location || ""}
              onChange={(e) => handleFieldChange("location", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="send-reminder"
              checked={formData.sendReminder}
              onCheckedChange={(checked) =>
                handleFieldChange("sendReminder", checked === true)
              }
            />
            <Label htmlFor="send-reminder">Send reminder</Label>
          </div>

          {formData.sendReminder ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reminder Type</Label>
                <Select
                  value={formData.reminderType}
                  onValueChange={(value) =>
                    handleFieldChange(
                      "reminderType",
                      value as EventReminderType,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="In-App Notification" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_REMINDER_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Before</Label>
                <Select
                  value={String(formData.remindBeforeMinutes)}
                  onValueChange={(value) =>
                    handleFieldChange("remindBeforeMinutes", Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="30 minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_REMINDER_MINUTES_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              placeholder="Add description"
              value={formData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <Button onClick={handleSubmit}>
            {isEditMode ? "Update event" : "Create event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
