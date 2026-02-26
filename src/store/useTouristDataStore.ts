import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TouristData } from '@/types/tourist';
import type { PurchaserData } from '@/components/form/PurchaserDataForm';

interface TouristDataStore {
	isPurchaser: boolean;
	touristsData: TouristData[];
	purchaserData: PurchaserData | null;
	isFormValid: boolean;
	triggerValidation: (() => Promise<boolean>) | null;

	setIsPurchaser: (value: boolean) => void;
	setTouristsData: (data: TouristData[]) => void;
	setPurchaserData: (data: PurchaserData | null) => void;
	setIsFormValid: (valid: boolean) => void;
	setTriggerValidation: (fn: (() => Promise<boolean>) | null) => void;
	reset: () => void;
}

const initialState = {
	isPurchaser: true,
	touristsData: [],
	purchaserData: null,
	isFormValid: false,
	triggerValidation: null as (() => Promise<boolean>) | null,
};

export const useTouristDataStore = create<TouristDataStore>()(
	persist(
		set => ({
			...initialState,
			setIsPurchaser: value => set({ isPurchaser: value }),
			setTouristsData: data => set({ touristsData: data }),
			setPurchaserData: data => set({ purchaserData: data }),
			setIsFormValid: valid => set({ isFormValid: valid }),
			setTriggerValidation: fn => set({ triggerValidation: fn }),
			reset: () => set(initialState),
		}),
		{
			name: 'tourist-data-storage',
			partialize: state => ({
				isPurchaser: state.isPurchaser,
				touristsData: state.touristsData,
				purchaserData: state.purchaserData,
			}),
		},
	),
);
