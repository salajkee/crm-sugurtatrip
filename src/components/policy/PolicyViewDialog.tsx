import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { PolicyCreateResponse } from '@/types/policy';

interface PolicyViewDialogProps {
	policy: PolicyCreateResponse | null;
	isOpen: boolean;
	onClose: () => void;
}

const PARTNER_NAMES: Record<number, string> = {
	1: 'Apex',
	2: 'Gross',
	3: 'Kapital',
};

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
}

export default function PolicyViewDialog({
	policy,
	isOpen,
	onClose,
}: PolicyViewDialogProps) {
	if (!policy) return null;

	const partnerName = PARTNER_NAMES[policy.partnerId] ?? 'Партнер';

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[520px]">
				<DialogHeader>
					<DialogTitle>Полис #{policy.id}</DialogTitle>
				</DialogHeader>

				<div className="space-y-3">
					<div className="flex justify-between">
						<span className="text-muted-foreground">ID:</span>
						<span className="font-medium">{policy.id}</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">Партнер:</span>
						<span className="font-medium">{partnerName}</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">
							№ Договора:
						</span>
						<span className="font-medium">
							{policy.partnerContractId ?? '—'}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">Страны:</span>
						<span className="font-medium">
							{policy.countries.join(', ')}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Дата регистрации:
						</span>
						<span className="font-medium">
							{formatDate(policy.dateReg)}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Дата начала:
						</span>
						<span className="font-medium">
							{formatDate(policy.dateStart)}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Дата окончания:
						</span>
						<span className="font-medium">
							{formatDate(policy.dateEnd)}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">Сумма:</span>
						<span className="font-medium">
							{policy.amount != null
								? policy.amount.toLocaleString('ru-RU')
								: '—'}
						</span>
					</div>

					<div className="flex justify-between items-center">
						<span className="text-muted-foreground">Статус:</span>
						<Badge
							variant="outline"
							className={
								policy.paid
									? 'bg-green-50 text-green-700 border-green-200'
									: 'bg-yellow-50 text-yellow-700 border-yellow-200'
							}
						>
							{policy.paid ? 'Оплачен' : 'Не оплачен'}
						</Badge>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Пользователь:
						</span>
						<span className="font-medium">{policy.userId}</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
