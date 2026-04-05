export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AdminRegisterPayload {
  firstName: string;
  lastName: string;
  password: string;
}

export interface AdminRegisterResponse {
  message: string;
  accessToken: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: number;
}

export interface VerifyOtpResponse {
  message: string;
  accessToken: string;
}

export interface AttendanceStatsResponse {
  totalAttendance: number;
  attendanceGrowth?: string;
  monthlyAttendanceTrends?: {
    month: string;
    thisMonth: number;
    lastMonth: number;
  }[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUserSummary {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  churchId?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUserSummary;
}

export interface GoogleAuthPayload {
  idToken: string;
}

export interface GoogleAuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user?: AuthUserSummary;
}

export interface ChurchResponse {
  _id: string;
  name: string;
  alias?: string;
  address: string;
  country: string;
  state?: string;
  defaultCurrency: string;
  timeZone: string;
  logoUrl?: string;
  logoPublicId?: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface CreateChurchPayload {
  name: string;
  alias?: string;
  address: string;
  country: string;
  state: string;
  defaultCurrency: string;
  timeZone: string;
}

export interface CreateWeeklyServicePayload {
  serviceName: string;
  type: "REGULAR" | "SPECIAL";
  day: string;
  startTime: string;
  endTime: string;
  location?: string;
}
