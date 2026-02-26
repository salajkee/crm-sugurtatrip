import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { COUNTRIES } from '@/constants/countries';
import { useState } from 'react';

interface CountrySelectProps {
	value?: string[];
	onValueChange?: (value: string[]) => void;
	placeholder?: string;
	maxSelection?: number;
}

export function CountrySelect({
	value = [],
	onValueChange,
	placeholder = 'Выберите страны...',
	maxSelection = 6,
}: CountrySelectProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const handleSelect = (countryValue: string) => {
		let newValue: string[];
		let shouldClose = false;

		if (value.includes(countryValue)) {
			newValue = value.filter(v => v !== countryValue);
		} else {
			if (value.length < maxSelection) {
				newValue = [...value, countryValue];
				shouldClose = true;
			} else {
				return;
			}
		}

		onValueChange?.(newValue);
		if (shouldClose) {
			setOpen(false);
		}
	};

	const handleRemove = (countryValue: string) => {
		const newValue = value.filter(v => v !== countryValue);
		onValueChange?.(newValue);
	};

	const selectedLabels = value
		.map(v => COUNTRIES.find(c => c.alpha3 === v)?.name)
		.filter(Boolean)
		.join(', ');

	const filteredCountries = COUNTRIES.filter(country =>
		country.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn(
							value.length > 0
								? 'text-foreground'
								: 'text-muted-foreground',
							'justify-between w-full focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-ring/50',
						)}
					>
						<span className="truncate">
							{value.length > 0 ? selectedLabels : placeholder}
						</span>
						<ChevronDown className="opacity-50 ml-2 w-4 h-4 text-foreground shrink-0" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="p-0"
					align="start"
					style={{ width: 'var(--radix-popover-trigger-width)' }}
				>
					<div>
						<div className="p-2 pb-1">
							<Input
								type="text"
								placeholder="Поиск страны..."
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								className="w-full"
							/>
						</div>

						<div className="space-y-1 p-2 pt-1 max-h-[250px] overflow-y-auto">
							{filteredCountries.length === 0 ? (
								<div className="py-4 text-muted-foreground text-sm text-center">
									Страна не найдена
								</div>
							) : (
								filteredCountries.map(country => {
									const isSelected = value.includes(
										country.alpha3,
									);
									const isDisabled =
										!isSelected &&
										value.length >= maxSelection;

									return (
										<Button
											variant={'ghost'}
											key={country.alpha3}
											type="button"
											onClick={() =>
												handleSelect(country.alpha3)
											}
											disabled={isDisabled}
											className={cn(
												'flex items-center gap-2 hover:bg-accent px-3 py-2 focus-visible:border-none rounded-md focus-visible:ring-2 focus-visible:ring-ring/50 ring-offset-0 w-full text-sm text-left transition-colors',
												isSelected && 'bg-accent',
												isDisabled &&
													'opacity-50 cursor-not-allowed',
											)}
										>
											<span className="flex-1">
												{country.name}
											</span>
											{isSelected && (
												<div
													role="button"
													tabIndex={0}
													className="flex justify-center items-center hover:bg-destructive/10 focus-visible:border-none rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 w-6 h-6 text-destructive hover:text-destructive"
													onClick={e => {
														e.stopPropagation();
														handleRemove(
															country.alpha3,
														);
													}}
												>
													<X className="w-4 h-4" />
												</div>
											)}
										</Button>
									);
								})
							)}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
