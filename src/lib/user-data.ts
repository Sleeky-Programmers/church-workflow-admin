import { User, ActionItem } from "../types/user";
import { UserStatus } from "./enums";

export const USER_ACTION_ITEMS: ActionItem[] = [
  {
    label: "View details",
    value: "view_details",
    variant: "default",
    showFor: ["active", "pending", "suspended"],
  },
  {
    label: "Change role",
    value: "change_role",
    variant: "default",
    showFor: ["active", "pending", "suspended"],
  },
  {
    label: "Resend Invite",
    value: "resend_invite",
    variant: "primary",
    showFor: ["pending"],
  },
  {
    label: "Delete invitation",
    value: "delete_invitation",
    variant: "default",
    showFor: ["pending"],
  },
  {
    label: "Suspend",
    value: "suspend",
    variant: "warning",
    showFor: ["active"],
  },
  {
    label: "Restore",
    value: "restore",
    variant: "default",
    showFor: ["suspended"],
  },
  {
    label: "Remove",
    value: "remove",
    variant: "danger",
    showFor: ["active", "pending", "suspended"],
  },
];

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: UserStatus.ACTIVE,
    dateInvited: "May 25, 2025 – 8AM",
  },
  {
    id: "2",
    name: "Sister Mary",
    email: "mary@yoursite.org",
    role: "Finance",
    status: UserStatus.PENDING,
    dateInvited: "May 24, 2025 – 2PM",
  },
  {
    id: "3",
    name: "Pastor James",
    email: "pastor@church.com",
    role: "Pastor",
    status: UserStatus.SUSPENDED,
    dateInvited: "-",
  },
];
