import { create } from 'zustand';
import api from '@/utils/axios';

export interface Employee {
	id: number;
	email: string;
	role: string;
	active: boolean;
	visibleName: string | null;
	userData: {
		firstName?: string;
		lastName?: string;
		name?: string;
	} | null;
	operatorId: number | null;
	createdAt: string;
	updatedAt: string;
}

interface CreateEmployeePayload {
	email: string;
	password: string;
	role: string;
	operatorId: number | null;
	active: boolean;
	userData: {
		firstName: string;
		lastName: string;
	};
}

interface EmployeeStore {
	employees: Employee[];
	isLoading: boolean;
	error: string | null;

	fetchEmployees: (operatorId?: number | null) => Promise<void>;
	createEmployee: (payload: CreateEmployeePayload) => Promise<void>;
	clearError: () => void;
}

export const useEmployeeStore = create<EmployeeStore>()(set => ({
	employees: [],
	isLoading: false,
	error: null,

	fetchEmployees: async (operatorId?: number | null) => {
		set({ isLoading: true, error: null });
		try {
			const url = operatorId ? `/user/operator/${operatorId}` : '/user';
			const { data } = await api.get<Employee[]>(url);
			set({ employees: data, isLoading: false });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка при загрузке';
			set({ isLoading: false, error: errorMessage });
		}
	},

	createEmployee: async (payload: CreateEmployeePayload) => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.post<Employee>('/user', payload);
			set(state => ({
				employees: [...state.employees, data],
				isLoading: false,
			}));
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Ошибка при создании сотрудника';
			set({ isLoading: false, error: errorMessage });
			throw error;
		}
	},

	clearError: () => set({ error: null }),
}));
