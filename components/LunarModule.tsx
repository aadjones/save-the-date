import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { SYNODIC_MONTH_DAYS, REFERENCE_NEW_MOON, MILLISECONDS_PER_DAY } from '../constants';
import { TimeModuleProps } from '../types';
import { vibes, getVibeClass } from '../designSystem';
import { useT, useLocale } from '../i18n';

interface MoonPhaseData {
  date: Date;
  phase: number; // 0..1
  type: 'NEW' | 'FIRST_QUARTER' | 'FULL' | 'LAST_QUARTER' | 'INTERMEDIATE';
  label: string;
  isWedding?: boolean;
  isCurrent?: boolean;
}

const MoonIcon: React.FC<{ phase: number; size: number; className?: string; highlight?: boolean }> = ({ phase, size, className, highlight }) => {
  const radius = size / 2;
  const p = phase % 1;

  // Determine lit path
  let pathD = "";

  if (Math.abs(p - 0.5) < 0.01) {
    // Full Moon
    pathD = `M 0,${-radius} A ${radius},${radius} 0 1,1 0,${radius} A ${radius},${radius} 0 1,1 0,${-radius}`;
  } else if (Math.abs(p) < 0.01 || Math.abs(p - 1) < 0.01) {
    // New Moon
    pathD = ""; // No light
  } else {
    const isWaxing = p < 0.5;
    const terminatorX = -Math.cos(p * 2 * Math.PI) * radius;

    if (isWaxing) {
      pathD = `
         M 0,${-radius} 
         A ${radius},${radius} 0 0,1 0,${radius} 
         A ${Math.abs(terminatorX)},${radius} 0 0,${p < 0.25 ? 0 : 1} 0,${-radius}
       `;
    } else {
      pathD = `
         M 0,${radius} 
         A ${radius},${radius} 0 0,1 0,${-radius} 
         A ${Math.abs(terminatorX)},${radius} 0 0,${p < 0.75 ? 1 : 0} 0,${radius}
       `;
    }
  }

  return (
    <svg width={size} height={size} viewBox={`-${size / 2} -${size / 2} ${size} ${size}`} className={className}>
      <defs>
        <clipPath id={`moon-clip-${phase}`}>
          <circle cx="0" cy="0" r={radius} />
        </clipPath>
      </defs>
      {/* Dark Side / Base */}
      <circle cx="0" cy="0" r={radius} className="fill-[#120b1e] stroke-indigo-900/30" strokeWidth="1" />
      {/* Lit Side with Glow */}
      <path
        d={pathD}
        className={highlight ? "fill-white drop-shadow-[0_0_8px_rgba(224,231,255,0.8)]" : "fill-indigo-200/70"}
        clipPath={`url(#moon-clip-${phase})`}
      />
    </svg>
  );
};

