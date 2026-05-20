<script>
	let { artist = $bindable(''), onSearch } = $props();
</script>

<form
	class="flex h-14 w-full items-center gap-3 rounded-sm border border-white/15 px-6 sm:max-w-110"
	onsubmit={(e) => {
		e.preventDefault();
		onSearch();
	}}
>
	<span class="text-xl text-white/40">⌕</span>

	<input
		bind:value={artist}
		type="text"
		placeholder="Chercher un artiste..."
		class="w-full bg-transparent text-l text-white outline-none placeholder:text-white/25"
	/>
</form>