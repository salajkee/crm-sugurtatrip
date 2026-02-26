import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types/user';

interface RoleProtectedRouteProps {
	allowedRoles: UserRole[];
	redirectTo?: string;
}

export function RoleProtectedRoute({
	allowedRoles,
	redirectTo = '/',
}: RoleProtectedRouteProps) {
	const hasRole = useAuthStore(state => state.hasRole);

	if (!hasRole(allowedRoles)) {
		return <Navigate to={redirectTo} replace />;
	}

	return <Outlet />;
}
