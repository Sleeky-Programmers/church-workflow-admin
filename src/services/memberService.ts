import { authenticatedFetch } from '@/lib/api';
import { mapMember } from '@/mappers/member.mapper';
import { MemberProfile, NewMemberData } from '@/types';

export interface FetchMembersResponse {
	data: MemberProfile[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

function normalizeMemberPayload(data: Partial<NewMemberData>) {
	return {
		title: data.title || undefined,
		fullName: data.fullName,
		email: data.email || undefined,
		phoneNumber: data.phone || undefined,
		gender: data.gender,
		birthday: data.birthday || undefined,
		maritalStatus: data.maritalStatus,
		dateOfMarriage: data.dateOfMarriage || undefined,
		occupation: data.occupation || undefined,
		address: data.address || undefined,
		educationalBackground: data.education || undefined,
		membershipStatus: data.membershipStatus,
		dateJoined: data.dateJoined || undefined,
		previousChurchMembership: data.previousChurchMembership || undefined,
		isBaptized: data.baptized,
		ministries: data.ministriesInvolved || undefined,
		volunteerPreferences: data.volunteersPreference || undefined,
		cellGroupName: data.smallGroupMember === 'Yes' ? data.smallGroupName || undefined : undefined,
	};
}

export async function fetchMembers(page = 1, limit = 10, search?: string, filter?: string): Promise<FetchMembersResponse> {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});

	if (search) {
		params.append('search', search);
	}
	if (filter && filter !== 'all') {
		params.append('filter', filter);
	}

	const response = await authenticatedFetch<FetchMembersResponse>(`/members?${params}`, {
		method: 'GET',
	});

	return {
		data: response.data.map(mapMember),
		pagination: response.pagination,
	};
}

export async function createMember(data: NewMemberData) {
	const payload = normalizeMemberPayload(data);

	const response = await authenticatedFetch<any>('/members/add', {
		method: 'POST',
		body: JSON.stringify(payload),
	});

	return mapMember(response);
}

