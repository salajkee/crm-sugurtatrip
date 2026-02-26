import api from '@/utils/axios';
import type { AuthResponse } from '@/types/auth';

export const authService = {
	login: (email: string, password: string) => {
		return api.post<AuthResponse>('/auth/login', { email, password });
	},
};
