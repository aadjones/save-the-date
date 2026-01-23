import React, { useState, useEffect } from 'react';
import { TimeModuleProps, AbsurdUnit } from '../types';
import { ABSURD_CONVERSIONS, MILLISECONDS_PER_DAY } from '../constants';

const AbsurdModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [unit, setUnit] = useState<AbsurdUnit>(AbsurdUnit.OH_SHIT);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
     // Initial setup
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = diffMs / MILLISECONDS_PER_DAY;

      let val = 0;
      switch (unit) {
        case AbsurdUnit.NETFLIX:
          val = diffHours / ABSURD_CONVERSIONS.NETFLIX_MINISERIES_HOURS;
          break;
        case AbsurdUnit.CAT_NAPS:
          val = diffHours / ABSURD_CONVERSIONS.CAT_NAP_HOURS;
          break;
        case AbsurdUnit.HEARTBEATS:
          val = (diffMs / 1000 / 60) * ABSURD_CONVERSIONS.HEARTBEAT_BPM;
          break;
        case AbsurdUnit.OH_SHIT:
          val = diffDays * ABSURD_CONVERSIONS.OH_SHIT_FACTOR;
          break;
      }
      setCount(val);
    };

    update();
    const timer = setInterval(update, unit === AbsurdUnit.HEARTBEATS ? 100 : 1000);
    return () => clearInterval(timer);
  }, [targetDate, unit]);

  const cycleUnit = () => {
      const units = Object.values(AbsurdUnit);
      const idx = units.indexOf(unit);
      setUnit(units[(idx + 1) % units.length]);
  };

  return (
    <div 
        onClick={cycleUnit}
        className="h-full w-full flex flex-col items-center justify-center bg-stone-950 text-stone-200 p-8 pt-20 cursor-pointer hover:bg-[#0f0d0c] transition-colors relative"
    >
      {/* Consistent Header */}
      <div className="absolute top-20 sm:top-12 left-0 right-0 z-10 text-center pointer-events-none px-4">
        <h2 className="text-xl sm:text-3xl italic font-serif text-stone-400">The Absurd Scale</h2>
      </div>

      <div className="text-center select-none w-full max-w-2xl mt-8 sm:mt-10">
        <div className="my-8 sm:my-12">
            <div className="text-6xl sm:text-8xl font-mono font-bold text-stone-100 mb-3 sm:mb-4 tabular-nums tracking-tight break-all sm:break-normal">
                {Math.floor(count).toLocaleString()}
            </div>
            <div className="text-2xl sm:text-3xl font-serif text-stone-400 px-4">
                {unit}
            </div>
        </div>
        
        <p className="text-stone-600 font-serif italic text-sm sm:text-base mt-2">Tap to change perspective</p>

        {unit === AbsurdUnit.OH_SHIT && (
             <p className="text-[10px] sm:text-xs text-stone-700 font-mono mt-4 px-4">
                 *Calculated based on a stress coefficient of 0.2 panics/day.
             </p>
        )}
         {unit === AbsurdUnit.HEARTBEATS && (
             <p className="text-[10px] sm:text-xs text-red-900/50 font-mono mt-4 animate-pulse px-4">
                 Based on 70 BPM resting rate.
             </p>
        )}
      </div>
    </div>
  );
};

export default AbsurdModule;