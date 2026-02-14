import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TimeModuleProps } from '../types';
import { ENGAGEMENT_DATE, MILLISECONDS_PER_DAY, SYNODIC_MONTH_DAYS, REFERENCE_NEW_MOON } from '../constants';
import { getModuleHeaderClass, typography } from '../designSystem';
import { useT } from '../i18n';

const TWO_PI = Math.PI * 2;

interface HandData {
  id: string;
  label: string;
  value: number; // 0 to 1
  color: string;
  lengthScale: number; // 0 to 1 relative to radius
  width: number;
  description: string;
}

const AnalogClockModule: React.FC<TimeModuleProps> = ({ targetDate, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const lastScrollTime = useRef(0);
  const t = useT();

  // Update time loop
  useEffect(() => {
    if (!isActive) return;
    const frame = requestAnimationFrame(() => setNow(new Date()));
    const interval = setInterval(() => setNow(new Date()), 1000 / 60); // 60fps target
    return () => {
        cancelAnimationFrame(frame);
        clearInterval(interval);
    };
  }, [isActive]);

  // Handle Scroll to Cycle
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!isActive) return;
        const currentTime = Date.now();
        if (currentTime - lastScrollTime.current < 100) return; // Throttle
        
        // If we are at the boundaries, we might want to let the user scroll away
        // But for "feeling" the clock, we capture a bit of scroll
        if (Math.abs(e.deltaY) > 10) {
            const direction = e.deltaY > 0 ? 1 : -1;
            setActiveIndex(prev => {
                const next = prev + direction;
                if (next < 0) return 8; // Wrap around
                if (next > 8) return 0; // Wrap around
                return next;
            });
            lastScrollTime.current = currentTime;
        }
    };

    const el = containerRef.current;
    if (el) {
        el.addEventListener('wheel', handleWheel, { passive: true });
    }
    return () => {
        if (el) el.removeEventListener('wheel', handleWheel);
    };
  }, [isActive]);

  // Calculate Hands
  const hands: HandData[] = useMemo(() => {
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = now.getHours() + m / 60;
    
    // 1. Seconds
    const secVal = s / 60;
    
    // 2. Minutes
    const minVal = m / 60;
    
    // 3. Hours (12h cycle)
    const hourVal = (h % 12) / 12;

    // 4. Sidereal Day (Approx 23h 56m 4s)
    // Sidereal time is roughly solar time + 1 day/year extra rotation
    // Simplified simulation: It moves slightly faster than 24h solar cycle
    const msInDay = (h * 3600 + m * 60 + s) * 1000; // Solar ms passed today
    // Sidereal day in ms is approx 86164090.5
    // Percent of sidereal day passed (resetting at sidereal midnight roughly)
    // We just want the rate relative to solar. 
    // Let's anchor it to 0 at midnight for visualization simplicity, but faster rate.
    const siderealDayLength = 86164.09 * 1000; 
    const siderealVal = (msInDay % siderealDayLength) / siderealDayLength;

    // 5. Day of Month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayVal = (now.getDate() - 1 + h / 24) / daysInMonth;

    // 6. Lunar Cycle
    const msSinceRefMoon = now.getTime() - REFERENCE_NEW_MOON.getTime();
    const daysSinceRefMoon = msSinceRefMoon / MILLISECONDS_PER_DAY;
    const lunarPhase = (daysSinceRefMoon % SYNODIC_MONTH_DAYS) / SYNODIC_MONTH_DAYS;

    // 7. Year (Orbit) - Progress through calendar year
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearProgress = (now.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime());

    // 8. The Wait (Oh Shit Curve)
    // Engagement to Wedding
    const totalWait = targetDate.getTime() - ENGAGEMENT_DATE.getTime();
    const elapsedWait = now.getTime() - ENGAGEMENT_DATE.getTime();
    let waitProgress = elapsedWait / totalWait;
    // Clamp or let it spin? Let's clamp at 100% (Wedding) or Loop?
    // "Oh shit" implies approaching doom/event.
    // If past wedding, maybe it stays at 100 or spins wild. Let's clamp 0-1 for cleanliness.
    if (waitProgress > 1) waitProgress = 1;
    if (waitProgress < 0) waitProgress = 0;

    // 9. Week (Social)
    // Progress through current week (Sun-Sat)
    const dayOfWeek = now.getDay(); // 0-6
    const weekVal = (dayOfWeek + h / 24) / 7;

    return [
        { id: 'sec', label: t.clock.seconds, value: secVal, color: '#a8a29e', lengthScale: 0.95, width: 1, description: t.clock.descSeconds },
        { id: 'min', label: t.clock.minutes, value: minVal, color: '#a8a29e', lengthScale: 0.85, width: 2, description: t.clock.descMinutes },
        { id: 'hr', label: t.clock.hours, value: hourVal, color: '#a8a29e', lengthScale: 0.6, width: 4, description: t.clock.descHours },
        { id: 'week', label: t.clock.week, value: weekVal, color: '#a8a29e', lengthScale: 0.5, width: 6, description: t.clock.descWeek },
        { id: 'lunar', label: t.clock.lunarPhase, value: lunarPhase, color: '#e7e5e4', lengthScale: 0.45, width: 2, description: t.clock.descLunarPhase },
        { id: 'month', label: t.clock.month, value: dayVal, color: '#a8a29e', lengthScale: 0.75, width: 1, description: t.clock.descMonth },
        { id: 'year', label: t.clock.solarYear, value: yearProgress, color: '#fbbf24', lengthScale: 0.9, width: 1.5, description: t.clock.descSolarYear },
        { id: 'sidereal', label: t.clock.siderealDay, value: siderealVal, color: '#78716c', lengthScale: 0.6, width: 1, description: t.clock.descSiderealDay },
        { id: 'wait', label: t.clock.theCountdown, value: waitProgress, color: '#f59e0b', lengthScale: 1.0, width: 3, description: t.clock.descCountdown },
    ];
  }, [now, targetDate, t]);

  const activeHand = hands[activeIndex];

  // Helper to get coordinates
  const getHandCoords = (val: number, length: number, radius: number) => {
    const angle = val * TWO_PI - Math.PI / 2; // -90deg offset to start at top
    return {
        x1: 0,
        y1: 0,
        x2: Math.cos(angle) * (radius * length),
        y2: Math.sin(angle) * (radius * length)
    };
  };

  // Helper for Arc Path
  const getArcPath = (val: number, radius: number) => {
      // Draw arc from top (0) to current value
      const startAngle = -Math.PI / 2;
      const endAngle = val * TWO_PI - Math.PI / 2;
      
      // If val is near 0 or 1, path logic can get weird, handle full circle
      if (val >= 0.999) {
        return `M 0 -${radius} A ${radius} ${radius} 0 1 1 -0.01 -${radius}`;
      }
      
      const x = Math.cos(endAngle) * radius;
      const y = Math.sin(endAngle) * radius;
      
      // SVG Arc: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
      const largeArc = val > 0.5 ? 1 : 0;
      
      return `M 0 -${radius} A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`;
  };

  const handleTap = () => {
      setActiveIndex((prev) => (prev + 1) % hands.length);
  };

  return (
    <div 
        ref={containerRef}
        onClick={handleTap}
        className="h-full w-full bg-stone-950 text-stone-200 relative overflow-hidden flex flex-col items-center justify-center select-none cursor-pointer"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(68,64,60,0.2)_0%,rgba(12,10,9,0)_70%)]" />
      </div>

      {/* Consistent Header */}
      <div className={getModuleHeaderClass()}>
        {t.clock.header}
      </div>

      <div className="relative z-10 w-full max-w-xl aspect-square p-6 sm:p-12 mt-8 sm:mt-10">
        <svg viewBox="-100 -100 200 200" className="w-full h-full drop-shadow-2xl">
            {/* Base Face */}
            <circle cx="0" cy="0" r="98" fill="none" stroke="#292524" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="2" fill="#57534e" />

            {/* Render Inactive Hands First (Ghosted) */}
            {hands.map((hand, i) => {
                if (i === activeIndex) return null; // Skip active
                const coords = getHandCoords(hand.value, hand.lengthScale, 95);
                return (
                    <g key={hand.id} className="transition-opacity duration-500 opacity-20">
                        {/* Faint Trail */}
                        <path 
                            d={getArcPath(hand.value, 95 * hand.lengthScale)} 
                            fill="none" 
                            stroke={hand.color} 
                            strokeWidth="0.5" 
                            opacity="0.3"
                        />
                        {/* Hand */}
                        <line 
                            x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} 
                            stroke={hand.color} 
                            strokeWidth="1"
                            strokeLinecap="round"
                        />
                    </g>
                );
            })}

            {/* Render Active Hand (Highlighted) */}
            <g className="transition-all duration-500 ease-out">
                {/* Trail */}
                <path 
                    d={getArcPath(activeHand.value, 95 * activeHand.lengthScale)} 
                    fill="none" 
                    stroke={activeHand.color} 
                    strokeWidth="4" 
                    opacity="0.15"
                />
                 <path 
                    d={getArcPath(activeHand.value, 95 * activeHand.lengthScale)} 
                    fill="none" 
                    stroke={activeHand.color} 
                    strokeWidth="0.5" 
                    opacity="0.5"
                    strokeDasharray="2 2"
                />

                {/* The Hand */}
                <line 
                    x1={0} y1={0} 
                    x2={Math.cos(activeHand.value * TWO_PI - Math.PI / 2) * (95 * activeHand.lengthScale)} 
                    y2={Math.sin(activeHand.value * TWO_PI - Math.PI / 2) * (95 * activeHand.lengthScale)} 
                    stroke={activeHand.color} 
                    strokeWidth={activeHand.width}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                />
                
                {/* Tip Decoration */}
                <circle 
                    cx={Math.cos(activeHand.value * TWO_PI - Math.PI / 2) * (95 * activeHand.lengthScale)} 
                    cy={Math.sin(activeHand.value * TWO_PI - Math.PI / 2) * (95 * activeHand.lengthScale)} 
                    r={activeHand.width * 1.5}
                    fill={activeHand.color}
                />
            </g>
            
            {/* Center Cap */}
            <circle cx="0" cy="0" r="3" fill="#1c1917" stroke={activeHand.color} strokeWidth="1" />
        </svg>

        {/* Floating Label with Backdrop for Better Readability */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-32 sm:mt-40 md:mt-48 px-4">
            <div className="bg-stone-950/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-stone-800/30">
                <div className="text-4xl sm:text-5xl md:text-6xl font-mono text-amber-100/90 font-light tracking-tighter drop-shadow-lg">
                    {activeHand.id === 'wait'
                        ? (activeHand.value * 100).toFixed(4) + '%'
                        : activeHand.id === 'year' || activeHand.id === 'lunar'
                            ? (activeHand.value * 100).toFixed(1) + '%'
                            : activeHand.id === 'sec' || activeHand.id === 'min'
                                 ? Math.floor(activeHand.value * 60).toString().padStart(2, '0')
                                 : (activeHand.value * (activeHand.id === 'hr' ? 12 : 1)).toFixed(2)
                    }
                </div>
                <div className="text-amber-500 font-serif italic text-xl sm:text-xl md:text-2xl mt-2">
                    {activeHand.label}
                </div>
                <div className="text-stone-500 font-mono text-[10px] sm:text-[10px] md:text-xs uppercase tracking-widest mt-2 max-w-[180px] sm:max-w-[200px] md:max-w-[240px] mx-auto leading-tight">
                    {activeHand.description}
                </div>
            </div>
        </div>
      </div>
      
      <div className={`absolute bottom-6 ${typography.hint.animated}`}>
         {t.clock.scrollHint}
      </div>
    </div>
  );
};

export default AnalogClockModule;