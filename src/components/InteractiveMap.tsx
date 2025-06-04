"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "@/app/styles.css";

interface InteractiveMapProps {
  onRegionClick: (region: string) => void;
}

type PartyKey = keyof typeof colorMap;

const colorMap = {
  Liberal: "#D41F27",
  Conservative: "#142F52",
  NDP: "#F58220",
  Green: "#20A242",
  Bloc: "#51A5E1",
  Other: "#808080",
} as const;

const InteractiveMap = ({ onRegionClick }: InteractiveMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const availableYears = [2015, 2019, 2021, 2023, 2025];
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRidingId, setSelectedRidingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"Ridings" | "Gradient">("Ridings");
  const [displayMode, setDisplayMode] = useState<"Straight" | "Battleground">(
    "Straight"
  );
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const svg = d3.select(svgRef.current) as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >;
    const g = d3.select(gRef.current) as d3.Selection<
      SVGGElement,
      unknown,
      null,
      undefined
    >;

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0, 0, 0, 0.75)")
      .style("color", "white")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-family", "sans-serif")
      .style("font-size", "13px")
      .style("display", "none");

    const svgWidth = svg?.node()?.clientWidth ?? 800;
    const svgHeight = svg?.node()?.clientHeight ?? 600;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 20])
      .translateExtent([
        [-100, -100],
        [svgWidth + 100, svgHeight + 100],
      ])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const filename = () => {
      if (viewMode === "Ridings" && displayMode === "Straight") {
        return selectedYear
          ? `${selectedYear}_Straight_Ridings.svg`
          : "2025_Straight_Ridings.svg";
      }
      if (viewMode === "Ridings" && displayMode === "Battleground") {
        return selectedYear
          ? `${selectedYear}_Battleground_Ridings.svg`
          : "2025_Battleground_Ridings.svg";
      }
      return "2025_Straight_Ridings.svg"; // Default fallback
    };

    const loadSvg = (file: string, shouldCenter = false) => {
      d3.xml(`/overlays/${file}`).then((data) => {
        g.selectAll("*").remove();
        const importedNode = document.importNode(data.documentElement, true);
        importedNode
          .querySelectorAll("path")
          .forEach((p) => g.node()?.appendChild(p));

        const selection = g.selectAll("path");

        selection
          .style("transition", "filter 0.2s ease")
          .on("mouseover", function () {
            d3.select(this).style("filter", "brightness(1.2)");
            tooltip.style("display", "block");
          })
          .on("mousemove", function (event) {
            const path = d3.select(this);
            const riding = path.attr("data-ed_namee") || "Unknown";
            const incumbent = path.attr("data-incumbent") || "";

            const candidates = [];
            for (let i = 1; i <= 5; i++) {
              const name = path.attr(`data-name${i}`);
              const vote = path.attr(`data-vote${i}`);
              const party = path.attr(`data-party${i}`);
              const color =
                path.attr(`data-color${i}`) ||
                (party && colorMap[party as PartyKey]) ||
                colorMap.Other;

              if (name && vote) candidates.push({ name, vote, color });
            }

            const candidateRows = candidates
              .map(
                (c) => `
              <div class="tooltip-row">
                <span class="color-box" style="background:${c.color}"></span>
                <span class="candidate-name">${c.name}</span>
                <span class="vote">${c.vote}</span>
              </div>`
              )
              .join("");

            tooltip
              .html(
                `
              <div class="tooltip-header">
                <strong>${riding}</strong>
                <span class="swing-icon">📊</span> <span class="swing-label">Vote %</span>
              </div>
              <div class="tooltip-body">${candidateRows}</div>
              <hr/>
              <div class="tooltip-incumbent">
                <span class="incumbent-icon">🟥</span> ${incumbent}
                <div class="incumbent-label">[this would be the incumbent's name]</div>
              </div>
            `
              )
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
          })
          .on("mouseout", function () {
            d3.select(this).style("filter", "none");
            tooltip.style("display", "none");
          })
          .on("click", function (event: MouseEvent) {
            const path = d3.select(event.currentTarget as SVGGraphicsElement);
            const regionId = path.attr("id");
            const regionName = path.attr("data-ed_namee");

            if (regionId) {
              setSelectedRidingId(regionId);
              onRegionClick(regionId);
            }

            // Zoom behavior
            const bbox = (event.currentTarget as SVGGraphicsElement).getBBox();
            const svgWidth = svg?.node()?.clientWidth ?? 800;
            const svgHeight = svg?.node()?.clientHeight ?? 600;
            const scale =
              0.8 * Math.min(svgWidth / bbox.width, svgHeight / bbox.height);
            const translateX = svgWidth / 2 - (bbox.x + bbox.width / 2) * scale;
            const translateY =
              svgHeight / 2 - (bbox.y + bbox.height / 2) * scale;

            const transform = d3.zoomIdentity
              .translate(translateX, translateY)
              .scale(scale);
            svg.transition().duration(750).call(zoom.transform, transform);
          });

        if (shouldCenter) {
          setTimeout(() => {
            const bbox = g.node()?.getBBox();
            const svgWidth = svg.node()?.clientWidth;
            const svgHeight = svg.node()?.clientHeight;
            if (bbox && svgWidth && svgHeight) {
              const scale =
                0.9 * Math.min(svgWidth / bbox.width, svgHeight / bbox.height);
              const translateX =
                (svgWidth - bbox.width * scale) / 2 - bbox.x * scale;
              const translateY =
                (svgHeight - bbox.height * scale) / 2 - bbox.y * scale;

              const transform = d3.zoomIdentity
                .translate(translateX, translateY)
                .scale(scale);
              svg.call(zoom.transform, transform);
            }
          }, 0);
        }
      });
    };

    loadSvg(filename(), isFirstLoad.current);
    isFirstLoad.current = false;
  }, [viewMode, displayMode, onRegionClick]);

  return (
    <div className="interactive-map-root h-full w-full min-h-0 min-w-0 flex flex-col relative p-4">
      <div className="map-toggle-container toggle-container absolute top-4 left-4">
        <div>
          <span className="toggle-label">Straight</span>
          <label className="switch">
            <input
              type="checkbox"
              onChange={(e) =>
                setDisplayMode(e.target.checked ? "Battleground" : "Straight")
              }
            />
            <span className="slider custom-toggle"></span>
          </label>
          <span className="toggle-label">Battleground</span>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <span className="toggle-label">Ridings</span>
          <label className="switch">
            <input
              type="checkbox"
              onChange={(e) =>
                setViewMode(e.target.checked ? "Gradient" : "Ridings")
              }
            />
            <span className="slider custom-toggle"></span>
          </label>
          <span className="toggle-label">Gradient</span>
        </div>
        <div className="year-select">
          <label htmlFor="year">Select Year:</label>
          <input
            type="text"
            id="year"
            list="year-options"
            value={selectedYear ?? ""}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) setSelectedYear(val);
              else setSelectedYear(null);
            }}
            placeholder="e.g., 2025"
          />
          <datalist id="year-options">
            {availableYears.map((year) => (
              <option key={year} value={year.toString()} />
            ))}
          </datalist>
        </div>
      </div>

      <svg ref={svgRef} id="map" className="h-full w-full">
        <g ref={gRef} />
      </svg>
    </div>
  );
};

export default InteractiveMap;
