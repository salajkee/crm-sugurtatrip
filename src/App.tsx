import {
	createBrowserRouter,
	RouterProvider,
	Outlet,
	Navigate,
} from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

// Импорт страниц
// import Dashboard from '@/pages/Dashboard';
import CreatePolicy from '@/pages/CreatePolicy';
import TravelAgencies from '@/pages/TravelAgencies';
import Employees from '@/pages/Employees';
import PolicyRegistry from '@/pages/PolicyRegistry';
import { LoginPage } from '@/pages/Login';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from './components/layout/header';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleProtectedRoute } from '@/components/guards/RoleProtectedRoute';

// Компонент для защищенных роутов
function ProtectedRoute() {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="flex-1">
				<Header />
				<main className="flex-1 p-6">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

// Роутинг
const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/',
		element: <ProtectedRoute />,
		children: [
			{
				index: true,
				element: <CreatePolicy />,
			},
			// {
			// 	path: 'create-policy',
			// 	element: <CreatePolicy />,
			// },
			{
				element: <RoleProtectedRoute allowedRoles={['admin']} />,
				children: [
					{
						path: 'agencies',
						element: <TravelAgencies />,
					},
				],
			},
			{
				element: (
					<RoleProtectedRoute
						allowedRoles={['admin', 'operator_admin']}
					/>
				),
				children: [
					{
						path: 'employees',
						element: <Employees />,
					},
				],
			},
			{
				path: 'registry',
				element: <PolicyRegistry />,
			},
		],
	},
	{
		path: '*',
		element: <Navigate to="/login" replace />,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
