<script>
	let { artist = $bindable(''), onSearch } = $props();
</script>

<form
	class="flex w-110 items-center gap-3 rounded-l border border-white/15 px-6 py-2"
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