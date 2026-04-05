import { format, parseISO } from "date-fns";
import {
  EventCalendarView,
  EventRecurrence,
  EventReminderType,
  EventType,
} from "@/lib/enums";
import { EventTypeOption, EventViewOption } from "@/types";

export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  {
    value: EventType.WORSHIP_SERVICE,
    label: "Worship Service",
    colorClass: "bg-blue-600",
  },
  { value: EventType.BIRTHDAY, label: "Birthday", colorClass: "bg-green-600" },
  { value: EventType.MEETING, label: "Meeting", colorClass: "bg-orange-500" },
  {
    value: EventType.WEDDING_ANNIVERSARY,
    label: "Wedding Anniversary",
    colorClass: "bg-violet-600",
  },
  { value: EventType.OTHER, label: "Others", colorClass: "bg-slate-600" },
];

export function getEventRecurrenceOptions(date?: string) {
  const baseDate = date ? parseISO(date) : new Date();
  const weekday = format(baseDate, "EEEE");
  const monthDay = format(baseDate, "MMMM do");
  const weekdayOrder = getWeekdayOrder(baseDate);

  return [
    { value: EventRecurrence.NONE, label: "Does not repeat" },
    { value: EventRecurrence.DAILY, label: "Daily" },
    { value: EventRecurrence.WEEKLY, label: `Weekly on ${weekday}` },
    {
      value: EventRecurrence.MONTHLY,
      label: `Monthly on the ${weekdayOrder} ${weekday}`,
    },
    {
      value: EventRecurrence.YEARLY,
      label: `Annually on this day (${monthDay})`,
    },
    {
      value: EventRecurrence.WEEKDAYS,
      label: "Every weekday (Monday to Friday)",
    },
  ];
}

function getWeekdayOrder(date: Date) {
  const dayOfMonth = Number(format(date, "d"));
  const order = Math.ceil(dayOfMonth / 7);
  if (order === 1) return "first";
  if (order === 2) return "second";
  if (order === 3) return "third";
  if (order === 4) return "fourth";
  return "fifth";
}

export function formatRecurrenceLabel(
  recurrence: EventRecurrence,
  date: string,
) {
  const options = getEventRecurrenceOptions(date);
  return (
    options.find((option) => option.value === recurrence)?.label ?? recurrence
  );
}

export const EVENT_REMINDER_TYPE_OPTIONS = [
  { value: EventReminderType.IN_APP, label: "In-App Notification" },
  { value: EventReminderType.EMAIL, label: "Email" },
  { value: EventReminderType.SMS, label: "SMS" },
];

export const EVENT_REMINDER_MINUTES_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 1440, label: "1 day" },
];

export const EVENT_VIEW_OPTIONS: EventViewOption[] = [
  { value: EventCalendarView.MONTH, label: "Month" },
  { value: EventCalendarView.WEEK, label: "Week" },
  { value: EventCalendarView.YEAR, label: "Year" },
];

export const EVENT_VIEW_DROPDOWN_OPTIONS = [
  { value: "calendar", label: "Calendar" },
];

export const EVENT_TYPE_LABEL_MAP: Record<EventType, string> = {
  [EventType.WORSHIP_SERVICE]: "Worship Service",
  [EventType.BIRTHDAY]: "Birthday",
  [EventType.MEETING]: "Meeting",
  [EventType.WEDDING_ANNIVERSARY]: "Wedding Anniversary",
  [EventType.OTHER]: "Others",
};

export const EVENT_REMINDER_LABEL_MAP: Record<EventReminderType, string> = {
  [EventReminderType.IN_APP]: "In-App",
  [EventReminderType.EMAIL]: "Email",
  [EventReminderType.SMS]: "SMS",
};

export function getEventTypeMeta(type: EventType) {
  return (
    EVENT_TYPE_OPTIONS.find((option) => option.value === type) ??
    EVENT_TYPE_OPTIONS[0]
  );
}
