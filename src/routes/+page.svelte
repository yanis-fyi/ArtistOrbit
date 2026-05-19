<script>
	import ArtistOrbit from '$lib/components/ArtistOrbit.svelte';
	import ArtistSearch from '$lib/components/ArtistSearch.svelte';
	import CertificationLegend from '$lib/components/CertificationLegend.svelte';
</script>

<main class="min-h-screen bg-neutral-950 p-5 text-white">
	<section class="min-h-[calc(100vh-40px)] rounded-4xl bg-[#07080d] p-10">
		<div class="grid h-full grid-cols-[1fr_320px] gap-12">
			<div class="flex flex-col">
				<div class="mb-12 flex items-center gap-4">
					<div class="relative">
	                    <select class="rounded-full border border-white/15 bg-white/10 
                                    px-6 py-3 pr-10 text-white outline-none"
                        >
		                    <option>Albums</option>
		                    <option>Singles</option>
	                    </select>
                    </div>
					<ArtistSearch />
				</div>

				<div class="flex flex-1 flex-col items-center justify-center">
					<ArtistOrbit />

					<div class="mt-10 text-center">
						<h1 class="text-4xl font-bold">Stromae</h1>
						<p class="mt-2 text-xl text-white/40">7 certifications · Albums</p>
					</div>
				</div>
			</div>

			<CertificationLegend />
		</div>
	</section>
</main>