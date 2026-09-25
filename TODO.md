# TODO

- [x] Add brunch information: Sunday, Oct 25, 10 AM–1 PM at Stone Brewing World Bistro, 1999 Citracado Parkway, Escondido.
- [x] Add venue arrival info: guests should arrive by 3:30 PM (parking/seating ahead of the day's events).
- [ ] Anakaren to review the new after-wedding Spanish copy in `translations/es.ts` (`headerMarried`, `since`, `anniversary`, `descAnniversary`, and the lunar `headerMarried`/`tonight`/`fullMoon(s)Since`/`nextFull*` strings). Must be pushed before 4:30 PM on Oct 24.
- [ ] After the wedding (no rush): move Tailwind from the runtime CDN script to a build-time setup. Styles would then exist before anything mounts, removing the class of "blank until refresh" bugs. Risk: dynamically built class names (e.g. `getVibeClass`) can silently drop out, so check every module and the homepage afterwards.
