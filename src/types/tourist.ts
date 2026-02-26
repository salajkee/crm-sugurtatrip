export interface Tourist {
	id: string;
	birthdate: string;
	age: number | null;
}

export interface TouristData {
	id: string;
	residency: number;
	birthdate: string;
	passportSeries: string;
	passportNumber: string;
	fullName?: string;
	lastName?: string;
	firstName?: string;
	phone?: string;

	pinfl?: string;
	country?: string;
	address?: string;
	region?: number;
	district?: number;
	gender?: string;
}

export interface PassportSearchRequest {
	series: string;
	number: string;
	birthday: string;
}

export interface PassportSearchResponse {
	result: number;
	result_message: string;
	pinfl: string;
	passport: string;
	passport_s: string;
	passport_n: string;
	surname_uz: string;
	name_uz: string;
	middlename_uz: string;
	surname_eng: string;
	name_eng: string;
	birthday: string;
	gender: number;
	address: string;
	region: number;
	district: number;
}
