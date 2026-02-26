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
import type { Operator } from '@/store/useOperatorStore';

const agencyEditSchema = z.object({
	name: z.string().min(1, 'Название обязательно'),
	legalName: z.string().min(1, 'Юридическое название обязательно'),
	address: z.string().min(1, 'Адрес обязателен'),
});

type AgencyEditFormData = z.infer<typeof agencyEditSchema>;

interface AgencyEditDialogProps {
	agency: Operator | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: any) => void;
}

export default function AgencyEditDialog({
	agency,
	isOpen,
	onClose,
	onSave,
}: AgencyEditDialogProps) {
	const [selectedPartners, setSelectedPartners] = useState<number[]>([]);

	const form = useForm<AgencyEditFormData>({
		resolver: zodResolver(agencyEditSchema),
		defaultValues: {
			name: '',
			legalName: '',
			address: '',
		},
	});

	useEffect(() => {
		if (agency) {
			form.reset({
				name: agency.name,
				legalName: agency.operatorData?.legalName ?? '',
				address: agency.operatorData?.address ?? '',
			});
			const currentPartners =
				agency.partners?.map(p => p.partner.id) ?? [];
			setSelectedPartners(currentPartners);
		}
	}, [agency, form]);

	useEffect(() => {
		if (!isOpen) {
			form.reset();
			setSelectedPartners([]);
		}
	}, [isOpen, form]);

	const handleSubmit = (data: AgencyEditFormData) => {
		onSave({
			name: data.name,
			operatorData: {
				legalName: data.legalName,
				address: data.address,
			},
			partners: selectedPartners,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Редактировать турагентство</DialogTitle>
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
											placeholder="ООО Турфирма"
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
											placeholder="Махтумкули 144"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* <div className="space-y-1">
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
						</div> */}

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
