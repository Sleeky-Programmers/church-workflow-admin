export enum DepartmentTabs {
  MEMBERS = "MEMBERS",
  REQUISITIONS = "REQUISITIONS",
}

export enum RequisitionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

export enum NotificationType {
  REQUISITION = "REQUISITION",
  MESSAGE = "MESSAGE",
  ROLE_UPDATE = "ROLE_UPDATE",
  BIRTHDAY = "BIRTHDAY",
  SUBSCRIPTION = "SUBSCRIPTION",
  MEMBER = "MEMBER",
  FINANCE = "FINANCE",
}

export enum CouponFilter {
  ALL = "all",
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

export enum ChurchPlanFilter {
  ALL = "all",
  ENTERPRISE = "Enterprise",
  GROWTH = "Growth",
  STARTER = "Starter",
}

export enum ChurchSearchFilter {
  BOTH = "Both",
  CHURCH = "Church",
  ADMIN = "Admin",
}

export enum ChurchFilter {
  ALL = "all",
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

export enum CouponDiscount {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
}

export enum AdminOption {
  SUSPEND = "SUSPEND",
  RESTORE = "RESTORE",
}

export enum PlanType {
  STARTER = "STARTER",
  GROWTH = "GROWTH",
  EXPANSION = "EXPANSION",
  ENTERPRISE = "ENTERPRISE",
}

export enum ChurchSubscriptionStatus {
  ACTIVE = "Active",
  OVERDUE = "Overdue",
  EXPIRING_SOON = "Expiring soon",
}

export enum ActivityDetailLabel {
  ACTION = "Action",
  BY = "By",
  MODULE = "Module",
  AFFECTED_RECORD = "Affected Record",
  STATUS = "Status",
  TRIGGERED_FROM = "Triggered From",
  DETAILS = "Details",
}

export enum HtmlInputElementTypes {
  INPUT = "INPUT",
  SELECT = "SELECT",
  TEXTAREA = "TEXTAREA",
}

export enum SignUpStep {
  SIGNUP = "SIGNUP",
  VERIFY_OTP = "VERIFY_OTP",
}

export enum EventCategory {
  GENERAL = "GENERAL",
  LEADERSHIP = "LEADERSHIP",
  SPECIAL = "SPECIAL",
}

export enum ActiveTab {
  FAVOURITES = "favourites",
  RECENT = "recent",
}

export enum UserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

export enum UserRole {
  ADMIN = "Admin",
  FINANCE = "Finance",
  PASTOR = "Pastor",
  MEMBER = "Member",
}

export enum EventType {
  WORSHIP_SERVICE = "WORSHIP_SERVICE",
  BIRTHDAY = "BIRTHDAY",
  MEETING = "MEETING",
  WEDDING_ANNIVERSARY = "WEDDING_ANNIVERSARY",
  OTHER = "OTHER",
}

export enum EventRecurrence {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
  WEEKDAYS = "WEEKDAYS",
}

export enum EventReminderType {
  IN_APP = "IN_APP",
  EMAIL = "EMAIL",
  SMS = "SMS",
}

export enum EventCalendarView {
  MONTH = "month",
  WEEK = "week",
  YEAR = "year",
}

export enum ServiceType {
  REGULAR = "regular",
  SPECIAL = "special",
}

export enum ServiceFrequency {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export enum TeamStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export enum MemberTitle {
  MR = "MR.",
  MRS = "MRS.",
  MISS = "MISS",
  DR = "DR.",
  PASTOR = "PASTOR.",
  REV = "REV.",
}

export enum MemberFormType {
  CSV = "csv",
  FORM = "form",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum MaritalStatus {
  MARRIED = "MARRIED",
  SINGLE = "SINGLE",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}

export enum MembershipStatus {
  VISITOR = "VISITOR",
  MEMBER = "MEMBER",
  VOLUNTEER = "VOLUNTEER",
  WORKER = "WORKER",
  LEADER = "LEADER",
  CONVERT = "NEW CONVERT",
}

export enum BillingCycle {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum ProductAdminStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum ChurchStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}
