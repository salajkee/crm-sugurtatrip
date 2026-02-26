import { Button } from '@/components/ui/button';
import type { PolicyCardData } from '@/types/policy';
import { PARTNER_LOGOS, PARTNER_NAMES } from '@/constants/partners';

interface PolicyCardProps {
	policy: PolicyCardData;
	onOrder: (programId: number) => void;
}

export function PolicyCard({ policy, onOrder }: PolicyCardProps) {
	const logo = PARTNER_LOGOS[policy.partner];
	const partnerName = PARTNER_NAMES[policy.partner];

	return (
		<div className="p-4 border rounded-lg">
			<div className="flex items-center">
				<div className="bg-gray-100 p-1 rounded">
					<img
						src={logo}
						alt={policy.partner}
						className="w-10 h-10 object-contain"
					/>
				</div>
				<div className="ml-3">
					<span className="font-medium text-sm">{partnerName}</span>
					<div className="font-bold text-primary">{policy.name}</div>
				</div>

				{policy.isBestseller && (
					<span className="bg-green-200 mx-auto px-2 py-1 rounded text-green-700 text-xs">
						Хит продаж
					</span>
				)}

				<div className="mr-3 ml-auto font-bold text-primary text-base">
					{policy.price.toLocaleString()} UZS
				</div>

				<Button onClick={() => onOrder(policy.programId)}>
					Выбрать
				</Button>
			</div>
		</div>
	);
}
