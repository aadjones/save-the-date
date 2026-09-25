# Architecture Documentation

## What This App Does

A wedding website for the Santana ~ Jones wedding (October 24, 2026). It has two distinct layers:

1. **Homepage**—the default landing view. Shows practical wedding details: hotel accommodation (two properties with booking links), directions to the venue, attire, Sunday brunch, RSVP form link, and gifts (with a Venmo honeymoon fund and QR code). Light sage palette, mobile-first, bilingual.

2. **Countdown experience**—reachable via `/#experience` or the footer link on the homepage. Seven creative ways to visualize the time remaining until the wedding, each as a full-screen snap-scroll module with its own visual "vibe". After the wedding the same modules count up instead (see "After the Wedding" below).

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **D3.js** - Data visualizations (used in the orbital and seasonal modules)
- **Tailwind CSS** - Styling (loaded via CDN for simplicity)
- **Lucide React** - Icon library

## File Structure

```
/
├── App.tsx                    # Root component: view routing + experience shell
├── index.tsx                  # React entry point, wraps app in LocaleProvider
├── index.html                 # HTML shell with Tailwind CDN & fonts
│
├── constants.ts               # Wedding date, venue info, conversion factors
├── types.ts                   # TypeScript interfaces (TimeModuleProps, etc.)
├── designSystem.ts            # All design tokens (colors, typography, spacing, vibes)
├── i18n.tsx                   # LocaleProvider, useT/useLocale hooks, LanguageToggle variants
│
├── components/
│   ├── HomePage.tsx           # Details homepage (hotels, directions, attire, brunch, RSVP, gifts)
│   ├── StandardCountdown.tsx  # Years/months/days/hours/minutes/seconds grid
│   ├── OrbitModule.tsx        # Earth orbit visualization with D3
│   ├── SeasonalDialModule.tsx # Seasonal clock showing progress through year
│   ├── LunarModule.tsx        # Scrolling moon-phase stack; "The Wedding Moon" after the wedding
│   ├── SocialTimeModule.tsx   # Weekends/meals/holidays counter
│   ├── AbsurdModule.tsx       # Netflix episodes, cat naps, heartbeats
│   ├── AnalogClockModule.tsx  # "Relative clock": tap to cycle nine hands (seconds → solar year, sidereal day, countdown)
│   └── Tooltip.tsx            # Reusable tooltip component
│
├── translations/
│   ├── index.ts               # Translations type + Locale type
│   ├── en.ts                  # English strings
│   └── es.ts                  # Spanish strings
│
└── utils/
    ├── calendarUtils.ts       # Generates .ics files for calendar export
    └── mapsUtils.ts           # Opens venue location in maps app (platform-aware)
```

## How the App Works

### 1. Routing

There is no router library. **App.tsx** holds a `view: 'home' | 'experience'` state value and conditionally renders either `<HomePage>` or the snap-scroll experience shell.

```tsx
const [view, setView] = useState<View>(() =>
  window.location.hash === '#experience' ? 'experience' : 'home'
);
```

`window.location.hash` is written manually on navigation (`#experience` or `''`), and a `hashchange` listener keeps the state in sync with the browser back button. This gives direct-linkable URLs with no dependency overhead.

### 2. Module System

**App.tsx** is the orchestrator:

- **Scroll container**: Full-screen (`h-dvh`) with `snap-y snap-mandatory` - each module fills the container (`h-full`)
- **Active tracking**: Detects which module is currently visible based on scroll position
- **Module array**: 7 modules in a specific order, each receives `targetDate` and `isActive` props

```tsx
const modules = [
  { id: 'standard', Component: StandardCountdown },
  { id: 'orbit', Component: OrbitModule },
  // ... 5 more
];
```

Each module gets rendered in a snap-scroll container. Only the visible module is "active" (for performance - animations pause when not visible).

### 3. Module Interface

Every module implements the same interface:

