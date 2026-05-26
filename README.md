# Save the Date

A wedding website for the Santana ~ Jones wedding, October 24, 2026. Built with React, TypeScript, Vite, and D3.js.

The site has two layers:
- **Homepage** — wedding details (hotels, directions, RSVP, gifts), the default landing experience
- **Countdown experience** — 7 creative ways to visualize time until the wedding, accessible via `/#experience`

## Features

- **Details Homepage**: Accommodation info, directions, RSVP link, and gifts — the practical stuff guests actually need
- **Multiple Countdown Modules**: 7 different creative ways to visualize time until the wedding
  - Standard Countdown
  - Orbital Visualization
  - Seasonal Dial
  - Lunar Phase Tracker
  - Social Time Converter
  - Absurd Time Units
  - Analog Clock
- **Bilingual (EN/ES)**: Full English and Spanish support across both views — includes Mexican holidays and locale-aware date formatting. Language preference persists via localStorage.
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

## Deploy to Vercel

This app is ready to deploy to Vercel:

1. Push to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Vite and configure the build settings
4. Deploy!

Alternatively, use the Vercel CLI:
```bash
vercel
```

## Tech Stack

- React 19
- TypeScript
- Vite
- D3.js (for visualizations)
- Tailwind CSS (via CDN)
- Lucide React (icons)

## License

MIT
