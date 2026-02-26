import * as z from 'zod';

export const policySearchSchema = z.object({
	countries: z
		.array(z.string())
		.min(1, 'Выберите хотя бы одну страну')
		.max(6, 'Максимум 6 стран'),
	tourists: z
		.array(
			z.object({
				id: z.string(),
				birthdate: z.string().min(10, 'Введите дату рождения'),
				age: z.number().nullable(),
			}),
		)
		.min(1, 'Добавьте хотя бы одного туриста')
		.max(6, 'Максимум 6 туристов')
		.refine(
			tourists => tourists.every(t => t.age !== null),
			'Введите корректные даты рождения для всех туристов',
		),
	startDate: z
		.date({ message: 'Выберите дату отправления' })
		.optional()
		.refine(date => date !== undefined, {
			message: 'Выберите дату отправления',
		}),
	endDate: z
		.date({ message: 'Выберите дату возвращения' })
		.optional()
		.refine(date => date !== undefined, {
			message: 'Выберите дату возвращения',
		}),
});

export type PolicySearchFormData = z.infer<typeof policySearchSchema>;
