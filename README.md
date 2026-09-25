# Save the Date

A wedding website for the Santana ~ Jones wedding, October 24, 2026. Built with React, TypeScript, Vite, and D3.js.

The site has two layers:
- **Homepage**—wedding details (hotels, directions, attire, brunch, RSVP, gifts), the default landing experience
- **Countdown experience**—7 creative ways to visualize time until the wedding, accessible via `/#experience`

## Features

- **Details Homepage**: Accommodation info, directions, attire, Sunday brunch, RSVP link, and gifts—the practical stuff guests actually need
- **Multiple Countdown Modules**: 7 different creative ways to visualize time until the wedding
  - Standard Countdown
  - Orbital Visualization
  - Seasonal Dial
  - Lunar Phase Tracker
  - Social Time Converter
  - Absurd Time Units
  - Analog Clock
- **After the wedding**: from 4:30 p.m. Pacific on Oct 24, 2026 the modules count *up* ("Married For", "since the wedding"), the lunar stack becomes a wedding-moon vs. tonight comparison, and the clock's red hand tracks progress to the next anniversary
- **Bilingual (EN/ES)**: Full English and Spanish support across both views—includes Mexican holidays and locale-aware date formatting. Language preference persists via localStorage.
- **Hash-based routing**: `/#experience` links directly to the countdown; default (`/`) lands on the homepage
- **Smooth Scrolling**: Snap-scroll through different countdown modules
- **Fully Responsive**: Mobile-first, works on desktop and mobile

## Wedding Details

**Date**: October 24, 2026, 4:00 p.m.
**Location**: The Yellow Rose Inn, 26895 N Broadway, Escondido, CA 92026

## Run Locally

**Prerequisites:** Node.js

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the URL printed in the terminal (default: [http://localhost:5173](http://localhost:5173))

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy

The repo is connected to Vercel through its GitHub integration: **every push to `main` deploys straight to production** (savethedate-three.vercel.app). Run `npm run build` before pushing.

To check a deploy went out, look at the "Vercel" status on the commit (`gh api repos/aadjones/save-the-date/commits/<sha>/status`) or run `vercel ls`.

## Tech Stack

- React 19
- TypeScript
- Vite
- D3.js (for visualizations)
- Tailwind CSS (via the runtime CDN script; see TODO.md)
- Lucide React (icons)

## License

MIT
