
/**
 * 
 * @param {string} name
 */
export function formatArtistName(name) {
	return name
		.split(' ')
		.map(
			(word) =>
				word.charAt(0).toUpperCase() +
				word.slice(1).toLowerCase()
		)
		.join(' ');
}