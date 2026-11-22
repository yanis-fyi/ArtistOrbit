<script>
	import { tick } from 'svelte';
	import { CERTIFICATION_TIERS } from '$lib/config/certificationTiers.js';

	/** @type {{ category?: 'Albums' | 'Singles' }} */
	let { category = 'Albums' } = $props();
	let root = $state(/** @type {HTMLElement | undefined} */ (undefined));
	let tooltipElement = $state(/** @type {HTMLDivElement | undefined} */ (undefined));
	let hoveredTier = $state(/** @type {string | null} */ (null));
	let focusedTier = $state(/** @type {string | null} */ (null));
	let pinnedTier = $state(/** @type {string | null} */ (null));
	let activeTier = $derived(
		CERTIFICATION_TIERS.find((tier) => tier.label === (hoveredTier ?? focusedTier ?? pinnedTier)) ??
			null
	);
	let position = $state({ left: 12, top: 12, ready: false });
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let hoverCloseTimer;
	/** @type {string | null} */
	let suppressFocusFor = null;
	/** @type {Record<'Albums' | 'Singles', Record<string, { value: string, unit: string }>>} */
	let thresholdMaps = {
		Albums: {
			Or: { value: '50 000', unit: 'Équivalents ventes' },
			Platine: { value: '100 000', unit: 'Équivalents ventes' },
			'Double Platine': { value: '200 000', unit: 'Équivalents ventes' },
			'Triple Platine': { value: '300 000', unit: 'Équivalents ventes' },
			Diamant: { value: '500 000', unit: 'Équivalents ventes' },
			'Double Diamant': { value: '1 000 000', unit: 'Équivalents ventes' },
			'Triple Diamant': { value: '1 500 000', unit: 'Équivalents ventes' },
			'Quadruple Diamant': { value: '2 000 000', unit: 'Équivalents ventes' }
		},
		Singles: {
			Or: { value: '15 millions', unit: 'Équivalents streams' },
			Platine: { value: '30 millions', unit: 'Équivalents streams' },
			Diamant: { value: '50 millions', unit: 'Équivalents streams' }
		}
	};

	let currentThreshold = $derived(
		activeTier ? thresholdMaps[category][activeTier.label] : undefined
	);
	let measurementUnit = $derived(
		category === 'Albums' ? 'Équivalents ventes' : 'Équivalents streams'
	);

	function clearHoverTimer() {
		if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
	}

	/** @param {string} label */
	function handlePointerEnter(label) {
		clearHoverTimer();
		hoveredTier = label;
	}

	function handlePointerLeave() {
		clearHoverTimer();
		hoverCloseTimer = setTimeout(() => {
			hoveredTier = null;
		}, 160);
	}

	function handleTooltipPointerLeave() {
		if (!pinnedTier) handlePointerLeave();
	}

	/** @param {string} label */
	function handleFocus(label) {
		if (suppressFocusFor === label) {
			suppressFocusFor = null;
			return;
		}
		focusedTier = label;
	}

	/** @param {FocusEvent} event */
	function handleFocusOut(event) {
		if (!(event.relatedTarget instanceof Node) || !root?.contains(event.relatedTarget)) {
			focusedTier = null;
		}
	}

	/** @param {string} label */
	function pinTooltip(label) {
		clearHoverTimer();
		pinnedTier = label;
		hoveredTier = label;
	}

	function closeTooltip(returnFocus = false) {
		const labelToFocus = pinnedTier ?? focusedTier ?? hoveredTier;
		clearHoverTimer();
		pinnedTier = null;
		hoveredTier = null;
		focusedTier = null;
		if (returnFocus && labelToFocus) {
			const trigger = [...(root?.querySelectorAll('[data-certification-trigger]') ?? [])].find(
				(element) => element.getAttribute('data-certification-trigger') === labelToFocus
			);
			const focusTarget = /** @type {HTMLButtonElement | undefined} */ (trigger);
			if (focusTarget && document.activeElement !== focusTarget) {
				suppressFocusFor = labelToFocus;
				focusTarget.focus();
			}
		}
	}

	/** @param {PointerEvent} event */
	function handleOutsidePointerDown(event) {
		if (event.target instanceof Node && !root?.contains(event.target)) closeTooltip();
	}

	/** @param {KeyboardEvent} event */
	function handleWindowKeydown(event) {
		if (event.key === 'Escape' && activeTier) {
			event.preventDefault();
			closeTooltip(true);
		}
	}

	/** @param {string} label @param {'Albums' | 'Singles'} selectedCategory */
	async function positionTooltip(label, selectedCategory) {
		// Use a fresh literal: reading `position` here would make the measuring effect
		// depend on the state it updates and create a reactive feedback loop.
		position = { left: 12, top: 12, ready: false };
		await tick();
		if (!tooltipElement || activeTier?.label !== label || category !== selectedCategory) return;

		const anchor = [...(root?.querySelectorAll('[data-certification-trigger]') ?? [])].find(
			(element) => element.getAttribute('data-certification-trigger') === label
		);
		if (!anchor) return;

		const anchorBounds = anchor.getBoundingClientRect();
		const tooltipBounds = tooltipElement.getBoundingClientRect();
		const margin = 12;
		const gap = 12;
		let left = anchorBounds.right + gap;

		if (left + tooltipBounds.width > window.innerWidth - margin) {
			const leftSide = anchorBounds.left - tooltipBounds.width - gap;
			left =
				leftSide >= margin
					? leftSide
					: Math.max(margin, window.innerWidth - tooltipBounds.width - margin);
		}

		const top = Math.min(
			Math.max(margin, anchorBounds.top + (anchorBounds.height - tooltipBounds.height) / 2),
			Math.max(margin, window.innerHeight - tooltipBounds.height - margin)
		);
		position = { left, top, ready: true };
	}

	$effect(() => {
		const label = activeTier?.label;
		const selectedCategory = category;
		if (label) positionTooltip(label, selectedCategory);
		else position = { left: 12, top: 12, ready: false };
	});

	function handleViewportChange() {
		if (activeTier) positionTooltip(activeTier.label, category);
	}
