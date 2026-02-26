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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '../ui/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import type { Employee } from '@/store/useEmployeeStore';

const employeeEditSchema = z
	.object({
		firstName: z.string().min(1, 'Имя обязательно'),
		lastName: z.string().min(1, 'Фамилия обязательна'),
		email: z.string().email('Введите корректный email'),
		password: z.string().optional(),
		confirmPassword: z.string().optional(),
	})
	.refine(
		data => {
			if (data.password || data.confirmPassword) {
				return data.password === data.confirmPassword;
			}
			return true;
		},
		{
			message: 'Пароли не совпадают',
			path: ['confirmPassword'],
		},
	)
	.refine(
		data => {
			if (data.password && data.password.length < 6) return false;
			return true;
		},
		{
			message: 'Пароль должен содержать минимум 6 символов',
			path: ['password'],
		},
	);

type EmployeeEditFormData = z.infer<typeof employeeEditSchema>;

interface EmployeeEditDialogProps {
	employee: Employee | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: any) => void;
}

export default function EmployeeEditDialog({
	employee,
	isOpen,
	onClose,
	onSave,
}: EmployeeEditDialogProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<EmployeeEditFormData>({
		resolver: zodResolver(employeeEditSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	useEffect(() => {
		if (employee) {
			form.reset({
				firstName: employee.userData?.firstName ?? '',
				lastName: employee.userData?.lastName ?? '',
				email: employee.email,
				password: '',
				confirmPassword: '',
			});
		}
	}, [employee, form]);

	useEffect(() => {
		if (!isOpen) {
			form.reset();
			setShowPassword(false);
			setShowConfirmPassword(false);
		}
	}, [isOpen, form]);

	const handleSubmit = (data: EmployeeEditFormData) => {
		const payload: any = {
			email: data.email,
			userData: {
				firstName: data.firstName,
				lastName: data.lastName,
			},
		};

		if (data.password) {
			payload.password = data.password;
		}
		onSave(payload);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Редактировать сотрудника</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Имя</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Иван" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Фамилия</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Иванов"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="example@mail.com"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Новый пароль{' '}
										<span className="font-normal text-muted-foreground">
											(необязательно)
										</span>
									</FormLabel>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												{...field}
												type={
													showPassword
														? 'text'
														: 'password'
												}
												placeholder="Оставьте пустым, чтобы не менять"
												autoComplete="new-password"
											/>
											<InputGroupAddon
												align="inline-end"
												className="h-9 font-normal text-foreground cursor-pointer"
												onClick={() =>
													setShowPassword(
														!showPassword,
													)
												}
											>
												{showPassword ? (
													<EyeIcon className="w-4 h-4" />
												) : (
													<EyeOffIcon className="w-4 h-4" />
												)}
											</InputGroupAddon>
										</InputGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Повторить пароль</FormLabel>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												{...field}
												type={
													showConfirmPassword
														? 'text'
														: 'password'
												}
												placeholder="Повторите пароль"
												autoComplete="new-password"
											/>
											<InputGroupAddon
												align="inline-end"
												className="h-9 font-normal text-foreground cursor-pointer"
												onClick={() =>
													setShowConfirmPassword(
														!showConfirmPassword,
													)
												}
											>
												{showConfirmPassword ? (
													<EyeIcon className="w-4 h-4" />
												) : (
													<EyeOffIcon className="w-4 h-4" />
												)}
											</InputGroupAddon>
										</InputGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
