import * as z from 'zod';
import { isAdult } from '@/utils/utils';

const createTouristSchema = (isPurchaser: boolean, isFirst: boolean) =>
	z
		.object({
			id: z.string(),
			residency: z.number(),
			birthdate: z.string().min(10, 'Введите дату рождения'),
			passportSeries: z.string().min(2, 'Введите серию паспорта'),
			passportNumber: z.string().min(7, 'Введите номер паспорта'),
			fullName: z.string().optional(),
			lastName: z.string().optional(),
			firstName: z.string().optional(),
			phone: z.string().optional(),
		})
		.superRefine((data, ctx) => {
			// ФИО или имя/фамилия
			if (
				data.residency === 1 &&
				(!data.fullName || data.fullName.length < 2)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'Заполняется автоматически после поиска по паспорту и дате рождения',
					path: ['fullName'],
				});
			}
			if (data.residency === 0) {
				if (!data.lastName || data.lastName.length < 2)
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Введите фамилию',
						path: ['lastName'],
					});
				if (!data.firstName || data.firstName.length < 2)
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Введите имя',
						path: ['firstName'],
					});
			}
			// только для первого туриста если он покупатель
			if (isFirst && isPurchaser) {
				if (!data.phone || data.phone.length < 12)
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Введите номер телефона',
						path: ['phone'],
					});
				if (!isAdult(data.birthdate))
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Покупатель должен быть старше 18 лет',
						path: ['birthdate'],
					});
			}
		});

export const purchaserDataSchema = z
	.object({
		residency: z.number(),
		birthdate: z.string().min(10, 'Введите дату рождения'),
		passportSeries: z.string().min(2, 'Введите серию паспорта'),
		passportNumber: z.string().min(7, 'Введите номер паспорта'),
		fullName: z.string().optional(),
		lastName: z.string().optional(),
		firstName: z.string().optional(),
		phone: z.string().min(12, 'Введите номер телефона'),
	})
	.superRefine((data, ctx) => {
		if (!isAdult(data.birthdate))
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Покупатель должен быть старше 18 лет',
				path: ['birthdate'],
			});
		if (
			data.residency === 1 &&
			(!data.fullName || data.fullName.length < 2)
		)
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'Заполняется автоматически после поиска по паспорту и дате рождения',
				path: ['fullName'],
			});
		if (data.residency === 0) {
			if (!data.lastName || data.lastName.length < 2)
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Введите фамилию',
					path: ['lastName'],
				});
			if (!data.firstName || data.firstName.length < 2)
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Введите имя',
					path: ['firstName'],
				});
		}
	});

export const createTouristDataStepSchema = (isPurchaser: boolean) =>
	z.object({
		tourists: z
			.tuple([createTouristSchema(isPurchaser, true)])
			.rest(createTouristSchema(isPurchaser, false)),
		purchaser: isPurchaser ? z.undefined() : purchaserDataSchema,
	});

export type TouristDataStepFormData = z.infer<
	ReturnType<typeof createTouristDataStepSchema>
>;