</script>

<svelte:window
	onpointerdown={handleOutsidePointerDown}
	onkeydown={handleWindowKeydown}
	onresize={handleViewportChange}
	onscroll={handleViewportChange}
/>

<aside
	class="flex items-center border-t border-white/10 pt-8 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-10"
	bind:this={root}
	onfocusout={handleFocusOut}
>
	<div>
		<h2 class="mb-8 text-sm font-semibold tracking-[0.3em] text-white/35">CERTIFICATION</h2>

		<ul class="space-y-5">
			{#each CERTIFICATION_TIERS as tier (tier.label)}
				<li>
					<button
						data-certification-trigger={tier.label}
						type="button"
						class="flex items-center gap-4 text-base font-semibold text-white/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50"
						aria-haspopup="dialog"
						aria-expanded={activeTier?.label === tier.label}
						aria-controls="certification-tier-tooltip"
						aria-label={`Informations sur la certification ${tier.label}`}
						onpointerenter={() => handlePointerEnter(tier.label)}
						onpointerleave={handlePointerLeave}
						onfocus={() => handleFocus(tier.label)}
						onclick={() => pinTooltip(tier.label)}
					>
						<span class="h-4 w-4 rounded-full" style={`background-color: ${tier.color}`}></span>
						<span>{tier.label}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>

	{#if activeTier}
		<div
			bind:this={tooltipElement}
			id="certification-tier-tooltip"
			class="certification-tooltip fixed z-50 w-[min(300px,calc(100vw-24px))] overflow-y-auto rounded-xl border border-white/15 bg-[#0f0f14] p-4 text-white shadow-2xl"
			style={`left: ${position.left}px; top: ${position.top}px; visibility: ${position.ready ? 'visible' : 'hidden'};`}
			role="dialog"
			tabindex="-1"
			aria-label={`Informations sur la certification ${activeTier.label}`}
			onpointerenter={clearHoverTimer}
			onpointerleave={handleTooltipPointerLeave}
		>
			<h3 class="text-base font-bold uppercase" style={`color: ${activeTier.color}`}>
				{activeTier.label}
			</h3>
			<p class="mt-2 text-2xl leading-snug font-bold text-white">
				{currentThreshold?.value ?? 'Seuil non précisé par le SNEP'}
			</p>
			<p class="mt-1 text-sm text-white/55">
				{currentThreshold?.unit ?? measurementUnit}
			</p>
			<a
				class="mt-3 inline-block text-xs text-white/55 underline decoration-white/25 underline-offset-4 hover:text-white"
				href="https://snepmusique.com/les-certifications/a-propos-des-certifications/"
				target="_blank"
				rel="noopener noreferrer"
			>
				Seuil actuel | SNEP
			</a>
		</div>
	{/if}
</aside>

<style>
	@keyframes certification-tooltip-enter {
		from {
			opacity: 0;
			transform: translateY(4px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.certification-tooltip {
		max-height: calc(100dvh - 24px);
		animation: certification-tooltip-enter 150ms ease-out both;
	}

	@media (prefers-reduced-motion: reduce) {
		.certification-tooltip {
			animation: none;
		}
	}
</style>
