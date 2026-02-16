import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TimeModuleProps } from '../types';
import { ENGAGEMENT_DATE, MILLISECONDS_PER_DAY, SYNODIC_MONTH_DAYS, REFERENCE_NEW_MOON } from '../constants';
import { getModuleHeaderClass, getModuleFooterClass, typography, vibes, getVibeClass } from '../designSystem';
import { useT, useLocale } from '../i18n';

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
    const vibe = 'steampunk';

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

    // Update time loop
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
            { id: 'sec', label: t.clock.seconds, value: secVal, color: '#fbbf24', lengthScale: 0.95, width: 1, description: t.clock.descSeconds }, // Amber
            { id: 'min', label: t.clock.minutes, value: minVal, color: '#f59e0b', lengthScale: 0.85, width: 2, description: t.clock.descMinutes }, // Amber-500
            { id: 'hr', label: t.clock.hours, value: hourVal, color: '#d97706', lengthScale: 0.6, width: 4, description: t.clock.descHours }, // Amber-600
            { id: 'week', label: t.clock.week, value: weekVal, color: '#fde047', lengthScale: 0.5, width: 6, description: t.clock.descWeek }, // Yellow-300
            { id: 'lunar', label: t.clock.lunarPhase, value: lunarPhase, color: '#eab308', lengthScale: 0.45, width: 2, description: t.clock.descLunarPhase }, // Yellow-500
            { id: 'month', label: t.clock.month, value: dayVal, color: '#fbbf24', lengthScale: 0.75, width: 1, description: t.clock.descMonth },
            { id: 'year', label: t.clock.solarYear, value: yearProgress, color: '#fef3c7', lengthScale: 0.9, width: 1.5, description: t.clock.descSolarYear }, // Amber-100
            { id: 'sidereal', label: t.clock.siderealDay, value: siderealVal, color: '#a3e635', lengthScale: 0.6, width: 1, description: t.clock.descSiderealDay }, // Lime-400 for sidereal difference
            { id: 'wait', label: t.clock.theCountdown, value: waitProgress, color: '#ef4444', lengthScale: 1.0, width: 3, description: t.clock.descCountdown }, // Red highlight for the Wait
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
            className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} relative overflow-hidden pt-28 sm:pt-32 px-4 select-none cursor-pointer`}
        >
            {/* 0. Background Ambience - Increased contrast/warmth */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,rgba(12,10,9,0)_70%)]" />
            </div>

            {/* 1. Module Title & Subtitle */}
            <div className="text-center z-20 flex-shrink-0 mb-8 sm:mb-12">
                <h2 className={getVibeClass(vibe, 'header')}>{t.clock.header}</h2>
                <p className={`${typography.hint.animated} !text-amber-600/80 mt-1`}>
                    {t.clock.scrollHint}
                </p>
            </div>

            {/* 2. Clock + Label (grouped so label stays attached) */}
            <div className="flex-1 w-full z-10 min-h-0 flex flex-col items-center justify-center gap-4">
                <svg viewBox="-100 -100 200 200" className="w-[65%] sm:w-[70%] aspect-square drop-shadow-2xl max-h-[55vh]">
                    {/* Base Face */}
                    <circle cx="0" cy="0" r="98" fill="none" stroke="#78716c" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="2" fill="#a8a29e" />

                    {/* Ghosted Hands */}
                    {hands.map((hand, i) => {
                        if (i === activeIndex) return null;
                        const coords = getHandCoords(hand.value, hand.lengthScale, 95);
                        return (
                            <g key={hand.id} className="transition-opacity duration-500 opacity-40">
                                <path d={getArcPath(hand.value, 95 * hand.lengthScale)} fill="none" stroke={hand.color} strokeWidth="0.8" opacity="0.6" />
                                <line x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke={hand.color} strokeWidth="1.5" strokeLinecap="round" />
                            </g>
                        );
                    })}

                    {/* Active Hand */}
                    <g className="transition-all duration-500 ease-out">
                        <path d={getArcPath(activeHand.value, 95 * activeHand.lengthScale)} fill="none" stroke={activeHand.color} strokeWidth="6" opacity="0.15" />
                        <path d={getArcPath(activeHand.value, 95 * activeHand.lengthScale)} fill="none" stroke={activeHand.color} strokeWidth="0.8" opacity="0.8" strokeDasharray="2 2" />
                        <line x1={0} y1={0} x2={Math.cos(activeHand.value * TWO_PI - Math.PI / 2) * (95 * activeHand.lengthScale)} y2={Math.sin(activeHand.value * TWO_PI - Math.PI / 2) * (95 * activeHand.lengthScale)} stroke={activeHand.color} strokeWidth={activeHand.width} strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                        <circle cx={Math.cos(activeHand.value * TWO_PI - Math.PI / 2) * (95 * activeHand.lengthScale)} cy={Math.sin(activeHand.value * TWO_PI - Math.PI / 2) * (95 * activeHand.lengthScale)} r={activeHand.width * 1.5} fill={activeHand.color} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                    </g>
                    <circle cx="0" cy="0" r="3" fill="#1c1917" stroke={activeHand.color} strokeWidth="1" />
                </svg>

                {/* Info Label — sibling to SVG, stays attached */}
                <div className="text-center px-4 pointer-events-none pb-16 sm:pb-20">
                <div className="bg-stone-950/60 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-stone-800/30 inline-block">
                    <div className="text-2xl sm:text-4xl md:text-5xl font-mono text-amber-100/90 font-light tracking-tighter drop-shadow-lg leading-tight">
                        {activeHand.id === 'wait'
                            ? (activeHand.value * 100).toFixed(4) + '%'
                            : activeHand.id === 'year' || activeHand.id === 'lunar'
                                ? (activeHand.value * 100).toFixed(1) + '%'
                                : activeHand.id === 'sec' || activeHand.id === 'min'
                                    ? Math.floor(activeHand.value * 60).toString().padStart(2, '0')
                                    : (activeHand.value * (activeHand.id === 'hr' ? 12 : 1)).toFixed(2)
                        }
                    </div>
                    <div className="text-amber-500 font-serif italic text-sm sm:text-lg mt-0.5 sm:mt-1">
                        {activeHand.label}
                    </div>
                    <div className="text-stone-400 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 opacity-80">
                        {activeHand.description}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default AnalogClockModule;