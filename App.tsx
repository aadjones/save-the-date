import React, { useState, useRef, useEffect } from 'react';
import StandardCountdown from './components/StandardCountdown';
import OrbitModule from './components/OrbitModule';
import SeasonalDialModule from './components/SeasonalDialModule';
import LunarModule from './components/LunarModule';
import SocialTimeModule from './components/SocialTimeModule';
import AbsurdModule from './components/AbsurdModule';
import AnalogClockModule from './components/AnalogClockModule';
import ShuffleButton from './components/ShuffleButton';
import { TARGET_DATE } from './constants';
import { components, colors, typography } from './designSystem';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModule, setActiveModule] = useState<number>(0);

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
    const randomIndex = Math.floor(Math.random() * modules.length);
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: randomIndex * height,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950">
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
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 pointer-events-none mix-blend-difference select-none">
         <div className="flex items-baseline gap-3">
           <h1 className={`${colors.text.secondary} font-serif text-lg sm:text-xl tracking-wide font-bold`}>Save the Date</h1>
           <p className={`${colors.text.muted} ${typography.label.mono}`}>33°11'52.5"N 117°09'07.0"W</p>
         </div>
         <p className={`${colors.text.tertiary} ${typography.label.mono} mt-0.5 sm:mt-1`}>September 20, 2026</p>
      </div>

      <ShuffleButton onClick={handleShuffle} />
    </div>
  );
};

export default App;