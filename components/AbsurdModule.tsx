import React, { useState, useEffect } from 'react';
import { TimeModuleProps, AbsurdUnit } from '../types';
import { ABSURD_CONVERSIONS, MILLISECONDS_PER_DAY } from '../constants';
import { getModuleHeaderClass, typography, colors } from '../designSystem';
import { useT } from '../i18n';

const AbsurdModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [unit, setUnit] = useState<AbsurdUnit>(AbsurdUnit.OH_SHIT);
  const [count, setCount] = useState<number>(0);
  const t = useT();

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
        className="h-full w-full flex flex-col items-center justify-center bg-stone-950 text-stone-200 p-6 sm:p-8 pt-16 sm:pt-20 cursor-pointer hover:bg-[#0f0d0c] transition-colors relative"
    >
      {/* Consistent Header */}
      <div className={getModuleHeaderClass()}>
        {t.absurd.header}
      </div>

      <div className="text-center select-none w-full max-w-2xl mt-4 sm:mt-10">
        <div className="my-4 sm:my-12">
            <div className={`${typography.number.large} mb-3 sm:mb-4 break-all sm:break-normal`}>
                {Math.floor(count).toLocaleString()}
            </div>
            <div className={`text-xl sm:text-3xl md:text-4xl font-serif ${colors.text.tertiary} px-4`}>
                {unitLabels[unit]}
            </div>
        </div>

        <p className={typography.hint.standard}>{t.absurd.tapHint}</p>

        {unit === AbsurdUnit.OH_SHIT && (
             <p className={`${typography.caption.standard} ${colors.text.subtle} mt-4 px-4`}>
                 {t.absurd.stressNote}
             </p>
        )}
         {unit === AbsurdUnit.HEARTBEATS && (
             <p className={`${typography.caption.standard} mt-4 px-4 opacity-70`}>
                 {t.absurd.bpmNote}
             </p>
        )}
      </div>
    </div>
  );
};

export default AbsurdModule;