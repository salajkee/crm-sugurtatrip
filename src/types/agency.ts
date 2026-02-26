export interface Agency {
	id: number;
	name: string;
	operatorData: {
		legalName: string;
		insurances: string[];
		phoneNumber: string;
		email: string;
		password: string;
		address: string;
	};
	active: boolean;
}
