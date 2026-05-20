<script>
	import { createOrbitLayout } from '$lib/utils/orbit.js';
    import OrbitTooltip from '$lib/components/OrbitTooltip.svelte';

    /** @type {{

	 * data?: { certification: string, count: number }[],
	 * category?: 'Albums' | 'Singles'
	 * }}
	 */
    let { data = [], category = 'Albums' } = $props();
    let orbit = $derived(createOrbitLayout(data, category));

    let tooltip = $state({ x: 0, y: 0 });

    /** @type {{ label: string, count: number, color: string } | null} */

	let hoveredRing = $state(null);

</script>

<div class="relative flex items-center justify-center">
	<svg
		width={orbit.width}
		height={orbit.height}
		viewBox={`0 0 ${orbit.width} ${orbit.height}`}
	>
		<circle
			cx={orbit.centerX}
			cy={orbit.centerY}
			r="12"
			fill="#fac775"
		/>

		{#each orbit.rings as ring (ring.label)}
			<circle
	role="presentation"
	class="ring-enter cursor-pointer transition-opacity duration-200"
	cx={orbit.centerX}
	cy={orbit.centerY}
	r={ring.radius}
	fill="none"
	pointer-events="stroke"
	stroke={ring.color}
	stroke-width={ring.strokeWidth}
	stroke-linecap="round"
	opacity={hoveredRing && hoveredRing.label !== ring.label ? 0.25 : 1}
	onmouseenter={(event) => {
		hoveredRing = ring;
		tooltip = { x: event.offsetX + 20, y: event.offsetY - 20 };
	}}
	onmousemove={(event) => {
		tooltip = { x: event.offsetX + 20, y: event.offsetY - 20 };
	}}
	onmouseleave={() => {
		hoveredRing = null;
	}}
/>
		{/each}
	</svg>

	<OrbitTooltip ring={hoveredRing} x={tooltip.x} y={tooltip.y} />
</div>