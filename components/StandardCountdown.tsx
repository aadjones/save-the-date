import React, { useState, useEffect } from 'react';
import { TimeModuleProps, CountdownTime } from '../types';

const StandardCountdown: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      <span className="text-3xl sm:text-6xl md:text-8xl font-mono font-light tracking-tighter tabular-nums text-stone-100">
        {val.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-sm uppercase tracking-widest text-stone-500 font-semibold mt-1 sm:mt-2">{label}</span>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-stone-950 text-stone-200 p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-stone-700 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-stone-800 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Consistent Header */}
      <div className="absolute top-32 sm:top-12 left-0 right-0 z-10 text-center pointer-events-none px-4">
        <h2 className="text-xl sm:text-3xl italic font-serif text-stone-400">
          The Standard Interval
        </h2>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 z-10 w-full max-w-4xl mt-10 sm:mt-0">
        <Item val={timeLeft.years} label="Years" />
        <Item val={timeLeft.months} label="Months" />
        <Item val={timeLeft.days} label="Days" />
        <Item val={timeLeft.hours} label="Hours" />
        <Item val={timeLeft.minutes} label="Minutes" />
        <Item val={timeLeft.seconds} label="Seconds" />
      </div>
      
      <p className="absolute bottom-8 sm:bottom-12 left-0 right-0 text-center text-stone-600 font-mono text-[10px] sm:text-xs px-4 z-10">
        Local time. Gregorian calendar. The rhythm of bureaucracy.
      </p>
    </div>
  );
};

export default StandardCountdown;