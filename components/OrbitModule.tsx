import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { EARTH_ORBIT_KM, DAYS_PER_YEAR, ENGAGEMENT_DATE } from '../constants';
import { TimeModuleProps } from '../types';
import { getModuleHeaderClass, typography, spacing } from '../designSystem';
import { Heart, MapPin } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { useT } from '../i18n';

const OrbitModule: React.FC<TimeModuleProps> = ({ targetDate, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useT();
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

    // Wedding Marker (Fixed at top - 90 degrees or -Math.PI/2)
    const targetAngle = -Math.PI / 2;

    // Wedding Line (Short tick mark)
    svg.append('line')
      .attr('x1', Math.cos(targetAngle) * (radius - 15))
      .attr('y1', Math.sin(targetAngle) * (radius - 15))
      .attr('x2', Math.cos(targetAngle) * (radius + 15))
      .attr('y2', Math.sin(targetAngle) * (radius + 15))
      .attr('stroke', '#a8a29e') // stone-400
      .attr('stroke-width', 2);

    // Wedding Icon
    const weddingIconSize = isMobile ? 12 : 16;
    const weddingIconY = Math.sin(targetAngle) * (radius + (isMobile ? 30 : 40));

    const weddingIconFO = svg.append('foreignObject')
      .attr('x', Math.cos(targetAngle) * (radius + (isMobile ? 30 : 40)) - weddingIconSize / 2)
      .attr('y', weddingIconY - weddingIconSize / 2)
      .attr('width', weddingIconSize)
      .attr('height', weddingIconSize)
      .style('pointer-events', 'none');

    const weddingIconDiv = document.createElement('div');
    weddingIconFO.node()?.appendChild(weddingIconDiv);
    const weddingIconRoot = createRoot(weddingIconDiv);
    weddingIconRoot.render(
      <Heart
        size={weddingIconSize}
        className="text-stone-400"
        fill="currentColor"
        strokeWidth={1.5}
      />
    );

    svg.append('text')
      .attr('x', Math.cos(targetAngle) * (radius + (isMobile ? 30 : 40)))
      .attr('y', Math.sin(targetAngle) * (radius + (isMobile ? 45 : 60)))
      .attr('text-anchor', 'middle')
      .attr('fill', '#a8a29e')
      .attr('class', 'font-mono text-[10px] sm:text-xs tracking-widest')
      .text(t.orbit.wedding);
    
    // --- ENGAGEMENT MARKER ---
    // Calculate position for Engagement Date
    // Earth travels CCW (decreasing angle). Past dates are at "higher" angles (further CCW back).
    const engDiffMs = targetDate.getTime() - ENGAGEMENT_DATE.getTime();
    const engDiffDays = engDiffMs / (1000 * 60 * 60 * 24);
    const engTotalDegrees = (engDiffDays / DAYS_PER_YEAR) * 360;
    const engRadians = (engTotalDegrees * Math.PI) / 180;
    const engAngle = targetAngle + engRadians;

    const engX = Math.cos(engAngle) * radius;
    const engY = Math.sin(engAngle) * radius;

    // Engagement marker circle (ring style)
    svg.append('circle')
        .attr('cx', engX)
        .attr('cy', engY)
        .attr('r', isMobile ? 4 : 5)
        .attr('fill', 'none')
        .attr('stroke', '#78716c') // stone-500
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7);

    // Label for Engagement with extended positioning
    const engExtension = isMobile ? 35 : 50;
    const engLabelR = radius + engExtension;
    const engLabelX = Math.cos(engAngle) * engLabelR;
    const engLabelY = Math.sin(engAngle) * engLabelR;

    // Leader line for Engagement
    svg.append('line')
        .attr('x1', engX)
        .attr('y1', engY)
        .attr('x2', Math.cos(engAngle) * (engLabelR - 10))
        .attr('y2', Math.sin(engAngle) * (engLabelR - 10))
        .attr('stroke', '#57534e')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2 2')
        .attr('opacity', 0.6);

    svg.append('text')
        .attr('x', engLabelX)
        .attr('y', engLabelY)
        .attr('text-anchor', 'middle')
        .attr('fill', '#78716c') // stone-500
        .attr('class', 'font-mono text-[8px] sm:text-[9px] tracking-widest')
        .text(t.orbit.engaged);

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

    // "You Are Here" Label Group (will be updated in animation)
    const youAreHereGroup = svg.append('g').attr('class', 'you-are-here-label');

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
      const earthX = Math.cos(currentAngle) * radius;
      const earthY = Math.sin(currentAngle) * radius;
      earthGroup.attr('transform', `translate(${earthX}, ${earthY})`);

      // Update Moon Position
      // Approx 29.5 days per cycle
      const moonRadians = (diffDays / 29.53) * 2 * Math.PI;
      const mx = Math.cos(moonRadians) * moonOrbitRadius;
      const my = Math.sin(moonRadians) * moonOrbitRadius;

      moon
        .attr('cx', mx)
        .attr('cy', my);

      // Update "You Are Here" Label
      youAreHereGroup.selectAll('*').remove();

      const youAreHereExtension = isMobile ? 40 : 60;
      const youAreHereLabelR = radius + youAreHereExtension;
      const youAreHereLabelX = Math.cos(currentAngle) * youAreHereLabelR;
      const youAreHereLabelY = Math.sin(currentAngle) * youAreHereLabelR;

      // Leader line for "You Are Here"
      youAreHereGroup.append('line')
        .attr('x1', earthX)
        .attr('y1', earthY)
        .attr('x2', Math.cos(currentAngle) * (youAreHereLabelR - 10))
        .attr('y2', Math.sin(currentAngle) * (youAreHereLabelR - 10))
        .attr('stroke', '#44403c')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2 2');

      // MapPin Icon for "You Are Here"
      const mapPinSize = isMobile ? 10 : 12;
      const mapPinFO = youAreHereGroup.append('foreignObject')
        .attr('x', youAreHereLabelX - mapPinSize / 2)
        .attr('y', youAreHereLabelY - mapPinSize / 2 - (isMobile ? 8 : 10))
        .attr('width', mapPinSize)
        .attr('height', mapPinSize)
        .style('pointer-events', 'none');

      const mapPinDiv = document.createElement('div');
      mapPinFO.node()?.appendChild(mapPinDiv);
      const mapPinRoot = createRoot(mapPinDiv);
      mapPinRoot.render(
        <MapPin
          size={mapPinSize}
          className="text-stone-300"
          fill="currentColor"
          strokeWidth={1.5}
        />
      );

      youAreHereGroup.append('text')
        .attr('x', youAreHereLabelX)
        .attr('y', youAreHereLabelY + (isMobile ? 4 : 6))
        .attr('text-anchor', 'middle')
        .attr('fill', '#d6d3d1') // stone-300
        .attr('class', 'font-mono text-[8px] sm:text-[9px] tracking-widest font-bold')
        .text(t.orbit.youAreHere);

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
  }, [targetDate, isActive, resizeTrigger, t]);

  return (
    <div className="h-full w-full relative bg-stone-950 overflow-hidden">
       {/* Visualization Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />
      
      {/* Consistent Header */}
      <div className={getModuleHeaderClass()}>
        {t.orbit.header}
      </div>

      {/* Overlay Stats */}
      <div className="absolute bottom-8 sm:bottom-16 left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {/* Mobile: Grid cols 3 (horizontal), Desktop: Grid cols 3 (horizontal) but bigger */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 text-center px-2 w-full max-w-4xl">
           <div className="flex flex-col items-center justify-start">
             <div className={typography.number.small}>
               {stats.degrees.toFixed(1)}°
             </div>
             <div className={`${typography.label.small} mt-1`}>{t.orbit.arc}</div>
           </div>

           <div className="flex flex-col items-center justify-start">
             <div className={typography.number.small}>
               {(stats.km / 1000000).toFixed(1)}M
             </div>
             <div className={`${typography.label.small} mt-1`}>{t.orbit.km}</div>
           </div>

           <div className="flex flex-col items-center justify-start">
             <div className={typography.number.small}>
               {stats.fraction.toFixed(3)}
             </div>
             <div className={`${typography.label.small} mt-1`}>{t.orbit.orbits}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrbitModule;