<script>
	import { createOrbitLayout } from '$lib/utils/orbit.js';
    let { data = [] } = $props();
    let orbit = $derived(createOrbitLayout(data));

</script>

<div class="flex items-center justify-center">
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
			cx={orbit.centerX}
			cy={orbit.centerY}
			r={ring.radius}
			fill="none"
			stroke={ring.color}
			stroke-width={ring.strokeWidth}
			stroke-linecap="round"
		/>
	{/each}
</svg>
</div>