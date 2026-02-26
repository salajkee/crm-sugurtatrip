import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Eye,
	Loader2,
	MoreHorizontal,
	Pencil,
	ShieldCheck,
	ShieldOff,
} from 'lucide-react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';
import { useOperatorStore } from '@/store/useOperatorStore';
import type { Operator } from '@/store/useOperatorStore';
import AgencyViewDialog from './AgencyViewDialog';
import AgencyEditDialog from './AgencyEditDialog';

export default function AgenciesTable() {
	const {
		operators,
		isLoading,
		fetchOperators,
		updateOperator,
		enableOperator,
		disableOperator,
	} = useOperatorStore();

	const [currentPage, setCurrentPage] = useState(1);
	const [selectedAgency, setSelectedAgency] = useState<Operator | null>(null);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	useEffect(() => {
		fetchOperators();
	}, []);

	const itemsPerPage = 10;
	const totalPages = Math.ceil(operators.length / itemsPerPage);

	const getCurrentPageData = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return operators.slice(startIndex, startIndex + itemsPerPage);
	};

	const handleView = (operator: Operator) => {
		setSelectedAgency(operator);
		setIsViewDialogOpen(true);
	};

	const handleEdit = (operator: Operator) => {
		setSelectedAgency(operator);
		setIsEditDialogOpen(true);
	};

	const handleToggleActive = async (operator: Operator) => {
		if (operator.active) {
			await disableOperator(operator.id);
		} else {
			await enableOperator(operator.id);
		}
	};

	const handleSaveEdit = async (data: any) => {
		if (!selectedAgency) return;
		await updateOperator(selectedAgency.id, data);
		setIsEditDialogOpen(false);
	};

	return (
		<>
			<div className="bg-card border rounded-lg w-full">
				<div className="relative w-full overflow-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[60px]">ID</TableHead>
								<TableHead>Название</TableHead>
								<TableHead>Юридическое название</TableHead>
								<TableHead>Адрес</TableHead>
								<TableHead>Статус</TableHead>
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
								getCurrentPageData().map(row => (
									<TableRow key={row.id}>
										<TableCell>{row.id}</TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>
											{row.operatorData.legalName ?? '—'}
										</TableCell>
										<TableCell>
											{row.operatorData.address ?? '—'}
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className={
													row.active
														? 'bg-green-50 text-green-700 border-green-200'
														: 'bg-gray-50 text-gray-700 border-gray-200'
												}
											>
												{row.active
													? 'Активен'
													: 'Неактивен'}
											</Badge>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="mx-auto"
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
															handleView(row)
														}
														className="cursor-pointer"
													>
														<Eye className="mr-2 w-4 h-4" />
														Открыть
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleEdit(row)
														}
														className="cursor-pointer"
													>
														<Pencil className="mr-2 w-4 h-4" />
														Редактировать
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleToggleActive(
																row,
															)
														}
														className={`cursor-pointer ${row.active ? 'text-red-500 focus:text-red-500' : 'text-blue-500 focus:text-blue-500'}`}
													>
														{row.active ? (
															<>
																<ShieldOff className="mr-2 w-4 h-4" />{' '}
																Деактивировать
															</>
														) : (
															<>
																<ShieldCheck className="mr-2 w-4 h-4" />{' '}
																Активировать
															</>
														)}
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className="h-24 text-center"
									>
										Нет результатов
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{totalPages > 1 && (
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

								<PaginationItem>
									<PaginationLink
										onClick={() => setCurrentPage(1)}
										isActive={currentPage === 1}
										className="cursor-pointer"
									>
										1
									</PaginationLink>
								</PaginationItem>

								{currentPage > 3 && (
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
								)}

								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1,
								)
									.filter(
										page =>
											page !== 1 &&
											page !== totalPages &&
											page >= currentPage - 1 &&
											page <= currentPage + 1,
									)
									.map(page => (
										<PaginationItem key={page}>
											<PaginationLink
												onClick={() =>
													setCurrentPage(page)
												}
												isActive={currentPage === page}
												className="cursor-pointer"
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									))}

								{currentPage < totalPages - 2 && (
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
								)}

								{totalPages > 1 && (
									<PaginationItem>
										<PaginationLink
											onClick={() =>
												setCurrentPage(totalPages)
											}
											isActive={
												currentPage === totalPages
											}
											className="cursor-pointer"
										>
											{totalPages}
										</PaginationLink>
									</PaginationItem>
								)}

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

			<AgencyViewDialog
				agency={selectedAgency}
				isOpen={isViewDialogOpen}
				onClose={() => setIsViewDialogOpen(false)}
			/>

			<AgencyEditDialog
				agency={selectedAgency}
				isOpen={isEditDialogOpen}
				onClose={() => setIsEditDialogOpen(false)}
				onSave={handleSaveEdit}
			/>
		</>
	);
}
