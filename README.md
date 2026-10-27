# Save the Date

This was the wedding website for the Santana ~ Jones wedding, October 24, 2026: a details page plus seven ways to count down (and then up) to the day.

The countdown now lives on Studio Demby at [studiodemby.com/extras/married-for](https://www.studiodemby.com/extras/married-for). This site is a single "we've moved" screen that links there. The old details page and countdown are in git history (last full version: `c2be4ed`).

## What happened

- **Before the wedding:** a details page (hotels, directions, attire, brunch, RSVP, gifts) and a seven-section countdown at `/#experience`, in English and Spanish.
- **October 24, 2026, 4:30 p.m. Pacific:** the countdown flipped to counting up ("Married For").
- **October 26, 2026:**
  - `c2be4ed` retired the "Save the Date" wording.
  - The countdown was then ported to Studio Demby as a hidden extra. Its README, `app/extras/married-for/README.md` in the studio-demby repo, covers how it's built and what changed in the move.
  - `3e97eff` replaced this site with the "we've moved" screen. It's a page rather than a server redirect because the `#experience` part of old links never reaches the server, and a page lets guests see that it moved.
  - `d009a8b` made the potatoes link there too.

## Run Locally

```bash
npm install
npm run dev
```

## Deploy

The repo is connected to Vercel through its GitHub integration: **every push to `main` deploys straight to production** (savethedate-three.vercel.app). Run `npm run build` before pushing.

## License

MIT
