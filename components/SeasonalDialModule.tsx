import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { TimeModuleProps } from "../types";
import { Snowflake, Flower2, Sun, Leaf } from "lucide-react";
import { createRoot } from "react-dom/client";
import { getModuleHeaderClass, typography, vibes, getVibeClass } from "../designSystem";
import { useT, useLocale } from "../i18n";

const SeasonalDialModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizeTrigger, setResizeTrigger] = useState(0);
  const t = useT();
  const [locale] = useLocale();
  const vibe = 'elemental';

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

    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    const centerYOffset = isMobile ? 0 : 20;

    let radiusScale = 0.45;
    if (isMobile) radiusScale = 0.28;
    else if (isTablet) radiusScale = 0.3;

    const radius = Math.min(width, height) * radiusScale;

    // Clear previous
    d3.select(containerRef.current).selectAll("*").remove();

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
        color: '#94a3b8' // slate-400 (frosty)
      },
      {
        name: t.seasonal.spring,
        startAngle: Math.PI / 2,
        endAngle: Math.PI,
        labelAngle: (3 * Math.PI) / 4,
        color: '#4ade80' // green-400 (bloom)
      },
      {
        name: t.seasonal.summer,
        startAngle: Math.PI,
        endAngle: (3 * Math.PI) / 2,
        labelAngle: (5 * Math.PI) / 4,
        color: '#fbbf24' // amber-400 (sun)
      },
      {
        name: t.seasonal.fall,
        startAngle: (3 * Math.PI) / 2,
        endAngle: 2 * Math.PI,
        labelAngle: (7 * Math.PI) / 4,
        color: '#c2410c' // orange-700 (earth/leaves)
      },
    ];

    // --- DRAW BASE DIAL ---
    svg
      .append("circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#334155") // slate-700
      .attr("stroke-width", 1);

    // Crosshairs
    svg
      .selectAll(".crosshair")
      .data([0, Math.PI / 2])
      .enter()
      .append("line")
      .attr("x1", (d) => Math.sin(d) * -radius)
      .attr("y1", (d) => -Math.cos(d) * -radius)
      .attr("x2", (d) => Math.sin(d) * radius)
      .attr("y2", (d) => -Math.cos(d) * radius)
      .attr("stroke", "#1e293b") // slate-800
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2 6");

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
        "font-serif text-[10px] sm:text-base md:text-lg text-emerald-100/30 fill-current uppercase tracking-[0.3em] italic select-none",
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
    const iconOffset = isMobile ? 0.35 : 0.4;

    seasonIcons.forEach((season, i) => {
      const seasonData = seasons[i];
      const iconX = Math.sin(seasonData.labelAngle) * (radius * iconOffset);
      const iconY = -Math.cos(seasonData.labelAngle) * (radius * iconOffset);

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
          className="text-emerald-400"
          style={{ opacity: 0.4 }}
          strokeWidth={1.5}
        />,
      );
    });

    // --- SOLSTICE / EQUINOX LABELS ---
    const labelSpacing = isMobile ? 12 : 25;
    const dateLocale = locale === 'es' ? 'es-MX' : 'en-US';
    const fmtDate = (m: number, d: number) =>
      new Date(2026, m, d).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' }).toUpperCase();

    const cardinalLabels = [
      {
        name: t.seasonal.winterSolstice,
        date: fmtDate(11, 21),
        angle: 0,
        align: "middle",
        dy: -labelSpacing - 15,
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
        dy: labelSpacing + 12,
        dx: 0,
      },
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

        const words = d.name.split(' ');
        let lines = [];
        if (words.length > 1) {
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
            "font-serif text-[9px] sm:text-[11px] md:text-sm text-emerald-200 fill-current italic tracking-wide",
          );

        lines.forEach((line, i) => {
          nameEl.append("tspan")
            .attr("x", textX)
            .attr("dy", i === 0 ? 0 : "1.2em")
            .text(line);
        });

        g.append("text")
          .attr("x", textX)
          .attr("y", textY + (lines.length * (isMobile ? 10 : 14)))
          .attr("text-anchor", d.align)
          .attr(
            "class",
            "font-sans text-[8px] sm:text-[9px] md:text-[10px] text-emerald-400/60 fill-current tracking-[0.2em]",
          )
          .text(d.date);
      });

    // --- CALCULATE CURRENT PROGRESS ---
    const now = new Date();
    const year = now.getFullYear();

    let lastWinterSolstice = new Date(year, 11, 21);
    if (now < lastWinterSolstice) {
      lastWinterSolstice = new Date(year - 1, 11, 21);
    }
    const nextWinterSolstice = new Date(lastWinterSolstice.getFullYear() + 1, 11, 21);
    const daysInYearCycle = (nextWinterSolstice.getTime() - lastWinterSolstice.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (now.getTime() - lastWinterSolstice.getTime()) / (1000 * 60 * 60 * 24);
    const cycleProgress = daysPassed / daysInYearCycle;
    const currentAngle = cycleProgress * 2 * Math.PI;

    // Active Season for Arc
    let activeSeasonIndex = 0;
    if (currentAngle < Math.PI / 2) activeSeasonIndex = 0;
    else if (currentAngle < Math.PI) activeSeasonIndex = 1;
    else if (currentAngle < (3 * Math.PI) / 2) activeSeasonIndex = 2;
    else activeSeasonIndex = 3;

    const activeSeason = seasons[activeSeasonIndex];

    const fillRadius = radius * 0.95;
    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(fillRadius)
      .startAngle(activeSeason.startAngle)
      .endAngle(currentAngle);

    svg.append("path")
      .attr("d", arcGenerator as any)
      .attr("fill", activeSeason.color)
      .attr("opacity", 0.05);

    // Current Date Line
    const currentX = Math.sin(currentAngle) * radius;
    const currentY = -Math.cos(currentAngle) * radius;

    svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", currentX)
      .attr("y2", currentY)
      .attr("stroke", activeSeason.color)
      .attr("stroke-width", 2)
      .attr("opacity", 0.8);

    // Label for You Are Here
    const curExtension = isMobile ? 35 : 70;
    const curLabelR = radius + curExtension;
    const curLabelX = Math.sin(currentAngle) * curLabelR;
    const curLabelY = -Math.cos(currentAngle) * curLabelR;

    const curGroup = svg.append("g");
    curGroup.append("text")
      .attr("x", curLabelX)
      .attr("y", curLabelY)
      .attr("text-anchor", "middle")
      .attr("class", "font-serif text-[10px] sm:text-base italic text-emerald-100 fill-current tracking-tight")
      .text(t.seasonal.youAreHere);

    curGroup.append("text")
      .attr("x", curLabelX)
      .attr("y", curLabelY + (isMobile ? 12 : 18))
      .attr("text-anchor", "middle")
      .attr("class", "font-sans text-[8px] sm:text-[10px] text-emerald-400 fill-current tracking-widest font-bold")
      .text(now.toLocaleDateString(dateLocale, { month: "short", day: "numeric" }).toUpperCase());

    // --- WEDDING TARGET MARKER ---
    const tYear = targetDate.getFullYear();
    let targetWS = new Date(tYear, 11, 21);
    if (targetDate < targetWS) {
      targetWS = new Date(tYear - 1, 11, 21);
    }
    const nextTargetWS = new Date(targetWS.getFullYear() + 1, 11, 21);
    const targetCycleDays = (nextTargetWS.getTime() - targetWS.getTime()) / (1000 * 60 * 60 * 24);
    const targetDaysPassed = (targetDate.getTime() - targetWS.getTime()) / (1000 * 60 * 60 * 24);
    const targetAngle = (targetDaysPassed / targetCycleDays) * 2 * Math.PI;
    const targetX = Math.sin(targetAngle) * radius;
    const targetY = -Math.cos(targetAngle) * radius;

    svg.append("circle")
      .attr("cx", targetX)
      .attr("cy", targetY)
      .attr("r", 5)
      .attr("fill", "none")
      .attr("stroke", "#fbbf24") // amber-400 target glow
      .attr("stroke-width", 2);

    const tarExtension = isMobile ? 40 : 100;
    const tarLabelR = radius + tarExtension;
    const tarLabelX = Math.sin(targetAngle) * tarLabelR;
    const tarLabelY = -Math.cos(targetAngle) * tarLabelR;

    const tarGroup = svg.append("g");
    tarGroup.append("text")
      .attr("x", tarLabelX)
      .attr("y", tarLabelY)
      .attr("text-anchor", "middle")
      .attr("class", "font-serif text-[10px] sm:text-base italic text-amber-100 fill-current")
      .text(t.seasonal.wedding);

    tarGroup.append("text")
      .attr("x", tarLabelX)
      .attr("y", tarLabelY + (isMobile ? 12 : 18))
      .attr("text-anchor", "middle")
      .attr("class", "font-sans text-[8px] sm:text-[10px] text-amber-500 fill-current tracking-widest font-bold")
      .text(targetDate.toLocaleDateString(dateLocale, { month: "short", day: "numeric" }).toUpperCase());

  }, [targetDate, resizeTrigger, t, locale]);

  return (
    <div className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} relative overflow-hidden pt-28 sm:pt-32 px-4`}>
      <h2 className={`${getVibeClass(vibe, 'header')} text-center z-10 mb-2 sm:text-3xl`}>
        {t.seasonal.header}
      </h2>
      <div ref={containerRef} className="flex-1 w-full min-h-0 z-0" />
      <div className="pb-14 sm:pb-32" />
    </div>
  );
};

export default SeasonalDialModule;
