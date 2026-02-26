import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Operator } from '@/store/useOperatorStore';

interface AgencyViewDialogProps {
	agency: Operator | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function AgencyViewDialog({
	agency,
	isOpen,
	onClose,
}: AgencyViewDialogProps) {
	if (!agency) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Данные о турагенте</DialogTitle>
				</DialogHeader>

				<div className="space-y-2.5">
					<div className="flex justify-between">
						<span className="text-muted-foreground">ID:</span>
						<span className="font-medium">{agency.id}</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">Название</span>
						<span className="font-medium">{agency.name}</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Юридическое название:
						</span>
						<span className="font-medium">
							{agency.operatorData.legalName}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-muted-foreground">Адрес:</span>
						<span className="font-medium">
							{agency.operatorData.address}
						</span>
					</div>

					{/* <div className="flex justify-between">
						<span className="text-muted-foreground">
							Номер телефона
						</span>
						<span className="font-medium">
							{agency.operatorData.phoneNumber}
						</span>
					</div> */}

					<div className="flex justify-between">
						<span className="text-muted-foreground">Статус</span>
						<Badge
							variant="outline"
							className={
								agency.active
									? 'bg-green-50 text-green-700 border-green-200'
									: 'bg-gray-50 text-gray-700 border-gray-200'
							}
						>
							{agency.active ? 'Активен' : 'Неактивен'}
						</Badge>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
