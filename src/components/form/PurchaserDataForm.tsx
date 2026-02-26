import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { formatDate, formatPhone } from '@/utils/utils';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '../ui/input-group';

export interface PurchaserData {
	residency: number;
	birthdate: string;
	passportSeries: string;
	passportNumber: string;
	fullName?: string;
	lastName?: string;
	firstName?: string;
	phone: string;
	pinfl?: string;
	country?: string;
	address?: string;
	region?: number;
	district?: number;
	gender?: string;
}

export const defaultPurchaserData: PurchaserData = {
	residency: 1,
	birthdate: '',
	passportSeries: '',
	passportNumber: '',
	fullName: '',
	lastName: '',
	firstName: '',
	phone: '',
};

interface PurchaserDataFormProps {
	data: PurchaserData;
	onChange: (data: PurchaserData) => void;
	onBlur: (field: keyof PurchaserData) => void;
	onSearchPassport: (series: string, number: string) => Promise<void>;
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

export const PurchaserDataForm = ({
	data,
	onChange,
	onBlur,
	onSearchPassport,
	searchError,
	errors,
}: PurchaserDataFormProps) => {
	const [isSearching, setIsSearching] = useState(false);

	const handleFieldChange = (field: keyof PurchaserData, value: any) => {
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
			<h3 className="mb-4 font-semibold text-lg">Покупатель</h3>

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
									!data.passportNumber ||
									!data.birthdate ||
									data.birthdate.length < 10
								}
							>
								<Search className="w-4 h-4" />
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
							value={data.fullName}
							onChange={e =>
								handleFieldChange('fullName', e.target.value)
							}
							onBlur={() => onBlur('fullName')}
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
								value={data.lastName}
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
								value={data.firstName}
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

				<div>
					<Label>Номер телефона</Label>
					<InputGroup>
						<InputGroupAddon className="py-1 pr-2 pl-3 h-9 font-normal text-foreground">
							+998
						</InputGroupAddon>
						<InputGroupInput
							type="tel"
							placeholder="00 000-00-00"
							value={data.phone}
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
			</div>
		</div>
	);
};
