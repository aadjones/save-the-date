import React, { useState, useEffect } from 'react';
import { TimeModuleProps, AbsurdUnit } from '../types';
import { ABSURD_CONVERSIONS, MILLISECONDS_PER_DAY } from '../constants';
import { getModuleHeaderClass, typography, colors } from '../designSystem';

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
      <div className={getModuleHeaderClass()}>
        The Absurd Scale
      </div>

      <div className="text-center select-none w-full max-w-2xl mt-8 sm:mt-10">
        <div className="my-8 sm:my-12">
            <div className={`${typography.number.large} mb-3 sm:mb-4 break-all sm:break-normal`}>
                {Math.floor(count).toLocaleString()}
            </div>
            <div className={`text-2xl sm:text-3xl md:text-4xl font-serif ${colors.text.tertiary} px-4`}>
                {unit}
            </div>
        </div>

        <p className={typography.hint.standard}>Tap to change perspective</p>

        {unit === AbsurdUnit.OH_SHIT && (
             <p className={`${typography.caption.standard} ${colors.text.subtle} mt-4 px-4`}>
                 *Calculated based on a stress coefficient of 0.2 panics/day.
             </p>
        )}
         {unit === AbsurdUnit.HEARTBEATS && (
             <p className={`${typography.caption.standard} mt-4 px-4 opacity-70`}>
                 Based on 70 BPM resting rate.
             </p>
        )}
      </div>
    </div>
  );
};

export default AbsurdModule;