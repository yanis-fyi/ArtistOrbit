export const CERTIFICATION_TIERS = [
	{
		label: 'Or',
		color: '#EF9F27',
		radius: 22
	},
	{
		label: 'Double Or',
		color: '#BA7517',
		radius: 40
	},
	{
		label: 'Platine',
		color: '#B4B2A9',
		radius: 58
	},
	{
		label: 'Double Platine',
		color: '#888780',
		radius: 76
	},
	{
		label: 'Triple Platine',
		color: '#5F5E5A',
		radius: 94
	},
	{
		label: 'Diamant',
		color: '#378ADD',
		radius: 112
	},
	{
		label: 'Double Diamant',
		color: '#185FA5',
		radius: 130
	},
	{
		label: 'Triple Diamant',
		color: '#0C447C',
		radius: 148
	},
	{
		label: 'Quadruple Diamant',
		color: '#042C53',
		radius: 164
	}
];

export const CERTIFICATION_BY_LABEL = Object.fromEntries(
	CERTIFICATION_TIERS.map((tier) => [tier.label, tier])
);