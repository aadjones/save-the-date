import React, { useState, useEffect } from 'react';
import { TimeModuleProps, CountdownTime } from '../types';
import { getModuleHeaderClass, getModuleFooterClass, typography, spacing, colors } from '../designSystem';
import { useT } from '../i18n';

const StandardCountdown: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const t = useT();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let timeLeft: CountdownTime = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        // Simple approximation for UI purposes, or use precise date libraries.
        // Doing a precise diff without library for "Standard" feel.
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
          // Days in previous month
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
    <div className="flex flex-col items-center justify-center p-1 sm:p-4">
      <span className={typography.number.medium}>
        {val.toString().padStart(2, '0')}
      </span>
      <span className={`${typography.label.uppercase} mt-1.5 sm:mt-2`}>{label}</span>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col items-center bg-stone-950 text-stone-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-stone-700 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-stone-800 rounded-full blur-[120px]"></div>
      </div>

      {/* Consistent Header */}
      <div className={getModuleHeaderClass()}>
        {t.standard.header}
      </div>

      {/* Image fills all space between header and countdown, centered within it */}
      <div className="flex-1 flex items-center justify-center w-full pt-32 sm:pt-20">
        <img
          src="/potatoes-transparent.png"
          alt="Aaron & Anakaren"
          className="z-10 max-h-[225px] sm:max-h-[285px] w-auto object-contain drop-shadow-2xl"
        />
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-8 sm:gap-x-4 sm:gap-y-8 md:gap-x-8 md:gap-y-10 z-10 w-full max-w-4xl px-6 pb-44 sm:pb-28">
        <Item val={timeLeft.years} label={t.standard.years} />
        <Item val={timeLeft.months} label={t.standard.months} />
        <Item val={timeLeft.days} label={t.standard.days} />
        <Item val={timeLeft.hours} label={t.standard.hours} />
        <Item val={timeLeft.minutes} label={t.standard.minutes} />
        <Item val={timeLeft.seconds} label={t.standard.seconds} />
      </div>

      <p className={getModuleFooterClass()}>
        {t.standard.footer}
      </p>

    </div>
  );
};

export default StandardCountdown;