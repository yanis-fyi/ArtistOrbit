<script>
	import ArtistOrbit from '$lib/components/ArtistOrbit.svelte';
	import ArtistSearch from '$lib/components/ArtistSearch.svelte';
	import CertificationLegend from '$lib/components/CertificationLegend.svelte';
    import {createOrbitLayout} from '$lib/utils/orbit';
    import {onMount} from 'svelte';

    import EmptyState from '$lib/components/EmptyState.svelte';

    import { getArtistCertifications } from '$lib/api/opensnep.js';

    onMount(() => {
        searchArtist();
    })

    let artist = $state('Stromae');
    /** @type {'Albums' | 'Singles'} */
    let category = $state('Albums');

    /** @type {{ certification: string, count: number }[]} */
    let certifications = $state([]);

    let orbit = $derived(createOrbitLayout(certifications, category));

	let loading = $state(false);
    /** @type {string | null} */
	let error = $state(null);

	async function searchArtist() {
		try {
			loading = true;
			error = null;
			certifications = await getArtistCertifications(
				artist,
				category
			);
		} catch (err) {
            error = err instanceof Error
            ? err.message
		    : 'Unknown error';
		} finally {
			loading = false;
		}
	}

</script>
<main class="min-h-screen bg-[#0a0a0f] p-3 text-white sm:p-5" >
<section class="flex min-h-[calc(100vh-40px)] flex-col rounded-4xl bg-[#0a0a0f] p-4 sm:p-8 lg:p-10">
	<div class="grid flex-1 grid-cols-1 gap-8 xl:grid-cols-[1fr_320px] xl:gap-12">
		
		<div class="flex min-h-0 flex-col">

			<div class="mb-5 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center">
				<div class="relative w-full sm:w-auto">
					<select
						bind:value={category}
						class="w-full h-14 rounded-sm border border-white/15 bg-white/10 px-6 pr-10 text-white outline-none sm:w-auto">

						<option>Albums</option>
						<option>Singles</option>
					</select>
				</div>

				<ArtistSearch
					bind:artist
					onSearch={searchArtist}
				/>
			</div>

			<div class="flex flex-1 flex-col items-center justify-center">

				{#if loading}
					<p class="text-white/40">Loading...</p>

				{:else if error}
					<p class="text-red-400">{error}</p>

				{:else if certifications.length === 0}
					<EmptyState />

				{:else}
					<ArtistOrbit
						data={certifications}
						category={category}
					/>
				{/if}

				<div class="mt-5 text-center sm:mt-10">
					<h1 class="text-3xl font-bold text-white sm:text-4xl">
						{artist}
					</h1>

					<p class="mt-2 text-l text-white/40">
						{orbit.total > 0 ? orbit.total : 0}
						certifications · {category}
					</p>
				</div>

			</div>
		</div>

		<CertificationLegend />

	</div>
</section>

<footer class="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/40">
	<p>
		Built by
		<a
			href="https://yanis.fyi"
			target="_blank"
			rel="noopener noreferrer"
			class="transition-colors hover:text-white"
		>
			Yanis
		</a>

		·

		<a
			href="https://github.com/yanis-fyi"
			target="_blank"
			rel="noopener noreferrer"
			class="transition-colors hover:text-white"
		>
			GitHub
		</a>
	</p>
</footer>
</main>