export async function updateMember(id: string, data: Partial<NewMemberData>) {
	const payload = normalizeMemberPayload(data);

	const response = await authenticatedFetch<any>(`/members/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload),
	});

	return mapMember(response);
}

export async function uploadMembersCsv(file: File) {
	const formData = new FormData();
	formData.append('file', file);

	return authenticatedFetch('/members/csv/create', {
		method: 'POST',
		body: formData,
	});
}

export interface MemberManagementFilters {
	page?: number;
	limit?: number;
	churchId?: string;
	status?: boolean; // true = active, false = inactive, undefined = all
	membershipStatus?: string;
	role?: string;
	search?: string;
}

export interface MemberManagementData {
	id: string;
	name: string;
	email: string;
	phone: string;
	membershipStatus: string;
	role: string;
	isActive: boolean;
	lastActive: string;
	churchId?: string;
	churchName?: string;
	churchInitials?: string;
	churchInitBg?: string;
	churchInitColor?: string;
	dateJoined?: string;
	gender?: string;
	createdAt: string;
}

export interface ChurchOption {
	id: string;
	name: string;
}

export interface MemberManagementResponse {
	success: boolean;
	data: MemberManagementData[];
	churches: ChurchOption[];
	pagination: {
		page: number;
		limit: number;
		totalCount: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface MemberStatsResponse {
	success: boolean;
	totalMembers: number;
	activeMembers: number;
	inactiveMembers: number;
	newMembersLast30Days: number;
	membersByChurch: Array<{
		churchName: string;
		count: number;
	}>;
	membersByStatus: Array<{
		status: string;
		count: number;
	}>;
	genderDistribution: Array<{
		gender: string;
		count: number;
	}>;
}

export interface MemberAttendanceStats {
	attendanceRate: number;
	totalServicesAttended: number;
	totalServicesMissed: number;
	totalEvaluated: number;
}

export interface RecentAttendance {
	date: string;
	status: string;
	serviceTitle: string;
	serviceType: string;
	recordedBy: string;
}

export interface MemberChurch {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
}

export interface MemberDetailsResponse {
	success: boolean;
	member: {
		id: string;
		name: string;
		email: string;
		phone: string;
		gender: string;
		title: string | null;
		birthday: string | null;
		maritalStatus: string | null;
		dateOfMarriage: string | null;
		occupation: string | null;
		educationalBackground: string | null;
		address: string | null;
		membershipStatus: string | null;
		isActive: boolean;
		dateJoined: string | null;
		previousChurchMembership: string | null;
		isBaptized: boolean | null;
		ministries: string | null;
		volunteerPreferences: string | null;
		cellGroupName: string | null;
		createdAt: string;
		updatedAt: string;
		church: MemberChurch | null;
		stats: MemberAttendanceStats;
		recentAttendance: RecentAttendance[];
	};
}

/**
 * Fetch all members for management (with pagination and filters)
 */
export async function fetchMembersForManagement(filters: MemberManagementFilters = {}): Promise<MemberManagementResponse> {
	const params = new URLSearchParams();

	if (filters.page) params.append('page', String(filters.page));
	if (filters.limit) params.append('limit', String(filters.limit));
	if (filters.churchId && filters.churchId !== 'all') params.append('churchId', filters.churchId);
	if (filters.status !== undefined && filters.status !== null) params.append('status', String(filters.status));
	if (filters.membershipStatus) params.append('membershipStatus', filters.membershipStatus);
	if (filters.role) params.append('role', filters.role);
	if (filters.search) params.append('search', filters.search);

	const response = await authenticatedFetch<MemberManagementResponse>(`/members/management?${params}`, { method: 'GET' });

	return response;
}

/**
 * Fetch member management statistics
 */
export async function fetchMemberManagementStats(): Promise<MemberStatsResponse> {
	const response = await authenticatedFetch<MemberStatsResponse>('/members/management/stats', { method: 'GET' });

	return response;
}

/**
 * Fetch member details for management view
 */
export async function fetchMemberDetailsForManagement(memberId: string): Promise<MemberDetailsResponse> {
	const response = await authenticatedFetch<MemberDetailsResponse>(`/members/management/${memberId}`, { method: 'GET' });

	return response;
}

/**
 * Update member status (activate/deactivate)
 */
export async function updateMemberStatus(memberId: string, isActive: boolean): Promise<{ success: boolean; message: string; isActive: boolean }> {
	const response = await authenticatedFetch<{
		success: boolean;
		message: string;
		isActive: boolean;
	}>(`/members/management/${memberId}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ isActive }),
	});

	return response;
}

/**
 * Get all unique membership statuses for filter dropdown
 */
export async function getMembershipStatuses(): Promise<string[]> {
	const response = await fetchMemberManagementStats();

	// Extract unique statuses from the stats
	const statuses = response.membersByStatus.map((s) => s.status);
	return statuses.filter((s) => s !== 'UNKNOWN');
}

/**
 * Get all unique roles for filter dropdown
 * (Will be dynamic later - for now, returns predefined roles)
 */
export async function getMemberRoles(): Promise<string[]> {
	// This will be replaced with dynamic role fetching later
	return ['Leader', 'Volunteer', 'Worker', 'Member', 'Visitor', 'New Convert'];
}

/**
 * Export members to CSV (optional feature)
 */
// export async function exportMembersToCSV(filters?: MemberManagementFilters): Promise<Blob> {
//   const params = new URLSearchParams();

//   if (filters?.churchId && filters.churchId !== "all") params.append("churchId", filters.churchId);
//   if (filters?.status !== undefined && filters.status !== null) params.append("status", String(filters.status));
//   if (filters?.membershipStatus) params.append("membershipStatus", filters.membershipStatus);
//   if (filters?.role) params.append("role", filters.role);
//   if (filters?.search) params.append("search", filters.search);

//   const response = await authenticatedFetch<Blob>(
//     `/members/management/export?${params}`,
//     { method: "GET", responseType: "blob" }
//   );

//   return response;
// }
