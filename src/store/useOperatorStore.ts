import { create } from 'zustand';
import api from '@/utils/axios';

export interface Operator {
	id: number;
	name: string;
	operatorData: {
		legalName: string;
		address: string;
	};
	active: boolean;
	partners: { partner: { id: number; visibleName: string } }[];
}

interface OperatorData {
	legalName: string;
	address: string;
}

interface CreateOperatorPayload {
	name: string;
	operatorData: OperatorData;
	partners: number[];
	active: boolean;
}

interface UpdateOperatorPayload {
	name: string;
	operatorData: OperatorData;
	partners?: number;
}

interface OperatorStore {
	operators: Operator[];
	isLoading: boolean;
	error: string | null;

	fetchOperators: () => Promise<void>;
	createOperator: (payload: CreateOperatorPayload) => Promise<void>;
	updateOperator: (
		id: number,
		payload: UpdateOperatorPayload,
	) => Promise<void>;
	enableOperator: (id: number) => Promise<void>;
	disableOperator: (id: number) => Promise<void>;
	clearError: () => void;
}

export const useOperatorStore = create<OperatorStore>()(set => ({
	operators: [],
	isLoading: false,
	error: null,

	fetchOperators: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.get<Operator[]>('/operator');
			set({ operators: data, isLoading: false });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка при загрузке';
			set({ isLoading: false, error: errorMessage });
		}
	},

	createOperator: async (payload: CreateOperatorPayload) => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.post<Operator>('/operator', payload);
			set(state => ({
				operators: [...state.operators, data],
				isLoading: false,
			}));
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Ошибка при создании агентства';
			set({ isLoading: false, error: errorMessage });
			throw error;
		}
	},

	updateOperator: async (id: number, payload: UpdateOperatorPayload) => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.patch<Operator>(
				`/operator/${id}`,
				payload,
			);
			set(state => ({
				operators: state.operators.map(op =>
					op.id === id ? data : op,
				),
				isLoading: false,
			}));
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Ошибка при обновлении агентства';
			set({ isLoading: false, error: errorMessage });
			throw error;
		}
	},

	enableOperator: async (id: number) => {
		set({ error: null });
		try {
			await api.post(`/operator/enable/${id}`);
			set(state => ({
				operators: state.operators.map(op =>
					op.id === id ? { ...op, active: true } : op,
				),
			}));
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Ошибка при активации агентства';
			set({ error: errorMessage });
			throw error;
		}
	},

	disableOperator: async (id: number) => {
		set({ error: null });
		try {
			await api.post(`/operator/disable/${id}`);
			set(state => ({
				operators: state.operators.map(op =>
					op.id === id ? { ...op, active: false } : op,
				),
			}));
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Ошибка при деактивации агентства';
			set({ error: errorMessage });
			throw error;
		}
	},

	clearError: () => set({ error: null }),
}));
