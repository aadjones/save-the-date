import React, { useState, useEffect } from 'react';
import { TimeModuleProps, SocialUnit } from '../types';
import { MILLISECONDS_PER_DAY } from '../constants';
import { Coffee, Calendar, Flag } from 'lucide-react';
import { getModuleHeaderClass, getModuleFooterClass, getButtonClass, typography, colors } from '../designSystem';

const SocialTimeModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [selectedUnit, setSelectedUnit] = useState<SocialUnit>(SocialUnit.WEEKENDS);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Helper to generate US Federal Holidays for a given year
    const getFederalHolidays = (year: number) => {
        const holidays: Date[] = [];
        
        // Fixed Date Holidays
        holidays.push(new Date(year, 0, 1)); // New Year's Day
        holidays.push(new Date(year, 5, 19)); // Juneteenth
        holidays.push(new Date(year, 6, 4)); // Independence Day
        holidays.push(new Date(year, 10, 11)); // Veterans Day
        holidays.push(new Date(year, 11, 25)); // Christmas Day

        // Floating Date Holidays
        const addFloating = (month: number, dayOfWeek: number, n: number) => { 
            // n=0 implies last occurrence
            const date = new Date(year, month, 1);
            // Find first occurrence of dayOfWeek in the month
            while (date.getDay() !== dayOfWeek) date.setDate(date.getDate() + 1);
            
            if (n === 0) {
                // Find last: Start at next month 0th day and go back
                const last = new Date(year, month + 1, 0);
                while (last.getDay() !== dayOfWeek) last.setDate(last.getDate() - 1);
                holidays.push(last);
            } else {
                // Add n-1 weeks to the first occurrence
                date.setDate(date.getDate() + (n - 1) * 7);
                holidays.push(date);
            }
        };

        addFloating(0, 1, 3); // MLK Day - Jan, 3rd Mon
        addFloating(1, 1, 3); // Presidents Day - Feb, 3rd Mon
        addFloating(4, 1, 0); // Memorial Day - May, Last Mon
        addFloating(8, 1, 1); // Labor Day - Sep, 1st Mon
        addFloating(9, 1, 2); // Columbus/Indigenous Peoples' Day - Oct, 2nd Mon
        addFloating(10, 4, 4); // Thanksgiving - Nov, 4th Thu

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
          // Rough approximation: weeks remaining
          setCount(Math.floor(diffDays / 7)); 
          break;
        case SocialUnit.MEALS:
          setCount(Math.floor(diffDays * 3));
          break;
        case SocialUnit.HOLIDAYS:
          let holidayCount = 0;
          const startYear = now.getFullYear();
          const endYear = targetDate.getFullYear();
          
          for (let y = startYear; y <= endYear; y++) {
             const holidays = getFederalHolidays(y);
             for (const h of holidays) {
                 // Check if holiday is strictly within the remaining window
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
    // Re-calculate less frequently for holidays, but keeping 1s for consistency across units
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, selectedUnit]);

  const buttons = [
    { id: SocialUnit.WEEKENDS, icon: Calendar, label: 'Weekends' },
    { id: SocialUnit.MEALS, icon: Coffee, label: 'Meals' },
    { id: SocialUnit.HOLIDAYS, icon: Flag, label: 'Holidays' },
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-stone-950 text-stone-200 p-6 relative">

      {/* Consistent Header */}
      <div className={getModuleHeaderClass()}>
        Social Constructs
      </div>

      <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-12 flex-col min-[400px]:flex-row justify-center mt-10 sm:mt-0">
        {buttons.map((btn) => {
            const Icon = btn.icon;
            const active = selectedUnit === btn.id;
            return (
                <button
                    key={btn.id}
                    onClick={() => setSelectedUnit(btn.id)}
                    className={`${getButtonClass(active)} flex items-center gap-2 px-4 py-2`}
                >
                    <Icon size={16} className="sm:w-4 sm:h-4" />
                    <span className={`${typography.label.small} font-bold`}>{btn.label}</span>
                </button>
            )
        })}
      </div>

      <div className="text-center animate-in fade-in duration-500">
        <span className="text-7xl sm:text-9xl font-mono font-light tracking-tighter text-stone-100 block mb-2 sm:mb-4">
            {Math.floor(count).toLocaleString()}
        </span>
        <span className="text-lg sm:text-xl font-serif italic text-stone-500">
            {selectedUnit.toLowerCase()} remaining
        </span>
      </div>
      
      <p className={getModuleFooterClass()}>
          *Estimates based on standard calendar weeks, 3 meals/day, and U.S. Federal Holidays.
      </p>
    </div>
  );
};

export default SocialTimeModule;