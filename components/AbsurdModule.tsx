import React, { useState, useEffect } from 'react';
import { TimeModuleProps, AbsurdUnit } from '../types';
import { ABSURD_CONVERSIONS, MILLISECONDS_PER_DAY } from '../constants';
import { getModuleHeaderClass, getModuleFooterClass, typography, colors, vibes, getVibeClass } from '../designSystem';
import { useT } from '../i18n';

const AbsurdModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [unit, setUnit] = useState<AbsurdUnit>(AbsurdUnit.OH_SHIT);
  const [count, setCount] = useState<number>(0);
  const t = useT();
  const vibe = 'humorous';

  const unitLabels: Record<AbsurdUnit, string> = {
    [AbsurdUnit.NETFLIX]: t.absurd.netflix,
    [AbsurdUnit.CAT_NAPS]: t.absurd.catNaps,
    [AbsurdUnit.OH_SHIT]: t.absurd.existentialPanics,
    [AbsurdUnit.HEARTBEATS]: t.absurd.heartbeats,
  };

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
      className={`h-full w-full flex flex-col items-center justify-between ${vibes[vibe].container} transition-colors duration-700 cursor-pointer pt-28 sm:pt-32 px-4 select-none`}
    >
      {/* 1. Header */}
      <h2 className={`${getVibeClass(vibe, 'header')} text-xl sm:text-2xl md:text-3xl text-center mb-8 z-10`}>
        {t.absurd.header}
      </h2>

      {/* 2. Main Metric Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full min-h-0 z-10">
        <div key={unit} className="animate-in zoom-in-95 fade-in duration-300">
          <div className={`${getVibeClass(vibe, 'number')} text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 sm:mb-6 break-all sm:break-normal`}>
            {Math.floor(count).toLocaleString()}
          </div>
          <div className={`${getVibeClass(vibe, 'header')} text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter`}>
            {unitLabels[unit]}
          </div>
        </div>
      </div>

      {/* 3. Footer / Hint Area */}
      <div className="flex flex-col items-center gap-4 pb-14 sm:pb-32 px-4 z-10">
        <div className={`${getVibeClass(vibe, 'label')} text-[10px] sm:text-xs animate-bounce`}>
          {t.absurd.tapHint}
        </div>
        {unit === AbsurdUnit.OH_SHIT && (
          <p className={`${getVibeClass(vibe, 'footer')} text-[9px] sm:text-[10px] opacity-60`}>
            {t.absurd.stressNote}
          </p>
        )}
        {unit === AbsurdUnit.HEARTBEATS && (
          <p className={`${getVibeClass(vibe, 'footer')} text-[9px] sm:text-[10px] opacity-60`}>
            {t.absurd.bpmNote}
          </p>
        )}
      </div>
    </div>
  );
};

export default AbsurdModule;