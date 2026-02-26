import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { v4 as uuidv4 } from 'uuid';
import type { Tourist } from '@/types/tourist';
import { formatDate, calculateAge, formatAges } from '@/utils/utils';

interface TouristSelectProps {
	value: Tourist[];
	onValueChange: (tourists: Tourist[]) => void;
	placeholder?: string;
	maxTourists?: number;
}

export function TouristSelect({
	value,
	onValueChange,
	placeholder = 'Туристы',
	maxTourists = 6,
}: TouristSelectProps) {
	const [open, setOpen] = useState(false);

	const handleDateChange = (id: string, inputValue: string) => {
		const formatted = formatDate(inputValue);
		const age = calculateAge(formatted);

		const newTourists = value.map(t =>
			t.id === id ? { ...t, birthdate: formatted, age } : t,
		);

		onValueChange(newTourists);
	};

	const addTourist = () => {
		if (value.length < maxTourists) {
			const newTourists = [
				...value,
				{ id: uuidv4(), birthdate: '', age: null },
			];
			onValueChange(newTourists);
		}
	};

	const removeTourist = (id: string) => {
		if (value.length === 1) return;

		const newTourists = value.filter(t => t.id !== id);
		onValueChange(newTourists);
	};

	const getHeaderText = () => {
		const validAges = value.filter(t => t.age !== null).map(t => t.age!);

		if (validAges.length === 0) {
			return placeholder;
		}

		return formatAges(validAges);
	};

	return (
		<div className="space-y-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn(
							value.some(t => t.age !== null)
								? 'text-foreground'
								: 'text-muted-foreground',
							'justify-between w-full focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-ring/50',
						)}
					>
						<span className="truncate">{getHeaderText()}</span>
						<ChevronDown className="opacity-50 ml-2 w-4 h-4 text-foreground shrink-0" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="p-0"
					align="start"
					style={{ width: 'var(--radix-popover-trigger-width)' }}
				>
					<div className="space-y-2 p-2 max-h-[315px] overflow-y-auto">
						{value.map(tourist => (
							<div
								key={tourist.id}
								className="flex items-center gap-2 w-full"
							>
								<Input
									type="text"
									value={tourist.birthdate}
									onChange={e =>
										handleDateChange(
											tourist.id,
											e.target.value,
										)
									}
									placeholder="дд.мм.гггг"
									maxLength={10}
									className="flex-1"
								/>

								{value.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="hover:bg-destructive/10 rounded w-6 h-6 text-destructive hover:text-destructive"
										onClick={() =>
											removeTourist(tourist.id)
										}
									>
										<X className="w-4 h-4" />
									</Button>
								)}
							</div>
						))}
						<Button
							type="button"
							className="w-full"
							onClick={addTourist}
							disabled={value.length >= maxTourists}
						>
							Добавить туриста
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
