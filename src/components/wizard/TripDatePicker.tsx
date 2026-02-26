import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface TripDatePickerProps {
	startDate?: Date;
	endDate?: Date;
	onStartDateChange?: (date: Date | undefined) => void;
	onEndDateChange?: (date: Date | undefined) => void;
}

export function TripDatePicker({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
}: TripDatePickerProps) {
	const [openDeparture, setOpenDeparture] = useState(false);
	const [openReturn, setOpenReturn] = useState(false);

	const normalizeDate = (date?: Date) => {
		if (!date) return undefined;
		const d = new Date(date);
		d.setHours(12, 0, 0, 0);
		return d;
	};

	const handleDepartureSelect = (date: Date | undefined) => {
		const normalized = normalizeDate(date);
		onStartDateChange?.(normalized);
		setOpenDeparture(false);
	};

	const handleReturnSelect = (date: Date | undefined) => {
		const normalized = normalizeDate(date);
		onEndDateChange?.(normalized);
		setOpenReturn(false);
	};

	const formatDate = (date: Date | undefined) => {
		if (!date) return '';
		return format(date, 'dd.MM.yyyy', { locale: ru });
	};

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return (
		<div className="flex items-center space-x-3 rounded-lg w-full">
			<Popover open={openDeparture} onOpenChange={setOpenDeparture}>
				<PopoverTrigger asChild className="w-[241.6px]">
					<Button
						variant="outline"
						className={cn(
							'flex justify-start items-center hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0',
							!startDate && 'text-muted-foreground',
						)}
					>
						<div className="flex items-center gap-2">
							<CalendarIcon className="w-4 h-4" />
							<span className="font-medium">
								{startDate
									? formatDate(startDate)
									: 'Выберите дату'}
							</span>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-2 w-auto" align="start">
					<Calendar
						mode="single"
						selected={startDate}
						onSelect={handleDepartureSelect}
						disabled={date => {
							if (date < today) return true;
							if (endDate && date > endDate) return true;
							return false;
						}}
						locale={ru}
						initialFocus
						className="bg-white p-0"
					/>
				</PopoverContent>
			</Popover>

			{/* Обратно */}
			<Popover open={openReturn} onOpenChange={setOpenReturn}>
				<PopoverTrigger asChild className="w-[241.6px]">
					<Button
						variant="outline"
						className={cn(
							'flex justify-start items-center hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0',
							!endDate && 'text-muted-foreground',
						)}
					>
						<div className="flex items-center gap-2">
							<CalendarIcon className="w-4 h-4" />
							<span className="font-medium">
								{endDate
									? formatDate(endDate)
									: 'Выберите дату'}
							</span>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-2 w-auto" align="start">
					<Calendar
						mode="single"
						selected={endDate}
						onSelect={handleReturnSelect}
						disabled={date => {
							const minDate = startDate || today;
							return date < minDate;
						}}
						locale={ru}
						initialFocus
						className="bg-white p-0"
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
