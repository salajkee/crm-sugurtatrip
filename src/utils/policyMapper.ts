import type { ApiPartnerResponse, PolicyCardData } from '@/types/policy';

const parseAmount = (value: unknown): number => {
	const str = String(value ?? '');
	const cleaned = str
		.replace(/\s/g, '')
		.replace(/[^\d.,]/g, '')
		.split(/[,.]/)[0];
	return parseInt(cleaned) || 0;
};

export const filterPolicies = (
	policies: PolicyCardData[],
	typeId: number,
): PolicyCardData[] => {
	if (typeId === 1) {
		return policies.filter(policy => policy.partner === 'KAPITAL');
	}
	return policies;
};

export const mapPoliciesToInsurance = (
	data: ApiPartnerResponse[],
): PolicyCardData[] => {
	const policies: PolicyCardData[] = [];

	data.forEach(partnerData => {
		partnerData.result.forEach(program => {
			policies.push({
				id: crypto.randomUUID(),
				programId: program.programId,
				name: program.programName,
				partner: partnerData.partner.toUpperCase(),
				coverage: parseAmount(program.coverage),
				price: parseAmount(program.premUzs),
				isBestseller:
					program.programName === 'GOLD' ||
					program.programName === 'GRAND 1',
			});
		});
	});

	return policies.sort(
		(a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0),
	);
};
