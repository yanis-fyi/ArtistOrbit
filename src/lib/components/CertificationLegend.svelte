<script>
	import { CERTIFICATION_TIERS } from '$lib/config/certificationTiers.js';
</script>

<aside class="flex items-center border-l border-white/10 pl-10">
	<div>
		<h2 class="mb-8 text-sm font-semibold tracking-[0.3em] text-white/35">
			CERTIFICATION
		</h2>

		<ul class="space-y-5">
			{#each CERTIFICATION_TIERS as tier (tier.label)}
				<li class="flex items-center gap-4 text-base font-semibold text-white/55">
					<span
						class="h-4 w-4 rounded-full"
						style={`background-color: ${tier.color}`}
					></span>

					<span>{tier.label}</span>
				</li>
			{/each}
		</ul>
	</div>
</aside>