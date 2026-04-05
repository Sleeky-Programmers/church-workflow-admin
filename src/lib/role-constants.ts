import { ModulePermission, Role } from "@/types";

export const frontendToBackendModule: Record<string, string> = {
  "Members Module": "MEMBERS",
  "Finance Module (Giving Records)": "GIVING",
  "Finance Module (Giving & Expenses Record)": "GIVING_AND_EXPENSES",
  "Requests Module": "REQUESTS",
  "Events Module": "EVENTS",
  "Departments Module": "DEPARTMENTS",
  "Attendance Module": "ATTENDANCE",
};

export const backendToFrontendModule: Record<string, string> =
  Object.fromEntries(
    Object.entries(frontendToBackendModule).map(([k, v]) => [v, k]),
  );

export const MODULE_PERMISSIONS: ModulePermission[] = [
  {
    module: "Members Module",
    level: "no_access",
    options: [
      {
        label: "No Access",
        value: "no_access",
        description: "",
      },
      {
        label: "View",
        value: "view",
        description: "View members",
      },
      {
        label: "Manage",
        value: "manage",
        description: "Add / Edit members",
      },
      {
        label: "Full Access",
        value: "full_access",
        description: "Add / Edit / Delete / Upload",
      },
    ],
  },
  {
    module: "Finance Module (Giving Records)",
    level: "no_access",
    options: [
      {
        label: "No Access",
        value: "no_access",
        description: "",
      },
      {
        label: "View",
        value: "view",
        description: "View finance dashboard & reports",
      },
      {
        label: "Manage",
        value: "manage",
        description: "Add giving records",
      },
      {
        label: "Full Access",
        value: "full_access",
        description: "Add giving records, approvals & exports",
      },
    ],
  },
  {
    module: "Finance Module (Giving & Expenses Record)",
    level: "no_access",
    options: [
      {
        label: "No Access",
        value: "no_access",
        description: "",
      },
      {
        label: "View",
        value: "view",
        description: "View finance dashboard & reports",
      },
      {
        label: "Manage",
        value: "manage",
        description: "Add giving & view expenses records",
      },
      {
        label: "Full Access",
        value: "full_access",
        description:
          "Add giving records, expenses records, approvals & exports",
      },
    ],
  },
  {
    module: "Requests Module",
    level: "no_access",
    options: [
      {
        label: "No Access",
        value: "no_access",
        description: "",
      },
      {
        label: "View",
        value: "view",
        description: "View requests",
      },
      {
        label: "Manage",
        value: "manage",
        description: "Create & edit",
      },
      {
        label: "Full Access",
        value: "full_access",
        description: "Approve / Reject / Delete",
      },
    ],
  },
  {
    module: "Events Module",
    level: "no_access",
    options: [
      {
        label: "No Access",
        value: "no_access",
        description: "",
      },
      {
        label: "View",
        value: "view",
        description: "View events",
      },
      {
        label: "Manage",
        value: "manage",
        description: "Create / Edit",
      },
      {
        label: "Full Access",
        value: "full_access",
        description: "Delete / Recurring services",
      },
    ],
  },
  {
    module: "Departments Module",
    level: "no_access",
    options: [
      {
        label: "No Access",
        value: "no_access",
        description: "",
      },
      {
        label: "View",
        value: "view",
        description: "View departments",
      },
      {
        label: "Manage",
        value: "manage",
        description: "Assign members",
      },
      {
        label: "Full Access",
        value: "full_access",
        description: "Create / Edit / Assign HOD",
      },
    ],
  },
  {
    module: "Attendance Module",
    level: "no_access",
    options: [
      {
        label: "No Access",
        value: "no_access",
        description: "",
      },
      {
        label: "View",
        value: "view",
        description: "View attendance",
      },
      {
        label: "Manage",
        value: "manage",
        description: "Record attendance",
      },
      {
        label: "Full Access",
        value: "full_access",
        description: "Edit / Export",
      },
    ],
  },
];
