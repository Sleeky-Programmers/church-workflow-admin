export interface ChurchUI {
  id: string;
  name: string;
  initials: string;
  initBg: string;
  initColor: string;
  location: string;
  members: number;
  userCount: number;
  plan: string;
  status: "active" | "expiring" | "overdue";
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const mapStatus = (status: string): ChurchUI["status"] => {
  if (status.toLowerCase().includes("expiring")) return "expiring";
  if (
    status.toLowerCase().includes("overdue") ||
    status.toLowerCase().includes("expired")
  )
    return "overdue";
  return "active";
};
