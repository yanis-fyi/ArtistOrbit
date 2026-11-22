<script>
	import { createOrbitLayout } from '$lib/utils/orbit.js';
	import OrbitTooltip from '$lib/components/OrbitTooltip.svelte';

	/** @typedef {{ label: string, count: number, color: string, radius: number, strokeWidth: number }} Ring */
	/** @type {{ data?: { certification: string, count: number }[], category?: 'Albums' | 'Singles' }} */
	let { data = [], category = 'Albums' } = $props();
	let orbit = $derived(createOrbitLayout(data, category));
	let tooltip = $state({ x: 12, y: 12 });
	let lastPointerPosition = $state({ x: 0, y: 0 });
	let hoveredRing = $state(/** @type {Ring | null} */ (null));
	let selectedRing = $state(/** @type {Ring | null} */ (null));
	let activeRing = $derived(hoveredRing ?? selectedRing);

	/** @param {number} clientX @param {number} clientY */
	function updateTooltipPosition(clientX, clientY) {
		lastPointerPosition = { x: clientX, y: clientY };
		const tooltipWidth = Math.min(240, window.innerWidth - 24);
		const maxLeft = Math.max(12, window.innerWidth - tooltipWidth - 12);
		const maxTop = Math.max(12, window.innerHeight - 92);

		tooltip = {
			x: Math.min(Math.max(12, clientX + 16), maxLeft),
			y: Math.min(Math.max(12, clientY - 20), maxTop)
		};
	}

	/** @param {PointerEvent} event @param {Ring} ring */
	function handleRingPointerEnter(event, ring) {
		if (event.pointerType !== 'mouse') return;
		hoveredRing = ring;
		updateTooltipPosition(event.clientX, event.clientY);
	}

	/** @param {PointerEvent} event */
	function handleRingPointerMove(event) {
		if (event.pointerType === 'mouse') {
			updateTooltipPosition(event.clientX, event.clientY);
		}
	}

	/** @param {PointerEvent} event @param {Ring} ring */
	function handleRingPointerLeave(event, ring) {
		if (event.pointerType === 'mouse' && hoveredRing?.label === ring.label) {
			hoveredRing = null;
		}
	}

	/** @param {MouseEvent} event @param {Ring} ring */
	function handleRingClick(event, ring) {
		selectedRing = selectedRing?.label === ring.label ? null : ring;
		updateTooltipPosition(event.clientX, event.clientY);
	}

	/** @param {PointerEvent} event */
	function handleOutsidePointerDown(event) {
		if (!(event.target instanceof Element) || !event.target.closest('[data-orbit-ring]')) {
			selectedRing = null;
		}
	}

	function handleViewportResize() {
		if (activeRing) {
			updateTooltipPosition(lastPointerPosition.x, lastPointerPosition.y);
		}
	}
</script>

<svelte:window onpointerdown={handleOutsidePointerDown} onresize={handleViewportResize} />

<div class="relative flex w-full max-w-100 items-center justify-center">
	<svg
		class="h-auto w-full"
		width={orbit.width}
		height={orbit.height}
		viewBox={`0 0 ${orbit.width} ${orbit.height}`}
	>
		<circle cx={orbit.centerX} cy={orbit.centerY} r="12" fill="#fac775" />

		{#each orbit.rings as ring (ring.label)}
			<circle
				role="presentation"
				class="ring-enter"
				cx={orbit.centerX}
				cy={orbit.centerY}
				r={ring.radius}
				fill="none"
				pointer-events="none"
				stroke={ring.color}
				stroke-width={ring.strokeWidth}
				stroke-linecap="round"
			/>
			<circle
				data-orbit-ring={ring.label}
				class="cursor-pointer"
				cx={orbit.centerX}
				cy={orbit.centerY}
				r={ring.radius}
				fill="none"
				pointer-events="stroke"
				stroke={ring.color}
				stroke-opacity="0"
				stroke-width={Math.max(ring.strokeWidth, 16)}
				stroke-linecap="round"
				role="presentation"
				onpointerenter={(event) => handleRingPointerEnter(event, ring)}
				onpointermove={handleRingPointerMove}
				onpointerleave={(event) => handleRingPointerLeave(event, ring)}
				onclick={(event) => handleRingClick(event, ring)}
			/>
		{/each}
	</svg>

	<OrbitTooltip ring={activeRing} x={tooltip.x} y={tooltip.y} />
</div>

<style>
	@media (pointer: coarse) {
		:global(.orbit-tooltip) {
			pointer-events: auto;
		}
	}
</style>
