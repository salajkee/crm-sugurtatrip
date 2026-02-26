import api from '@/utils/axios';
import type {
	PassportSearchRequest,
	PassportSearchResponse,
} from '@/types/tourist';

export const touristService = {
	searchByPassport: (data: PassportSearchRequest) =>
		api.post<PassportSearchResponse>('/info/person', data),
};
