# ArtistOrbit

Interactive orbit-based visualization of French music certifications built with SvelteKit and D3.js using the OpenSnep API.

## Overview

ArtistOrbit transforms artist certifications into orbital rings:

- ring color → certification tier
- ring thickness → number of certifications
- orbit structure → certification hierarchy

The project was created as a creative showcase of what can be built using the OpenSnep API and French music industry data.

## Features

- Interactive SVG orbit visualization
- Dynamic certification scaling
- Albums / Singles categories
- Hover & mobile tooltip interactions
- Responsive design
- Real-time API fetching

## Tech Stack

- SvelteKit
- TailwindCSS
- D3.js
- OpenSnep API

## Installation

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file:

```env
PUBLIC_API_URL=https://opensnep.up.railway.app
```

## Build

```bash
npm run build
```

## Links

### OpenSnep API

https://opensnep.up.railway.app

### Portfolio

https://yanis.fyi

## Future Improvements

- Improve mobile tooltip positioning
- Add smooth transitions between artist searches
- Add search suggestions/autocomplete
- Persist artist & category in URL parameters
- Add loading skeletons
- Improve touch interactions on mobile
- Add shareable orbit screenshots
- Add artist search history
- Improve tooltip overflow handling
- Add subtle ring glow effects
- Add deployment URL
- Add screenshots/GIF demo to README
- pls: I will do that if I am not lazy :)
