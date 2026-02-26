import { useEffect, useMemo, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { MoreHorizontal, Eye, Loader2 } from 'lucide-react';
import { useEmployeeStore, type Employee } from '@/store/useEmployeeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOperatorStore } from '@/store/useOperatorStore';
import EmployeeViewDialog from './EmployeeViewDialog';

const ROLE_LABELS: Record<string, string> = {
	admin: 'Администратор',
	operator_admin: 'Оператор',
	operator_manager: 'Менеджер',
};

export default function EmployeesTable() {
	const { employees, isLoading, fetchEmployees } = useEmployeeStore();
	const user = useAuthStore(state => state.user);
	const hasRole = useAuthStore(state => state.hasRole);
	const isAdmin = hasRole(['admin']);
	const { operators, fetchOperators } = useOperatorStore();

	const [currentPage, setCurrentPage] = useState(1);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null,
	);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

	useEffect(() => {
		const operatorId = isAdmin ? null : user?.operatorId;
		fetchEmployees(operatorId);
		if (isAdmin) {
			fetchOperators();
		}
	}, []);

	const operatorNames = useMemo(() => {
		const map: Record<number, string> = {};
		for (const op of operators) {
			map[op.id] = op.name;
		}
		return map;
	}, [operators]);

	const itemsPerPage = 10;
	const totalPages = Math.ceil(employees.length / itemsPerPage);

	const getCurrentPageData = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return employees.slice(startIndex, startIndex + itemsPerPage);
	};

	const getFullName = (employee: Employee) => {
		const { userData } = employee;
		if (!userData) return '—';
		if (userData.firstName || userData.lastName) {
			return `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim();
		}
		return userData.name ?? '—';
	};

	const handleView = (employee: Employee) => {
		setSelectedEmployee(employee);
		setIsViewDialogOpen(true);
	};

	// const handleEdit = (employee: Employee) => {
	// 	setSelectedEmployee(employee);
	// 	setIsEditDialogOpen(true);
	// };

	// const handleSaveEdit = (data: any) => {
	// 	console.log('Сохранение изменений:', data);
	// };

	return (
		<>
			<div className="bg-card border rounded-lg w-full">
				<div className="relative w-full overflow-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[60px]">ID</TableHead>
								<TableHead>ФИО</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Роль</TableHead>
								{isAdmin && <TableHead>Агентство</TableHead>}
								<TableHead className="w-[120px]">
									Действие
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={10}
										className="h-24 text-center"
									>
										<Loader2 className="mx-auto w-6 h-6 text-muted-foreground animate-spin" />
									</TableCell>
								</TableRow>
							) : getCurrentPageData().length > 0 ? (
								getCurrentPageData().map(employee => (
									<TableRow key={employee.id}>
										<TableCell>{employee.id}</TableCell>
										<TableCell>
											{getFullName(employee)}
										</TableCell>
										<TableCell>{employee.email}</TableCell>
										<TableCell>
											{ROLE_LABELS[employee.role] ??
												employee.role}
										</TableCell>
										{isAdmin && (
										<TableCell>
											{employee.operatorId
												? (operatorNames[
														employee.operatorId
													] ?? '—')
												: '—'}
										</TableCell>
									)}
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
													>
														<MoreHorizontal className="w-4 h-4" />
														<span className="sr-only">
															Открыть меню
														</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() =>
															handleView(employee)
														}
														className="cursor-pointer"
													>
														<Eye className="mr-2 w-4 h-4" />
														Открыть
													</DropdownMenuItem>
													{/* <DropdownMenuItem
														onClick={() =>
															handleEdit(employee)
														}
														className="cursor-pointer"
													>
														<Pencil className="mr-2 w-4 h-4" />
														Редактировать
													</DropdownMenuItem> */}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={10}
										className="h-24 text-center"
									>
										Нет результатов
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{!isLoading && totalPages > 1 && (
					<div className="px-6 py-4 border-t">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											setCurrentPage(prev =>
												Math.max(prev - 1, 1),
											)
										}
										className={
											currentPage === 1
												? 'pointer-events-none opacity-50'
												: 'cursor-pointer'
										}
									/>
								</PaginationItem>
								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1,
								).map(page => (
									<PaginationItem key={page}>
										<PaginationLink
											onClick={() => setCurrentPage(page)}
											isActive={currentPage === page}
											className="cursor-pointer"
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									<PaginationNext
										onClick={() =>
											setCurrentPage(prev =>
												Math.min(prev + 1, totalPages),
											)
										}
										className={
											currentPage === totalPages
												? 'pointer-events-none opacity-50'
												: 'cursor-pointer'
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</div>

			<EmployeeViewDialog
				employee={selectedEmployee}
				isOpen={isViewDialogOpen}
				onClose={() => setIsViewDialogOpen(false)}
			/>

		</>
	);
}
