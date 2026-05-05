import { PlanType } from "@/lib/enums";

export function formatDate(isoDate?: string): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function normalizePlan(plan?: string) {
  if (!plan) return "Starter";

  switch (plan.toUpperCase()) {
    case "ENTERPRISE":
      return "Enterprise";
    case "GROWTH":
      return "Growth";
    case "EXPANSION":
      return "Expansion";
    case "STARTER":
      return "Starter";
    default:
      return "Starter";
  }
}

export function normalizeStatus(status?: string) {
  if (!status) return "active";

  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "EXPIRING_SOON":
      return "expiring";
    case "OVERDUE":
      return "overdue";
    default:
      return "active";
  }
}
