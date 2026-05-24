import { authenticatedFetch } from '@/lib/api';

// Types
export interface CreateRolePayload {
	name: string;
	description?: string;
	permissions?: string[];
}

export interface UpdateRolePayload extends Partial<CreateRolePayload> {
	id: string;
}

export interface Role {
	id: string;
	name: string;
	description: string | null;
	permissions: string[];
	isSystemRole: boolean;
	memberCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface RoleListResponse {
	data: Role[];
	pagination: {
		page: number;
		limit: number;
		itemCount: number;
		totalPages: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

export interface AssignRolePayload {
	userId: string;
	roleId: string;
}

// Create a new role
export async function createRole(payload: CreateRolePayload): Promise<Role> {
	const response = await authenticatedFetch<{ success: boolean; data: Role }>('/product-admin-roles', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
	return response.data;
}

// Get all roles with pagination
export async function fetchRoles(params?: { page?: number; limit?: number; search?: string }): Promise<RoleListResponse> {
	const query = new URLSearchParams();
	if (params?.page) query.append('page', String(params.page));
	if (params?.limit) query.append('limit', String(params.limit));
	if (params?.search) query.append('search', params.search);

	const suffix = query.toString() ? `?${query.toString()}` : '';

	return authenticatedFetch<RoleListResponse>(`/product-admin-roles${suffix}`, {
		method: 'GET',
	});
}

// Get single role by ID
export async function fetchRoleById(id: string): Promise<Role> {
	const response = await authenticatedFetch<{ success: boolean; data: Role }>(`/product-admin-roles/${id}`, {
		method: 'GET',
	});
	return response.data;
}

// Update a role
export async function updateRole(id: string, payload: UpdateRolePayload): Promise<Role> {
	const response = await authenticatedFetch<{ success: boolean; data: Role }>(`/product-admin-roles/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload),
	});
	return response.data;
}

// Delete a role
export async function deleteRole(id: string): Promise<{ success: boolean; message: string }> {
	return authenticatedFetch(`/product-admin-roles/${id}`, {
		method: 'DELETE',
	});
}

// Assign role to user
export async function assignRoleToUser(payload: AssignRolePayload): Promise<{ success: boolean; message: string }> {
	return authenticatedFetch('/product-admin-roles/assign', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

// Remove role from user
export async function removeRoleFromUser(userId: string, roleId: string): Promise<{ success: boolean; message: string }> {
	return authenticatedFetch(`/product-admin-roles/${userId}/roles/${roleId}`, {
		method: 'DELETE',
	});
}

// Get users with their roles
export async function fetchUsersWithRoles(params?: { page?: number; limit?: number; roleId?: string }): Promise<{
	data: {
		id: string;
		name: string;
		email: string;
		roles: Role[];
	}[];
	pagination: any;
}> {
	const query = new URLSearchParams();
	if (params?.page) query.append('page', String(params.page));
	if (params?.limit) query.append('limit', String(params.limit));
	if (params?.roleId) query.append('roleId', params.roleId);

	const suffix = query.toString() ? `?${query.toString()}` : '';

	return authenticatedFetch(`/product-admin-roles/users${suffix}`, {
		method: 'GET',
	});
}
