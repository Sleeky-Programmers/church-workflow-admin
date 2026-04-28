import {
  EventCalendarView,
  EventRecurrence,
  EventReminderType,
  EventType,
  NotificationType,
  UserRole,
  UserStatus,
  MemberTitle,
  MaritalStatus,
  Gender,
  MembershipStatus,
} from "@/lib/enums";
import { LucideIcon } from "lucide-react";
import { CouponDiscount } from "@/lib/enums";

export type ActivityRow = {
  _id: string;
  adminId: { firstName: string; lastName: string };
  action: string;
  module: string;
  details: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationTypes = {
  _id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  type: NotificationType;
  isRead: boolean;
  iconBg: string;
  iconColor: string;
  date: string;
};

export type ApiNotification = {
  _id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationApiResponse = {
  data: ApiNotification[];
  pagination: {
    page: number;
    limit: number;
    itemCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

export type ActivityLogApiResponse = {
  data: ActivityRow[];
  pagination: {
    page: number;
    limit: number;
    itemCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

export type DepartmentRow = {
  id: string;
  name: string;
  hod: { name: string; initials?: string } | null;
  members: number;
  status: "Active" | "Inactive";
};

export type TeamRow = {
  id: string;
  name: string;
  leader: { name: string; initials?: string } | null;
  members: number;
  status: "Active" | "Inactive";
};

export type Permission =
  | "users.view"
  | "users.invite"
  | "users.edit"
  | "users.suspend"
  | "users.remove"
  | "roles.manage"
  | "members.view"
  | "members.edit"
  | "finance.view"
  | "finance.manage"
  | "departments.manage";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  dateInvited: string | null;
}

export type RoleType = "system" | "custom";

export type RoleStatus = "active" | "disabled";

export type PermissionLevel = "no_access" | "view" | "manage" | "full_access";

export type ModulePermission = {
  module: string;
  level: PermissionLevel;
  options: {
    label: string;
    value: PermissionLevel;
    description: string;
  }[];
};

export type Role = {
  id: string;
  name: string;
  type: RoleType;
  users: number;
  status: RoleStatus;
  description?: string;
};

export type CreateRoleFormData = {
  name: string;
  description?: string;
  permissions: Record<string, PermissionLevel>;
};

export type RoleAction = "view_permissions" | "edit" | "disable" | "enable";

export type PrivacySettings = {
  birthdayCalendar: boolean;
  birthdayReminders: boolean;
  emailAlerts: boolean;
};

export type AccountDeletionStatus = "none" | "scheduled" | "pending";

export type AccountSettings = {
  privacy: PrivacySettings;
  deletionStatus: AccountDeletionStatus;
  deletionDate?: string;
  waitingPeriodDays?: number;
};

export type NotificationSettings = {
  requisitionApprovals: boolean;
  events: boolean;
  birthdays: boolean;
};

export type ServiceType = "regular" | "special";

export type ServiceFrequency = "weekly" | "monthly" | "one-time";

export type Member = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
};

export type AttendanceRecord = {
  serviceId: string;
  date: string;
  presentMembers: string[];
  absentMembers: string[];
  recordedBy: string;
  location?: string;
  startTime: string;
  endTime?: string;
};

export type RegularService = {
  id: string;
  serviceName: string;
  days: string[];
  startTime: string;
  endTime?: string;
  location?: string;
  frequency: "weekly";
  attendanceRecords?: AttendanceRecord[];
};

export type SpecialService = {
  id: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  type: string;
  attendanceRecord?: AttendanceRecord;
};

export type Service = RegularService | SpecialService;

export type CalendarDay = {
  date: Date;
  dateString: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  services: RegularService[];
};

export type AttendanceStatus = "Present" | "Absent";

export type MemberAttendanceRecord = {
  id: string;
  service: string;
  date: string;
  status: AttendanceStatus;
  recordedBy: string;
  time: string;
};

export type MemberProfile = {
  id: string;
  title?: MemberTitle;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  birthday?: string;
  address?: string;
  maritalStatus: MaritalStatus;
  dateOfMarriage?: string;

  membershipStatus: MembershipStatus;
  dateJoined?: string;
  baptized: boolean;
  volunteersPreference: string;

  servicesAttended: number;
  servicesMissed: number;
  attendanceRate: number;

  attendanceRecords: MemberAttendanceRecord[];

  initials: string;
  avatar?: string;
};

export type AddMemberStep1Data = {
  title?: MemberTitle;
  fullName: string;
  gender: Gender;
  birthday?: string;
  maritalStatus: MaritalStatus;
  dateOfMarriage?: string;
};

export type AddMemberStep2Data = {
  email: string;
  phone: string;
  address: string;
  occupation: string;
  education: string;
};

export type AddMemberStep3Data = {
  membershipStatus?: MembershipStatus;
  dateJoined?: string;
  previousChurchMembership?: string;
  baptized: boolean;
  ministriesInvolved?: string;
  volunteersPreference: string;
  smallGroupMember?: "Yes" | "No";
  smallGroupName?: string;
};

export type NewMemberData = AddMemberStep1Data &
  AddMemberStep2Data &
  AddMemberStep3Data;

export type ChurchEvent = {
  id: string;
  title: string;
  type: EventType;
  recurrence: EventRecurrence;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  description?: string;
  sendReminder: boolean;
  reminderType: EventReminderType;
  remindBeforeMinutes: number;
  colorClass: string;
};

export type EventFormData = Omit<ChurchEvent, "id" | "colorClass">;

export type EventTypeOption = {
  value: EventType;
  label: string;
  colorClass: string;
};

export type EventViewOption = {
  value: EventCalendarView;
  label: string;
};

export type SpecialServiceDaySchedule = {
  date: string;
  startTime: string;
  endTime: string;
};

export type SpecialServiceEvent = {
  id: string;
  serviceName: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  recurrence: "none" | "monthly-first-sunday";
  daySchedules: SpecialServiceDaySchedule[];
};

export type CouponData = {
  id: string;
  code: string;
  description: string;
  discountType: string;
  discount: number;
  maxUsage: number;
  usageCount: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type couponPayload = {
  code: string;
  description: string;
  discountType: CouponDiscount;
  discount: number;
  maxUsage: number;
  expiryDate: string;
  isActive?: boolean;
};

export type GetCouponStat = {
  totalCoupons: number;
  activeCoupons: number;
  expiringSoon: number;
  totalUsage: number;
};
