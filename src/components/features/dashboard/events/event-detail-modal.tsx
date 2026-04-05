"use client";

import { format, parseISO } from "date-fns";
import { Calendar, Clock3, MapPin, Repeat, Trash2, X } from "lucide-react";
import { ChurchEvent } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EVENT_REMINDER_LABEL_MAP,
  EVENT_TYPE_LABEL_MAP,
  formatRecurrenceLabel,
} from "./constants";
import { Span, Text } from "@/components/ui/typography/Text";
import Heading from "@/components/ui/typography/Heading";

type EventDetailModalProps = {
  open: boolean;
  event: ChurchEvent | null;
  onOpenChange: (open: boolean) => void;
  onDelete: (eventId: string) => void;
  onEdit: (event: ChurchEvent) => void;
};

export function EventDetailModal({
  open,
  event,
  onOpenChange,
  onDelete,
  onEdit,
}: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="max-w-lg p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>{EVENT_TYPE_LABEL_MAP[event.type]}</DialogTitle>

            <div className="flex items-center gap-2">
              <Button
                className="p-2"
                size="icon"
                variant="ghost"
                onClick={() => onDelete(event.id)}
                aria-label="Delete activity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

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
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-2">
            <Span className={`h-3 w-3 rounded-full ${event.colorClass}`} />
            <Heading level={3}>{event.title}</Heading>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Span>{format(parseISO(event.date), "EEEE, MMMM do, yyyy")}</Span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              <Span>
                {format(parseISO(`${event.date}T${event.startTime}`), "p")}
                {event.endTime
                  ? ` - ${format(parseISO(`${event.date}T${event.endTime}`), "p")}`
                  : ""}
              </Span>
            </div>

            {event.location ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <Span>{event.location}</Span>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              <Span>{formatRecurrenceLabel(event.recurrence, event.date)}</Span>
            </div>
          </div>

          {event.description ? (
            <div>
              <Text variant="default">Description</Text>
              <Text variant="muted">{event.description}</Text>
            </div>
          ) : null}

          <Span variant="muted">
            {event.sendReminder
              ? `Reminder: ${EVENT_REMINDER_LABEL_MAP[event.reminderType]} (${event.remindBeforeMinutes} mins before)`
              : "Reminder disabled"}
          </Span>
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <Button onClick={() => onEdit(event)}>Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
