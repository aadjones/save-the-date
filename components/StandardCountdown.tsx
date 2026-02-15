import React, { useState, useEffect } from 'react';
import { TimeModuleProps, CountdownTime } from '../types';
import { getModuleHeaderClass, getModuleFooterClass, typography, spacing, colors, vibes, getVibeClass } from '../designSystem';
import { useT } from '../i18n';

const StandardCountdown: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const t = useT();
  const vibe = 'wedding';

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let timeLeft: CountdownTime = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        const now = new Date();
        const target = new Date(targetDate);

        let years = target.getFullYear() - now.getFullYear();
        let months = target.getMonth() - now.getMonth();
        let days = target.getDate() - now.getDate();
        let hours = target.getHours() - now.getHours();
        let minutes = target.getMinutes() - now.getMinutes();
        let seconds = target.getSeconds() - now.getSeconds();

        if (seconds < 0) {
          seconds += 60;
          minutes--;
        }
        if (minutes < 0) {
          minutes += 60;
          hours--;
        }
        if (hours < 0) {
          hours += 24;
          days--;
        }
        if (days < 0) {
          const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
          days += prevMonth.getDate();
          months--;
        }
        if (months < 0) {
          months += 12;
          years--;
        }

        timeLeft = { years, months, days, hours, minutes, seconds };
      }
      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const Item = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center justify-center p-0.5 sm:p-2">
      <span className={`${getVibeClass(vibe, 'number')} text-2xl sm:text-4xl md:text-5xl lg:text-7xl tabular-nums leading-tight`}>
        {val.toString().padStart(2, '0')}
      </span>
      <span className={`${getVibeClass(vibe, 'label')} mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] md:text-xs`}>{label}</span>
    </div>
  );

  return (
    <div className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} relative overflow-hidden pt-28 sm:pt-32 px-4`}>
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-teal-400 rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-stone-500 rounded-full blur-[200px]"></div>
      </div>

      <h2 className={`${getVibeClass(vibe, 'header')} text-xl sm:text-2xl md:text-3xl text-center z-10 font-bold flex-shrink-0 mb-1 sm:mb-2`}>
        {t.standard.header}
      </h2>

      {/* 2. Main Visualization Area (Potato) - THE ABSOLUTE PRIORITY */}
      <div className="flex-[3] w-full flex items-center justify-center min-h-[160px] py-1 z-10 overflow-hidden">
        <div className="relative w-full h-full max-h-[220px] sm:max-h-[300px] md:max-h-[380px] flex items-center justify-center">
          <img
            src="/potatoes-transparent.png"
            alt="Aaron & Anakaren"
            className="h-full w-auto object-contain translate-y-2"
          />
        </div>
      </div>

      {/* 3. Stats Area - Scales down to accommodate potatoes */}
      <div className="w-full max-w-4xl z-10 flex flex-col justify-center mb-6 px-2 sm:px-6 flex-shrink-0">
        <div className="grid grid-cols-3 gap-x-1 gap-y-1 sm:gap-x-4 sm:gap-y-4 md:gap-x-8 md:gap-y-6">
          <Item val={timeLeft.years} label={t.standard.years} />
          <Item val={timeLeft.months} label={t.standard.months} />
          <Item val={timeLeft.days} label={t.standard.days} />
          <Item val={timeLeft.hours} label={t.standard.hours} />
          <Item val={timeLeft.minutes} label={t.standard.minutes} />
          <Item val={timeLeft.seconds} label={t.standard.seconds} />
        </div>
      </div>

      <p className={`${getVibeClass(vibe, 'footer')} text-[10px] sm:text-xs text-center uppercase tracking-widest pb-14 sm:pb-32 px-4`}>
        {t.standard.footer}
      </p>

    </div>
  );
};

export default StandardCountdown;