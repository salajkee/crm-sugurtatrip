import { useCallback, useEffect, useState } from 'react';
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
import { MoreHorizontal, Loader2, Eye, CreditCard } from 'lucide-react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';
import { policyService } from '@/services/policyService';
import type { PolicyCreateResponse } from '@/types/policy';
import PolicyPaymentDialog from './PolicyPaymentDialog';
import PolicyViewDialog from './PolicyViewDialog';

const PARTNER_NAMES: Record<number, string> = {
	1: 'Apex',
	2: 'Gross',
	3: 'Kapital',
};

function getPartnerName(partnerId: number): string {
	return PARTNER_NAMES[partnerId] ?? 'Partner';
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
}

export default function PolicyTable() {
	const [items, setItems] = useState<PolicyCreateResponse[]>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedPolicy, setSelectedPolicy] =
		useState<PolicyCreateResponse | null>(null);
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
	const [viewPolicy, setViewPolicy] = useState<PolicyCreateResponse | null>(
		null,
	);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

	const itemsPerPage = 20;
	const totalPages = Math.ceil(total / itemsPerPage);

	const fetchPolicies = useCallback(async (page: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const { data } = await policyService.getAll({
				page,
				size: itemsPerPage,
			});
			setItems(data.items);
			setTotal(data.total);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Ошибка загрузки полисов';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPolicies(currentPage);
	}, [currentPage, fetchPolicies]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleView = (policy: PolicyCreateResponse) => {
		setViewPolicy(policy);
		setIsViewDialogOpen(true);
	};

	const handlePayment = (policy: PolicyCreateResponse) => {
		setSelectedPolicy(policy);
		setIsPaymentDialogOpen(true);
	};

	return (
		<div className="bg-card border rounded-lg w-full">
			<div className="relative w-full overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[60px]">ID</TableHead>
							<TableHead>Партнер</TableHead>
							<TableHead>№ Договора</TableHead>
							<TableHead>Страны</TableHead>
							<TableHead>Дата регистрации</TableHead>
							<TableHead>Дата начала</TableHead>
							<TableHead>Дата окончания</TableHead>
							<TableHead>Сумма</TableHead>
							<TableHead>Статус</TableHead>
							<TableHead className="w-[80px]">Действие</TableHead>
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
						) : error ? (
							<TableRow>
								<TableCell
									colSpan={10}
									className="h-24 text-destructive text-center"
								>
									{error}
								</TableCell>
							</TableRow>
						) : items.length > 0 ? (
							items.map(row => (
								<TableRow key={row.id}>
									<TableCell>{row.id}</TableCell>
									<TableCell>
										{getPartnerName(row.partnerId)}
									</TableCell>
									<TableCell>
										{row.partnerContractId ?? '—'}
									</TableCell>
									<TableCell>
										{row.countries.join(', ')}
									</TableCell>
									<TableCell>
										{formatDate(row.dateReg)}
									</TableCell>
									<TableCell>
										{formatDate(row.dateStart)}
									</TableCell>
									<TableCell>
										{formatDate(row.dateEnd)}
									</TableCell>
									<TableCell>
										{row.amount != null
											? row.amount.toLocaleString('ru-RU')
											: '—'}
									</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className={
												row.paid
													? 'bg-green-50 text-green-700 border-green-200'
													: 'bg-yellow-50 text-yellow-700 border-yellow-200'
											}
										>
											{row.paid
												? 'Оплачен'
												: 'Не оплачен'}
										</Badge>
									</TableCell>
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
														handleView(row)
													}
												>
													<Eye className="mr-2 w-4 h-4" />
													Открыть
												</DropdownMenuItem>
												{!row.paid && (
													<DropdownMenuItem
														onClick={() =>
															handlePayment(row)
														}
													>
														<CreditCard className="mr-2 w-4 h-4" />
														Оплатить
													</DropdownMenuItem>
												)}
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

			{totalPages > 1 && (
				<div className="px-6 py-4 border-t">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() =>
										handlePageChange(
											Math.max(currentPage - 1, 1),
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
									onClick={() => handlePageChange(1)}
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

							{Array.from({ length: totalPages }, (_, i) => i + 1)
								.filter(page => {
									return (
										page !== 1 &&
										page !== totalPages &&
										page >= currentPage - 1 &&
										page <= currentPage + 1
									);
								})
								.map(page => (
									<PaginationItem key={page}>
										<PaginationLink
											onClick={() =>
												handlePageChange(page)
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
											handlePageChange(totalPages)
										}
										isActive={currentPage === totalPages}
										className="cursor-pointer"
									>
										{totalPages}
									</PaginationLink>
								</PaginationItem>
							)}

							<PaginationItem>
								<PaginationNext
									onClick={() =>
										handlePageChange(
											Math.min(
												currentPage + 1,
												totalPages,
											),
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

			<PolicyPaymentDialog
				policy={selectedPolicy}
				isOpen={isPaymentDialogOpen}
				onClose={() => setIsPaymentDialogOpen(false)}
			/>

			<PolicyViewDialog
				policy={viewPolicy}
				isOpen={isViewDialogOpen}
				onClose={() => setIsViewDialogOpen(false)}
			/>
		</div>
	);
}
