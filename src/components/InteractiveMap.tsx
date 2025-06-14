"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "@/app/styles.css";
import { TbAdjustments } from "react-icons/tb";
import { MdOutlineZoomInMap } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const baseTransform = useRef<d3.ZoomTransform | null>(null);
  const zoomRef = useRef<any>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const availableYears = [2015, 2019, 2021, 2023, 2025];
  const [selectedYear, setSelectedYear] = useState<number>(
    Math.max(...availableYears)
  );
  const [selectedRidingId, setSelectedRidingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"Ridings" | "Gradient">("Ridings");
  const [displayMode, setDisplayMode] = useState<"Straight" | "Battleground">(
    "Straight"
  );
  const [showOptions, setShowOptions] = useState(false);
  const isFirstLoad = useRef(true);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({ visible: false, x: 0, y: 0, content: null });

  const handleZoomOut = () => {
    if (!svgRef.current || !gRef.current || !zoomRef.current) {
      console.log("No svgRef.current || !gRef.current || !zoomRef.current");
      return;
    }

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const bbox = g.node()?.getBBox();
    const svgWidth = svgRef.current.clientWidth ?? 800;
    const svgHeight = svgRef.current.clientHeight ?? 600;

    if (bbox && svgWidth && svgHeight) {
      const scale =
        0.9 * Math.min(svgWidth / bbox.width, svgHeight / bbox.height);
      const translateX = svgWidth / 2 - (bbox.x + bbox.width / 2) * scale;
      const translateY = svgHeight / 2 - (bbox.y + bbox.height / 2) * scale;

      const transform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale);

      svg
        .transition()
        .duration(750)
        .ease(d3.easeCubicInOut)
        .call(zoomRef.current.transform, transform);
    }
  };

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

    // Only declare zoom once
    if (!zoomRef.current) {
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 20])
        .filter((event) => event.type !== "wheel")
        .translateExtent([
          [-100, -100],
          [
            svg.node()?.clientWidth ?? 800 + 100,
            svg.node()?.clientHeight ?? 600 + 100,
          ],
        ])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });
      svg.call(zoom);
      zoomRef.current = zoom;
    }

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
          .on("mouseover", function (event) {
            d3.select(this).style("filter", "brightness(1.2)");
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
            setTooltip({
              visible: true,
              x: event.pageX,
              y: event.pageY,
              content: (
                <div>
                  <div className="font-bold mb-1">{riding}</div>
                  <div className="mb-1">
                    {candidates.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-sm"
                          style={{ background: c.color }}
                        ></span>
                        <span>{c.name}</span>
                        <span className="ml-2 font-mono">{c.vote}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Incumbent:</span>{" "}
                    {incumbent}
                  </div>
                </div>
              ),
            });
          })
          .on("mousemove", function (event) {
            setTooltip((t) => ({ ...t, x: event.pageX, y: event.pageY }));
          })
          .on("mouseout", function () {
            d3.select(this).style("filter", "none");
            setTooltip((t) => ({ ...t, visible: false }));
          })
          .on("click", function (event: MouseEvent) {
            const path = d3.select(event.currentTarget as SVGGraphicsElement);
            const regionId = path.attr("id");
            const regionName = path.attr("data-ed_namee");
            setShowOptions(false);

            if (regionId) {
              setSelectedRidingId(regionId);
              onRegionClick(regionId);
            }

            // Zoom behavior
            const bbox = (event.currentTarget as SVGGraphicsElement).getBBox();
            const svgWidth = svgRef.current?.clientWidth ?? 800;
            const svgHeight = svgRef.current?.clientHeight ?? 600;
            const scale =
              0.8 * Math.min(svgWidth / bbox.width, svgHeight / bbox.height);
            const translateX = svgWidth / 2 - (bbox.x + bbox.width / 2) * scale;
            const translateY =
              svgHeight / 2 - (bbox.y + bbox.height / 2) * scale;

            const transform = d3.zoomIdentity
              .translate(translateX, translateY)
              .scale(scale);
            svg
              .transition()
              .duration(750)
              .call(zoomRef.current.transform, transform);
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

              // Store the base transform for zoom out
              baseTransform.current = transform;

              svg.call(zoomRef.current.transform, transform);
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
      <button
        className="absolute top-8 left-10 p-2 rounded-full bg-gray-600 text-white hover:bg-blue-700 shadow transition z-10"
        onClick={() => setShowOptions(!showOptions)}
        title="Toggle Options"
      >
        <TbAdjustments size={20} />
      </button>
      <button
        className="absolute bottom-10 left-10 p-2 rounded-full bg-gray-600 text-white hover:bg-blue-700 shadow transition z-10"
        onClick={() => {
          handleZoomOut();
        }}
        title="Zoom Out"
      >
        <MdOutlineZoomInMap size={20} />
      </button>
      {showOptions && (
        <div
          ref={optionsRef}
          className="map-toggle-container"
          style={{ position: "absolute", top: "4px", left: "72px" }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="toggle-label">Normal</span>
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setDisplayMode(
                      e.target.checked ? "Battleground" : "Straight"
                    )
                  }
                />
                <span className="slider custom-toggle"></span>
              </label>
              <span className="toggle-label">Battleground</span>
            </div>
            <div className="flex items-center gap-2">
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
            <div className="year-select flex items-center gap-2">
              <label htmlFor="year" className="block mb-0">
                Select Year:
              </label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(val) => setSelectedYear(Number(val))}
              >
                <SelectTrigger className="w-[120px] bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2">
                  <SelectValue className="text-black" />
                </SelectTrigger>
                <SelectContent className="z-[9999] bg-white border border-gray-200 rounded shadow-lg">
                  {[...availableYears]
                    .sort((a, b) => b - a)
                    .map((year) => (
                      <SelectItem
                        key={year}
                        value={year.toString()}
                        className="hover:bg-blue-100 focus:bg-blue-200"
                      >
                        {year}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      <svg
        ref={svgRef}
        id="map"
        className="h-full w-full"
        onClick={() => setShowOptions(false)}
      >
        <g ref={gRef} />
      </svg>
      {tooltip.visible && (
        <div
          className="fixed pointer-events-none z-[99999] bg-white/95 text-black rounded shadow-lg px-4 py-2 text-sm"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