```tsx
interface TimeModuleProps {
  targetDate: Date;  // Oct 24, 2026, 4:30 p.m. Pacific: the countdown → count-up switch
  isActive: boolean; // Is this module currently visible?
  onScrolledToBottom?: (atBottom: boolean) => void; // Lunar only: tells App when to show the next-section arrow
}
```

This makes all modules **swappable** - you can reorder them in `App.tsx` without breaking anything.

### 4. Design System

**designSystem.ts** contains all visual constants:

- **`vibes`**: One entry per module "vibe" (`wedding`, `space`, `elemental`, `mystical`, `corporate`, `humorous`, `steampunk`), each with its own palette and fonts: class strings for `container`, `header`, `number`, `label`, `footer`, `branding`, and pagination colors. This is what modules actually style themselves with.
- **`getVibeClass(vibe, part)`**: Looks up one of those class strings.
- **`colors`, `typography`, `spacing`, `components`**: Shared tokens (e.g. `components.pagination`, `getButtonClass`) used for cross-module chrome.

**Why it exists**: Each module has a distinct look, but all of it is defined in one file. App.tsx also uses the active module's vibe to recolor the shared chrome (title, date, coordinates, "← details" link, next-section arrow).

**Example**:
```tsx
import { vibes, getVibeClass } from '../designSystem';

const vibe = 'mystical';
<div className={`h-full w-full ${vibes[vibe].container}`}>
  <h2 className={getVibeClass(vibe, 'header')}>…</h2>
</div>
```

(`getModuleHeaderClass` / `getModuleFooterClass` still exist in designSystem.ts but nothing calls them.)

### 5. Constants

**constants.ts** holds all non-visual configuration:

- Wedding date and venue coordinates. `TARGET_DATE` is the moment the site flips from counting down to counting up: 4:30 p.m. **with an explicit Pacific offset** (`-07:00`), so every guest flips at the same instant regardless of their own time zone. Anything that displays it as a calendar date (the `.ics` export, the seasonal dial label) formats it in `America/Los_Angeles` so guests far east of California still see Oct 24.
- Milliseconds per day/year/lunar cycle
- Conversion factors for "absurd" units (Netflix hours, cat nap duration)

**Why separated**: Makes it easy to clone this for another event - just change constants.ts and you're done.

### 6. Internationalization (i18n)

**i18n.tsx** provides a React Context that stores the current locale (`'en' | 'es'`) and persists it to `localStorage` so the choice survives page reloads and carries across both views.

- **`useT()`**—returns the full `Translations` object for the active locale
- **`useLocale()`**—returns `[locale, setLocale]` for reading/writing the locale
- **`LanguageToggle`**—flag pill toggle styled for the dark experience view
- **`LanguageToggleLight`**—same toggle styled for the light sage homepage

All strings live in `translations/en.ts` and `translations/es.ts`, typed against the `Translations` interface in `translations/index.ts`. The `home` namespace covers the homepage; all other namespaces cover the countdown modules.

### 7. Module Patterns

All modules follow the same structure:

