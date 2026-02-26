import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { TouristDataForm } from '@/components/form/TouristDataForm';
import {
	PurchaserDataForm,
	defaultPurchaserData,
} from '@/components/form/PurchaserDataForm';
import { Button } from '@/components/ui/button';
import type { TouristData } from '@/types/tourist';
import type { PurchaserData } from '@/components/form/PurchaserDataForm';
import { usePolicySearchStore } from '@/store/usePolicySearchStore';
import { useTouristDataStore } from '@/store/useTouristDataStore';
import {
	createTouristDataStepSchema,
	type TouristDataStepFormData,
} from '@/schemas/touristSchemas';
import { touristService } from '@/services/touristService';
import type { PassportSearchResponse } from '@/types/tourist';

function cleanName(value: string): string {
	return value
		.replace(/[''`ʻʼ]/g, '')
		.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '')
		.trim();
}

function resolveName(eng: string, uz: string): string {
	if (eng && eng.trim()) return eng.trim();
	return cleanName(uz);
}

function mapGender(gender: number): string {
	return gender === 1 ? 'male' : 'female';
}

const FOREIGNER_DEFAULTS = {
	country: 'RU',
	pinfl: '12345678901234',
	address: 'World',
	region: 10,
	district: 1003,
	gender: '',
} as const;

export const TouristDataStep = () => {
	const tourists = usePolicySearchStore(state => state.tourists);
	const setTourists = usePolicySearchStore(state => state.setTourists);

	const isPurchaser = useTouristDataStore(state => state.isPurchaser);
	const setIsPurchaser = useTouristDataStore(state => state.setIsPurchaser);
	const touristsData = useTouristDataStore(state => state.touristsData);
	const setTouristsData = useTouristDataStore(state => state.setTouristsData);
	const setPurchaserData = useTouristDataStore(
		state => state.setPurchaserData,
	);
	const setIsFormValid = useTouristDataStore(state => state.setIsFormValid);
	const setTriggerValidation = useTouristDataStore(
		state => state.setTriggerValidation,
	);

	const formData = useMemo(
		() =>
			touristsData.length === tourists.length
				? touristsData
				: tourists.map(tourist => ({
						id: tourist.id,
						residency: 1,
						birthdate: tourist.birthdate,
						passportSeries: '',
						passportNumber: '',
						fullName: '',
						lastName: '',
						firstName: '',
						phone: '',
					})),
		[touristsData, tourists],
	);

	const schema = useMemo(
		() => createTouristDataStepSchema(isPurchaser),
		[isPurchaser],
	);

	const {
		formState: { isValid, errors },
		trigger,
		setValue,
		watch,
	} = useForm<TouristDataStepFormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			tourists: formData,
			purchaser: isPurchaser ? undefined : defaultPurchaserData,
		},
	});

	const [showAllErrors, setShowAllErrors] = useState(false);
	const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

	const [searchErrors, setSearchErrors] = useState<
		Record<string, string | null>
	>({});

	const setSearchError = (key: string, error: string | null) => {
		setSearchErrors(prev => ({ ...prev, [key]: error }));
	};

	const markFieldTouched = (path: string) => {
		setTouchedFields(prev => {
			const next = new Set(prev);
			next.add(path);
			return next;
		});
	};

	useEffect(() => {
		setIsFormValid(isValid);
	}, [isValid]);

	const isFirstRender = useRef(true);
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		trigger();
	}, [isPurchaser]);

	useEffect(() => {
		setTriggerValidation(async () => {
			setShowAllErrors(true);
			return trigger();
		});
		return () => setTriggerValidation(null);
	}, [trigger, setTriggerValidation]);

	const applySearchResult = useCallback(
		(
			current: TouristData,
			response: PassportSearchResponse,
		): TouristData => {
			const firstName = resolveName(response.name_eng, response.name_uz);
			const lastName = resolveName(
				response.surname_eng,
				response.surname_uz,
			);
			return {
				...current,
				fullName: `${lastName} ${firstName}`.trim(),
				firstName,
				lastName,
				pinfl: response.pinfl,
				country: 'UZ',
				address: response.address,
				region: response.region,
				district: response.district,
				gender: mapGender(response.gender),
			};
		},
		[],
	);

	const applySearchResultPurchaser = useCallback(
		(
			current: PurchaserData,
			response: PassportSearchResponse,
		): PurchaserData => {
			const firstName = resolveName(response.name_eng, response.name_uz);
			const lastName = resolveName(
				response.surname_eng,
				response.surname_uz,
			);
			return {
				...current,
				fullName: `${lastName} ${firstName}`.trim(),
				firstName,
				lastName,
				pinfl: response.pinfl,
				country: 'UZ',
				address: response.address,
				region: response.region,
				district: response.district,
				gender: mapGender(response.gender),
			};
		},
		[],
	);

	const handleTouristChange = (index: number, data: TouristData) => {
		const prev = formData[index];
		let updated = data;
		if (prev && prev.residency !== data.residency && data.residency === 0) {
			updated = {
				...data,
				...FOREIGNER_DEFAULTS,
				fullName: '',
				lastName: '',
				firstName: '',
			};
			setSearchError(`tourist-${index}`, null);
		}
		if (prev && prev.residency !== data.residency && data.residency === 1) {
			updated = {
				...data,
				pinfl: '',
				country: '',
				address: '',
				region: undefined,
				district: undefined,
				gender: '',
				fullName: '',
				lastName: '',
				firstName: '',
			};
			setSearchError(`tourist-${index}`, null);
		}
		const all = [...formData];
		all[index] = updated;
		setTouristsData(all);
		setValue(`tourists.${index}`, updated, { shouldValidate: true });
	};

	const handleTouristBlur = (index: number, field: keyof TouristData) => {
		markFieldTouched(`tourists.${index}.${field}`);
	};

	const handlePurchaserChange = (data: PurchaserData) => {
		let updated = data;
		const prev = watch('purchaser');
		if (prev && prev.residency !== data.residency && data.residency === 0) {
			updated = {
				...data,
				...FOREIGNER_DEFAULTS,
				fullName: '',
				lastName: '',
				firstName: '',
			};
			setSearchError('purchaser', null);
		}
		if (prev && prev.residency !== data.residency && data.residency === 1) {
			updated = {
				...data,
				pinfl: '',
				country: '',
				address: '',
				region: undefined,
				district: undefined,
				gender: '',
				fullName: '',
				lastName: '',
				firstName: '',
			};
			setSearchError('purchaser', null);
		}
		setPurchaserData(updated);
		setValue('purchaser', updated, { shouldValidate: true });
	};

	const handlePurchaserBlur = (field: keyof PurchaserData) => {
		markFieldTouched(`purchaser.${field}`);
	};

	const handleSearchTouristPassport = useCallback(
		async (index: number, series: string, number: string) => {
			const tourist = formData[index];
			if (!tourist || !tourist.birthdate || tourist.birthdate.length < 10)
				return;

			const errorKey = `tourist-${index}`;
			setSearchError(errorKey, null);

			try {
				const { data: response } =
					await touristService.searchByPassport({
						series,
						number,
						birthday: tourist.birthdate,
					});

				if (response.result !== 0) {
					setSearchError(errorKey, 'Введите корректные данные');
					return;
				}

				const updatedTourist = applySearchResult(tourist, response);
				const all = [...formData];
				all[index] = updatedTourist;
				setTouristsData(all);
				setValue(`tourists.${index}`, updatedTourist, {
					shouldValidate: true,
				});
			} catch {
				setSearchError(errorKey, 'Введите корректные данные');
			}
		},
		[formData, applySearchResult, setTouristsData, setValue],
	);

	const handleSearchPurchaserPassport = useCallback(
		async (series: string, number: string) => {
			const current = watch('purchaser');
			if (!current || !current.birthdate || current.birthdate.length < 10)
				return;

			setSearchError('purchaser', null);

			try {
				const { data: response } =
					await touristService.searchByPassport({
						series,
						number,
						birthday: current.birthdate,
					});

				if (response.result !== 0) {
					setSearchError('purchaser', 'Введите корректные данные');
					return;
				}

				const updated = applySearchResultPurchaser(
					current as PurchaserData,
					response,
				);
				setPurchaserData(updated);
				setValue('purchaser', updated, { shouldValidate: true });
			} catch {
				setSearchError('purchaser', 'Введите корректные данные');
			}
		},
		[watch, applySearchResultPurchaser, setPurchaserData, setValue],
	);

	const handleIsPurchaserChange = (value: boolean) => {
		setIsPurchaser(value);
		setValue('purchaser', value ? undefined : defaultPurchaserData, {
			shouldValidate: true,
		});
	};

	const handleRemoveTourist = (index: number) => {
		if (index === 0) return;
		const updated = formData.filter((_, i) => i !== index);
		setTouristsData(updated);
		setTourists(tourists.filter((_, i) => i !== index));
		setValue('tourists', updated as [TouristData, ...TouristData[]], {
			shouldValidate: true,
		});
	};

	const handleAddTourist = () => {
		const newTouristId = uuidv4();
		const newTourist: TouristData = {
			id: newTouristId,
			residency: 1,
			birthdate: '',
			passportSeries: '',
			passportNumber: '',
			fullName: '',
			lastName: '',
			firstName: '',
			phone: '',
		};
		setTourists([
			...tourists,
			{ id: newTouristId, birthdate: '', age: null },
		]);
		setTouristsData([...formData, newTourist]);
		setValue(
			'tourists',
			[...formData, newTourist] as unknown as [TouristData, ...TouristData[]],
			{ shouldValidate: true },
		);
	};

	const getTouristErrors = (index: number) => {
		const e = errors.tourists?.[index];
		const show = (field: string) =>
			showAllErrors || touchedFields.has(`tourists.${index}.${field}`);
		return {
			birthdate: show('birthdate') ? e?.birthdate?.message : undefined,
			passportSeries: show('passportSeries')
				? e?.passportSeries?.message
				: undefined,
			passportNumber: show('passportNumber')
				? e?.passportNumber?.message
				: undefined,
			fullName: show('fullName') ? e?.fullName?.message : undefined,
			lastName: show('lastName') ? e?.lastName?.message : undefined,
			firstName: show('firstName') ? e?.firstName?.message : undefined,
			phone: show('phone') ? e?.phone?.message : undefined,
		};
	};

	const getPurchaserErrors = () => {
		const e = errors.purchaser;
		const show = (field: string) =>
			showAllErrors || touchedFields.has(`purchaser.${field}`);
		return {
			birthdate: show('birthdate') ? e?.birthdate?.message : undefined,
			passportSeries: show('passportSeries')
				? e?.passportSeries?.message
				: undefined,
			passportNumber: show('passportNumber')
				? e?.passportNumber?.message
				: undefined,
			fullName: show('fullName') ? e?.fullName?.message : undefined,
			lastName: show('lastName') ? e?.lastName?.message : undefined,
			firstName: show('firstName') ? e?.firstName?.message : undefined,
			phone: show('phone') ? e?.phone?.message : undefined,
		};
	};

	return (
		<div>
			<h2 className="mb-6 font-semibold text-2xl">Данные туристов</h2>

			<div className="space-y-4">
				{formData.map((tourist, index) => (
					<TouristDataForm
						key={tourist.id}
						touristNumber={index + 1}
						data={tourist}
						isPurchaser={index === 0 ? isPurchaser : false}
						onIsPurchaserChange={
							index === 0 ? handleIsPurchaserChange : () => {}
						}
						onChange={data => handleTouristChange(index, data)}
						onBlur={field => handleTouristBlur(index, field)}
						onSearchPassport={(series, number) =>
							handleSearchTouristPassport(index, series, number)
						}
						onRemove={() => handleRemoveTourist(index)}
						canRemove={index !== 0}
						showPurchaserSwitch={index === 0}
						searchError={searchErrors[`tourist-${index}`]}
						errors={getTouristErrors(index)}
					/>
				))}
			</div>

			<Button type="button" onClick={handleAddTourist} className="mt-6">
				Добавить туриста
			</Button>

			{!isPurchaser && (
				<div className="mt-6">
					<h2 className="mb-6 font-semibold text-2xl">
						Данные покупателя
					</h2>
					<PurchaserDataForm
						data={watch('purchaser') ?? defaultPurchaserData}
						onChange={handlePurchaserChange}
						onBlur={handlePurchaserBlur}
						onSearchPassport={handleSearchPurchaserPassport}
						searchError={searchErrors['purchaser']}
						errors={getPurchaserErrors()}
					/>
				</div>
			)}
		</div>
	);
};
