export interface ApiPolicyProgram {
	id: number;
	programName: string;
	programId: number;
	premUsd: string;
	premUzs: string;
	premEur: string;
	coverage: string;
	medicine: string;
	stomatology: string;
	covidIncluded: boolean;
	covid: string;
	repatriation: string;
	zahoronenie: string;
}

export interface ApiPartnerResponse {
	partner: string;
	result: ApiPolicyProgram[];
}

export interface PolicySearchRequest {
	startDate: string;
	endDate: string;
	programId: number;
	activityId: number;
	groupId: number;
	typeId: number;
	multiId?: number;
	purposeId: number;
	dateBirths: string[];
	countriesIso: string[];
}

export interface PolicyCardData {
	id: string;
	programId: number;
	name: string;
	partner: string;
	coverage: number;
	price: number;
	isBestseller?: boolean;
}

export interface PolicyIssuePassport {
	series: string;
	number: string;
	issuedBy: string;
	issued: string;
	validTill: string;
}

export interface PolicyIssueApplicant {
	isResident: number;
	country: string;
	fizyur: number;
	pinfl: string;
	passport: PolicyIssuePassport;
	dateBirth: string;
	firstName: string;
	lastName: string;
	middleName: string;
	phone: string;
	address: string;
	region: number;
	district: number;
	gender: string;
	email: string;
}

export interface PolicyIssueInsured {
	isResident: number;
	country: string;
	pinfl: string;
	passport: PolicyIssuePassport;
	dateBirth: string;
	firstName: string;
	lastName: string;
	middleName: string;
	region: number;
	district: number;
	address: string;
	phone: string;
	gender: string;
	email: string;
}

export interface PolicyIssueRequest {
	partner: string;
	activityId: number;
	applicant: PolicyIssueApplicant;
	countriesIso: string[];
	dateReg: string;
	startDate: string;
	endDate: string;
	groupId: number;
	programId: number;
	typeId: number;
	multiId: number;
	insured: PolicyIssueInsured[];
}

export interface PolicyCreateResponse {
	id: number;
	partnerContractId: number | null;
	activity: number;
	countries: string[];
	dateReg: string;
	dateStart: string;
	dateEnd: string;
	programId: number;
	groupId: number;
	typeId: number;
	multiId: number;
	cancelled: boolean;
	amount: number | null;
	paid: boolean;
	url: string | null;
	series: string | null;
	number: string | null;
	erspPolicyNumber: string | null;
	issued: boolean;
	issuedAt: string | null;
	data: {
		payment?: {
			click?: string;
			payme?: string;
		};
	} | null;
	createdAt: string;
	updatedAt: string;
	clientId: number;
	partnerId: number;
	operatorId: number;
	userId: number;
}

export interface PolicyListParams {
	page?: number;
	size?: number;
}

export interface PolicyListResponse {
	items: PolicyCreateResponse[];
	total: number;
	page: number;
	size: number;
}

export interface PolicyIssueByIdRequest {
	partner: string;
	id: number;
}

export interface PolicyIssueResultData {
	result: number;
	result_message: string;
	contract_id: number;
	startdate: string;
	enddate: string;
	stoimost_uzs: number;
	click_link: string;
	payme_link: string;
}

export interface PolicyIssueResponse {
	success: boolean;
	message: string | null;
	data: PolicyIssueResultData;
}
