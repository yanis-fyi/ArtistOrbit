<script>
	import ArtistOrbit from '$lib/components/ArtistOrbit.svelte';
	import ArtistSearch from '$lib/components/ArtistSearch.svelte';
	import CategoryDropdown from '$lib/components/CategoryDropdown.svelte';
	import CertificationLegend from '$lib/components/CertificationLegend.svelte';
	import { createOrbitLayout } from '$lib/utils/orbit';
	import { formatArtistName } from '$lib/utils/format';
	import { createRequestController } from '$lib/utils/requestState.js';

	import EmptyState from '$lib/components/EmptyState.svelte';

	import { getArtistCertifications } from '$lib/api/opensnep.js';

	let artist = $state('Stromae');
	let searchedArtist = $state('Stromae');
	let searchVersion = $state(0);
	/** @type {'Albums' | 'Singles'} */
	let category = $state('Albums');

	let requestState = $state({
		/** @type {'initial' | 'loading' | 'success' | 'empty' | 'error'} */
		status: 'initial',
		/** @type {{ certification: string, count: number }[]} */
		certifications: [],
		/** @type {Error | null} */
		error: null
	});
	const requestController = createRequestController((nextState) => {
		requestState = nextState;
	});
	let orbit = $derived(createOrbitLayout(requestState.certifications, category));

	function searchArtist() {
		searchedArtist = artist;
		searchVersion += 1;
	}

	$effect(() => {
		searchVersion;
		const requestedArtist = searchedArtist;
		const requestedCategory = category;

		if (!requestedArtist.trim()) {
			requestController.cancel();
			requestState = {
				status: 'error',
				certifications: [],
				error: new Error('Enter an artist name to search.')
			};
			return;
		}

		requestController.run((signal) =>
			getArtistCertifications(requestedArtist, requestedCategory, signal)
		);

		return () => requestController.cancel();
	});

	function retrySearch() {
		searchVersion += 1;
	}
</script>

<main
	class="flex min-h-screen flex-col overflow-y-auto bg-[#0a0a0f] p-3 text-white sm:p-5 xl:h-screen xl:overflow-hidden"
>
	<section class="flex flex-1 flex-col rounded-4xl bg-[#0a0a0f] p-4 sm:p-8 lg:p-10">
		<div class="grid flex-1 grid-cols-1 gap-8 xl:grid-cols-[1fr_320px] xl:gap-12">
			<div class="flex min-h-0 flex-col">
				<div class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
					<CategoryDropdown bind:category />

					<ArtistSearch bind:artist onSearch={searchArtist} />
				</div>

				<div class="flex flex-1 flex-col items-center justify-center">
					{#if requestState.status === 'loading' || requestState.status === 'initial'}
						<p class="text-white/40">Loading...</p>
					{:else if requestState.status === 'error'}
						<div class="flex flex-col items-center gap-3 text-center">
							<p class="text-red-400">{requestState.error?.message}</p>
							<button
								type="button"
								onclick={retrySearch}
								class="rounded-sm border border-white/20 px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
							>
								Retry
							</button>
						</div>
					{:else if requestState.status === 'empty'}
						<EmptyState />
					{:else if requestState.status === 'success'}
						<ArtistOrbit data={requestState.certifications} {category} />
					{/if}

					<div class="mt-4 text-center sm:mt-6">
						<h1 class="text-3xl font-bold text-white sm:text-4xl">
							{formatArtistName(searchedArtist)}
						</h1>
						{#if requestState.status === 'success' || requestState.status === 'empty'}
							<p class="text-l mt-2 text-white/40">
								{orbit.total} certifications - {category}
							</p>
						{/if}
					</div>
				</div>
			</div>

			<CertificationLegend {category} />
		</div>
	</section>

	<footer class="mt-4 border-t border-white/10 pt-4 text-center text-sm text-white/40">
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
