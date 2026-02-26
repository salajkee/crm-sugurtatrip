import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
} from '@/components/ui/sidebar';
import {
	Building2,
	CirclePlus,
	FileText,
	// House,
	LogOut,
	User,
	Users,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export function AppSidebar() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout, hasRole } = useAuthStore();

	const isActive = (path: string) => location.pathname === path;

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<Sidebar>
			<SidebarContent className="bg-[#131C55]">
				<SidebarGroup>
					<SidebarGroupLabel className="flex justify-center items-center text-white text-2xl">
						Sugurtatrip
					</SidebarGroupLabel>
					<SidebarGroupContent className="mt-6">
						<SidebarMenu>
							{/* <SidebarMenuItem className="text-white">
								<SidebarMenuButton
									asChild
									data-active={isActive('/dashboard')}
									className="data-[active=true]:bg-primary hover:bg-primary active:bg-primary data-[active=true]:text-white hover:text-white active:text-white"
								>
									<Link to="/dashboard" className="font-medium">
										<House />
										Дашборд
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem> */}
							<SidebarMenuItem className="text-white">
								<SidebarMenuButton
									asChild
									data-active={isActive('/')}
									className="data-[active=true]:bg-primary hover:bg-primary active:bg-primary data-[active=true]:text-white hover:text-white active:text-white"
								>
									<Link to="/" className="font-medium">
										<CirclePlus />
										Создать полис
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{hasRole(['admin']) && (
								<SidebarMenuItem className="text-white">
									<SidebarMenuButton
										asChild
										data-active={isActive('/agencies')}
										className="data-[active=true]:bg-primary hover:bg-primary active:bg-primary data-[active=true]:text-white hover:text-white active:text-white"
									>
										<Link
											to="/agencies"
											className="font-medium"
										>
											<Building2 />
											Турагентства
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)}

							{hasRole(['admin', 'operator_admin']) && (
								<SidebarMenuItem className="text-white">
									<SidebarMenuButton
										asChild
										data-active={isActive('/employees')}
										className="data-[active=true]:bg-primary hover:bg-primary active:bg-primary data-[active=true]:text-white hover:text-white active:text-white"
									>
										<Link
											to="/employees"
											className="font-medium"
										>
											<Users />
											Сотрудники
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)}

							<SidebarMenuItem className="text-white">
								<SidebarMenuButton
									asChild
									data-active={isActive('/registry')}
									className="data-[active=true]:bg-primary hover:bg-primary active:bg-primary data-[active=true]:text-white hover:text-white active:text-white"
								>
									<Link
										to="/registry"
										className="font-medium"
									>
										<FileText />
										Реестр полисов
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="bg-[#131C55] p-4 border-white/10 border-t">
				<div className="flex justify-between items-center gap-2">
					<div className="flex items-center gap-2 min-w-0">
						<div className="flex justify-center items-center bg-white/10 rounded-full w-8 h-8">
							<User className="w-4 h-4 text-white" />
						</div>
						<span className="font-medium text-white text-sm truncate">
							{user?.userData?.firstName}{' '}
							{user?.userData?.lastName}
						</span>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleLogout}
						className="hover:bg-white/10 text-white hover:text-white"
						title="Выйти"
					>
						<LogOut className="w-4 h-4" />
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
