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

<main class="min-h-screen bg-[#0a0a0f] p-5 text-white">
	<section class="min-h-[calc(100vh-40px)] rounded-4xl bg-[#0a0a0f] p-10">
		<div class="grid h-full grid-cols-[1fr_320px] gap-12">
			<div class="flex flex-col">
				<div class="mb-12 flex items-center gap-4">
					<div class="relative">
	                    <select bind:value={category} class="rounded-sm border border-white/15 bg-white/10 px-6 py-2 pr-10 text-white outline-none"
                        >
		                    <option>Albums</option>
		                    <option>Singles</option>
	                    </select>
                    </div>
					<ArtistSearch bind:artist onSearch={searchArtist} />
				</div>

				<div class="flex flex-1 flex-col items-center justify-center">

	                {#if loading}
		                <p class="text-white/40">Loading...</p>
	                {:else if error}
		                <p class="text-red-400">{error}</p>
                    {:else if certifications.length === 0}
                        <EmptyState />
	                {:else}
		                <ArtistOrbit data={certifications} />
	                {/if}
	                <div class="mt-10 text-center">
		                <h1 class="text-4xl font-bold">{artist}</h1>
		                <p class="mt-2 text-xl text-white/40">
			                {orbit.total > 0 ? orbit.total : 0}
			                certifications · {category}
		                </p>
	                </div>

                </div>
			</div>

			<CertificationLegend />
		</div>
	</section>
</main>