const LunarModule: React.FC<TimeModuleProps> = ({ targetDate, isActive, onScrolledToBottom }) => {
  const [phases, setPhases] = useState<MoonPhaseData[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const t = useT();
  const [locale] = useLocale();
  const vibe = 'mystical';

  // Generate Phases
  useEffect(() => {
    const data: MoonPhaseData[] = [];
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startMs = startOfToday.getTime();
    const endMs = targetDate.getTime();

    let currentMs = startMs;
    const diffFromRef = startMs - REFERENCE_NEW_MOON.getTime();
    const cyclesSinceRef = Math.floor(diffFromRef / (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY));
    const firstNewMoonMs = REFERENCE_NEW_MOON.getTime() + (cyclesSinceRef * SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY);
    currentMs = firstNewMoonMs;

    const addPhase = (time: number, type: MoonPhaseData['type'], phaseVal: number, lbl: string) => {
      if (time >= startMs && time <= endMs) {
        data.push({
          date: new Date(time),
          phase: phaseVal,
          type,
          label: lbl
        });
      }
    };

    while (currentMs <= endMs) {
      addPhase(currentMs, 'NEW', 0, t.lunar.newMoon);
      addPhase(currentMs + (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY * 0.25), 'FIRST_QUARTER', 0.25, t.lunar.firstQuarter);
      addPhase(currentMs + (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY * 0.5), 'FULL', 0.5, t.lunar.fullMoon);
      addPhase(currentMs + (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY * 0.75), 'LAST_QUARTER', 0.75, t.lunar.lastQuarter);
      currentMs += (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY);
    }

    const nowPhaseVal = ((now.getTime() - REFERENCE_NEW_MOON.getTime()) / (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY)) % 1;
    const getPhaseLabel = (p: number) => {
      if (p < 0.25) return t.lunar.waxingCrescent;
      if (p < 0.5) return t.lunar.waxingGibbous;
      if (p < 0.75) return t.lunar.waningGibbous;
      return t.lunar.waningCrescent;
    };

    data.push({
      date: now,
      phase: nowPhaseVal,
      type: 'INTERMEDIATE',
      label: getPhaseLabel(nowPhaseVal),
      isCurrent: true
    });

    const targetPhaseVal = ((targetDate.getTime() - REFERENCE_NEW_MOON.getTime()) / (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY)) % 1;
    data.push({
      date: targetDate,
      phase: targetPhaseVal,
      type: 'INTERMEDIATE',
      label: t.lunar.theWedding,
      isWedding: true
    });

    data.sort((a, b) => a.date.getTime() - b.date.getTime());

    const filteredData: MoonPhaseData[] = [];
    for (let i = 0; i < data.length; i++) {
      const current = data[i];
      if (i < data.length - 1) {
        const next = data[i + 1];
        if (!current.isCurrent && !current.isWedding && next.isCurrent) {
          const diffHours = (next.date.getTime() - current.date.getTime()) / (1000 * 60 * 60);
          if (diffHours < 24) continue;
        }
      }
      filteredData.push(current);
    }

    const finalData: MoonPhaseData[] = [];
    for (let i = 0; i < filteredData.length; i++) {
      const current = filteredData[i];
      if (i > 0) {
        const prev = filteredData[i - 1];
        if (prev.isCurrent && !current.isWedding && !current.isCurrent) {
          const diffHours = (current.date.getTime() - prev.date.getTime()) / (1000 * 60 * 60);
          if (diffHours < 24) continue;
        }
      }
      finalData.push(current);
    }

    setPhases(finalData);
  }, [targetDate, t]);

  // Handle Scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 2;
      const atTop = el.scrollTop < 2;
      if ((atBottom && e.deltaY > 0) || (atTop && e.deltaY < 0)) {
        el.style.overflowY = 'hidden';
        requestAnimationFrame(() => { el.style.overflowY = 'auto'; });
      }
    };

    const handleScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 2;
      onScrolledToBottom?.(atBottom);
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleScroll);
    };
  }, [onScrolledToBottom]);

  useLayoutEffect(() => {
    if (isActive && phases.length > 0 && scrollContainerRef.current) {
      const currentIndex = phases.findIndex(p => p.isCurrent);
      if (currentIndex !== -1) {
        const el = itemRefs.current.get(`item-${currentIndex}`);
        el?.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
  }, [phases, isActive]);

  return (
    <div className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} relative overflow-hidden pt-28 sm:pt-32 px-4`}>
      {/* Background mystical glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-900 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-900/40 rounded-full blur-[160px]"></div>
      </div>

      {/* 1. Module Title */}
      <div className="text-center z-20 flex-shrink-0 mb-4">
        <h2 className={`${getVibeClass(vibe, 'header')} text-xl sm:text-2xl md:text-3xl`}>{t.lunar.header}</h2>
        <p className={`${getVibeClass(vibe, 'footer')} text-[9px] sm:text-xs uppercase tracking-[0.2em] mt-2 opacity-90 animate-pulse`}>
          {t.lunar.scrollHint}
        </p>
      </div>

      {/* 2. Scrollable Timeline */}
      <div
        ref={scrollContainerRef}
        className="flex-1 w-full overflow-y-auto no-scrollbar relative px-2 sm:px-6 scroll-smooth"
      >
        {/* Vertical Guide Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-500/10 -translate-x-1/2 z-0" />

        <div className="flex flex-col items-center gap-4 sm:gap-16 py-6 sm:py-10">
          {phases.map((p, i) => {
            const isHighlight = p.isCurrent || p.isWedding;
            return (
              <div
                key={`${p.date.toISOString()}-${i}`}
                ref={(el) => { if (el) itemRefs.current.set(`item-${i}`, el); }}
                className={`flex items-center w-full max-w-lg z-10 relative transition-all duration-500 ${isHighlight ? 'opacity-100 scale-105 sm:scale-125' : 'opacity-55 scale-100'}`}
              >
                {/* Left: Date */}
                <div className={`flex-1 text-right pr-3 sm:pr-10 ${p.isCurrent ? 'text-indigo-100' : 'text-indigo-400'}`}>
                  <div className={`${getVibeClass(vibe, 'label')} !text-[10px] sm:!text-xs leading-none`}>
                    {p.date.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-indigo-300/70 uppercase mt-1">
                    {p.date.getFullYear()}
                  </div>
                </div>

                {/* Center: Icon */}
                <div className="relative flex-shrink-0">
                  <MoonIcon
                    phase={p.phase}
                    size={isHighlight ? 48 : 36}
                    highlight={isHighlight}
                    className="drop-shadow-2xl"
                  />
                </div>

                {/* Right: Label */}
                <div className={`flex-1 text-left pl-3 sm:pl-10`}>
                  {p.isCurrent && (
                    <div className="mb-1 sm:mb-2">
                      <span className="text-[8px] sm:text-[9px] text-indigo-100 font-mono tracking-widest bg-indigo-900/50 px-2 py-0.5 rounded-full border border-indigo-500/30">
                        {t.lunar.youAreHere}
                      </span>
                    </div>
                  )}
                  <div className={`${getVibeClass(vibe, 'header')} lowercase !tracking-[0.1em] ${isHighlight ? 'text-lg sm:text-xl text-white' : 'text-sm sm:text-base text-indigo-200/80'}`}>
                    {p.label}
                  </div>
                  {p.isWedding && (
                    <div className={`${getVibeClass(vibe, 'label')} !text-[8px] sm:!text-[9px] !text-amber-500/60 lowercase mt-1`}>
                      {t.lunar.theBigDay}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="py-8" />
        </div>
      </div>
    </div>
  );
};

export default LunarModule;