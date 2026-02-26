import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authServices';
import type { User, UserRole } from '@/types/user';

interface AuthStore {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	clearError: () => void;

	hasRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			login: async (email, password) => {
				set({ isLoading: true, error: null });
				try {
					const { data } = await authService.login(email, password);
					set({
						user: data.user,
						token: data.accessToken,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : 'Ошибка входа';
					set({
						isLoading: false,
						error: errorMessage,
						isAuthenticated: false,
						user: null,
						token: null,
					});
					throw error;
				}
			},

			logout: async () => {
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					error: null,
				});

				const { useStepperStore } =
					await import('@/store/useStepperStore');
				const { usePolicySearchStore } =
					await import('@/store/usePolicySearchStore');
				const { useTouristDataStore } =
					await import('@/store/useTouristDataStore');
				const { usePaymentStore } =
					await import('@/store/usePaymentStore');

				useStepperStore.getState().reset();
				usePolicySearchStore.getState().reset();
				useTouristDataStore.getState().reset();
				usePaymentStore.getState().reset();
			},

			clearError: () => set({ error: null }),

			hasRole: roles => {
				const { user } = get();
				return user ? roles.includes(user.role as UserRole) : false;
			},
		}),
		{
			name: 'auth-storage',
			partialize: state => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
