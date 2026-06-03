import { getInitials } from '@/lib/utils';
import { ActivityLogApiResponse, Member, NotificationApiResponse, RegularService } from '@/types';
import {
	AdminRegisterPayload,
	AdminRegisterResponse,
	AttendanceStatsResponse,
	CreateChurchPayload,
	CreateWeeklyServicePayload,
	GoogleAuthResponse,
	LoginPayload,
	LoginResponse,
	ResetPasswordPayload,
	ResetPasswordResponse,
	SignupPayload,
	VerifyOtpPayload,
	VerifyOtpResponse,
} from '@/types/payload';
import { InviteFormData, PendingInvite, User, UserAction } from '@/types/user';

import { MOCK_ADMIN } from '../data';
import { MOCK_USERS } from '../user-data';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authenticatedFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const token = localStorage.getItem('accessToken');
	if (!token) throw new Error('No authentication token');

	const isFormData = options.body instanceof FormData;

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			...(isFormData ? {} : { 'Content-Type': 'application/json' }),
			...options.headers,
		},
	});

	if (response.status === 401) {
		try {
			const refreshData = await refreshAuthToken();
			localStorage.setItem('accessToken', refreshData.accessToken);
			if (refreshData.refreshToken) {
				localStorage.setItem('refreshToken', refreshData.refreshToken);
			}

			const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
				...options,
				headers: {
					Authorization: `Bearer ${refreshData.accessToken}`,
					...(isFormData ? {} : { 'Content-Type': 'application/json' }),
					...options.headers,
				},
			});

			if (!retryResponse.ok) {
				throw new Error('Retry failed');
			}
			return retryResponse.json();
		} catch (err) {
			console.log(err);
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');

			if (!window.location.pathname.includes('/auth/login')) {
				window.location.href = '/auth/login';
			}

			throw err;
		}
	}

	const text = await response.text();
	let data: unknown = null;
	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			data = text;
		}
	}

	if (!response.ok) {
		const message = typeof data === 'object' && data && 'message' in data ? String((data as { message?: unknown }).message || 'Request failed') : 'Request failed';
		const error: any = new Error(message);
		error.response = { status: response.status };
		error.status = response.status;
		throw error;
	}

	return data as T;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit): Promise<T> {
	const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token && { Authorization: `Bearer ${token}` }),
			...options.headers,
		},
	});

	const text = await response.text();
	let data: unknown = null;
	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			data = text;
		}
	}

	if (response.status === 401) {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('accessToken');
			if (!window.location.pathname.includes('/auth/login')) {
				window.location.href = '/auth/login';
			}
		}
		const message = typeof data === 'object' && data && 'message' in data ? String((data as { message?: unknown }).message || 'Unauthorized') : 'Unauthorized';
		const error: any = new Error(message);
		error.response = { status: 401, data };
		error.status = 401;
		throw error;
	}

	if (!response.ok) {
		const message =
			typeof data === 'object' && data && 'message' in data ? String((data as { message?: unknown }).message || 'Request failed') : text || 'Request failed';
		const error: any = new Error(message);
		error.response = { status: response.status, data };
		error.status = response.status;
		throw error;
	}

	return (data ?? null) as T;
}

