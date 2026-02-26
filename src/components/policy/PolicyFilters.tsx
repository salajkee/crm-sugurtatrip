import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PolicyFiltersProps {
	typeId: number;
	purposeId: number;
	multiId?: number;
	setTypeId: (value: number) => void;
	setPurposeId: (value: number) => void;
	setMultiId?: (value: number) => void;
}

export const PolicyFilters = ({
	typeId,
	purposeId,
	multiId,
	setTypeId,
	setPurposeId,
	setMultiId,
}: PolicyFiltersProps) => {
	return (
		<div className="gap-4 grid grid-cols-3 mb-6">
			<div>
				<Label>Тип полиса</Label>
				<Select
					value={typeId.toString()}
					onValueChange={val => setTypeId(Number(val))}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Выберите тип полиса" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="0">
							Однократное путешествие
						</SelectItem>
						<SelectItem value="1">
							Многократное путешествие
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{typeId === 1 && setMultiId && (
				<div>
					<Label>Дни пребывания</Label>
					<Select
						value={multiId?.toString()}
						onValueChange={val => setMultiId(Number(val))}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Выберите дни пребывания" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">
								30 дней пребывания в течение 92 дней
							</SelectItem>
							<SelectItem value="2">
								90 дней пребывания в течение 183 дней
							</SelectItem>
							<SelectItem value="3">
								90 дней пребывания в течение 365 дней
							</SelectItem>
							<SelectItem value="4">
								180 дней пребывания в течение 365 дней
							</SelectItem>
							<SelectItem value="5">
								30 дней пребывания в течение 365 дней
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}

			<div>
				<Label>Цель поездки</Label>
				<Select
					value={purposeId.toString()}
					onValueChange={val => setPurposeId(Number(val))}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Выберите цель поездки" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="0">Путешествие</SelectItem>
						<SelectItem value="1">Работа физическая</SelectItem>
						<SelectItem value="2">
							Спорт или активный отдых
						</SelectItem>
						<SelectItem value="3">Учеба за рубежом</SelectItem>
						<SelectItem value="4">Деловая поездка</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
