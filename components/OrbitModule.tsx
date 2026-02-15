import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { EARTH_ORBIT_KM, DAYS_PER_YEAR, ENGAGEMENT_DATE } from '../constants';
import { TimeModuleProps } from '../types';
import { getModuleHeaderClass, typography, spacing, vibes, getVibeClass } from '../designSystem';
import { Heart, MapPin } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { useT } from '../i18n';

const OrbitModule: React.FC<TimeModuleProps> = ({ targetDate, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const [stats, setStats] = useState({ degrees: 0, km: 0, fraction: 0 });
  const [resizeTrigger, setResizeTrigger] = useState(0);
  const vibe = 'space';

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

    // Header Safe Area (branding + toggle)
    const headerSafety = isMobile ? 100 : 120;
    // Bottom Stats Safe Area - Increase this to push the diagram center UP
    const footerSafety = isMobile ? 140 : 180;

    const availableHeightForOrbit = height - headerSafety - footerSafety;
    const centerY = headerSafety + (availableHeightForOrbit / 2);

    // Label padding for vertical radius calculation
    const labelPadding = isMobile ? 50 : 70;
    const horizontalMaxRadius = (width / 2) - 40;
    const verticalMaxRadius = (availableHeightForOrbit / 2) - labelPadding;

    const radius = Math.max(60, Math.min(horizontalMaxRadius, verticalMaxRadius));

    const centerYOffset = centerY - (height / 2);

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
      .attr("fill", "#38bdf8"); // sky-400

    // Sun
    svg.append('circle')
      .attr('r', isMobile ? 12 : 16)
      .attr('fill', '#fff') // Pure white sun for "Spare Space" vibe
      .attr('filter', 'blur(8px)')
      .attr('opacity', 0.6);

    svg.append('circle')
      .attr('r', isMobile ? 6 : 8)
      .attr('fill', '#fff')
      .attr('opacity', 1);

    // Orbit Path
    svg.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#1e293b') // slate-800
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 4');

    // Wedding Marker (Fixed at top - 90 degrees or -Math.PI/2)
    const targetAngle = -Math.PI / 2;

    // Wedding Line (Short tick mark)
    svg.append('line')
      .attr('x1', Math.cos(targetAngle) * (radius - 15))
      .attr('y1', Math.sin(targetAngle) * (radius - 15))
      .attr('x2', Math.cos(targetAngle) * (radius + 15))
      .attr('y2', Math.sin(targetAngle) * (radius + 15))
      .attr('stroke', '#38bdf8') // sky-400
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
        className="text-rose-500"
        fill="currentColor"
        strokeWidth={1.5}
      />
    );

    svg.append('text')
      .attr('x', Math.cos(targetAngle) * (radius + (isMobile ? 30 : 40)))
      .attr('y', Math.sin(targetAngle) * (radius + (isMobile ? 45 : 60)))
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('class', 'font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold')
      .text(t.orbit.wedding);

    // --- ENGAGEMENT MARKER ---
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
      .attr('stroke', '#334155') // slate-700
      .attr('stroke-width', 1.5);

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
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '1 3');

    svg.append('text')
      .attr('x', engLabelX)
      .attr('y', engLabelY)
      .attr('text-anchor', 'middle')
      .attr('fill', '#475569') // slate-600
      .attr('class', 'font-mono text-[8px] sm:text-[9px] uppercase tracking-widest')
      .text(t.orbit.engaged);

    // Dynamic Arrow Path (Initialized empty)
    const arrowPath = svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');

    // Earth Group
    const earthGroup = svg.append('g');

    // Moon Orbit (Relative to Earth)
    const moonOrbitRadius = isMobile ? 10 : 14;
    earthGroup.append('circle')
      .attr('r', moonOrbitRadius)
      .attr('fill', 'none')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 0.5);

    // Earth Body
    earthGroup.append('circle')
      .attr('r', isMobile ? 5 : 7)
      .attr('fill', '#38bdf8'); // Space: Blue Earth

    // Moon Body
    const moon = earthGroup.append('circle')
      .attr('r', isMobile ? 1.5 : 2.5)
      .attr('fill', '#fff'); // Space: White Moon

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
      const moonRadians = (diffDays / 29.53) * 2 * Math.PI;
      const mx = Math.cos(moonRadians) * moonOrbitRadius;
      const my = Math.sin(moonRadians) * moonOrbitRadius;

      moon.attr('cx', mx).attr('cy', my);

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
        .attr('stroke', '#334155')
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
          className="text-white"
          fill="currentColor"
          strokeWidth={1.5}
        />
      );

      youAreHereGroup.append('text')
        .attr('x', youAreHereLabelX)
        .attr('y', youAreHereLabelY + (isMobile ? 4 : 6))
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('class', 'font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black')
        .text(t.orbit.youAreHere);

      const arrowStartOffset = 0.15;
      const arrowLength = 0.5;

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
    <div className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} relative overflow-hidden pt-28 sm:pt-32 px-4`}>
      {/* 1. Module Title */}
      <h2 className={`${getVibeClass(vibe, 'header')} text-center z-10 mb-4 sm:text-2xl`}>
        {t.orbit.header}
      </h2>

      {/* 2. Visualization Area (In Flow) */}
      <div ref={containerRef} className="flex-1 w-full min-h-0 z-0" />

      {/* 3. Overlay Stats (Stacked in flow) */}
      <div className="w-full max-w-4xl z-10 flex flex-col items-center -mt-20 sm:-mt-32 mb-2">
        <div className="grid grid-cols-3 gap-3 sm:gap-8 text-center px-2 w-full">
          <div className="flex flex-col items-center justify-start">
            <div className={`${getVibeClass(vibe, 'number')} text-lg sm:text-2xl md:text-3xl`}>
              {stats.degrees.toFixed(1).padStart(5, '0')}°
            </div>
            <div className={`${getVibeClass(vibe, 'label')} mt-1`}>{t.orbit.arc}</div>
          </div>

          <div className="flex flex-col items-center justify-start">
            <div className={`${getVibeClass(vibe, 'number')} text-lg sm:text-2xl md:text-3xl`}>
              {(stats.km / 1000000).toFixed(1).padStart(4, '0')}M
            </div>
            <div className={`${getVibeClass(vibe, 'label')} mt-1`}>{t.orbit.km}</div>
          </div>

          <div className="flex flex-col items-center justify-start">
            <div className={`${getVibeClass(vibe, 'number')} text-lg sm:text-2xl md:text-3xl`}>
              {stats.fraction.toFixed(3)}
            </div>
            <div className={`${getVibeClass(vibe, 'label')} mt-1`}>{t.orbit.orbits}</div>
          </div>
        </div>
      </div>

      {/* 4. Caption / Footer Spacer */}
      <div className="pb-4 sm:pb-8 px-4 z-10" />
    </div>
  );
};

export default OrbitModule;