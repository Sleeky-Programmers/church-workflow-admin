import { authenticatedFetch } from '@/lib/api';

type FetchOptionsParams = {
	page?: number;
	limit?: number;
	search?: string;
};

export async function getProfile() {
	return await authenticatedFetch('/product-admin/profile', {
		method: 'GET',
	});
}

export async function updatePassword(data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) {
	return await authenticatedFetch('/product-admin/change-password', {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
}

export async function updateProfile(data: { name: string; email: string }) {
	return await authenticatedFetch('/product-admin/me', {
		method: 'PATCH',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
