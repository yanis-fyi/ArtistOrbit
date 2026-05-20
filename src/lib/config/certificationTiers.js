export const CERTIFICATION_TIERS = [
	{
		label: 'Or',
		color: '#EF9F27',
		radius: 24
	},
	{
		label: 'Double Or',
		color: '#BA7517',
		radius: 44
	},
	{
		label: 'Platine',
		color: '#B4B2A9',
		radius: 64
	},
	{
		label: 'Double Platine',
		color: '#888780',
		radius: 84
	},
	{
		label: 'Triple Platine',
		color: '#5F5E5A',
		radius: 104
	},
	{
		label: 'Diamant',
		color: '#378ADD',
		radius: 124
	},
	{
		label: 'Double Diamant',
		color: '#185FA5',
		radius: 144
	},
	{
		label: 'Triple Diamant',
		color: '#0C447C',
		radius: 164
	},
	{
		label: 'Quadruple Diamant',
		color: '#042C53',
		radius: 184
	}
];

export const CERTIFICATION_BY_LABEL = Object.fromEntries(
	CERTIFICATION_TIERS.map((tier) => [tier.label, tier])
);