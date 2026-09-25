# Architecture Documentation

## What This App Does

A wedding website for the Santana ~ Jones wedding (October 24, 2026). It has two distinct layers:

1. **Homepage** — the default landing view. Shows practical wedding details: hotel accommodation (two properties with booking links), directions to the venue, RSVP form link, and gifts note. Light sage palette, mobile-first, bilingual.

2. **Countdown experience** — reachable via `/#experience` or the footer link on the homepage. Seven creative ways to visualize the time remaining until the wedding, each as a full-screen snap-scroll module with its own visual "vibe". After the wedding the same modules count up instead (see "After the Wedding" below).

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **D3.js** - Data visualizations (used in orbital, lunar, and seasonal modules)
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
│   ├── HomePage.tsx           # Details homepage (hotels, directions, RSVP, gifts)
│   ├── StandardCountdown.tsx  # Years/months/days/hours/minutes/seconds grid
│   ├── OrbitModule.tsx        # Earth orbit visualization with D3
│   ├── SeasonalDialModule.tsx # Seasonal clock showing progress through year
│   ├── LunarModule.tsx        # Moon phase tracker
│   ├── SocialTimeModule.tsx   # Weekends/meals/holidays counter
│   ├── AbsurdModule.tsx       # Netflix episodes, cat naps, heartbeats
│   ├── AnalogClockModule.tsx  # Traditional analog clock
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

- **Scroll container**: Full-screen with `snap-y snap-mandatory` - each module takes exactly 100vh
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
  targetDate: Date;  // October 24, 2026
  isActive: boolean; // Is this module currently visible?
}
```

This makes all modules **swappable** - you can reorder them in `App.tsx` without breaking anything.

### 4. Design System

**designSystem.ts** contains all visual constants:

- **Colors**: Text, backgrounds, borders (all from Tailwind's stone palette)
- **Typography**: Predefined text styles for headers, numbers, labels
- **Spacing**: Consistent positioning for headers/footers
- **Components**: Reusable class strings for buttons, pagination dots

**Why it exists**: So we can change the entire app's visual style by editing one file. Every module imports and uses these tokens.

**Example**:
```tsx
import { getModuleHeaderClass, typography, colors } from '../designSystem';

// Instead of:
<h2 className="text-xl sm:text-2xl md:text-3xl italic font-serif text-stone-400">

// We write:
<h2 className={getModuleHeaderClass()}>
```

### 5. Constants

**constants.ts** holds all non-visual configuration:

- Wedding date and venue coordinates. `TARGET_DATE` is the moment the site flips from counting down to counting up: 4:30 p.m. **with an explicit Pacific offset** (`-07:00`), so every guest flips at the same instant regardless of their own time zone. Anything that displays it as a calendar date (the `.ics` export, the seasonal dial label) formats it in `America/Los_Angeles` so guests far east of California still see Oct 24.
- Milliseconds per day/year/lunar cycle
- Conversion factors for "absurd" units (Netflix hours, cat nap duration)

**Why separated**: Makes it easy to clone this for another event - just change constants.ts and you're done.

### 6. Internationalization (i18n)

**i18n.tsx** provides a React Context that stores the current locale (`'en' | 'es'`) and persists it to `localStorage` so the choice survives page reloads and carries across both views.

- **`useT()`** — returns the full `Translations` object for the active locale
- **`useLocale()`** — returns `[locale, setLocale]` for reading/writing the locale
- **`LanguageToggle`** — flag pill toggle styled for the dark experience view
- **`LanguageToggleLight`** — same toggle styled for the light sage homepage

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

  // 3. Render with consistent header/footer
  return (
    <div className="h-full w-full flex flex-col items-center justify-center...">
      <div className={getModuleHeaderClass()}>Module Name</div>
      {/* Main visualization */}
      <p className={getModuleFooterClass()}>Explanatory caption</p>
    </div>
  );
};
```

**Key points**:
- Every module recalculates its values every second (1000ms interval)
- Background animations often use `isActive` to pause when off-screen
- Headers use serif italic, footers use small mono text (design system enforces this)

### 8. Visualization Modules

**D3-heavy modules** (Orbit, Seasonal, Lunar):
- Create SVG elements using D3 for data binding and animations
- Use `useRef` to access DOM elements for D3 manipulation
- Calculate positions using trigonometry (angles, arcs, orbits)

- Redraw via a `ResizeObserver` on the container, not a window `resize` listener. The container can still be 0px tall when the module mounts (e.g. arriving from the homepage while the Tailwind CDN is still applying styles), and a one-time measurement left the seasonal dial blank until a refresh.

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

**Shuffle button** (bottom-right):
- Randomly jumps to a different module
- Uses `containerRef.scrollTo()` with smooth behavior
- Excludes current module from random selection

**Calendar export** (click date in header):
- Generates an `.ics` file on the fly
- Downloads automatically when clicked
- Contains wedding date, venue, and description

**Maps link** (click coordinates in header):
- Opens venue address in default maps application
- Platform-aware: Google Maps on mobile, Apple/Google Maps on desktop

### 10. Pagination Indicators

Little dots on the right side show which module you're viewing:
- Each module renders its own indicator (7 dots total)
- Active dot is larger and brighter
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

The whole app is ~2200 lines of TypeScript across source files. Small enough to understand in one sitting, structured enough to maintain easily.
