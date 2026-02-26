import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Tourist } from '@/types/tourist';
import type { PolicyCardData } from '@/types/policy';

interface PolicySearchStore {
	countries: string[];
	tourists: Tourist[];
	startDate: string | null;
	endDate: string | null;
	typeId: number;
	activityId: number;
	multiId: number;
	groupId: number;
	programId: number;
	partner: string;
	purposeId: number;
	showResults: boolean;
	policies: PolicyCardData[];

	setCountries: (countries: string[]) => void;
	setTourists: (tourists: Tourist[]) => void;
	setStartDate: (date: string | null) => void;
	setEndDate: (date: string | null) => void;
	setTypeId: (type: number) => void;
	setActivityId: (id: number) => void;
	setMultiId: (id: number) => void;
	setGroupId: (id: number) => void;
	setProgramId: (id: number) => void;
	setPartner: (partner: string) => void;
	setPurposeId: (id: number) => void;
	setShowResults: (show: boolean) => void;
	setPolicies: (policies: PolicyCardData[]) => void;

	getRequestData: () => {
		startDate: string;
		endDate: string;
		programId: number;
		activityId: number;
		groupId: number;
		typeId: number;
		multiId: number;
		purposeId: number;
		dateBirths: string[];
		countriesIso: string[];
	};

	reset: () => void;
}

const initialState = {
	countries: [],
	tourists: [{ id: uuidv4(), birthdate: '', age: null }],
	startDate: null,
	endDate: null,
	typeId: 0,
	activityId: 0,
	multiId: 0,
	groupId: 0,
	programId: 0,
	partner: '',
	purposeId: 0,
	showResults: false,
	policies: [],
};

export const usePolicySearchStore = create<PolicySearchStore>()(
	persist(
		(set, get) => ({
			...initialState,

			setCountries: countries => set({ countries }),
			setTourists: tourists => set({ tourists }),
			setStartDate: date => set({ startDate: date }),
			setEndDate: date => set({ endDate: date }),
			setTypeId: id => set({ typeId: id }),
			setActivityId: id => set({ activityId: id }),
			setMultiId: id => set({ multiId: id }),
			setGroupId: id => set({ groupId: id }),
			setProgramId: id => set({ programId: id }),
			setPartner: partner => set({ partner }),
			setPurposeId: id => set({ purposeId: id }),
			setShowResults: show => set({ showResults: show }),
			setPolicies: policies => set({ policies }),

			getRequestData: () => {
				const state = get();
				return {
					startDate: state.startDate || '',
					endDate: state.endDate || '',
					programId: state.programId,
					activityId: state.activityId,
					groupId: state.groupId,
					typeId: state.typeId,
					multiId: state.multiId,
					purposeId: state.purposeId === 4 ? 0 : state.purposeId,
					dateBirths: state.tourists
						.map(t => t.birthdate)
						.filter(date => date !== ''),
					countriesIso: state.countries,
				};
			},

			reset: () => set(initialState),
		}),
		{
			name: 'policy-search-storage',
			partialize: state => ({
				countries: state.countries,
				tourists: state.tourists,
				startDate: state.startDate,
				endDate: state.endDate,
				typeId: state.typeId,
				activityId: state.activityId,
				multiId: state.multiId,
				groupId: state.groupId,
				purposeId: state.purposeId,
				programId: state.programId,
				partner: state.partner,
			}),
		},
	),
);
