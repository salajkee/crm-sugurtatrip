import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Search, X } from 'lucide-react';
import { useState } from 'react';
import type { TouristData } from '@/types/tourist';
import { formatDate, formatPhone } from '@/utils/utils';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '../ui/input-group';

export interface TouristDataFormRef {
	validate: () => boolean;
}

interface TouristDataFormProps {
	touristNumber: number;
	data: TouristData;
	isPurchaser: boolean;
	onChange: (data: TouristData) => void;
	onBlur: (field: keyof TouristData) => void;
	onIsPurchaserChange: (value: boolean) => void;
	onSearchPassport: (series: string, number: string) => Promise<void>;
	onRemove: () => void;
	canRemove: boolean;
	showPurchaserSwitch: boolean;
	searchError?: string | null;
	errors?: {
		birthdate?: string;
		passportSeries?: string;
		passportNumber?: string;
		fullName?: string;
		lastName?: string;
		firstName?: string;
		phone?: string;
	};
}

export const TouristDataForm = ({
	touristNumber,
	data,
	isPurchaser,
	onChange,
	onBlur,
	onIsPurchaserChange,
	onSearchPassport,
	onRemove,
	canRemove,
	showPurchaserSwitch,
	searchError,
	errors,
}: TouristDataFormProps) => {
	const [isSearching, setIsSearching] = useState(false);

	const handleFieldChange = (field: keyof TouristData, value: any) => {
		onChange({ ...data, [field]: value });
	};

	const handleBirthdateChange = (value: string) => {
		handleFieldChange('birthdate', formatDate(value));
	};

	const handlePassportSeriesChange = (value: string) => {
		handleFieldChange(
			'passportSeries',
			value.toUpperCase().replace(/[^A-Z]/g, ''),
		);
	};

	const handlePassportNumberChange = (value: string) => {
		handleFieldChange('passportNumber', value.replace(/\D/g, ''));
	};

	const handlePassportSearch = async () => {
		if (!data.passportSeries || !data.passportNumber || !data.birthdate)
			return;
		setIsSearching(true);
		try {
			await onSearchPassport(data.passportSeries, data.passportNumber);
		} finally {
			setIsSearching(false);
		}
	};

	const isResident = data.residency === 1;

	return (
		<div className="relative bg-gray-50 p-6 rounded-lg">
			{canRemove && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="top-4 right-4 absolute hover:bg-destructive/10 text-destructive hover:text-destructive"
					onClick={onRemove}
				>
					<X className="w-5 h-5" />
				</Button>
			)}

			<h3 className="mb-4 font-semibold text-lg">
				Путешественник {touristNumber}
			</h3>

			{showPurchaserSwitch && (
				<div className="flex items-center gap-3 mb-6">
					<Switch
						checked={isPurchaser}
						onCheckedChange={onIsPurchaserChange} // [1] теперь через пропс
					/>
					<Label className="cursor-pointer">
						Путешественник {touristNumber} является покупателем
					</Label>
				</div>
			)}

			<div className="gap-4 grid grid-cols-3">
				<div>
					<Label>Резидент</Label>
					<Select
						value={data.residency.toString()}
						onValueChange={value =>
							handleFieldChange('residency', Number(value))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Выберите" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">
								Гражданин Узбекистана
							</SelectItem>
							<SelectItem value="0">Иностранец</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label>Дата рождения</Label>
					<Input
						type="text"
						placeholder="дд.мм.гггг"
						value={data.birthdate}
						onChange={e => handleBirthdateChange(e.target.value)}
						onBlur={() => onBlur('birthdate')}
						maxLength={10}
					/>
					{(searchError || errors?.birthdate) && (
						<p className="mt-1 text-destructive text-sm">
							{searchError || errors?.birthdate}
						</p>
					)}
				</div>

				<div>
					<Label>Серия и номер паспорта</Label>
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="Серия"
							value={data.passportSeries}
							onChange={e =>
								handlePassportSeriesChange(e.target.value)
							}
							onBlur={() => onBlur('passportSeries')}
							className="w-20"
							maxLength={2}
						/>
						<Input
							type="text"
							placeholder="Номер"
							value={data.passportNumber}
							onChange={e =>
								handlePassportNumberChange(e.target.value)
							}
							onBlur={() => onBlur('passportNumber')}
							className="flex-1"
							maxLength={7}
						/>
						{isResident && (
							<Button
								type="button"
								variant="default"
								size="icon"
								onClick={handlePassportSearch}
								disabled={
									isSearching ||
									!data.passportSeries ||
									data.passportSeries.length < 2 ||
									!data.passportNumber ||
									data.passportNumber.length < 7 ||
									!data.birthdate ||
									data.birthdate.length < 10
								}
							>
								{isSearching ? (
									<LoaderCircle className="w-4 h-4 animate-spin" />
								) : (
									<Search className="w-4 h-4" />
								)}
							</Button>
						)}
					</div>
					{searchError && (
						<p className="mt-1 text-destructive text-sm">
							{searchError}
						</p>
					)}
					{!searchError &&
						(errors?.passportSeries || errors?.passportNumber) && (
							<p className="mt-1 text-destructive text-sm">
								{errors.passportSeries || errors.passportNumber}
							</p>
						)}
				</div>

				{data.residency === 1 && (
					<div className="col-span-2">
						<Label>ФИО</Label>
						<Input
							type="text"
							placeholder="ФИО"
							value={data.fullName ?? ''}
							className="focus-visible:ring-0 cursor-not-allowed"
							readOnly
						/>
						{errors?.fullName && (
							<p className="mt-1 text-destructive text-sm">
								{errors.fullName}
							</p>
						)}
					</div>
				)}

				{data.residency === 0 && (
					<>
						<div>
							<Label>Фамилия</Label>
							<Input
								type="text"
								placeholder="Фамилия"
								value={data.lastName ?? ''}
								onChange={e =>
									handleFieldChange(
										'lastName',
										e.target.value,
									)
								}
								onBlur={() => onBlur('lastName')}
							/>
							{errors?.lastName && (
								<p className="mt-1 text-destructive text-sm">
									{errors.lastName}
								</p>
							)}
						</div>
						<div>
							<Label>Имя</Label>
							<Input
								type="text"
								placeholder="Имя"
								value={data.firstName ?? ''}
								onChange={e =>
									handleFieldChange(
										'firstName',
										e.target.value,
									)
								}
								onBlur={() => onBlur('firstName')}
							/>
							{errors?.firstName && (
								<p className="mt-1 text-destructive text-sm">
									{errors.firstName}
								</p>
							)}
						</div>
					</>
				)}

				{isPurchaser && (
					<div>
						<Label>Номер телефона</Label>
						<InputGroup>
							<InputGroupAddon className="py-1 pr-2 pl-3 h-9 font-normal text-foreground">
								+998
							</InputGroupAddon>
							<InputGroupInput
								type="tel"
								placeholder="00 000-00-00"
								value={data.phone ?? ''}
								onChange={e =>
									handleFieldChange(
										'phone',
										formatPhone(e.target.value),
									)
								}
								onBlur={() => onBlur('phone')}
								maxLength={12}
								className="pl-0 rounded-l-none"
							/>
						</InputGroup>
						{errors?.phone && (
							<p className="mt-1 text-destructive text-sm">
								{errors.phone}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
