import { PUBLIC_API_URL } from '$env/static/public';
import { dev } from '$app/environment';

/**
 * @param {string} artist
 * @param {string} category
 */
/** @typedef {{ certification: string, count: number }} Certification */

/**
 * @param {unknown} value
 * @returns {value is Certification[]}
 */
export function isCertificationResponse(value) {
	return (
		Array.isArray(value) &&
		value.every(
			(item) =>
				typeof item === 'object' &&
				item !== null &&
				typeof item.certification === 'string' &&
				typeof item.count === 'number' &&
				Number.isFinite(item.count) &&
				item.count >= 0
		)
	);
}

/**
 * @param {string} artist
 * @param {string} category
 * @param {AbortSignal} [signal]
 * @returns {Promise<Certification[]>}
 */
export async function getArtistCertifications(artist, category, signal) {
	const url = `${PUBLIC_API_URL}/artists/${encodeURIComponent(artist)}/certifications?category=${encodeURIComponent(category)}`;
	let status = null;
	try {
		const response = await fetch(url, { signal });
		status = response.status;
		if (!response.ok) {
			throw Object.assign(
				new Error(`Certification service returned HTTP ${response.status}. Please try again.`),
				{ kind: 'http', url, status }
			);
		}

		/** @type {unknown} */
		let data;
		try {
			data = await response.json();
		} catch (cause) {
			throw Object.assign(new Error('Certification service returned invalid JSON.'), {
				kind: 'invalid-json',
				url,
				status,
				cause
			});
		}

		if (!isCertificationResponse(data)) {
			throw Object.assign(new Error('Certification service returned an invalid response.'), {
				kind: 'validation',
				url,
				status
			});
		}

		return data;
	} catch (error) {
		const isAbort = error instanceof Error && error.name === 'AbortError';
		const originalError =
			/** @type {Error & { kind?: string, url?: string, status?: number | null, cause?: unknown }} */ (
				error
			);
		const requestError = originalError.kind
			? originalError
			: Object.assign(
					new Error(
						isAbort
							? 'Certification request was cancelled.'
							: 'Unable to connect to the certification service. Please try again.',
						{ cause: error }
					),
					{ kind: isAbort ? 'aborted' : 'network', url, status }
				);

		if (dev) {
			console.error('[OpenSNEP] Certification request failed', {
				kind: requestError.kind,
				url: requestError.url ?? url,
				status: requestError.status ?? status,
				error: requestError,
				cause: requestError.cause
			});
		}

		throw requestError;
	}
}
