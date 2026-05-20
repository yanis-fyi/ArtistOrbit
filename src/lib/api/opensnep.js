import { PUBLIC_API_URL } from '$env/static/public';

/**
 * @param {string} artist
 * @param {string} category
 */
export async function getArtistCertifications(artist, category) {
	const response = await fetch(
		`${PUBLIC_API_URL}/artists/${encodeURIComponent(artist)}/certifications?category=${encodeURIComponent(category)}`
	);

	if (!response.ok) {
		throw new Error('Could not fetch artist certifications');
	}

	return response.json();
}