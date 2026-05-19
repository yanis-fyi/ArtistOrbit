// src/lib/utils/orbit.js

import { scaleSqrt, sum } from 'd3';
import { CERTIFICATION_BY_LABEL } from '$lib/config/certificationTiers.js';

const MAX_CERTIFICATION_COUNT = 120;
const MIN_STROKE_WIDTH = 0;
const MAX_STROKE_WIDTH = 34;

const thicknessScale = scaleSqrt()
	.domain([0, MAX_CERTIFICATION_COUNT])
	.range([MIN_STROKE_WIDTH, MAX_STROKE_WIDTH])
	.clamp(true);

/**
 * @param {{ certification: string, count: number }[]} data
 */
export function createOrbitLayout(data) {
	const rings = data
		.map(
			/** @param {{ certification: string, count: number }} item */
			(item) => {
				const tier = CERTIFICATION_BY_LABEL[item.certification];

				if (!tier) return null;

				return {
					label: tier.label,
					color: tier.color,
					radius: tier.radius,
					count: item.count,
					strokeWidth: thicknessScale(item.count)
				};
			}
		)
		.filter(
			/**
			 * @param {{
			 * label: string;
			 * color: string;
			 * radius: number;
			 * count: number;
			 * strokeWidth: number;
			 * } | null} ring
			 */
			(ring) => ring !== null
		);

	return {
		width: 820,
		height: 820,
		centerX: 410,
		centerY: 410,
		total: sum(rings, (ring) => ring.count),
		rings
	};
}