export function signup(payload: SignupPayload) {
	return apiFetch('/auth/register', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export function adminRegister(token: string, payload: AdminRegisterPayload) {
	const query = token ? `?token=${encodeURIComponent(token)}` : '';
	return apiFetch<AdminRegisterResponse>(`/auth/admin-register${query}`, {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function verifyOtp(payload: VerifyOtpPayload) {
	return apiFetch<VerifyOtpResponse>('/auth/verify-otp', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function resendOtp(email: string) {
	return apiFetch<{ message: string }>('/auth/request-otp', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

export async function login(payload: LoginPayload) {
	return apiFetch<LoginResponse>('/product-admin/login', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function googleAuth(idToken: string, token?: string) {
	const query = token ? `?token=${encodeURIComponent(token)}` : '';

	return apiFetch<GoogleAuthResponse>(`/auth/google${query}`, {
		method: 'POST',
		body: JSON.stringify({ idToken }),
	});
}

export async function requestOtp(email: string) {
	return apiFetch<{ message: string }>('/auth/request-otp', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

export async function resetPassword(payload: ResetPasswordPayload) {
	return apiFetch<ResetPasswordResponse>('/auth/reset-password', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function getCurrentUser() {
	const token = localStorage.getItem('accessToken');
	if (!token) throw new Error('No auth token');

	return apiFetch<any>('/admin', {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` },
	});
}

export async function createChurch(payload: CreateChurchPayload, logoFile?: File | null) {
	const formData = new FormData();

	if (logoFile) {
		formData.append('file', logoFile);
	}
	formData.append('name', payload.name);
	formData.append('alias', payload.alias || '');
	formData.append('address', payload.address);
	formData.append('country', payload.country);
	formData.append('state', payload.state || '');
	formData.append('defaultCurrency', payload.defaultCurrency);
	formData.append('timeZone', payload.timeZone);
	return authenticatedFetch('/church', {
		method: 'POST',
		body: formData,
	});
}

export async function getMyChurch() {
	return await authenticatedFetch<any>('/church/admin/me', {
		method: 'GET',
	});
}

export async function createWeeklyService(payload: CreateWeeklyServicePayload) {
	return authenticatedFetch('/church-services', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function uploadMembersCsv(file: File) {
	const token = localStorage.getItem('accessToken');

	if (!token) {
		throw new Error('Unauthorized');
	}

	const formData = new FormData();
	formData.append('file', file);

	const response = await fetch(`${BASE_URL}/members/csv/create`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text();
		try {
			const parsed = JSON.parse(text) as {
				message?: string | string[];
			};
			const message = Array.isArray(parsed.message) ? parsed.message.join(', ') : parsed.message;
			throw new Error(message || 'Members upload failed');
		} catch {
			throw new Error(text || 'Members upload failed');
		}
	}

	return response.json();
}

export async function fetchUsers(): Promise<User[]> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(MOCK_USERS);
		}, 500);
	});
}

export async function fetchUserById(userId: string): Promise<User | null> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const user = MOCK_USERS.find((u) => u.id === userId);
			resolve(user || null);
		}, 300);
	});
}
export async function inviteUser(data: { email: string; role: string }): Promise<{ success: boolean; message: string }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: true,
				message: 'Invitation sent successfully',
			});
		}, 500);
	});
}

export async function fetchPendingInvites(): Promise<PendingInvite[]> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([]);
		}, 300);
	});
}
export async function performUserAction(userId: string, action: UserAction, additionalData?: Record<string, unknown>): Promise<{ success: boolean; message: string }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const messages: Record<UserAction, string> = {
				view_details: 'User details loaded',
				change_role: 'User role updated successfully',
				resend_invite: 'Invitation resent successfully',
				delete_invitation: 'Invitation deleted successfully',
				suspend: 'User suspended successfully',
				restore: 'User restored successfully',
				remove: 'User removed successfully',
			};

			resolve({
				success: true,
				message: messages[action] || 'Action completed',
			});
		}, 500);
	});
}

export async function sendInvitation(data: InviteFormData): Promise<{ success: boolean; message: string }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: true,
				message: 'Invitation sent successfully',
			});
		}, 500);
	});
}

type ChurchServiceApi = {
	_id: string;
	serviceName: string;
	type: 'REGULAR' | 'SPECIAL';
	day?: string;
	startTime: string;
	endTime?: string;
	location?: string;
	startDate?: string;
	endDate?: string;
	description?: string;
	specialDays?: { date: string; startTime: string; endTime?: string }[];
};

type PaginatedResponse<T> = {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
};

const SERVICE_DAY_MAP: Record<string, string> = {
	SUNDAY: 'Sunday',
	MONDAY: 'Monday',
	TUESDAY: 'Tuesday',
	WEDNESDAY: 'Wednesday',
	THURSDAY: 'Thursday',
	FRIDAY: 'Friday',
	SATURDAY: 'Saturday',
};

const DAY_NAME_ALIASES: Record<string, string> = {
	SUNDAY: 'Sunday',
	SUN: 'Sunday',
	SUNDAYFULL: 'Sunday',
	MONDAY: 'Monday',
	MON: 'Monday',
	TUESDAY: 'Tuesday',
	TUE: 'Tuesday',
	TUES: 'Tuesday',
	WEDNESDAY: 'Wednesday',
	WED: 'Wednesday',
	THURSDAY: 'Thursday',
	THU: 'Thursday',
	THUR: 'Thursday',
	THURS: 'Thursday',
	FRIDAY: 'Friday',
	FRI: 'Friday',
	SATURDAY: 'Saturday',
	SAT: 'Saturday',
};

function normalizeDayName(value?: string): string | undefined {
	if (!value) return undefined;
	const trimmed = value.trim();
	if (!trimmed) return undefined;

	const upper = trimmed.toUpperCase();
	if (SERVICE_DAY_MAP[upper]) return SERVICE_DAY_MAP[upper];
	if (DAY_NAME_ALIASES[upper]) return DAY_NAME_ALIASES[upper];

	const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
	if (Object.values(SERVICE_DAY_MAP).includes(capitalized)) {
		return capitalized;
	}

	return undefined;
}

export function getRefreshToken(): string | null {
	if (typeof window === 'undefined') {
		return null;
	}
	return localStorage.getItem('refreshToken');
}

export async function refreshAuthToken() {
	const refreshToken = getRefreshToken();

	if (!refreshToken) {
		throw new Error('No refresh token');
	}

	const response = await fetch(`${BASE_URL}/product-admin/refresh-token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ refreshToken }),
	});

	if (!response.ok) {
		throw new Error('Refresh failed');
	}

	return response.json();
}

function mapChurchServiceToRegular(service: ChurchServiceApi): RegularService {
	const dayName = normalizeDayName(service.day);
	const daysFromArray = Array.isArray((service as any).days) ? (service as any).days.map((day: string) => normalizeDayName(day)).filter(Boolean) : [];

	const days = dayName && daysFromArray.length === 0 ? [dayName] : daysFromArray;
	return {
		id: service._id,
		serviceName: service.serviceName,
		days,
		startTime: service.startTime,
		endTime: service.endTime,
		location: service.location,
		frequency: 'weekly',
		attendanceRecords: [],
	};
}

export async function fetchServices(_month: string): Promise<RegularService[]> {
	const response = await authenticatedFetch<PaginatedResponse<ChurchServiceApi>>('/church-services?page=1&limit=100', { method: 'GET' });

	return (response.data || []).filter((service) => typeof service.type === 'string' && service.type.toUpperCase() === 'REGULAR').map(mapChurchServiceToRegular);
}

export async function fetchTotalMembers(): Promise<{
	totalMembers: number;
	growth: string;
}> {
	const res = await apiFetch<any>('/members/stats', { method: 'GET' });
	return { totalMembers: res.totalMembers || 0, growth: res.growth || '0%' };
}

export async function fetchAttendanceStats(): Promise<AttendanceStatsResponse> {
	return authenticatedFetch<AttendanceStatsResponse>('/attendance/stats', {
		method: 'GET',
	});
}

export async function fetchMembers(
	page: number = 1,
	limit: number = 10,
	search: string = ''
): Promise<{
	members: Member[];
	total: number;
	pages: number;
}> {
	const query = new URLSearchParams({
		page: String(page),
		limit: String(limit),
		...(search ? { search } : {}),
	});

	const response = await authenticatedFetch<
		PaginatedResponse<{
			_id: string;
			fullName: string;
			email?: string;
			gender?: string;
		}>
	>(`/members?${query.toString()}`, { method: 'GET' });

	const members =
		response.data?.map((member) => ({
			id: member._id,
			name: member.fullName,
			email: member.email || '',
			initials: getInitials(member.fullName || ''),
			gender: member.gender,
		})) || [];

	return {
		members,
		total: response.pagination?.itemCount || 0,
		pages: response.pagination?.totalPages || 1,
	};
}

type RawAttendanceApiRecord = {
	_id: string;
	churchServiceId: string;
	date: string;
	memberId?: string;
	recordedBy?: string;
};

type AttendanceApiRecord = {
	attendees: string[];
	recordedBy: string;
};

export type AttendanceApiResult = {
	attendance: AttendanceApiRecord | null;
	stats: {
		present: { male: number; female: number; total: number };
		absent: { male: number; female: number; total: number };
	} | null;
};

export async function getAttendanceRecord(serviceId: string, date: string): Promise<AttendanceApiResult> {
	const query = new URLSearchParams({
		serviceId,
		date,
	});

	const raw = await authenticatedFetch<{
		attendance: RawAttendanceApiRecord[] | null;
		stats: AttendanceApiResult['stats'];
	}>(`/attendance?${query.toString()}`, { method: 'GET' });

	if (!raw.attendance || raw.attendance.length === 0) {
		return { attendance: null, stats: raw.stats || null };
	}

	return {
		attendance: {
			attendees: raw.attendance.map((record) => record.memberId).filter((id): id is string => Boolean(id)),
			recordedBy: raw.attendance[0]?.recordedBy || '',
		},
		stats: raw.stats || null,
	};
}
export async function saveAttendance(data: { serviceId: string; date: string; presentMembers: string[] }): Promise<{ message: string }> {
	const query = new URLSearchParams({
		serviceId: data.serviceId,
	});

	return authenticatedFetch<{ message: string }>(`/attendance/mark?${query.toString()}`, {
		method: 'POST',
		body: JSON.stringify({
			date: data.date,
			memberIds: data.presentMembers,
		}),
	});
}

export async function saveAbsentAttendance(data: { serviceId: string; date: string; absentMembers: string[] }): Promise<{ message: string }> {
	if (!data.absentMembers || data.absentMembers.length === 0) {
		return { message: 'No absent members to save' };
	}

	const query = new URLSearchParams({ serviceId: data.serviceId });

	return authenticatedFetch<{ message: string }>(`/attendance/mark-absent?${query.toString()}`, {
		method: 'POST',
		body: JSON.stringify({
			date: data.date,
			memberIds: data.absentMembers,
		}),
	});
}
type SmallTeamMemberApi = {
	id: string;
	fullName: string;
	email: string;
};

type SmallTeamApi = {
	_id: string;
	name: string;
	status: 'ACTIVE' | 'INACTIVE';
	description: string;
	leader: {
		id: string;
		fullName: string;
	} | null;
	members: SmallTeamMemberApi[];
	membersCount: number;
	createdAt: string;
	updatedAt: string;
};

export type SmallTeamListResponse = {
	data: SmallTeamApi[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
};

export async function fetchSmallTeams(page: number = 1, limit: number = 100, search: string = ''): Promise<SmallTeamListResponse> {
	const query = new URLSearchParams({
		page: String(page),
		limit: String(limit),
		...(search ? { search } : {}),
	});

	return authenticatedFetch<SmallTeamListResponse>(`/small-teams?${query.toString()}`, { method: 'GET' });
}

export async function createSmallTeam(payload: {
	name: string;
	leaderId?: string;
	memberIds: string[];
	status: 'ACTIVE' | 'INACTIVE';
	description?: string;
}): Promise<SmallTeamApi> {
	return authenticatedFetch<SmallTeamApi>('/small-teams', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function updateSmallTeam(payload: {
	teamId: string;
	name?: string;
	leaderId?: string;
	memberIds?: string[];
	status?: 'ACTIVE' | 'INACTIVE';
	description?: string;
}): Promise<SmallTeamApi> {
	const { teamId, ...body } = payload;
	return authenticatedFetch<SmallTeamApi>(`/small-teams/${teamId}`, {
		method: 'PUT',
		body: JSON.stringify(body),
	});
}

export async function updateSmallTeamMembers(teamId: string, memberIds: string[]): Promise<SmallTeamApi> {
	return authenticatedFetch<SmallTeamApi>(`/small-teams/${teamId}/members`, {
		method: 'PUT',
		body: JSON.stringify({ memberIds }),
	});
}

export async function deleteSmallTeam(teamId: string): Promise<{ message: string }> {
	return authenticatedFetch<{ message: string }>(`/small-teams/${teamId}`, {
		method: 'DELETE',
	});
}

export async function markSmallTeamAttendance(payload: { teamId: string; serviceId: string; date: string; memberIds: string[] }): Promise<{
	message: string;
	presentCount: number;
	totalTeamMembers: number;
}> {
	const { teamId, serviceId, date, memberIds } = payload;
	const query = new URLSearchParams({ serviceId });
	return authenticatedFetch(`/small-teams/${teamId}/attendance?${query.toString()}`, {
		method: 'POST',
		body: JSON.stringify({ date, memberIds }),
	});
}

export type SmallTeamReportResponse = {
	team: SmallTeamApi;
	attendancePercentage: number;
	sessions: number;
	lowAttendanceMembers: {
		id: string;
		fullName: string;
		email: string;
		presentCount: number;
		sessions: number;
		attendancePercentage: number;
	}[];
};

export async function fetchSmallTeamReport(
	teamId: string,
	params?: {
		from?: string;
		to?: string;
		lowAttendanceThreshold?: number;
	}
): Promise<SmallTeamReportResponse> {
	const query = new URLSearchParams();
	if (params?.from) query.set('from', params.from);
	if (params?.to) query.set('to', params.to);
	if (typeof params?.lowAttendanceThreshold === 'number') {
		query.set('lowAttendanceThreshold', String(params.lowAttendanceThreshold));
	}

	const suffix = query.toString() ? `?${query.toString()}` : '';
	return authenticatedFetch<SmallTeamReportResponse>(`/small-teams/${teamId}/report${suffix}`, { method: 'GET' });
}

export type MemberAttendanceHistoryResponse = {
	memberId: string;
	records: {
		id: string;
		service: string;
		date: string;
		status: 'Present' | 'Absent';
		recordedBy: string;
		time: string;
	}[];
	stats: {
		attended: number;
		missed: number;
		total: number;
		rate: number;
	};
	trends: {
		month: string;
		attended: number;
		total: number;
		rate: number;
	}[];
};

export async function fetchMemberAttendanceHistory(memberId: string, params?: { from?: string; to?: string }): Promise<MemberAttendanceHistoryResponse> {
	const query = new URLSearchParams();
	if (params?.from) query.set('from', params.from);
	if (params?.to) query.set('to', params.to);
	const suffix = query.toString() ? `?${query.toString()}` : '';

	return authenticatedFetch<MemberAttendanceHistoryResponse>(`/attendance/member/${memberId}${suffix}`, { method: 'GET' });
}

export function getCurrentAdmin() {
	return MOCK_ADMIN;
}

export async function fetchNotifications(): Promise<NotificationApiResponse> {
	return await apiFetch('/notifications', {
		method: 'GET',
	});
}

export async function markNotificationAsRead(notificationId: string) {
	return await apiFetch(`/notifications/${notificationId}/read`, {
		method: 'PUT',
	});
}

export async function markAllNotificationsAsRead() {
	return await apiFetch('/notifications/read-all', {
		method: 'PUT',
	});
}

export async function fetchActivityLogs(): Promise<ActivityLogApiResponse> {
	return await apiFetch('/activity-log', {
		method: 'GET',
	});
}
