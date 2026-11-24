import assert from 'node:assert/strict';
import test from 'node:test';
import { formatArtistName } from '../src/lib/utils/format.js';
import { createOrbitLayout } from '../src/lib/utils/orbit.js';
import { createRequestController } from '../src/lib/utils/requestState.js';

test('formatArtistName preserves the artist name exactly', () => {
	assert.equal(formatArtistName('mC SOLAAR'), 'mC SOLAAR');
	assert.equal(formatArtistName('  Élodie  '), '  Élodie  ');
});

test('createOrbitLayout totals recognized certification counts', () => {
	const layout = createOrbitLayout(
		[
			{ certification: 'Or', count: 2 },
			{ certification: 'Diamant', count: 1 },
			{ certification: 'Unknown', count: 100 }
		],
		'Albums'
	);

	assert.equal(layout.total, 3);
	assert.deepEqual(
		layout.rings.map(({ label }) => label),
		['Or', 'Diamant']
	);
});

test('createOrbitLayout renders Double Or alongside Or and Platine', () => {
	const layout = createOrbitLayout(
		[
			{ certification: 'Or', count: 2 },
			{ certification: 'Double Or', count: 1 },
			{ certification: 'Platine', count: 3 }
		],
		'Albums'
	);

	assert.deepEqual(
		layout.rings.map(({ label, radius, color }) => ({ label, radius, color })),
		[
			{ label: 'Or', radius: 24, color: '#EF9F27' },
			{ label: 'Double Or', radius: 44, color: '#BA7517' },
			{ label: 'Platine', radius: 64, color: '#B4B2A9' }
		]
	);
	assert.equal(
		layout.rings.every(({ strokeWidth }) => strokeWidth > 0),
		true
	);
});

test('createOrbitLayout normalizes certification label whitespace and casing', () => {
	const layout = createOrbitLayout(
		[
			{ certification: '  dOuBlE   oR ', count: 1 },
			{ certification: '  OR ', count: 1 }
		],
		'Albums'
	);

	assert.deepEqual(
		layout.rings.map(({ label }) => label),
		['Double Or', 'Or']
	);
});

test('createOrbitLayout hides zero-count certifications', () => {
	const layout = createOrbitLayout(
		[
			{ certification: 'Double Or', count: 0 },
			{ certification: 'Or', count: 1 }
		],
		'Albums'
	);

	assert.deepEqual(
		layout.rings.map(({ label }) => label),
		['Or']
	);
	assert.equal(layout.total, 1);
});

test('failed requests enter error state without certification totals', async () => {
	/** @type {import('../src/lib/utils/requestState.js').RequestState} */
	let state = { status: 'initial', certifications: [], error: null };
	const controller = createRequestController((nextState) => (state = nextState));

	await controller.run(async () => {
		throw new Error('service unavailable');
	});

	assert.equal(state.status, 'error');
	assert.deepEqual(state.certifications, []);
	assert.ok(state.error instanceof Error);
});

test('successful empty requests enter empty state', async () => {
	/** @type {import('../src/lib/utils/requestState.js').RequestState} */
	let state = { status: 'initial', certifications: [], error: null };
	const controller = createRequestController((nextState) => (state = nextState));

	await controller.run(async () => []);

	assert.equal(state.status, 'empty');
	assert.deepEqual(state.certifications, []);
});

test('cancelled requests cannot overwrite the latest result', async () => {
	/** @type {import('../src/lib/utils/requestState.js').RequestState} */
	let state = { status: 'initial', certifications: [], error: null };
	const controller = createRequestController((nextState) => (state = nextState));
	/** @type {() => void} */
	let resolveOldRequest = () => {};
	const oldRequest = controller.run(
		(signal) =>
			new Promise((resolve) => {
				resolveOldRequest = () => resolve([{ certification: 'Or', count: 20 }]);
				signal.addEventListener('abort', () => {});
			})
	);
	await controller.run(async () => [{ certification: 'Diamant', count: 1 }]);
	resolveOldRequest();
	await oldRequest;

	assert.equal(state.status, 'success');
	assert.deepEqual(state.certifications, [{ certification: 'Diamant', count: 1 }]);
});

test('retry starts a new request', async () => {
	/** @type {import('../src/lib/utils/requestState.js').RequestState} */
	let state = { status: 'initial', certifications: [], error: null };
	const controller = createRequestController((nextState) => (state = nextState));
	let attempts = 0;
	const request = async () => {
		attempts += 1;
		if (attempts === 1) throw new Error('temporary failure');
		return [{ certification: 'Or', count: 1 }];
	};

	await controller.run(request);
	assert.equal(state.status, 'error');
	await controller.run(request);

	assert.equal(attempts, 2);
	assert.equal(state.status, 'success');
});
