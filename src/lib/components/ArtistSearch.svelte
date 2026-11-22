<script>
	let { artist = $bindable(''), onSearch } = $props();
</script>

<form
	class="flex h-14 w-full min-w-0 items-center gap-2 rounded-[10px] border border-white/15 px-4 transition-colors focus-within:border-white/40 sm:h-16 sm:flex-1 sm:gap-3 sm:px-6"
	onsubmit={(e) => {
		e.preventDefault();
		onSearch();
	}}
>
	<span class="text-2xl text-white/40 sm:text-[26px]">⌕</span>

	<input
		bind:value={artist}
		type="text"
		placeholder="Chercher un artiste..."
		class="w-full min-w-0 bg-transparent text-lg text-white outline-none placeholder:text-white/25 sm:text-2xl"
	/>
</form>