```tsx
const SomeModule: React.FC<TimeModuleProps> = ({ targetDate, isActive }) => {
  // 1. State for calculated values
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // 2. useEffect to calculate countdown and update every second
  useEffect(() => {
    const calculate = () => { /* math */ };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // 3. Render inside the module's vibe
  return (
    <div className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} ...`}>
      <h2 className={getVibeClass(vibe, 'header')}>{t.someModule.header}</h2>
      {/* Main visualization */}
      <p className={getVibeClass(vibe, 'footer')}>{t.someModule.footer}</p>
    </div>
  );
};
```

**Key points**:
- Update rates vary: Standard and Social tick every second; Absurd every second (every 100ms for heartbeats); Orbit and Clock animate every frame while active; Seasonal and Lunar recompute only when they redraw (resize, language change, becoming active)
- Animations use `isActive` to pause when off-screen
- All user-facing strings come from `useT()`, never hard-coded

### 8. Visualization Modules

**D3-heavy modules** (Orbit, Seasonal):
- Create SVG elements using D3 for data binding and animations
- Use `useRef` to access DOM elements for D3 manipulation
- Calculate positions using trigonometry (angles, arcs, orbits)
- Redraw via a `ResizeObserver` on the container, not a window `resize` listener. The container can still be 0px tall when the module mounts (e.g. arriving from the homepage while the Tailwind CDN is still applying styles), and a one-time measurement left the seasonal dial blank until a refresh.

**SVG-in-JSX modules** (Lunar, Clock):
- Draw moon phases and clock hands as plain React SVG, no D3

**Simple modules** (Standard, Social, Absurd):
- Just do math and display numbers
- No fancy graphics, rely on typography scale for impact

### After the Wedding

Each module checks `now >= targetDate` on every tick, so an open page flips live at 4:30 p.m. on Oct 24:

| Module | After the wedding |
|---|---|
| Standard | Header becomes "Married For"; counts up from the wedding |
| Orbit | Stats show distance travelled *since*; one full lap = first anniversary |
| Seasonal | Unchanged (it was always cyclical) |
| Lunar | The scrolling stack is replaced by "The Wedding Moon": wedding-night moon vs. tonight's, plus full moons since. Re-checked when scrolled into view rather than every second |
| Social | "… since the wedding"; holidays counted between wedding and now |
| Absurd | Absolute value plus a "since 'I do'" line |
| Clock | The red "Countdown" hand becomes "The Anniversary": progress from the latest Oct 24 to the next |

### 9. Interactive Elements

**Next-section arrow** (bottom center):
- Smooth-scrolls to the next module via `containerRef.scrollTo()`
- Hidden on the last module; on the lunar stack it appears only once the list is scrolled to the bottom (or immediately if the list fits)

**"← details" link** (top-left): returns to the homepage.

**Calendar export** (click date in header):
- Generates an `.ics` file on the fly
- Downloads automatically when clicked
- All-day event on the wedding date (formatted in Pacific time), with venue and description

**Maps link** (click coordinates in header):
- Opens venue address in default maps application
- Platform-aware: Google Maps on mobile, Apple/Google Maps on desktop

### 10. Pagination Indicators

Little dots on the right side show which module you're viewing:
- App.tsx renders a set of 7 dots inside each module's slot
- Active dot is scaled up and brighter
- Not clickable - just visual feedback

## Data Flow

```
User scrolls
    ↓
App.tsx detects scroll position
    ↓
Updates activeModule state (0-6)
    ✓
Modules receive isActive={true/false}
    ↓
Active module runs animations, others pause
```

## Performance Considerations

1. **Scroll snapping**: Browser-native, no JavaScript needed for smooth scrolling
2. **Conditional rendering**: Most modules don't pause their timers when inactive, but D3 animations respect `isActive`
3. **No route splits**: Everything loads at once (app is tiny anyway)
4. **Tailwind CDN**: Simpler than build-time purging for a small app, but it generates styles at runtime, so layout isn't guaranteed to be final when components mount. Measure DOM size with a `ResizeObserver`, never once on mount. Moving to build-time Tailwind is in TODO.md

## Extending the App

### Adding a new module:

1. Create `components/NewModule.tsx`
2. Implement `TimeModuleProps` interface
3. Add to `modules` array in `App.tsx`
4. Use design system tokens for consistency

### Changing visual style:

Edit `designSystem.ts` - specifically the `colors` object. Everything else follows.

### Using for a different event:

1. Change `TARGET_DATE` in `constants.ts` (keep an explicit time-zone offset, and update the `America/Los_Angeles` formatting in `calendarUtils.ts` and `SeasonalDialModule.tsx` if the venue moves)
2. Update venue info
3. Modify `index.html` title
4. Done!

## Why This Architecture?

**Simplicity**: No complex state management, no routing, no server
**Consistency**: Design system ensures visual coherence across 7 different modules
**Extensibility**: Adding new countdown visualizations is trivial
**Portability**: Static export works anywhere (Vercel, Netlify, S3, GitHub Pages)

The whole app is ~3,400 lines of TypeScript (including ~500 lines of translations). Small enough to understand in one sitting, structured enough to maintain easily.
