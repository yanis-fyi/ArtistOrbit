import { scaleSqrt, sum } from 'd3';
import { CERTIFICATION_BY_LABEL } from '../config/certificationTiers.js';

const MIN_STROKE_WIDTH = 2;
const MAX_STROKE_WIDTH = 18;

const CATEGORY_MAX_COUNTS = {
	Albums: 40,
	Singles: 190
};

/** @typedef {{ label: string, color: string, radius: number, count: number, strokeWidth: number }} OrbitRing */

const SVG_SIZE = 400;
const CENTER = SVG_SIZE / 2;

/** @param {string} label */
function normalizeCertificationLabel(label) {
	return label.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

const CERTIFICATION_BY_NORMALIZED_LABEL = new Map(
	Object.values(CERTIFICATION_BY_LABEL).map((tier) => [
		normalizeCertificationLabel(tier.label),
		tier
	])
);

/**
 * @param {{ certification: string, count: number }[]} data
 * @param {'Albums' | 'Singles'} category
 */
export function createOrbitLayout(data, category) {
	const maxCount = CATEGORY_MAX_COUNTS[category];
	const thicknessScale = scaleSqrt()
		.domain([0, maxCount])
		.range([MIN_STROKE_WIDTH, MAX_STROKE_WIDTH])
		.clamp(true);

	/** @type {OrbitRing[]} */
	const rings = data
		.filter((item) => item.count > 0)
		.map(
			/** @param {{ certification: string, count: number }} item */
			(item) => {
				const tier = CERTIFICATION_BY_NORMALIZED_LABEL.get(
					normalizeCertificationLabel(item.certification)
				);

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
		.filter((ring) => ring !== null);

	return {
		width: SVG_SIZE,
		height: SVG_SIZE,
		centerX: CENTER,
		centerY: CENTER,
		total: sum(rings, /** @param {OrbitRing} ring */ (ring) => ring.count),
		rings
	};
}
