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
