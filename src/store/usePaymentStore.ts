import { create } from 'zustand';
import { format } from 'date-fns';
import { policyService } from '@/services/policyService';
import { usePolicySearchStore } from '@/store/usePolicySearchStore';
import { useTouristDataStore } from '@/store/useTouristDataStore';
import type {
	PolicyIssueRequest,
	PolicyIssueApplicant,
	PolicyIssueInsured,
	PolicyIssueResultData,
} from '@/types/policy';
import type { TouristData } from '@/types/tourist';
import type { PurchaserData } from '@/components/form/PurchaserDataForm';

type PersonLike = TouristData | PurchaserData;

function buildApplicant(
	person: PersonLike,
	phone: string,
): PolicyIssueApplicant {
	const isResident = person.residency;
	const firstName = person.firstName ?? '';
	const lastName = person.lastName ?? '';

	return {
		isResident,
		country: person.country ?? (isResident === 1 ? 'UZ' : 'RU'),
		fizyur: 1,
		pinfl: person.pinfl ?? '',
		passport: {
			series: person.passportSeries,
			number: person.passportNumber,
			issuedBy: '',
			issued: '',
			validTill: '',
		},
		dateBirth: person.birthdate,
		firstName,
		lastName,
		middleName: '',
		phone,
		address: person.address ?? '',
		region: person.region ?? 0,
		district: person.district ?? 0,
		gender: person.gender ?? '',
		email: 'support@sugurtatrip.uz',
	};
}

function buildInsured(person: TouristData): PolicyIssueInsured {
	const isResident = person.residency;
	const firstName = person.firstName ?? '';
	const lastName = person.lastName ?? '';

	return {
		isResident,
		country: person.country ?? (isResident === 1 ? 'UZ' : 'RU'),
		pinfl: person.pinfl ?? '',
		passport: {
			series: person.passportSeries,
			number: person.passportNumber,
			issuedBy: '',
			issued: '',
			validTill: '',
		},
		dateBirth: person.birthdate,
		firstName,
		lastName,
		middleName: '',
		region: person.region ?? 0,
		district: person.district ?? 0,
		address: person.address ?? '',
		phone: person.phone ? `998${person.phone.replace(/\D/g, '')}` : '',
		gender: person.gender ?? '',
		email: 'support@sugurtatrip.uz',
	};
}

interface PaymentStore {
	isLoading: boolean;
	isChecking: boolean;
	error: string | null;
	isSuccess: boolean;
	isPaid: boolean;
	policyId: number | null;
	policyUrl: string | null;
	paymentData: PolicyIssueResultData | null;

	issuePolicy: () => Promise<void>;
	checkPayment: () => Promise<void>;
	setError: (error: string | null) => void;
	reset: () => void;
}

const initialState = {
	isLoading: false,
	isChecking: false,
	error: null as string | null,
	isSuccess: false,
	isPaid: false,
	policyId: null as number | null,
	policyUrl: null as string | null,
	paymentData: null as PolicyIssueResultData | null,
};

export const usePaymentStore = create<PaymentStore>()((set, get) => ({
	...initialState,

	issuePolicy: async () => {
		set({
			isLoading: true,
			error: null,
			isSuccess: false,
			paymentData: null,
		});
		try {
			const policySearch = usePolicySearchStore.getState();
			const touristStore = useTouristDataStore.getState();

			const partner = policySearch.partner;

			const firstTourist = touristStore.touristsData[0];
			const purchaserPerson: PersonLike = touristStore.isPurchaser
				? firstTourist
				: (touristStore.purchaserData ?? firstTourist);

			const rawPhone = touristStore.isPurchaser
				? (firstTourist?.phone ?? '')
				: (touristStore.purchaserData?.phone ?? '');
			const phone = `998${rawPhone.replace(/\D/g, '')}`;

			const applicant = buildApplicant(purchaserPerson, phone);

			const insured: PolicyIssueInsured[] =
				touristStore.touristsData.map(buildInsured);

			const createBody: PolicyIssueRequest = {
				partner,
				activityId: policySearch.activityId,
				countriesIso: policySearch.countries,
				dateReg: format(new Date(), 'dd.MM.yyyy'),
				startDate: policySearch.startDate ?? '',
				endDate: policySearch.endDate ?? '',
				groupId: policySearch.groupId,
				programId: policySearch.programId,
				typeId: policySearch.typeId,
				multiId: policySearch.multiId,
				applicant,
				insured,
			};

			const { data: draft } = await policyService.create(createBody);

			set({ policyId: draft.id });

			const { data: issueResult } = await policyService.issue({
				partner,
				id: draft.id,
			});

			if (!issueResult.success) {
				throw new Error(issueResult.message ?? 'Ошибка выпуска полиса');
			}

			set({ isSuccess: true, paymentData: issueResult.data });
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: 'Ошибка при выпуске полиса';
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},

	checkPayment: async () => {
		const { policyId } = get();
		if (!policyId) {
			set({ error: 'ID полиса не найден' });
			return;
		}

		set({ isChecking: true, error: null });
		try {
			const { data } = await policyService.getById(policyId);

			if (data.paid && data.url) {
				set({ isPaid: true, policyUrl: data.url });
			} else {
				set({ error: 'Оплата ещё не поступила. Попробуйте позже.' });
			}
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: 'Ошибка при проверке оплаты';
			set({ error: message });
		} finally {
			set({ isChecking: false });
		}
	},

	setError: error => set({ error }),
	reset: () => set(initialState),
}));
