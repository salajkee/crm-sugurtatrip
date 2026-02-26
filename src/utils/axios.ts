import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
	baseURL: '/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(config => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	response => response,
	error => {
		const message = error.response?.data?.message || 'Произошла ошибка';
		return Promise.reject(new Error(message));
	},
);

export default api;
