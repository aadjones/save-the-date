import React, { useState, useEffect } from 'react';
import { TimeModuleProps, SocialUnit } from '../types';
import { MILLISECONDS_PER_DAY } from '../constants';
import { Coffee, Calendar, Flag } from 'lucide-react';
import { getModuleHeaderClass, getModuleFooterClass, getButtonClass, typography, colors, vibes, getVibeClass } from '../designSystem';
import Tooltip from './Tooltip';
import { useT, useLocale } from '../i18n';

const SocialTimeModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [selectedUnit, setSelectedUnit] = useState<SocialUnit>(SocialUnit.WEEKENDS);
  const [count, setCount] = useState<number>(0);
  const t = useT();
  const [locale] = useLocale();
  const vibe = 'corporate';

  useEffect(() => {
    // US Federal Holidays
    const getFederalHolidays = (year: number) => {
      const holidays: Date[] = [];

      holidays.push(new Date(year, 0, 1)); // New Year's Day
      holidays.push(new Date(year, 5, 19)); // Juneteenth
      holidays.push(new Date(year, 6, 4)); // Independence Day
      holidays.push(new Date(year, 10, 11)); // Veterans Day
      holidays.push(new Date(year, 11, 25)); // Christmas Day

      const addFloating = (month: number, dayOfWeek: number, n: number) => {
        const date = new Date(year, month, 1);
        while (date.getDay() !== dayOfWeek) date.setDate(date.getDate() + 1);

        if (n === 0) {
          const last = new Date(year, month + 1, 0);
          while (last.getDay() !== dayOfWeek) last.setDate(last.getDate() - 1);
          holidays.push(last);
        } else {
          date.setDate(date.getDate() + (n - 1) * 7);
          holidays.push(date);
        }
      };

      addFloating(0, 1, 3); // MLK Day
      addFloating(1, 1, 3); // Presidents Day
      addFloating(4, 1, 0); // Memorial Day
      addFloating(8, 1, 1); // Labor Day
      addFloating(9, 1, 2); // Columbus Day
      addFloating(10, 4, 4); // Thanksgiving

      return holidays;
    };

    // Mexican Holidays (Días Festivos Oficiales)
    const getMexicanHolidays = (year: number) => {
      const holidays: Date[] = [];

      // Fixed
      holidays.push(new Date(year, 0, 1));  // Año Nuevo
      holidays.push(new Date(year, 4, 1));  // Día del Trabajo
      holidays.push(new Date(year, 8, 16)); // Día de la Independencia
      holidays.push(new Date(year, 10, 20)); // Revolución Mexicana (observed)
      holidays.push(new Date(year, 11, 25)); // Navidad

      const addFloating = (month: number, dayOfWeek: number, n: number) => {
        const date = new Date(year, month, 1);
        while (date.getDay() !== dayOfWeek) date.setDate(date.getDate() + 1);
        date.setDate(date.getDate() + (n - 1) * 7);
        holidays.push(date);
      };

      addFloating(1, 1, 1); // Día de la Constitución - Feb, 1st Mon
      addFloating(2, 1, 3); // Natalicio de Benito Juárez - Mar, 3rd Mon

      return holidays;
    };

    const calculate = () => {
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();
      const diffDays = diffMs / MILLISECONDS_PER_DAY;

      if (diffDays <= 0) {
        setCount(0);
        return;
      }

      switch (selectedUnit) {
        case SocialUnit.WEEKENDS:
          setCount(Math.floor(diffDays / 7));
          break;
        case SocialUnit.MEALS:
          setCount(Math.floor(diffDays * 3));
          break;
        case SocialUnit.HOLIDAYS:
          let holidayCount = 0;
          const startYear = now.getFullYear();
          const endYear = targetDate.getFullYear();
          const getHolidays = locale === 'es' ? getMexicanHolidays : getFederalHolidays;

          for (let y = startYear; y <= endYear; y++) {
            const holidays = getHolidays(y);
            for (const h of holidays) {
              if (h.getTime() > now.getTime() && h.getTime() < targetDate.getTime()) {
                holidayCount++;
              }
            }
          }
          setCount(holidayCount);
          break;
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, selectedUnit, locale]);

  // Map SocialUnit enum to translated label for the "X remaining" display
  const unitDisplayLabel: Record<SocialUnit, string> = {
    [SocialUnit.WEEKENDS]: t.social.weekends.toLowerCase(),
    [SocialUnit.MEALS]: t.social.meals.toLowerCase(),
    [SocialUnit.HOLIDAYS]: t.social.holidays.toLowerCase(),
  };

  const buttons = [
    {
      id: SocialUnit.WEEKENDS,
      icon: Calendar,
      label: t.social.weekends,
      tooltip: t.social.weekendsTooltip,
    },
    {
      id: SocialUnit.MEALS,
      icon: Coffee,
      label: t.social.meals,
      tooltip: t.social.mealsTooltip,
    },
    {
      id: SocialUnit.HOLIDAYS,
      icon: Flag,
      label: t.social.holidays,
      tooltip: t.social.holidaysTooltip,
    },
  ];

  return (
    <div className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} relative overflow-hidden pt-28 sm:pt-32 px-4`}>
      <h2 className={`${getVibeClass(vibe, 'header')} text-center mb-6 z-10`}>
        {t.social.header}
      </h2>

      <div className="flex gap-2 sm:gap-4 mb-8 sm:mb-12 flex-col min-[400px]:flex-row justify-center z-10">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          const active = selectedUnit === btn.id;
          return (
            <Tooltip key={btn.id} content={btn.tooltip}>
              <button
                onClick={() => setSelectedUnit(btn.id)}
                className={`${getButtonClass(active)} flex items-center gap-2 px-4 py-2 pointer-events-auto`}
              >
                <Icon size={16} className="sm:w-4 sm:h-4" />
                <span className={`${getVibeClass(vibe, 'label')} ${active ? '!text-white' : ''} !text-[10px] sm:!text-xs font-bold`}>{btn.label}</span>
              </button>
            </Tooltip>
          )
        })}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 w-full min-h-0 z-10">
        <span className={`${getVibeClass(vibe, 'number')} text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] block mb-2 sm:mb-4 tracking-tighter`}>
          {Math.floor(count).toLocaleString()}
        </span>
        <span className={`${getVibeClass(vibe, 'header')} text-lg sm:text-xl md:text-2xl lowercase opacity-40 italic`}>
          {unitDisplayLabel[selectedUnit]} {t.social.remaining}
        </span>
      </div>

      <p className={`${getVibeClass(vibe, 'footer')} text-[10px] sm:text-xs text-center uppercase tracking-widest pb-14 sm:pb-32 px-4 z-10`}>
        {t.social.footer}
      </p>
    </div>
  );
};

export default SocialTimeModule;
