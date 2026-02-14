import React, { useState, useRef, useEffect } from 'react';
import StandardCountdown from './components/StandardCountdown';
import OrbitModule from './components/OrbitModule';
import SeasonalDialModule from './components/SeasonalDialModule';
import LunarModule from './components/LunarModule';
import SocialTimeModule from './components/SocialTimeModule';
import AbsurdModule from './components/AbsurdModule';
import AnalogClockModule from './components/AnalogClockModule';
import ShuffleButton from './components/ShuffleButton';
import { ChevronDown } from 'lucide-react';
import { TARGET_DATE, VENUE_NAME, VENUE_ADDRESS, VENUE_COORDINATES } from './constants';
import { components, colors, typography } from './designSystem';
import { generateIcsFile } from './utils/calendarUtils';
import { openMapsLink } from './utils/mapsUtils';
import { useT, LanguageToggle } from './i18n';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModule, setActiveModule] = useState<number>(0);
  const t = useT();

  const modules = [
    { id: 'standard', Component: StandardCountdown },
    { id: 'orbit', Component: OrbitModule },
    { id: 'seasonal', Component: SeasonalDialModule },
    { id: 'lunar', Component: LunarModule },
    { id: 'social', Component: SocialTimeModule },
    { id: 'absurd', Component: AbsurdModule },
    { id: 'clock', Component: AnalogClockModule },
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

  const handleShuffle = () => {
    if (!containerRef.current) return;
    // Get a random index that's different from the current module
    // If there are N modules and we exclude the current one, we have N-1 options
    let randomIndex = Math.floor(Math.random() * (modules.length - 1));
    // If the random index is >= current index, increment to skip the current module
    if (randomIndex >= activeModule) {
      randomIndex++;
    }
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: randomIndex * height,
      behavior: 'smooth'
    });
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
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900">
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
            />
            
            {/* Pagination indicator */}
            <div className={components.pagination.container}>
               {modules.map((_, dotIndex) => (
                 <div
                    key={dotIndex}
                    className={`${components.pagination.dot} ${
                      dotIndex === index
                        ? components.pagination.dotActive
                        : components.pagination.dotInactive
                    }`}
                 />
               ))}
            </div>

            {/* Scroll down arrow — all modules except the last */}
            {index < modules.length - 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none z-20 opacity-80">
                <ChevronDown size={36} className="text-stone-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 mix-blend-difference select-none">
         <div className="flex items-baseline gap-3">
           <h1 className={`${colors.text.secondary} font-serif text-lg sm:text-xl tracking-wide font-bold pointer-events-none`}>{t.app.title}</h1>
           <button
             onClick={handleLocationClick}
             className={`${colors.text.muted} ${typography.label.mono} pointer-events-auto cursor-pointer hover:text-stone-200 transition-colors underline decoration-dotted underline-offset-2 hidden sm:inline`}
             aria-label={t.app.locationAriaLabel}
           >
             {VENUE_COORDINATES}
           </button>
         </div>
         <div className="flex items-center gap-3 mt-0.5 sm:mt-1">
           <button
             onClick={handleDateClick}
             className={`${colors.text.tertiary} ${typography.label.mono} pointer-events-auto cursor-pointer hover:text-stone-300 transition-colors underline decoration-dotted underline-offset-2`}
             aria-label={t.app.calendarAriaLabel}
           >
             {t.app.date}
           </button>
           <div className="sm:hidden pointer-events-auto">
             <LanguageToggle />
           </div>
         </div>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 mix-blend-difference hidden sm:block">
        <LanguageToggle />
      </div>

      <ShuffleButton onClick={handleShuffle} />
    </div>
  );
};

export default App;