# Architecture Documentation

## What This App Does

A wedding countdown app with 7 different creative ways to visualize time until October 24, 2026. Users scroll vertically through different "modules" (visualizations), each showing the countdown in a unique way.

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
├── App.tsx                    # Main app component, handles scrolling & module navigation
├── index.tsx                  # React entry point
├── index.html                 # HTML shell with Tailwind CDN & fonts
│
├── constants.ts               # Wedding date, venue info, conversion factors
├── types.ts                   # TypeScript interfaces (TimeModuleProps, etc.)
├── designSystem.ts            # All design tokens (colors, typography, spacing)
│
├── components/
│   ├── StandardCountdown.tsx  # Years/months/days/hours/minutes/seconds grid
│   ├── OrbitModule.tsx        # Earth orbit visualization with D3
│   ├── SeasonalDialModule.tsx # Seasonal clock showing progress through year
│   ├── LunarModule.tsx        # Moon phase tracker
│   ├── SocialTimeModule.tsx   # Weekends/meals/holidays counter
│   ├── AbsurdModule.tsx       # Netflix episodes, cat naps, heartbeats
│   ├── AnalogClockModule.tsx  # Traditional analog clock
│   ├── ShuffleButton.tsx      # Bottom-right button to jump to random module
│   └── Tooltip.tsx            # Reusable tooltip component
│
└── utils/
    ├── calendarUtils.ts       # Generates .ics files for calendar export
    └── mapsUtils.ts           # Opens venue location in maps app
```

## How the App Works

### 1. Module System

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

### 2. Module Interface

Every module implements the same interface:

```tsx
interface TimeModuleProps {
  targetDate: Date;  // October 24, 2026
  isActive: boolean; // Is this module currently visible?
}
```

This makes all modules **swappable** - you can reorder them in `App.tsx` without breaking anything.

### 3. Design System

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

### 4. Constants

**constants.ts** holds all non-visual configuration:

- Wedding date and venue coordinates
- Milliseconds per day/year/lunar cycle
- Conversion factors for "absurd" units (Netflix hours, cat nap duration)

**Why separated**: Makes it easy to clone this for another event - just change constants.ts and you're done.

### 5. Module Patterns

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

### 6. Visualization Modules

**D3-heavy modules** (Orbit, Seasonal, Lunar):
- Create SVG elements using D3 for data binding and animations
- Use `useRef` to access DOM elements for D3 manipulation
- Calculate positions using trigonometry (angles, arcs, orbits)

**Simple modules** (Standard, Social, Absurd):
- Just do math and display numbers
- No fancy graphics, rely on typography scale for impact

### 7. Interactive Elements

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

### 8. Pagination Indicators

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
4. **Tailwind CDN**: Simpler than build-time purging for a small app

## Extending the App

### Adding a new module:

1. Create `components/NewModule.tsx`
2. Implement `TimeModuleProps` interface
3. Add to `modules` array in `App.tsx`
4. Use design system tokens for consistency

### Changing visual style:

Edit `designSystem.ts` - specifically the `colors` object. Everything else follows.

### Using for a different event:

1. Change `TARGET_DATE` in `constants.ts`
2. Update venue info
3. Modify `index.html` title
4. Done!

## Why This Architecture?

**Simplicity**: No complex state management, no routing, no server
**Consistency**: Design system ensures visual coherence across 7 different modules
**Extensibility**: Adding new countdown visualizations is trivial
**Portability**: Static export works anywhere (Vercel, Netlify, S3, GitHub Pages)

The whole app is ~1700 lines of TypeScript. Small enough to understand in one sitting, structured enough to maintain easily.
