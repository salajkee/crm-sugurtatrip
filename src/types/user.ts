export type UserRole = 'admin' | 'operator_admin' | 'operator_manager';

interface UserData {
	lastName: string;
	firstName: string;
}

export interface User {
	id: number;
	email: string;
	visibleName: string | null;
	role: 'admin' | 'operator_admin' | 'operator_manager';
	active: boolean;
	userData: UserData;
	createdAt: string;
	updatedAt: string;
	operatorId: number | null;
}
