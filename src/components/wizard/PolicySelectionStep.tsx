import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStepperStore } from '@/store/useStepperStore';
import { Label } from '@/components/ui/label';
import { PolicyFilters } from '@/components/policy/PolicyFilters';
import { PolicyCard } from '@/components/policy/PolicyCard';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, parse } from 'date-fns';
import { CountrySelect } from './CountrySelect';
import { TouristSelect } from './TouristSelect';
import { TripDatePicker } from './TripDatePicker';
import { filterPolicies, mapPoliciesToInsurance } from '@/utils/policyMapper';
import { policyService } from '@/services/policyService';
import { usePolicySearchStore } from '@/store/usePolicySearchStore';
import {
	policySearchSchema,
	type PolicySearchFormData,
} from '@/schemas/policySearchSchema';

export const PolicySelectionStep = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [_error, setError] = useState<string | null>(null);

	const {
		countries,
		tourists,
		startDate,
		endDate,
		typeId,
		purposeId,
		multiId,
		showResults,
		policies,

		setCountries,
		setTourists,
		setStartDate,
		setEndDate,
		setTypeId,
		setPurposeId,
		setMultiId,
		setProgramId,
		setPartner,
		setShowResults,
		setPolicies,
		getRequestData,
	} = usePolicySearchStore();

	const { nextStep } = useStepperStore();

	const parseDateFromStore = (
		dateString: string | null,
	): Date | undefined => {
		if (!dateString) return undefined;
		try {
			if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
				return parse(dateString, 'dd.MM.yyyy', new Date());
			}
			return new Date(dateString);
		} catch {
			return undefined;
		}
	};

	const {
		setValue,
		trigger,
		formState: { errors },
	} = useForm<PolicySearchFormData>({
		resolver: zodResolver(policySearchSchema),
		defaultValues: {
			countries,
			tourists:
				tourists.length > 0
					? tourists
					: [{ id: uuidv4(), birthdate: '', age: null }],
			startDate: parseDateFromStore(startDate),
			endDate: parseDateFromStore(endDate),
		},
		mode: 'onChange',
	});

	const searchPolicies = async (currentTypeId = typeId) => {
		setIsLoading(true);
		setError(null);

		try {
			const requestData = getRequestData();
			const { data } = await policyService.search(requestData);

			const allPolicies = mapPoliciesToInsurance(data);
			const filtered = filterPolicies(allPolicies, currentTypeId);

			if (filtered.length === 0) {
				setError('Полисы не найдены. Попробуйте изменить параметры.');
				return;
			}

			setPolicies(filtered);
		} catch (err) {
			setError('Ошибка при поиске полисов. Попробуйте еще раз.');
			console.error('Search error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = async () => {
		const isFormValid = await trigger();
		if (!isFormValid) return;

		setShowResults(true);
		await searchPolicies();
	};

	const handleTypeChange = async (value: number) => {
		setTypeId(value);
		setMultiId(value === 1 ? 1 : 0);
		await searchPolicies(value);
	};

	const handleMultiChange = async (value: number) => {
		setMultiId(value);
		await searchPolicies();
	};

	const handlePurposeChange = async (value: number) => {
		setPurposeId(value);
		await searchPolicies();
	};

	const handleSelectPolicy = (policyId: number) => {
		const selected = policies.find(p => p.programId === policyId);
		setProgramId(policyId);
		setPartner(selected?.partner?.toLowerCase() ?? '');
		nextStep();
	};

	const handleStartDateChange = (date: Date | undefined) => {
		const dateString = date ? format(date, 'dd.MM.yyyy') : null;
		setStartDate(dateString);
		setValue('startDate', date, { shouldValidate: true });
	};

	const handleEndDateChange = (date: Date | undefined) => {
		const dateString = date ? format(date, 'dd.MM.yyyy') : null;
		setEndDate(dateString);
		setValue('endDate', date, { shouldValidate: true });
	};

	return (
		<div>
			<h3 className="mb-4 font-semibold text-lg">Параметры поездки</h3>
			<div className="flex items-start space-x-3">
				<div className="w-full min-w-[320px]">
					<Label htmlFor="countries">
						Страны <span className="text-destructive">*</span>
					</Label>
					<CountrySelect
						value={countries}
						onValueChange={value => {
							setCountries(value);
							setValue('countries', value, {
								shouldValidate: true,
							});
						}}
						placeholder="Куда?"
						maxSelection={6}
					/>
					{errors.countries && (
						<p className="mt-1 text-destructive text-sm">
							{errors.countries.message}
						</p>
					)}
				</div>

				<div>
					<Label>
						Даты поездки <span className="text-destructive">*</span>
					</Label>
					<TripDatePicker
						startDate={parseDateFromStore(startDate)}
						endDate={parseDateFromStore(endDate)}
						onStartDateChange={handleStartDateChange}
						onEndDateChange={handleEndDateChange}
					/>
					{(errors.startDate || errors.endDate) && (
						<p className="mt-1 text-destructive text-sm">
							{errors.startDate?.message ||
								errors.endDate?.message}
						</p>
					)}
				</div>

				<div className="w-full">
					<Label>
						Туристы <span className="text-destructive">*</span>
					</Label>
					<TouristSelect
						value={tourists}
						onValueChange={value => {
							setTourists(value);
							setValue('tourists', value, {
								shouldValidate: true,
							});
						}}
						maxTourists={6}
					/>
					{errors.tourists && (
						<p className="mt-1 text-destructive text-sm">
							{errors.tourists.message}
						</p>
					)}
				</div>

				<Button
					className="mt-6"
					onClick={handleSearch}
					disabled={isLoading}
				>
					{isLoading ? <Loader2 className="animate-spin" /> : 'Найти'}
				</Button>
			</div>

			{showResults && (
				<div className="mt-6">
					<PolicyFilters
						typeId={typeId}
						purposeId={purposeId}
						multiId={multiId}
						setTypeId={handleTypeChange}
						setPurposeId={handlePurposeChange}
						setMultiId={handleMultiChange}
					/>
				</div>
			)}

			{showResults && isLoading && (
				<div className="flex flex-col justify-center items-center py-12">
					<Loader2 className="mb-4 w-12 h-12 text-primary animate-spin" />
					<p className="text-muted-foreground">Поиск полисов...</p>
				</div>
			)}

			{showResults && !isLoading && (
				<div className="gap-4 grid grid-cols-2 mt-6">
					{policies.map(policy => (
						<PolicyCard
							key={uuidv4()}
							policy={policy}
							onOrder={handleSelectPolicy}
						/>
					))}
				</div>
			)}
		</div>
	);
};
