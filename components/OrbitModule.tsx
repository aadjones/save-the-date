import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { EARTH_ORBIT_KM, DAYS_PER_YEAR, ENGAGEMENT_DATE } from '../constants';
import { TimeModuleProps } from '../types';
import { getModuleHeaderClass, typography, spacing } from '../designSystem';

const OrbitModule: React.FC<TimeModuleProps> = ({ targetDate, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({ degrees: 0, km: 0, fraction: 0 });
  const [resizeTrigger, setResizeTrigger] = useState(0);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => setResizeTrigger(prev => prev + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const isMobile = width < 640;

    // Adjust Center Y
    // Shift slightly upwards on both to leave ample room for the bottom stats block
    const centerYOffset = isMobile ? -50 : -20;

    // Adjust Radius
    // Significantly reduced to prevent the orbit path or labels from overlapping 
    // with the top header or bottom stats area.
    const radiusScale = isMobile ? 0.22 : 0.26;
    const radius = Math.min(width, height) * radiusScale;

    // Clear previous
    d3.select(containerRef.current).selectAll('*').remove();

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2 + centerYOffset})`);

    // Define arrowhead marker
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#a8a29e"); // stone-400

    // Sun
    svg.append('circle')
      .attr('r', isMobile ? 12 : 16)
      .attr('fill', '#fcd34d') // amber-300
      .attr('filter', 'blur(4px)')
      .attr('opacity', 0.8);
    
    svg.append('circle')
      .attr('r', isMobile ? 6 : 8)
      .attr('fill', '#fff') 
      .attr('opacity', 0.9);

    // Orbit Path
    svg.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#44403c') // stone-700
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 4');

    // Target Marker (Fixed at top - 90 degrees or -Math.PI/2)
    const targetAngle = -Math.PI / 2;
    
    // Target Line (Short tick mark)
    svg.append('line')
      .attr('x1', Math.cos(targetAngle) * (radius - 15))
      .attr('y1', Math.sin(targetAngle) * (radius - 15))
      .attr('x2', Math.cos(targetAngle) * (radius + 15))
      .attr('y2', Math.sin(targetAngle) * (radius + 15))
      .attr('stroke', '#a8a29e') // stone-400
      .attr('stroke-width', 2);

    svg.append('text')
      .attr('x', Math.cos(targetAngle) * (radius + (isMobile ? 20 : 30)))
      .attr('y', Math.sin(targetAngle) * (radius + (isMobile ? 20 : 30)))
      .attr('text-anchor', 'middle')
      .attr('fill', '#a8a29e')
      .attr('class', 'font-mono text-[10px] sm:text-xs tracking-widest')
      .text('TARGET');
    
    // --- GHOST EARTH (Engagement Date) ---
    // Calculate position for Engagement Date
    // Earth travels CCW (decreasing angle). Past dates are at "higher" angles (further CCW back).
    const engDiffMs = targetDate.getTime() - ENGAGEMENT_DATE.getTime();
    const engDiffDays = engDiffMs / (1000 * 60 * 60 * 24);
    const engTotalDegrees = (engDiffDays / DAYS_PER_YEAR) * 360;
    const engRadians = (engTotalDegrees * Math.PI) / 180;
    const engAngle = targetAngle + engRadians;

    const ghostGroup = svg.append('g')
      .attr('transform', `translate(${Math.cos(engAngle) * radius}, ${Math.sin(engAngle) * radius})`);
    
    ghostGroup.append('circle')
        .attr('r', isMobile ? 5 : 7)
        .attr('fill', 'none')
        .attr('stroke', '#57534e') // stone-600
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.6);

    // Label for Engagement
    const labelAngle = engAngle;
    
    ghostGroup.append('text')
        .attr('x', Math.cos(labelAngle) * 20)
        .attr('y', Math.sin(labelAngle) * 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#57534e') // stone-600
        .attr('class', 'font-mono text-[8px] sm:text-[9px] tracking-widest')
        .text('ENGAGED');

    // Dynamic Arrow Path (Initialized empty)
    const arrowPath = svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#78716c')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)')
      .attr('opacity', 0.8);

    // Earth Group
    const earthGroup = svg.append('g');

    // Moon Orbit (Relative to Earth)
    const moonOrbitRadius = isMobile ? 10 : 14;
    earthGroup.append('circle')
      .attr('r', moonOrbitRadius)
      .attr('fill', 'none')
      .attr('stroke', '#57534e')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.4);

    // Earth Body
    earthGroup.append('circle')
      .attr('r', isMobile ? 5 : 7)
      .attr('fill', '#38bdf8'); // sky-400
      
    // Moon Body
    const moon = earthGroup.append('circle')
      .attr('r', isMobile ? 1.5 : 2.5)
      .attr('fill', '#e7e5e4'); // stone-200

    // Animation Loop
    let animationId: number;
    
    const animate = () => {
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      
      const totalDegrees = (diffDays / DAYS_PER_YEAR) * 360;
      const kmRemaining = (diffDays / DAYS_PER_YEAR) * EARTH_ORBIT_KM;
      
      // Angle for visualization
      const remainingRadians = (totalDegrees * Math.PI) / 180;
      const currentAngle = targetAngle + remainingRadians;

      // Update Earth Position
      earthGroup.attr('transform', `translate(${Math.cos(currentAngle) * radius}, ${Math.sin(currentAngle) * radius})`);

      // Update Moon Position
      // Approx 29.5 days per cycle
      const moonRadians = (diffDays / 29.53) * 2 * Math.PI;
      const mx = Math.cos(moonRadians) * moonOrbitRadius;
      const my = Math.sin(moonRadians) * moonOrbitRadius;
      
      moon
        .attr('cx', mx)
        .attr('cy', my);

      // Update Arrow Position
      const arrowStartOffset = 0.15; // rads ~ 8 deg
      const arrowLength = 0.5; // rads ~ 28 deg
      
      const arrowStart = currentAngle - arrowStartOffset;
      const arrowEnd = currentAngle - arrowStartOffset - arrowLength;

      const ax1 = Math.cos(arrowStart) * radius;
      const ay1 = Math.sin(arrowStart) * radius;
      const ax2 = Math.cos(arrowEnd) * radius;
      const ay2 = Math.sin(arrowEnd) * radius;

      arrowPath.attr('d', `M ${ax1} ${ay1} A ${radius} ${radius} 0 0 0 ${ax2} ${ay2}`);

      setStats({
        degrees: totalDegrees,
        km: kmRemaining,
        fraction: diffDays / DAYS_PER_YEAR
      });

      if (isActive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [targetDate, isActive, resizeTrigger]);

  return (
    <div className="h-full w-full relative bg-stone-950 overflow-hidden">
       {/* Visualization Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />
      
      {/* Consistent Header */}
      <div className={getModuleHeaderClass()}>
        Orbital Dynamics
      </div>

      {/* Overlay Stats */}
      <div className="absolute bottom-8 sm:bottom-16 left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {/* Mobile: Grid cols 3 (horizontal), Desktop: Grid cols 3 (horizontal) but bigger */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 text-center px-2 w-full max-w-4xl">
           <div className="flex flex-col items-center justify-start">
             <div className={typography.number.small}>
               {stats.degrees.toFixed(1)}°
             </div>
             <div className={`${typography.label.small} mt-1`}>Arc</div>
           </div>

           <div className="flex flex-col items-center justify-start">
             <div className={typography.number.small}>
               {(stats.km / 1000000).toFixed(1)}M
             </div>
             <div className={`${typography.label.small} mt-1`}>KM</div>
           </div>

           <div className="flex flex-col items-center justify-start">
             <div className={typography.number.small}>
               {stats.fraction.toFixed(3)}
             </div>
             <div className={`${typography.label.small} mt-1`}>Orbits</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrbitModule;