/**
 * @typedef {{ status: 'initial' | 'loading' | 'success' | 'empty' | 'error', certifications: { certification: string, count: number }[], error: Error | null }} RequestState
 */

/**
 * Manage latest-request-wins semantics and expose explicit request states.
 * @param {(state: RequestState) => void} onState
 */
export function createRequestController(onState) {
	/** @type {AbortController | null} */
	let activeController = null;
	let activeRequestId = 0;

	return {
		/**
		 * @param {(signal: AbortSignal) => Promise<{ certification: string, count: number }[]>} request
		 */
		async run(request) {
			activeController?.abort();
			const controller = new AbortController();
			const requestId = ++activeRequestId;
			activeController = controller;
			onState({ status: 'loading', certifications: [], error: null });

			try {
				const certifications = await request(controller.signal);
				if (requestId !== activeRequestId || controller.signal.aborted) return;
				onState({
					status: certifications.length ? 'success' : 'empty',
					certifications,
					error: null
				});
			} catch (error) {
				if (requestId !== activeRequestId || controller.signal.aborted) return;
				onState({
					status: 'error',
					certifications: [],
					error: error instanceof Error ? error : new Error('An unknown error occurred.')
				});
			}
		},
		cancel() {
			activeRequestId += 1;
			activeController?.abort();
			activeController = null;
		}
	};
}
