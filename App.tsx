import React, { useState, useRef, useEffect } from 'react';
import StandardCountdown from './components/StandardCountdown';
import OrbitModule from './components/OrbitModule';
import SeasonalDialModule from './components/SeasonalDialModule';
import LunarModule from './components/LunarModule';
import SocialTimeModule from './components/SocialTimeModule';
import AbsurdModule from './components/AbsurdModule';
import AnalogClockModule from './components/AnalogClockModule';
import { ChevronDown } from 'lucide-react';
import { TARGET_DATE, VENUE_NAME, VENUE_ADDRESS, VENUE_COORDINATES } from './constants';
import { components, colors, typography, vibes, getVibeClass, Vibe } from './designSystem';
import { generateIcsFile } from './utils/calendarUtils';
import { openMapsLink } from './utils/mapsUtils';
import { useT, LanguageToggle } from './i18n';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModule, setActiveModule] = useState<number>(0);
  const [lunarAtBottom, setLunarAtBottom] = useState(false);
  const t = useT();

  const modules: { id: string; vibe: Vibe; Component: React.FC<any> }[] = [
    { id: 'standard', vibe: 'wedding', Component: StandardCountdown },
    { id: 'orbit', vibe: 'space', Component: OrbitModule },
    { id: 'seasonal', vibe: 'elemental', Component: SeasonalDialModule },
    { id: 'lunar', vibe: 'mystical', Component: LunarModule },
    { id: 'social', vibe: 'corporate', Component: SocialTimeModule },
    { id: 'absurd', vibe: 'humorous', Component: AbsurdModule },
    { id: 'clock', vibe: 'steampunk', Component: AnalogClockModule },
  ];

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPosition = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollPosition / height);
    if (index !== activeModule) {
      setActiveModule(index);
    }
  };

  const scrollToModule = (index: number) => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollTo({ top: index * height, behavior: 'smooth' });
  };

  const handleDateClick = () => {
    generateIcsFile(
      t.app.calendarTitle,
      TARGET_DATE,
      `${VENUE_NAME}, ${VENUE_ADDRESS}`,
      t.app.calendarDescription
    );
  };

  const handleLocationClick = () => {
    openMapsLink(`${VENUE_NAME}, ${VENUE_ADDRESS}`);
  };

  return (
    <div className="relative w-screen h-dvh overflow-hidden bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
      >
        {modules.map((Module, index) => (
          <div
            key={Module.id}
            className="w-full h-full snap-start relative flex-shrink-0"
          >
            <Module.Component
              targetDate={TARGET_DATE}
              isActive={index === activeModule}
              {...(Module.id === 'lunar' && { onScrolledToBottom: setLunarAtBottom })}
            />

            {/* Pagination indicator */}
            <div className={components.pagination.container}>
              {modules.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className={`${components.pagination.dot} ${dotIndex === index
                    ? components.pagination.dotActive
                    : components.pagination.dotInactive
                    }`}
                />
              ))}
            </div>

            {/* Scroll down arrow */}
            {index < modules.length - 1 && Module.id !== 'lunar' && (
              <div className="absolute bottom-4 sm:bottom-16 inset-x-0 flex justify-center z-20">
                <button
                  onClick={() => scrollToModule(index + 1)}
                  className="animate-bounce opacity-80 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none p-2"
                  aria-label="Scroll to next section"
                >
                  <ChevronDown size={28} className="text-stone-300 sm:w-9 sm:h-9" />
                </button>
              </div>
            )}
            {/* Lunar: arrow appears only once scrolled to the bottom of the timeline */}
            {Module.id === 'lunar' && index < modules.length - 1 && (
              <div className={`absolute bottom-4 sm:bottom-16 inset-x-0 flex justify-center z-20 transition-opacity duration-500 ${lunarAtBottom ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}>
                <button
                  onClick={() => scrollToModule(index + 1)}
                  className="animate-bounce hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none p-2"
                  aria-label="Scroll to next section"
                >
                  <ChevronDown size={28} className="text-stone-300 sm:w-9 sm:h-9" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Global Header Elements */}
      <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none">
        {/* Top row: Left (Logo/Date), Center (Toggle), Right (Coords - desktop) */}
        {/* Using fixed width for the logo block to prevent the toggle from shifting when language changes */}
        <div className="w-full flex justify-between items-start gap-2 sm:gap-4">
          <div className="flex flex-col items-start pointer-events-auto flex-shrink-0 w-28 sm:w-40">
            <h1 className={`${getVibeClass(modules[activeModule].vibe, 'branding')} font-serif text-sm sm:text-lg tracking-wide font-bold whitespace-nowrap transition-colors duration-500`}>
              {t.app.title}
            </h1>
            <button
              onClick={handleDateClick}
              className={`${getVibeClass(modules[activeModule].vibe, 'branding')} text-[9px] sm:text-xs font-mono cursor-pointer opacity-60 hover:opacity-100 transition-all underline decoration-dotted underline-offset-2`}
              aria-label={t.app.calendarAriaLabel}
            >
              {t.app.date}
            </button>
          </div>

          <div className="flex-1 flex justify-center pointer-events-auto min-w-0">
            <div className="flex-shrink-0">
              <LanguageToggle />
            </div>
          </div>

          <div className="flex justify-end pointer-events-auto flex-shrink-0 w-10 sm:w-40">
            <button
              onClick={handleLocationClick}
              className={`${getVibeClass(modules[activeModule].vibe, 'branding')} text-[9px] sm:text-xs font-mono cursor-pointer opacity-60 hover:opacity-100 transition-all underline decoration-dotted underline-offset-2 hidden sm:inline`}
              aria-label={t.app.locationAriaLabel}
            >
              {VENUE_COORDINATES}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default App;