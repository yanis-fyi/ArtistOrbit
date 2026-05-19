<script>
	import { createOrbitLayout } from '$lib/utils/orbit.js';

	const fakeData = [
		{
            certification: "Triple Platine",
            count: 11
        },
        {
            certification: "Double Platine",
            count: 8
        },
        {
            certification: "Diamant",
            count: 5
        },
        {
            certification: "Platine",
            count: 5
        },
        {
            certification: "Or",
            count: 107
        }
	];

	const orbit = createOrbitLayout(fakeData);
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
		r="36"
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