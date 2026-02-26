import { Button } from '@/components/ui/button';
import { useTouristDataStore } from '@/store/useTouristDataStore';
import { usePolicySearchStore } from '@/store/usePolicySearchStore';
import { useStepperStore } from '@/store/useStepperStore';
import { usePaymentStore } from '@/store/usePaymentStore';
import {
	Pencil,
	Loader2,
	CalendarDays,
	Users,
	CheckCircle2,
	UserPlus,
	Download,
	Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { COUNTRIES } from '@/constants/countries';
import type { TouristData } from '@/types/tourist';
import type { PurchaserData } from '@/components/form/PurchaserDataForm';
import clickLogo from '@/assets/click-logo.svg';
import paymeLogo from '@/assets/payme-logo.svg';

type PersonLike = TouristData | PurchaserData;

const getDisplayName = (person: PersonLike): string => {
	if (person.residency === 1) {
		return person.fullName || '—';
	}
	return [person.firstName, person.lastName].filter(Boolean).join(' ') || '—';
};

const getPassport = (person: PersonLike): string => {
	return `${person.passportSeries} ${person.passportNumber}`;
};

const getCountryNames = (isoCodes: string[]): string => {
	return isoCodes
		.map(code => {
			const country = COUNTRIES.find(
				c => c.alpha2 === code || c.alpha3 === code,
			);
			return country?.name ?? code;
		})
		.join(', ');
};

interface InfoRowProps {
	label: string;
	value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
	<div className="flex justify-between items-baseline py-1.5">
		<span className="text-muted-foreground text-sm">{label}</span>
		<span className="font-medium text-sm">{value}</span>
	</div>
);

interface PersonBlockProps {
	title: string;
	person: PersonLike;
	showPhone?: boolean;
	badge?: string;
}

const PersonBlock = ({ title, person, showPhone, badge }: PersonBlockProps) => (
	<div className="bg-gray-50 p-5 rounded-lg h-full">
		<div className="flex items-center gap-2 mb-3">
			<h4 className="font-semibold text-base">{title}</h4>
			{badge && (
				<span className="bg-primary/10 px-2 py-0.5 rounded-full font-medium text-primary text-xs">
					{badge}
				</span>
			)}
		</div>
		<div className="divide-y divide-gray-200">
			<InfoRow label="ФИО" value={getDisplayName(person)} />
			<InfoRow label="Паспорт" value={getPassport(person)} />
			<InfoRow label="Дата рождения" value={person.birthdate || '—'} />
			{showPhone && (
				<InfoRow
					label="Телефон"
					value={person.phone ? `+998 ${person.phone}` : '—'}
				/>
			)}
		</div>
	</div>
);

export const ConfirmationStep = () => {
	const isPurchaser = useTouristDataStore(state => state.isPurchaser);
	const touristsData = useTouristDataStore(state => state.touristsData);
	const purchaserData = useTouristDataStore(state => state.purchaserData);

	const countries = usePolicySearchStore(state => state.countries);
	const startDate = usePolicySearchStore(state => state.startDate);
	const endDate = usePolicySearchStore(state => state.endDate);

	const navigate = useNavigate();
	const setCurrentStep = useStepperStore(state => state.setCurrentStep);
	const isLoading = usePaymentStore(state => state.isLoading);
	const isChecking = usePaymentStore(state => state.isChecking);
	const error = usePaymentStore(state => state.error);
	const isSuccess = usePaymentStore(state => state.isSuccess);
	const isPaid = usePaymentStore(state => state.isPaid);
	const policyUrl = usePaymentStore(state => state.policyUrl);
	const paymentData = usePaymentStore(state => state.paymentData);
	const issuePolicy = usePaymentStore(state => state.issuePolicy);
	const checkPayment = usePaymentStore(state => state.checkPayment);
	const resetPayment = usePaymentStore(state => state.reset);

	const handleEdit = () => {
		setCurrentStep(2);
	};

	const handleBack = () => {
		resetPayment();
		setCurrentStep(2);
	};

	const handleAddTourist = () => {
		const newTouristId = uuidv4();

		const currentTourists = usePolicySearchStore.getState().tourists;
		usePolicySearchStore
			.getState()
			.setTourists([
				...currentTourists,
				{ id: newTouristId, birthdate: '', age: null },
			]);

		const currentTouristsData = useTouristDataStore.getState().touristsData;
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
		useTouristDataStore
			.getState()
			.setTouristsData([...currentTouristsData, newTourist]);

		setCurrentStep(2);

		setTimeout(() => {
			window.scrollTo({
				top: document.body.scrollHeight,
				behavior: 'smooth',
			});
		}, 150);
	};

	const handleCheckPayment = async () => {
		await checkPayment();
	};

	const handleGoHome = () => {
		resetPayment();
		navigate('/');
	};

	const handlePay = async () => {
		await issuePolicy();
	};

	type DisplayPerson = {
		key: string;
		title: string;
		person: PersonLike;
		isPurchaser: boolean;
	};

	const people: DisplayPerson[] = [];

	if (isPurchaser) {
		touristsData.forEach((tourist, index) => {
			people.push({
				key: tourist.id,
				title: `Путешественник ${index + 1}`,
				person: tourist,
				isPurchaser: index === 0,
			});
		});
	} else {
		if (purchaserData) {
			people.push({
				key: 'purchaser',
				title: 'Покупатель',
				person: purchaserData,
				isPurchaser: true,
			});
		}
		touristsData.forEach((tourist, index) => {
			people.push({
				key: tourist.id,
				title: `Путешественник ${index + 1}`,
				person: tourist,
				isPurchaser: false,
			});
		});
	}

	if (isPaid && policyUrl) {
		return (
			<div>
				<div className="flex flex-col items-center py-8 text-center">
					<CheckCircle2 className="mb-4 w-16 h-16 text-green-500" />
					<h2 className="mb-2 font-semibold text-2xl">
						Оплата прошла успешно!
					</h2>
					<p className="text-muted-foreground">
						Полис готов к скачиванию
					</p>
				</div>

				<div className="flex justify-center gap-4">
					<a
						href={policyUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button size="lg" className="gap-2">
							<Download className="w-4 h-4" />
							Скачать полис PDF
						</Button>
					</a>

					<Button
						size="lg"
						variant="outline"
						className="gap-2"
						onClick={handleGoHome}
					>
						<Home className="w-4 h-4" />
						На главную
					</Button>
				</div>
			</div>
		);
	}

	if (isSuccess && paymentData) {
		return (
			<div>
				<div className="flex flex-col items-center py-8 text-center">
					<CheckCircle2 className="mb-4 w-16 h-16 text-green-500" />
					<h2 className="mb-2 font-semibold text-2xl">
						Полис сформирован
					</h2>
					<p className="mb-2 text-muted-foreground">
						Сумма к оплате:{' '}
						<span className="font-semibold text-foreground">
							{paymentData.stoimost_uzs.toLocaleString('ru-RU')}{' '}
							сум
						</span>
					</p>
					<p className="text-muted-foreground text-sm">
						Выберите способ оплаты
					</p>
				</div>

				<div className="flex justify-center gap-4">
					<a
						href={paymentData.click_link}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							size="lg"
							variant="outline"
							className="gap-2 min-w-[150px] h-12"
						>
							<img src={clickLogo} alt="Click" className="h-5" />
						</Button>
					</a>

					<a
						href={paymentData.payme_link}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							size="lg"
							variant="outline"
							className="gap-2 min-w-[150px] h-12"
						>
							<img src={paymeLogo} alt="Payme" className="h-5" />
						</Button>
					</a>
				</div>

				{error && (
					<p className="mt-4 text-center text-destructive text-sm">
						{error}
					</p>
				)}

				<div className="flex justify-center gap-4 mt-6">
					<Button onClick={handleBack} variant="outline">
						Назад
					</Button>
					<Button
						onClick={handleCheckPayment}
						disabled={isChecking}
					>
						{isChecking ? (
							<Loader2 className="mr-2 w-4 h-4 animate-spin" />
						) : null}
						Проверить оплату
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h2 className="mb-6 font-semibold text-2xl">Проверьте данные</h2>

			<div className="mb-6">
				<div className="flex items-center gap-2 mb-3">
					<CalendarDays className="w-5 h-5 text-muted-foreground" />
					<h3 className="font-semibold text-lg">
						Детали путешествия
					</h3>
				</div>
				<div className="bg-gray-50 p-5 rounded-lg">
					<div className="gap-6 grid grid-cols-3">
						<div>
							<p className="text-muted-foreground text-sm">
								Дата начала
							</p>
							<p className="font-medium">{startDate || '—'}</p>
						</div>
						<div>
							<p className="text-muted-foreground text-sm">
								Дата окончания
							</p>
							<p className="font-medium">{endDate || '—'}</p>
						</div>
						<div>
							<p className="text-muted-foreground text-sm">
								Страна
							</p>
							<p className="font-medium">
								{countries.length > 0
									? getCountryNames(countries)
									: '—'}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-6">
				<div className="flex items-center gap-2 mb-3">
					<Users className="w-5 h-5 text-muted-foreground" />
					<h3 className="font-semibold text-lg">Путешественники</h3>
				</div>
				<div className="gap-4 grid grid-cols-2">
					{people.map(
						({ key, title, person, isPurchaser: isBuyer }) => (
							<div key={key}>
								<PersonBlock
									title={title}
									person={person}
									showPhone={isBuyer}
									badge={isBuyer ? 'Покупатель' : undefined}
								/>
							</div>
						),
					)}
					<div
						onClick={handleAddTourist}
						className="flex justify-center items-center gap-3 hover:bg-primary/10 p-6 border-2 border-primary border-dashed rounded-xl text-primary text-xl transition cursor-pointer"
					>
						<UserPlus className="w-6 h-6" />
						<span>Добавить путешественника</span>
					</div>
				</div>
			</div>

			{error && <p className="mt-4 text-destructive text-sm">{error}</p>}

			<div className="flex justify-end gap-4 mt-8">
				<Button
					variant="outline"
					onClick={handleEdit}
					disabled={isLoading}
				>
					<Pencil className="mr-2 w-4 h-4" />
					Редактировать данные
				</Button>

				<Button
					onClick={handlePay}
					disabled={isLoading}
					className="w-[120px]"
				>
					{isLoading ? (
						<Loader2 className="mr-2 w-4 h-4 animate-spin" />
					) : (
						'Оплатить'
					)}
				</Button>
			</div>
		</div>
	);
};
