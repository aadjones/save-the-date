import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { SYNODIC_MONTH_DAYS, REFERENCE_NEW_MOON, MILLISECONDS_PER_DAY } from '../constants';
import { TimeModuleProps } from '../types';

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
  
  // Create path for the lit portion
  // Based on simplified projection: Terminator is an elliptical arc
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
    // Calculate terminator curve
    // The terminator is a semi-ellipse with vertical axis R and horizontal axis R * cos(angle)
    
    const isWaxing = p < 0.5;
    
    // Outer arc (the limb)
    // Waxing: Lit on Right (Sweep 1 from Top to Bottom)
    // Waning: Lit on Left (Sweep 0 from Top to Bottom)

    // Terminator offset x. 
    // p=0 -> cos(0)=1. p=0.25 -> cos(PI/2)=0. p=0.5 -> cos(PI)=-1.
    const terminatorX = -Math.cos(p * 2 * Math.PI) * radius;
    
    // Path construction
    if (isWaxing) {
       // Lit Right
       // Limb: Top -> Right -> Bottom
       // Terminator: Bottom -> Top. 
       // For Crescent (p < 0.25), Terminator bows Right (Sweep 0).
       // For Gibbous (p > 0.25), Terminator bows Left (Sweep 1).
       pathD = `
         M 0,${-radius} 
         A ${radius},${radius} 0 0,1 0,${radius} 
         A ${Math.abs(terminatorX)},${radius} 0 0,${p < 0.25 ? 0 : 1} 0,${-radius}
       `;
    } else {
       // Waning (Lit Left)
       // Limb: Top -> Left -> Bottom
       // Terminator: Bottom -> Top.
       // For Gibbous (p < 0.75), Terminator bows Right (Sweep 0).
       // For Crescent (p > 0.75), Terminator bows Left (Sweep 1).
       pathD = `
         M 0,${radius} 
         A ${radius},${radius} 0 0,1 0,${-radius} 
         A ${Math.abs(terminatorX)},${radius} 0 0,${p < 0.75 ? 0 : 1} 0,${radius}
       `;
    }
  }

  return (
    <svg width={size} height={size} viewBox={`-${size/2} -${size/2} ${size} ${size}`} className={className}>
      {/* Dark Side / Base */}
      <circle cx="0" cy="0" r={radius} className="fill-stone-900 stroke-stone-800" strokeWidth="1" />
      {/* Lit Side */}
      <path d={pathD} className={highlight ? "fill-stone-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "fill-stone-400 opacity-80"} />
    </svg>
  );
};

const LunarModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const [phases, setPhases] = useState<MoonPhaseData[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Generate Phases
  useEffect(() => {
    const data: MoonPhaseData[] = [];
    const now = new Date();
    
    // Start strictly from today (beginning of day to catch phases happening later today)
    // This removes past phases (history) as requested.
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startMs = startOfToday.getTime();
    
    // End exactly at wedding date (no future phases beyond it)
    const endMs = targetDate.getTime();
    
    let currentMs = startMs;

    // Find first sync point (New Moon) before startMs
    // Ref: Jan 11 2024
    const diffFromRef = startMs - REFERENCE_NEW_MOON.getTime();
    const cyclesSinceRef = Math.floor(diffFromRef / (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY));
    const firstNewMoonMs = REFERENCE_NEW_MOON.getTime() + (cyclesSinceRef * SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY);
    
    // Ensure we start checking phases from the sync point just before our start window
    currentMs = firstNewMoonMs;

    const addPhase = (time: number, type: MoonPhaseData['type'], phaseVal: number, lbl: string) => {
        // Filter out any calculated phases that are before the start of today
        if (time >= startMs && time <= endMs) {
            data.push({
                date: new Date(time),
                phase: phaseVal,
                type,
                label: lbl
            });
        }
    };

    // Iterate until we pass the end date
    // Note: We might start loop before startMs, but addPhase filters.
    while (currentMs <= endMs) {
        // New Moon
        addPhase(currentMs, 'NEW', 0, 'New Moon');
        // First Quarter
        addPhase(currentMs + (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY * 0.25), 'FIRST_QUARTER', 0.25, 'First Quarter');
        // Full Moon
        addPhase(currentMs + (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY * 0.5), 'FULL', 0.5, 'Full Moon');
        // Last Quarter
        addPhase(currentMs + (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY * 0.75), 'LAST_QUARTER', 0.75, 'Last Quarter');
        
        currentMs += (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY);
    }

    // Insert "Current" (Right Now)
    const nowPhaseVal = ((now.getTime() - REFERENCE_NEW_MOON.getTime()) / (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY)) % 1;
    // Helper to get descriptive label for intermediate
    const getPhaseLabel = (p: number) => {
        if (p < 0.25) return 'Waxing Crescent';
        if (p < 0.5) return 'Waxing Gibbous';
        if (p < 0.75) return 'Waning Gibbous';
        return 'Waning Crescent';
    };

    data.push({
        date: now,
        phase: nowPhaseVal,
        type: 'INTERMEDIATE',
        label: getPhaseLabel(nowPhaseVal),
        isCurrent: true
    });

    // Insert "Wedding"
    const targetPhaseVal = ((targetDate.getTime() - REFERENCE_NEW_MOON.getTime()) / (SYNODIC_MONTH_DAYS * MILLISECONDS_PER_DAY)) % 1;
    data.push({
        date: targetDate,
        phase: targetPhaseVal,
        type: 'INTERMEDIATE',
        label: "The Wedding", // Override label
        isWedding: true
    });

    // Sort by date
    data.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Deduplicate: If "Current" is very close (< 24h) to a major phase, skip the major phase to avoid visual clutter.
    // We prioritize "Current" over a standard phase if they are effectively the same day.
    const filteredData: MoonPhaseData[] = [];
    
    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        
        // Look ahead to next item
        if (i < data.length - 1) {
            const next = data[i+1];
            
            // Conflict Resolution:
            // If `current` is a generated phase and `next` is "Current" (You Are Here), and they are < 24h apart:
            // Skip `current` so "You Are Here" takes precedence.
            if (!current.isCurrent && !current.isWedding && next.isCurrent) {
                 const diffHours = (next.date.getTime() - current.date.getTime()) / (1000 * 60 * 60);
                 if (diffHours < 24) continue;
            }
        }
        
        filteredData.push(current);
    }
    
    // Second pass to remove items strictly following "Current" that are too close (e.g. Current is 10pm, Next Phase is Tomorrow 2am - maybe keep? User said "update daily".
    // If we have Current (Jan 22) and Last Quarter (Jan 23), that's fine.
    // The main duplicate to avoid is Current (Jan 22 10am) and Last Quarter (Jan 22 1pm).
    
    const finalData: MoonPhaseData[] = [];
    for (let i = 0; i < filteredData.length; i++) {
        const current = filteredData[i];
        if (i > 0) {
            const prev = filteredData[i-1];
            // If prev was Current and current is standard phase and < 24h, skip current
            if (prev.isCurrent && !current.isWedding && !current.isCurrent) {
                 const diffHours = (current.date.getTime() - prev.date.getTime()) / (1000 * 60 * 60);
                 if (diffHours < 24) continue;
            }
        }
        finalData.push(current);
    }

    setPhases(finalData);
  }, [targetDate]);

  // Scroll to Current
  useLayoutEffect(() => {
    if (phases.length > 0 && scrollContainerRef.current) {
        // Find 'current' item
        const currentIndex = phases.findIndex(p => p.isCurrent);
        if (currentIndex !== -1) {
            const el = itemRefs.current.get(`item-${currentIndex}`);
            if (el) {
                // Scroll to top of view roughly, or center
                el.scrollIntoView({ behavior: 'auto', block: 'center' });
            }
        }
    }
  }, [phases]);


  return (
    <div className="h-full w-full bg-stone-950 text-stone-200 relative overflow-hidden flex flex-col">
       {/* Header - Fixed - Increased Top Padding for Mobile to clear global header */}
       <div className="pt-32 sm:pt-24 pb-4 text-center z-20 bg-gradient-to-b from-stone-950 via-stone-950 to-transparent flex-shrink-0">
          <h2 className="text-xl sm:text-3xl italic font-serif text-stone-400">The Lunar Stack</h2>
          <p className="text-[10px] sm:text-xs font-mono text-stone-600 mt-2 uppercase tracking-widest">
             Scroll to traverse time
          </p>
       </div>

       {/* Scrollable Timeline */}
       <div 
         ref={scrollContainerRef}
         className="flex-1 overflow-y-auto no-scrollbar relative px-2 sm:px-6 pb-20 scroll-smooth"
       >
         {/* Vertical Guide Line */}
         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-800 -translate-x-1/2 z-0" />

         <div className="flex flex-col items-center gap-6 sm:gap-16 py-10">
            {phases.map((p, i) => {
                const isPast = p.isCurrent ? false : p.date < new Date();
                
                let opacityClass = 'opacity-40'; 
                
                if (p.isCurrent || p.isWedding) {
                    opacityClass = 'opacity-100';
                }

                // Reduced scale on mobile to keep things compact
                const scaleClass = (p.isCurrent || p.isWedding) ? 'scale-105 sm:scale-125' : 'scale-100';
                
                return (
                    <div 
                        key={`${p.date.toISOString()}-${i}`}
                        ref={(el) => {
                            if (el) itemRefs.current.set(`item-${i}`, el);
                        }}
                        className={`flex items-center w-full max-w-lg z-10 relative transition-all duration-500 ${opacityClass} ${scaleClass}`}
                    >
                        {/* Left: Date - Reduced padding on mobile */}
                        <div className={`flex-1 text-right pr-3 sm:pr-10 ${p.isCurrent ? 'text-stone-100' : 'text-stone-500'}`}>
                            <div className="font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold">
                                {p.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="font-mono text-[9px] sm:text-[10px] text-stone-600 uppercase">
                                {p.date.getFullYear()}
                            </div>
                        </div>

                        {/* Center: Icon */}
                        <div className="relative flex-shrink-0">
                             <MoonIcon 
                                phase={p.phase} 
                                size={p.isCurrent || p.isWedding ? 64 : 48} 
                                highlight={p.isCurrent || p.isWedding}
                                className="drop-shadow-2xl"
                             />
                        </div>

                        {/* Right: Label - Reduced padding on mobile */}
                        <div className={`flex-1 text-left pl-3 sm:pl-10 ${p.isWedding ? 'text-amber-200' : 'text-stone-400'}`}>
                            {p.isCurrent && (
                                <div className="mb-1 sm:mb-2">
                                    <span className="text-[9px] sm:text-[10px] text-stone-100 font-mono tracking-widest bg-stone-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-stone-700 whitespace-nowrap">YOU ARE HERE</span>
                                </div>
                            )}
                            <div className={`font-serif italic leading-tight ${p.isCurrent || p.isWedding ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
                                {p.label}
                            </div>
                            {p.isWedding && (
                                <div className="font-mono text-[9px] sm:text-[10px] text-amber-500/50 uppercase tracking-widest mt-1">
                                    The Big Day
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
         </div>
       </div>
    </div>
  );
};

export default LunarModule;