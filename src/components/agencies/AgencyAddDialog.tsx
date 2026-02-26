import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const PARTNERS = [
	{ id: 1, label: 'Apex' },
	{ id: 2, label: 'Gross' },
	{ id: 3, label: 'Kapital' },
] as const;

const agencyAddSchema = z.object({
	name: z.string().min(1, 'Название обязательно'),
	legalName: z.string().min(1, 'Юридическое название обязательно'),
	address: z.string().min(1, 'Адрес обязателен'),
});

type AgencyAddFormData = z.infer<typeof agencyAddSchema>;

interface AgencyAddDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: any) => void;
}

export default function AgencyAddDialog({
	isOpen,
	onClose,
	onSave,
}: AgencyAddDialogProps) {
	const [selectedPartners, setSelectedPartners] = useState<number[]>([]);

	const form = useForm<AgencyAddFormData>({
		resolver: zodResolver(agencyAddSchema),
		defaultValues: {
			name: '',
			legalName: '',
			address: '',
		},
	});

	useEffect(() => {
		if (!isOpen) {
			form.reset();
			setSelectedPartners([]);
		}
	}, [isOpen, form]);

	const togglePartner = (partnerId: number) => {
		setSelectedPartners(prev =>
			prev.includes(partnerId)
				? prev.filter(id => id !== partnerId)
				: [...prev, partnerId],
		);
	};

	const handleSubmit = (data: AgencyAddFormData) => {
		onSave({
			name: data.name,
			operatorData: {
				legalName: data.legalName,
				address: data.address,
			},
			partners: selectedPartners,
			active: true,
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Добавить турагентство</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Название</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Название агентства"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="legalName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Юридическое название</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Юридическое название"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Адрес</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Введите адрес"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-1">
							<label className="font-medium text-sm">
								Страховые компании
							</label>
							<div className="flex gap-4 mt-1">
								{PARTNERS.map(partner => (
									<div
										key={partner.id}
										className="flex items-center gap-2"
									>
										<Checkbox
											className="border-input"
											checked={selectedPartners.includes(
												partner.id,
											)}
											onCheckedChange={() =>
												togglePartner(partner.id)
											}
										/>
										<span className="text-sm">
											{partner.label}
										</span>
									</div>
								))}
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
							>
								Отмена
							</Button>
							<Button type="submit">Сохранить</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
