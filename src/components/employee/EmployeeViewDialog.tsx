import { useMemo } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { type Employee } from '@/types/employee';
import { useAuthStore } from '@/store/useAuthStore';
import { useOperatorStore } from '@/store/useOperatorStore';

interface EmployeeViewDialogProps {
	employee: Employee | null;
	isOpen: boolean;
	onClose: () => void;
}

const ROLE_LABELS: Record<string, string> = {
	admin: 'Администратор',
	operator_admin: 'Оператор',
	operator_manager: 'Менеджер',
};

export default function EmployeeViewDialog({
	employee,
	isOpen,
	onClose,
}: EmployeeViewDialogProps) {
	const hasRole = useAuthStore(state => state.hasRole);
	const isAdmin = hasRole(['admin']);
	const { operators } = useOperatorStore();

	const operatorNames = useMemo(() => {
		const map: Record<number, string> = {};
		for (const op of operators) {
			map[op.id] = op.name;
		}
		return map;
	}, [operators]);

	if (!employee) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Данные пользователя</DialogTitle>
				</DialogHeader>

				<div className="space-y-2.5">
					<div className="flex justify-between">
						<span className="text-muted-foreground">ФИО:</span>
						<span className="font-medium">
							{employee.userData?.firstName}{' '}
							{employee.userData?.lastName}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">ID:</span>
						<span className="font-medium">{employee.id}</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">Email:</span>
						<span className="font-medium">{employee.email}</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">Роль:</span>
						<span className="font-medium">
							{ROLE_LABELS[employee.role] ?? employee.role}
						</span>
					</div>

					{isAdmin && (
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Агентство:
						</span>
						<span className="font-medium">
							{employee.operatorId
								? (operatorNames[employee.operatorId] ?? '—')
								: 'Summa Group'}
						</span>
					</div>
				)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
