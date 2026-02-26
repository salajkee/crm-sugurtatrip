import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types/user';

export function usePermissions() {
	const user = useAuthStore(state => state.user);
	const hasRole = useAuthStore(state => state.hasRole);

	return {
		user,
		role: user?.role as UserRole | undefined,
		hasRole,
		isAdmin: hasRole(['admin']),
		isOperatorAdmin: hasRole(['operator_admin']),
		isOperatorManager: hasRole(['operator_manager']),
		userName: user?.userData?.firstName || user?.visibleName || 'User',
	};
}
