import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@/components/ui/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
	email: z.string().email('Введите корректный email'),
	password: z.string().min(5, 'Пароль должен содержать минимум 5 символов'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const { login } = useAuthStore();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		try {
			await login(data.email, data.password);

			navigate('/');
		} catch {
			form.setError('root', { message: 'Неверный email или пароль' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1">
				<CardTitle className="font-bold text-2xl">Вход</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
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
											disabled={isLoading}
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
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<InputGroup className="overflow-hidden">
											<InputGroupInput
												{...field}
												type={
													showPassword
														? 'text'
														: 'password'
												}
												placeholder="Введите пароль"
												disabled={isLoading}
												className="rounded-md"
											/>
											<InputGroupAddon
												align="inline-end"
												className="right-3 absolute p-0 h-9 font-normal text-foreground cursor-pointer"
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

						{form.formState.errors.root && (
							<p className="text-destructive text-sm">
								{form.formState.errors.root.message}
							</p>
						)}

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? 'Вход...' : 'Войти'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
