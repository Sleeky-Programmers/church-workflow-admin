import { RolePermissions, PendingInvite } from "../types/user";

export const ROLE_PERMISSIONS: Record<string, RolePermissions> = {
  Admin: {
    role: "Admin",
    description: "Admin can do everything apart from inviting a new user.",
    permissions: [
      {
        module: "Members Module",
        level: "full_access",
        description: "Full Access → Add / Edit / Delete / Upload",
      },
      {
        module: "Finance Module",
        level: "full_access",
        description: "Full Access → Add giving, expenses, approvals & exports",
      },
      {
        module: "Requests Module",
        level: "manage",
        description: "Manage → Create & edit own",
      },
    ],
  },
  Finance: {
    role: "Finance",
    description: "Finance role has access to financial data and reports.",
    permissions: [
      {
        module: "Members Module",
        level: "view",
        description: "View → View members",
      },
      {
        module: "Finance Module",
        level: "full_access",
        description:
          "Full Access → View finance dashboard & reports, Add giving, expenses, approvals & exports",
      },
      {
        module: "Requests Module",
        level: "view",
        description: "View → View requests",
      },
    ],
  },
  Pastor: {
    role: "Pastor",
    description: "Pastor role has access to member management.",
    permissions: [
      {
        module: "Members Module",
        level: "manage",
        description: "Manage → Add / Edit members",
      },
      {
        module: "Finance Module",
        level: "view",
        description: "View → View finance dashboard & reports",
      },
      {
        module: "Requests Module",
        level: "manage",
        description: "Manage → Create & edit own",
      },
    ],
  },
  Member: {
    role: "Member",
    description: "Member has limited access to the platform.",
    permissions: [
      {
        module: "Members Module",
        level: "view",
        description: "View → View members",
      },
      {
        module: "Finance Module",
        level: "no_access",
        description: "No Access",
      },
      {
        module: "Requests Module",
        level: "view",
        description: "View → View requests",
      },
    ],
  },
};

export const MOCK_PENDING_INVITES: PendingInvite[] = [
  {
    id: "inv-1",
    name: "John Ade",
    email: "john@example.com",
    role: "Pastor",
    status: "pending",
  },
  {
    id: "inv-2",
    name: "Jane Faith",
    email: "pastorfaith@example.com",
    role: "Pastor",
    status: "pending",
  },
];

export const TITLE_OPTIONS = [
  "Mr",
  "Mrs",
  "Miss",
  "Ms",
  "Dr",
  "Prof",
  "Rev",
  "Pastor",
];

export const ROLE_OPTIONS = ["Admin", "Finance", "Pastor", "Member"];
