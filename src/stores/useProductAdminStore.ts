// stores/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getMyChurch } from '@/lib/api';
import { getCurrentUserProfile } from '@/lib/auth/session';
import { getProfile } from '@/services/userServices';

export type ProductAdmin = {
	_id: string;
	name: string;
	email: string;
	role: { name: string };
	status: string;
	createdAt: string;
	updatedAt: string;
};

export type Church = {
	_id: string;
	name: string;
	alias: string;
	address: string;
	country: string;
	state: string;
	defaultCurrency: string;
	logoUrl: string | null;
	location?: string;
};

type ProductAdminStore = {
	// State
	admin: ProductAdmin | null;
	isLoading: boolean;
	error: string | null;
	lastFetched: number | null;

	// Actions
	fetchAdminData: (forceRefresh?: boolean) => Promise<void>;
	updateAdmin: (updatedUser: Partial<ProductAdmin>) => void;
	setUser: (user: ProductAdmin | null) => void;
	clearUserData: () => void;
	getAdminFullName: () => string;
};

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useProductAdminStore = create<ProductAdminStore>()(
	persist(
		(set, get) => ({
			// Initial state
			admin: null,
			church: null,
			isLoading: false,
			error: null,
			lastFetched: null,

			// Fetch user data from API
			fetchAdminData: async (forceRefresh = false) => {
				const { lastFetched, isLoading } = get();
				const now = Date.now();

				// Return cached data if it's still valid and not forcing refresh
				if (!forceRefresh && lastFetched && now - lastFetched < CACHE_DURATION && !isLoading) {
					return;
				}

				// Prevent multiple simultaneous requests
				if (isLoading) return;

				set({ isLoading: true, error: null });

				try {
					const [userData] = await Promise.all([getProfile() as any]);

					set({
						admin: userData,
						isLoading: false,
						lastFetched: now,
						error: null,
					});
				} catch (error: any) {
					set({
						error: error.message || 'Failed to load profile',
						isLoading: false,
					});
				}
			},

			// Update user data locally (after successful API update)
			updateAdmin: (updatedUser: Partial<ProductAdmin>) => {
				set((state) => ({
					admin: state.admin ? { ...state.admin, ...updatedUser } : null,
				}));
			},

			// Set user directly
			setUser: (user) => set({ admin: user }),

			// Clear all user data (e.g., on logout)
			clearUserData: () => {
				set({
					admin: null,
					error: null,
					lastFetched: null,
				});
			},

			// Helper function to get full name
			getAdminFullName: () => {
				const { admin: user } = get();
				if (user?.name) {
					return user.name;
				}
				return 'User';
			},
		}),
		{
			name: 'user-profile-storage',
			// Only persist these fields
			partialize: (state) => ({
				user: state.admin,
				lastFetched: state.lastFetched,
			}),
		}
	)
);
