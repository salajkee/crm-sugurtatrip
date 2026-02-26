import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Форматирует введенную строку в формат дд.мм.гггг
 * @param value - строка с цифрами
 * @returns отформатированная дата
 */
export const formatDate = (value: string): string => {
	const digits = value.replace(/\D/g, '');
	let formatted = '';

	if (digits.length > 0) {
		formatted = digits.substring(0, 2);
		if (digits.length >= 3) {
			formatted += '.' + digits.substring(2, 4);
		}
		if (digits.length >= 5) {
			formatted += '.' + digits.substring(4, 8);
		}
	}

	return formatted;
};

/**
 * Вычисляет возраст по дате рождения в формате дд.мм.гггг
 * @param birthdate - дата рождения в формате "дд.мм.гггг"
 * @returns возраст в годах или null если дата некорректна
 */
export const calculateAge = (birthdate: string): number | null => {
	const parts = birthdate.split('.');
	if (parts.length !== 3 || parts[2].length !== 4) return null;

	const day = parseInt(parts[0]);
	const month = parseInt(parts[1]);
	const year = parseInt(parts[2]);

	if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
		return null;
	}

	const birth = new Date(year, month - 1, day);
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birth.getDate())
	) {
		age--;
	}

	return age >= 0 ? age : null;
};

/**
 * Возвращает правильное склонение слова "год/года/лет" для числа
 * @param age - возраст
 * @returns правильная форма слова
 */
export const getYearWord = (age: number): string => {
	const lastDigit = age % 10;
	const lastTwoDigits = age % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'лет';
	if (lastDigit === 1) return 'год';
	if (lastDigit >= 2 && lastDigit <= 4) return 'года';
	return 'лет';
};

/**
 * Форматирует массив возрастов в строку с правильным склонением
 * @param ages - массив возрастов
 * @returns строка с возрастами
 */
export const formatAges = (ages: number[]): string => {
	if (ages.length === 0) return '';

	const groups: { [key: string]: number[] } = {
		год: [],
		года: [],
		лет: [],
	};

	ages.forEach(age => {
		const word = getYearWord(age);
		groups[word].push(age);
	});

	const parts = [];
	if (groups['год'].length > 0) {
		parts.push(`${groups['год'].join(', ')} год`);
	}
	if (groups['года'].length > 0) {
		parts.push(`${groups['года'].join(', ')} года`);
	}
	if (groups['лет'].length > 0) {
		parts.push(`${groups['лет'].join(', ')} лет`);
	}

	if (parts.length > 1) {
		return `${ages.join(', ')} лет`;
	}

	return parts[0];
};

/**
 * Форматирует номер телефона в формат: 00 000-00-00
 * Без префикса +998 (он в InputLeftAddon)
 */
export const formatPhone = (value: string): string => {
	const digits = value.replace(/\D/g, '');
	let formatted = '';

	if (digits.length > 0) {
		formatted = digits.substring(0, 2);
		if (digits.length >= 3) {
			formatted += ' ' + digits.substring(2, 5);
		}
		if (digits.length >= 6) {
			formatted += '-' + digits.substring(5, 7);
		}
		if (digits.length >= 8) {
			formatted += '-' + digits.substring(7, 9);
		}
	}

	return formatted;
};

/**
 * Получить полный номер телефона с кодом страны
 */
export const getFullPhone = (value: string): string => {
	const digits = value.replace(/\D/g, '');
	return '+998' + digits;
};

/**
 * Убрать форматирование и получить только цифры
 */
export const unformatPhone = (value: string): string => {
	return value.replace(/\D/g, '');
};

/**
 * Проверка на совершеннолетие 18+
 */
export const isAdult = (birthdate: string): boolean => {
	const age = calculateAge(birthdate);
	if (age === null) return false;
	return age >= 18;
};
