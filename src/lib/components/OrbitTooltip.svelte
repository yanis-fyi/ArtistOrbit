<script>
	/** @type {{
	 * ring: { label: string, count: number, color: string } | null,
	 * x?: number,
	 * y?: number
	 * }}
	 */
	let { ring = null, x = 0, y = 0 } = $props();
</script>

{#if ring}
	<div
		class="pointer-events-none absolute z-10 rounded-xl border border-white/10 bg-[#0f0f14]/95 px-4 py-2 shadow-2xl backdrop-blur"
		style={`left: ${x}px; top: ${y}px;`}
	>
		<div class="flex items-center gap-3 whitespace-nowrap">
			<div
				class="h-3 w-3 rounded-full"
				style={`background-color: ${ring.color}`}
			></div>

			<p class="text-sm font-semibold text-white">
				{ring.label}
			</p>

			<p class="ml-2 text-sm font-bold text-white">
				×{ring.count}
			</p>
		</div>
	</div>
{/if}