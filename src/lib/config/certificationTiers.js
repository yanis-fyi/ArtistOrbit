export const CERTIFICATION_TIERS = [
	{ label: 'Or', color: '#EF9F27', radius: 70 },
	{ label: 'Double Or', color: '#BA7517', radius: 105 },
	{ label: 'Platine', color: '#B4B2A9', radius: 140 },
	{ label: 'Double Platine', color: '#888780', radius: 175 },
	{ label: 'Triple Platine', color: '#5F5E5A', radius: 210 },
	{ label: 'Diamant', color: '#378ADD', radius: 245 },
	{ label: 'Double Diamant', color: '#185FA5', radius: 280 },
	{ label: 'Triple Diamant', color: '#0C447C', radius: 315 },
	{ label: 'Quadruple Diamant', color: '#042C53', radius: 350 }
];

export const CERTIFICATION_BY_LABEL = Object.fromEntries(
	CERTIFICATION_TIERS.map((tier) => [tier.label, tier])
);