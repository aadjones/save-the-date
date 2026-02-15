import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { TimeModuleProps } from "../types";
import { Snowflake, Flower2, Sun, Leaf } from "lucide-react";
import { createRoot } from "react-dom/client";
import { getModuleHeaderClass, typography } from "../designSystem";
import { useT, useLocale } from "../i18n";

const SeasonalDialModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizeTrigger, setResizeTrigger] = useState(0);
  const t = useT();
  const [locale] = useLocale();

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      setResizeTrigger((prev) => prev + 1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Breakpoints
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    // 1. Center Shift
    // Mobile: Shift down to make room for the header
    // Desktop: Centered
    const centerYOffset = isMobile ? 0 : 20;

    // 2. Radius configuration
    // Mobile: Increased size for better visibility
    // Tablet: Moderate
    // Desktop: Larger for grand presentation
    let radiusScale = 0.45;
    if (isMobile) radiusScale = 0.28;
    else if (isTablet) radiusScale = 0.3;

    const radius = Math.min(width, height) * radiusScale;

    // Clear previous
    d3.select(containerRef.current).selectAll("*").remove();

    // Keep reference to root SVG for Safari foreignObject fix
    const rootSvg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const svg = rootSvg
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2}, ${height / 2 + centerYOffset})`,
      );

    // --- SEASONS CONFIG ---
    const seasons = [
      {
        name: t.seasonal.winter,
        startAngle: 0,
        endAngle: Math.PI / 2,
        labelAngle: Math.PI / 4,
      },
      {
        name: t.seasonal.spring,
        startAngle: Math.PI / 2,
        endAngle: Math.PI,
        labelAngle: (3 * Math.PI) / 4,
      },
      {
        name: t.seasonal.summer,
        startAngle: Math.PI,
        endAngle: (3 * Math.PI) / 2,
        labelAngle: (5 * Math.PI) / 4,
      },
      {
        name: t.seasonal.fall,
        startAngle: (3 * Math.PI) / 2,
        endAngle: 2 * Math.PI,
        labelAngle: (7 * Math.PI) / 4,
      },
    ];

    // --- DRAW BASE DIAL ---

    // Outer Circle
    svg
      .append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#57534e") // stone-600
      .attr("stroke-width", 1);

    // Crosshairs (Solstices/Equinoxes)
    // Vertical
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", -radius)
      .attr("x2", 0)
      .attr("y2", radius)
      .attr("stroke", "#44403c") // stone-700
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4 4");

    // Horizontal
    svg
      .append("line")
      .attr("x1", -radius)
      .attr("y1", 0)
      .attr("x2", radius)
      .attr("y2", 0)
      .attr("stroke", "#44403c") // stone-700
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4 4");

    // Season Labels
    svg
      .selectAll(".season-label")
      .data(seasons)
      .enter()
      .append("text")
      .attr("x", (d) => Math.sin(d.labelAngle) * (radius * 0.55))
      .attr("y", (d) => -Math.cos(d.labelAngle) * (radius * 0.55))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr(
        "class",
        "font-serif text-[10px] sm:text-base md:text-lg text-stone-400 fill-current uppercase tracking-widest font-bold opacity-50 select-none",
      )
      .text((d) => d.name);

    // Season Icons
    const seasonIcons = [
      { name: "Winter", icon: Snowflake },
      { name: "Spring", icon: Flower2 },
      { name: "Summer", icon: Sun },
      { name: "Fall", icon: Leaf },
    ];

    const iconSize = isMobile ? 16 : 24;
    const iconOffset = isMobile ? 0.35 : 0.38; // Position icons closer to center than text

    seasonIcons.forEach((season, i) => {
      const seasonData = seasons[i];
      // Calculate relative position
      const iconX = Math.sin(seasonData.labelAngle) * (radius * iconOffset);
      const iconY = -Math.cos(seasonData.labelAngle) * (radius * iconOffset);

      // Safari fix: Append to root SVG with absolute positions instead of transformed group
      // Calculate absolute position including center transform
      const absoluteX = width / 2 + iconX - iconSize / 2;
      const absoluteY = height / 2 + centerYOffset + iconY - iconSize / 2;

      const foreignObject = rootSvg
        .append("foreignObject")
        .attr("x", absoluteX)
        .attr("y", absoluteY)
        .attr("width", iconSize)
        .attr("height", iconSize)
        .style("pointer-events", "none");

      const div = document.createElement("div");
      foreignObject.node()?.appendChild(div);

      const Icon = season.icon;
      const root = createRoot(div);
      root.render(
        <Icon
          size={iconSize}
          className="text-stone-400"
          style={{ opacity: 0.6 }}
          strokeWidth={2}
        />,
      );
    });

    // --- SOLSTICE / EQUINOX LABELS ---
    // Adjusted offsets for responsiveness
    // dy/dx now conditional on isMobile vs Desktop for better spacing
    const labelSpacing = isMobile ? 10 : 25;

    const dateLocale = locale === 'es' ? 'es-MX' : 'en-US';
    const fmtDate = (m: number, d: number) =>
      new Date(2026, m, d).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' }).toUpperCase();

    const cardinalLabels = [
      {
        name: t.seasonal.winterSolstice,
        date: fmtDate(11, 21),
        angle: 0,
        align: "middle",
        dy: -labelSpacing - 12, // Raised specifically for clearance
        dx: 0,
      },
      {
        name: t.seasonal.vernalEquinox,
        date: fmtDate(2, 20),
        angle: Math.PI / 2,
        align: "start",
        dy: 0,
        dx: labelSpacing,
      },
      {
        name: t.seasonal.summerSolstice,
        date: fmtDate(5, 21),
        angle: Math.PI,
        align: "middle",
        dy: labelSpacing + 10,
        dx: 0,
      },
      // Safari/mobile fix: Reduce negative dx offset to prevent label cutoff on left edge
      {
        name: t.seasonal.autumnalEquinox,
        date: fmtDate(8, 22),
        angle: (3 * Math.PI) / 2,
        align: "end",
        dy: -labelSpacing,
        dx: isMobile ? -8 : -labelSpacing,
      },
    ];

    const labelsGroup = svg.append("g").attr("class", "cardinal-labels");

    labelsGroup
      .selectAll(".cardinal-group")
      .data(cardinalLabels)
      .enter()
      .append("g")
      .each(function (d) {
        const g = d3.select(this);
        const x = Math.sin(d.angle) * radius;
        const y = -Math.cos(d.angle) * radius;

        let textX = x + (d.dx || 0);
        let textY = y + (d.dy || 0);

        // Render multi-line labels (Name + Date)
        const words = d.name.split(' ');
        let lines = [];

        // Logical split for better two-line balance
        if (words.length > 1) {
          // If 3 words (like "Solsticio de Invierno"), put 'de' on the second line
          if (words.length === 3 && words[1].toLowerCase() === 'de') {
            lines.push(words[0]);
            lines.push(words.slice(1).join(' '));
          } else {
            const mid = Math.ceil(words.length / 2);
            lines.push(words.slice(0, mid).join(' '));
            lines.push(words.slice(mid).join(' '));
          }
        } else {
          lines.push(d.name);
        }

        const nameEl = g.append("text")
          .attr("x", textX)
          .attr("y", textY)
          .attr("text-anchor", d.align)
          .attr(
            "class",
            "font-mono text-[8px] sm:text-[10px] md:text-xs text-stone-500 fill-current font-bold uppercase tracking-wider",
          );

        // Append Label Lines
        lines.forEach((line, i) => {
          nameEl.append("tspan")
            .attr("x", textX)
            .attr("dy", i === 0 ? 0 : "1.2em")
            .text(line);
        });

        // Append Date Line (always separate)
        g.append("text")
          .attr("x", textX)
          .attr("y", textY + (lines.length * (isMobile ? 10 : 14)))
          .attr("text-anchor", d.align)
          .attr(
            "class",
            "font-mono text-[8px] sm:text-[9px] md:text-[10px] text-stone-600 fill-current uppercase tracking-wider",
          )
          .text(d.date);
      });

    // --- CALCULATE CURRENT PROGRESS ---
    const now = new Date();
    const year = now.getFullYear();

    let lastWinterSolstice = new Date(year, 11, 21); // Dec 21
    if (now < lastWinterSolstice) {
      lastWinterSolstice = new Date(year - 1, 11, 21);
    }

    const nextWinterSolstice = new Date(
      lastWinterSolstice.getFullYear() + 1,
      11,
      21,
    );
    const daysInYearCycle =
      (nextWinterSolstice.getTime() - lastWinterSolstice.getTime()) /
      (1000 * 60 * 60 * 24);
    const daysPassed =
      (now.getTime() - lastWinterSolstice.getTime()) / (1000 * 60 * 60 * 24);

    const cycleProgress = daysPassed / daysInYearCycle; // 0 to 1
    const currentAngle = cycleProgress * 2 * Math.PI;

    // Determine Active Season
    let activeSeasonIndex = 0;
    if (currentAngle < Math.PI / 2)
      activeSeasonIndex = 0; // Winter
    else if (currentAngle < Math.PI)
      activeSeasonIndex = 1; // Spring
    else if (currentAngle < (3 * Math.PI) / 2)
      activeSeasonIndex = 2; // Summer
    else activeSeasonIndex = 3; // Fall

    const activeSeason = seasons[activeSeasonIndex];

    // Progress within season
    const seasonDuration = Math.PI / 2;
    const angleInSeason = currentAngle - activeSeason.startAngle;
    const seasonProgress = Math.max(
      0,
      Math.min(1, angleInSeason / seasonDuration),
    );

    // --- DRAW FILL ---
    const fillRadius = radius * seasonProgress;
    const arcGenerator = d3
      .arc()
      .innerRadius(0)
      .outerRadius(fillRadius)
      .startAngle(activeSeason.startAngle)
      .endAngle(activeSeason.endAngle);

    svg
      .append("path")
      .attr("d", arcGenerator as any)
      .attr("fill", "#e7e5e4")
      .attr("opacity", 0.1);

    svg
      .append("path")
      .attr("d", arcGenerator as any)
      .attr("fill", "#e7e5e4")
      .attr("opacity", 0.15)
      .append("animate")
      .attr("attributeName", "opacity")
      .attr("values", "0.15;0.05;0.15")
      .attr("dur", "4s")
      .attr("repeatCount", "indefinite");

    // --- CURRENT DATE MARKER ---
    const currentX = Math.sin(currentAngle) * radius;
    const currentY = -Math.cos(currentAngle) * radius;

    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", currentX)
      .attr("y2", currentY)
      .attr("stroke", "#e7e5e4")
      .attr("stroke-width", 1.5);

    svg
      .append("circle")
      .attr("cx", currentX)
      .attr("cy", currentY)
      .attr("r", 3)
      .attr("fill", "#e7e5e4")
      .attr("stroke", "#0c0a09")
      .attr("stroke-width", 1);

    // Label for Current
    // Dynamic extension
    const curExtension = isMobile ? 40 : 80;
    const curLabelR = radius + curExtension;
    const curLabelX = Math.sin(currentAngle) * curLabelR;
    const curLabelY = -Math.cos(currentAngle) * curLabelR;

    const curGroup = svg.append("g");

    svg
      .append("line")
      .attr("x1", currentX)
      .attr("y1", currentY)
      .attr("x2", Math.sin(currentAngle) * (curLabelR - 10))
      .attr("y2", -Math.cos(currentAngle) * (curLabelR - 10))
      .attr("stroke", "#44403c")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2 2");

    curGroup
      .append("text")
      .attr("x", curLabelX)
      .attr("y", curLabelY)
      .attr("text-anchor", "middle")
      .attr(
        "class",
        "font-mono text-[9px] sm:text-[10px] md:text-xs font-bold text-stone-100 fill-current tracking-widest",
      )
      .text(t.seasonal.youAreHere);

    curGroup
      .append("text")
      .attr("x", curLabelX)
      .attr("y", curLabelY + (isMobile ? 12 : 16))
      .attr("text-anchor", "middle")
      .attr(
        "class",
        "font-mono text-[8px] sm:text-[9px] md:text-[10px] text-stone-400 fill-current uppercase tracking-wider",
      )
      .text(
        now
          .toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', { month: "short", day: "numeric" })
          .toUpperCase(),
      );

    // --- WEDDING TARGET MARKER ---
    const tYear = targetDate.getFullYear();
    let targetWS = new Date(tYear, 11, 21);
    if (targetDate < targetWS) {
      targetWS = new Date(tYear - 1, 11, 21);
    }
    const nextTargetWS = new Date(targetWS.getFullYear() + 1, 11, 21);
    const targetCycleDays =
      (nextTargetWS.getTime() - targetWS.getTime()) / (1000 * 60 * 60 * 24);
    const targetDaysPassed =
      (targetDate.getTime() - targetWS.getTime()) / (1000 * 60 * 60 * 24);
    const targetAngle = (targetDaysPassed / targetCycleDays) * 2 * Math.PI;
    const targetX = Math.sin(targetAngle) * radius;
    const targetY = -Math.cos(targetAngle) * radius;

    // Dashed Line for Target
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", targetX)
      .attr("y2", targetY)
      .attr("stroke", "#a8a29e")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3 3");

    svg
      .append("circle")
      .attr("cx", targetX)
      .attr("cy", targetY)
      .attr("r", 4)
      .attr("fill", "#0c0a09")
      .attr("stroke", "#a8a29e")
      .attr("stroke-width", 1.5);

    // Label for Target
    const tarExtension = isMobile ? 40 : 100; // More extension on desktop for drama
    const tarLabelR = radius + tarExtension;
    const tarLabelX = Math.sin(targetAngle) * tarLabelR;
    const tarLabelY = -Math.cos(targetAngle) * tarLabelR;

    const tarGroup = svg.append("g");

    // Leader line for Target
    svg
      .append("line")
      .attr("x1", targetX)
      .attr("y1", targetY)
      .attr("x2", Math.sin(targetAngle) * (tarLabelR - 10))
      .attr("y2", -Math.cos(targetAngle) * (tarLabelR - 10))
      .attr("stroke", "#a8a29e")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2 2");

    // Manual Offset for Wedding Label
    const wedOffsetX = -5;
    const wedOffsetY = isMobile ? 12 : 16;

    tarGroup
      .append("text")
      .attr("x", tarLabelX + wedOffsetX)
      .attr("y", tarLabelY + wedOffsetY)
      .attr("text-anchor", "end")
      .attr(
        "class",
        "font-mono text-[9px] sm:text-[10px] md:text-xs font-bold text-stone-300 fill-current tracking-widest",
      )
      .text(t.seasonal.wedding);

    tarGroup
      .append("text")
      .attr("x", tarLabelX + wedOffsetX)
      .attr("y", tarLabelY + wedOffsetY + (isMobile ? 12 : 16))
      .attr("text-anchor", "end")
      .attr(
        "class",
        "font-mono text-[8px] sm:text-[9px] md:text-[10px] text-stone-400 fill-current uppercase tracking-wider",
      )
      .text(
        targetDate
          .toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', { month: "short", day: "numeric" })
          .toUpperCase(),
      );
  }, [targetDate, resizeTrigger, t, locale]);

  return (
    <div className="h-full w-full flex flex-col items-center bg-stone-950 text-stone-200 relative overflow-hidden pt-28 sm:pt-32 px-4">
      {/* 1. Module Title */}
      <h2 className={`${typography.header.module} text-center z-10 mb-2`}>
        {t.seasonal.header}
      </h2>

      {/* 2. Visualization Area (In Flow) */}
      <div ref={containerRef} className="flex-1 w-full min-h-0 z-0" />

      {/* 3. Footer Spacer (to clear bounce arrow) */}
      <div className="pb-14 sm:pb-32" />
    </div>
  );
};

export default SeasonalDialModule;
