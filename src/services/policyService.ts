import api from '@/utils/axios';
import type {
	PolicySearchRequest,
	ApiPartnerResponse,
	PolicyIssueRequest,
	PolicyCreateResponse,
	PolicyIssueByIdRequest,
	PolicyIssueResponse,
	PolicyListParams,
	PolicyListResponse,
} from '@/types/policy';

export const policyService = {
	search: (data: PolicySearchRequest) =>
		api.post<ApiPartnerResponse[]>('/price', data),

	getAll: (params?: PolicyListParams) =>
		api.get<PolicyListResponse>('/policy', { params }),

	create: (data: PolicyIssueRequest) =>
		api.post<PolicyCreateResponse>('/policy', data),

	issue: (data: PolicyIssueByIdRequest) =>
		api.post<PolicyIssueResponse>('/policy/issue', data),

	getById: (id: number) =>
		api.get<PolicyCreateResponse>(`/policy/${id}`),
};
