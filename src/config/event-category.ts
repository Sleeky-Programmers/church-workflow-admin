import { EventCategory } from "@/lib/enums";

export const EVENT_CATEGORY_CONFIG = {
  [EventCategory.GENERAL]: {
    label: "Service",
    dotClass: "bg-primary",
  },
  [EventCategory.LEADERSHIP]: {
    label: "Leadership",
    dotClass: "bg-secondary",
  },
  [EventCategory.SPECIAL]: {
    label: "Special",
    dotClass: "bg-destructive",
  },
};
