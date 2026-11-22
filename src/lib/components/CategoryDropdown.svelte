<script>
	import { tick } from 'svelte';

	/** @type {{ category?: 'Albums' | 'Singles' }} */
	let { category = $bindable('Albums') } = $props();
	/** @type {('Albums' | 'Singles')[]} */
	const categories = ['Albums', 'Singles'];
	let open = $state(false);
	let root = $state(/** @type {HTMLDivElement | undefined} */ (undefined));
	let trigger = $state(/** @type {HTMLButtonElement | undefined} */ (undefined));
	let menu = $state(/** @type {HTMLDivElement | undefined} */ (undefined));

	async function openMenu(focusIndex = categories.indexOf(category)) {
		open = true;
		await tick();
		const option = menu?.querySelectorAll('[role="option"]')[focusIndex];
		/** @type {HTMLButtonElement | undefined} */ (option)?.focus();
	}

	function closeMenu(returnFocus = false) {
		open = false;
		if (returnFocus) trigger?.focus();
	}

	function toggleMenu() {
		if (open) {
			closeMenu();
		} else {
			openMenu();
		}
	}

	/** @param {'Albums' | 'Singles'} value */
	function chooseCategory(value) {
		category = value;
		closeMenu(true);
	}

	/** @param {KeyboardEvent} event @param {number} index */
	function handleOptionKeydown(event, index) {
		const options = menu?.querySelectorAll('[role="option"]');
		if (!options?.length) return;

		/** @type {number} */
		let nextIndex;
		if (event.key === 'ArrowDown') nextIndex = (index + 1) % options.length;
		else if (event.key === 'ArrowUp') nextIndex = (index - 1 + options.length) % options.length;
		else if (event.key === 'Home') nextIndex = 0;
		else if (event.key === 'End') nextIndex = options.length - 1;
		else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			chooseCategory(categories[index]);
			return;
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeMenu(true);
			return;
		} else {
			return;
		}

		event.preventDefault();
		/** @type {HTMLButtonElement | undefined} */ (options[nextIndex])?.focus();
	}

	/** @param {PointerEvent} event */
	function handleOutsidePointerDown(event) {
		if (event.target instanceof Node && !root?.contains(event.target)) closeMenu();
	}
</script>

<svelte:window onpointerdown={handleOutsidePointerDown} />

<div class="relative w-full sm:w-auto" bind:this={root}>
	<button
		bind:this={trigger}
		type="button"
		class="flex h-14 w-full items-center justify-between rounded-[10px] border border-white/15 bg-white/10 px-4 pr-12 text-left text-base text-white outline-none focus-visible:ring-2 focus-visible:ring-white/35 sm:h-16 sm:w-[180px] sm:pr-9 sm:pl-5 sm:text-lg"
		aria-label="Category"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls="artist-orbit-category-menu"
		onclick={toggleMenu}
		onkeydown={(event) => {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				openMenu(categories.indexOf(category));
			} else if (event.key === 'Home') {
				event.preventDefault();
				openMenu(0);
			} else if (event.key === 'End') {
				event.preventDefault();
				openMenu(categories.length - 1);
			} else if (event.key === 'Escape' && open) {
				event.preventDefault();
				closeMenu(true);
			}
		}}
	>
		<span>{category}</span>
		<svg
			class="pointer-events-none absolute top-1/2 right-6 h-4 w-4 -translate-y-1/2 text-white/60"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
			focusable="false"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</button>

	{#if open}
		<div
			bind:this={menu}
			id="artist-orbit-category-menu"
			class="category-menu absolute left-0 z-50 w-full rounded-[10px] border border-white/15 bg-[#0f0f14] p-1 shadow-xl"
			style="top: calc(100% + 8px)"
			role="listbox"
			aria-label="Category"
		>
			{#each categories as option, index (option)}
				<button
					type="button"
					class="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-base text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none sm:text-lg"
					role="option"
					aria-selected={category === option}
					tabindex="-1"
					onclick={() => chooseCategory(option)}
					onkeydown={(event) => handleOptionKeydown(event, index)}
				>
					<span>{option}</span>
					{#if category === option}
						<svg
							class="h-4 w-4 text-white/80"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="m5 12 4 4L19 6" />
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	@keyframes category-menu-enter {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.category-menu {
		animation: category-menu-enter 150ms ease-out both;
	}

	@media (prefers-reduced-motion: reduce) {
		.category-menu {
			animation: none;
		}
	}
</style>
