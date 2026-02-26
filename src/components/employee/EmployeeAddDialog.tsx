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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '../ui/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOperatorStore } from '@/store/useOperatorStore';

const employeeAddSchema = z
	.object({
		firstName: z.string().min(1, 'Имя обязательно'),
		lastName: z.string().min(1, 'Фамилия обязательна'),
		email: z.string().email('Введите корректный email'),
		role: z.enum(['admin', 'operator_admin', 'operator_manager']),
		operatorId: z.string().optional(),
		password: z
			.string()
			.min(6, 'Пароль должен содержать минимум 6 символов'),
		confirmPassword: z.string().min(1, 'Повторите пароль'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'],
	});

type EmployeeAddFormData = z.infer<typeof employeeAddSchema>;

interface EmployeeAddDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: any) => void;
}

export default function EmployeeAddDialog({
	isOpen,
	onClose,
	onSave,
}: EmployeeAddDialogProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const user = useAuthStore(state => state.user);
	const hasRole = useAuthStore(state => state.hasRole);
	const isAdmin = hasRole(['admin']);
	const isOperatorAdmin = hasRole(['operator_admin']);

	const { operators, fetchOperators } = useOperatorStore();

	useEffect(() => {
		if (isOpen && isAdmin && operators.length === 0) {
			fetchOperators();
		}
	}, [isOpen, isAdmin, operators.length, fetchOperators]);

	const form = useForm<EmployeeAddFormData>({
		resolver: zodResolver(employeeAddSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			role: isOperatorAdmin ? 'operator_manager' : undefined,
			operatorId: undefined,
			password: '',
			confirmPassword: '',
		},
	});

	useEffect(() => {
		if (!isOpen) {
			form.reset();
			setShowPassword(false);
			setShowConfirmPassword(false);
		}
	}, [isOpen, form]);

	const handleSubmit = (data: EmployeeAddFormData) => {
		let operatorId: number | null = null;

		if (isAdmin) {
			operatorId = data.operatorId ? Number(data.operatorId) : null;
		} else if (isOperatorAdmin) {
			operatorId = user?.operatorId ?? null;
		}

		const payload = {
			email: data.email,
			password: data.password,
			role: isOperatorAdmin ? 'operator_manager' : data.role,
			operatorId,
			active: true,
			userData: {
				firstName: data.firstName,
				lastName: data.lastName,
			},
		};
		onSave(payload);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Добавить сотрудника</DialogTitle>
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

						{!isOperatorAdmin && (
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Роль</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Выберите роль" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="admin">
													Admin
												</SelectItem>
												<SelectItem value="operator_admin">
													Operator Admin
												</SelectItem>
												<SelectItem value="operator_manager">
													Operator Manager
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{isAdmin && (
							<FormField
								control={form.control}
								name="operatorId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Оператор</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Выберите оператора" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{operators.map(op => (
													<SelectItem
														key={op.id}
														value={String(op.id)}
													>
														{op.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												{...field}
												type={
													showPassword
														? 'text'
														: 'password'
												}
												placeholder="Введите пароль"
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
