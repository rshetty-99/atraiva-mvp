"use client";

import React, { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { US_STATES_MAP } from "@/types/state-regulation";
import type { StateBreachData, BreachStatus } from "@/lib/breach/server-fetch";

// US States GeoJSON URL (using a public CDN)
const geoUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type BreachMapProps = {
  breachCountsByState: Record<string, StateBreachData>;
};

// Status colors - Using completely different palette from map intensity
// Map uses: light blue → medium blue → orange → red (for TOTAL COUNT intensity)
// Status uses: pastel/muted colors to clearly distinguish from map colors
const statusColors: Record<BreachStatus, string> = {
  reported: "#EC4899", // Pink/Magenta (distinct from map red)
  investigating: "#F59E0B", // Amber (distinct from map orange)
  contained: "#8B5CF6", // Purple (completely different from map blue)
  resolved: "#10B981", // Green (not used in map)
  closed: "#94A3B8", // Slate Blue (distinct from map gray)
};

const statusLabels: Record<BreachStatus, string> = {
  reported: "Reported",
  investigating: "Investigating",
  contained: "Contained",
  resolved: "Resolved",
  closed: "Closed",
};

// Color scale function
function getColorForCount(count: number, maxCount: number): string {
  if (count === 0) return "#E5E7EB"; // Gray for no breaches
  
  // Calculate intensity (0 to 1)
  const intensity = Math.min(count / Math.max(maxCount, 1), 1);
  
  // Color gradient: Light blue/teal → Medium blue → Orange → Red
  if (intensity < 0.25) {
    // Light blue/teal for low counts
    const t = intensity / 0.25;
    return `rgb(${Math.round(224 + t * (96 - 224))}, ${Math.round(242 + t * (165 - 242))}, ${Math.round(254 + t * (250 - 254))})`;
  } else if (intensity < 0.5) {
    // Medium blue
    const t = (intensity - 0.25) / 0.25;
    return `rgb(${Math.round(96 + t * (59 - 96))}, ${Math.round(165 + t * (130 - 165))}, ${Math.round(250 + t * (246 - 250))})`;
  } else if (intensity < 0.75) {
    // Orange/amber
    const t = (intensity - 0.5) / 0.25;
    return `rgb(${Math.round(59 + t * (245 - 59))}, ${Math.round(130 + t * (158 - 130))}, ${Math.round(246 + t * (11 - 246))})`;
  } else {
    // Red for high counts
    const t = (intensity - 0.75) / 0.25;
    return `rgb(${Math.round(245 + t * (239 - 245))}, ${Math.round(158 + t * (68 - 158))}, ${Math.round(11 + t * (68 - 11))})`;
  }
}

export function BreachMap({ breachCountsByState }: BreachMapProps) {
  const [tooltipContent, setTooltipContent] = useState<{
    state: string;
    data: StateBreachData;
    x: number;
    y: number;
  } | null>(null);

  // Calculate max count for color scaling
  const maxCount = useMemo(() => {
    return Math.max(
      ...Object.values(breachCountsByState).map((data) => data.total),
      1
    );
  }, [breachCountsByState]);

  // Get total breaches
  const totalBreaches = useMemo(() => {
    return Object.values(breachCountsByState).reduce(
      (sum, data) => sum + data.total,
      0
    );
  }, [breachCountsByState]);

  // Get totals by status
  const totalsByStatus = useMemo(() => {
    const totals: Record<BreachStatus, number> = {
      reported: 0,
      investigating: 0,
      contained: 0,
      resolved: 0,
      closed: 0,
    };
    Object.values(breachCountsByState).forEach((data) => {
      Object.entries(data.byStatus).forEach(([status, count]) => {
        totals[status as BreachStatus] += count;
      });
    });
    return totals;
  }, [breachCountsByState]);

  // Helper to find state code from GeoJSON properties
  const findStateCode = (geo: any): string | null => {
    const props = geo.properties;
    // Try full state name first
    if (props.name) {
      const matchingState = Object.entries(US_STATES_MAP).find(
        ([, name]) => name === props.name
      );
      if (matchingState) return matchingState[0];
    }
    // Try abbreviation (might be in id or other properties)
    if (props.id && props.id.length === 2) {
      const upperId = props.id.toUpperCase();
      if (upperId in US_STATES_MAP) return upperId;
    }
    // Try other common property names
    const possibleKeys = ['state', 'STATE', 'stateCode', 'state_code'];
    for (const key of possibleKeys) {
      if (props[key] && props[key].length === 2) {
        const upper = props[key].toUpperCase();
        if (upper in US_STATES_MAP) return upper;
      }
    }
    return null;
  };

  // Handle geography click/hover
  const handleGeographyClick = (geo: any) => {
    const stateCode = findStateCode(geo);
    if (stateCode) {
      const data = breachCountsByState[stateCode] || {
        total: 0,
        byStatus: {
          reported: 0,
          investigating: 0,
          contained: 0,
          resolved: 0,
          closed: 0,
        },
      };
      // You could show a modal or navigate here
      console.log(`${US_STATES_MAP[stateCode]}: ${data.total} breaches`, data.byStatus);
    }
  };

  const handleGeographyMouseEnter = (geo: any, event: React.MouseEvent) => {
    const stateCode = findStateCode(geo);
    if (stateCode) {
      const data = breachCountsByState[stateCode] || {
        total: 0,
        byStatus: {
          reported: 0,
          investigating: 0,
          contained: 0,
          resolved: 0,
          closed: 0,
        },
      };
      setTooltipContent({
        state: US_STATES_MAP[stateCode],
        data,
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleGeographyMouseLeave = () => {
    setTooltipContent(null);
  };

  return (
    <div className="relative w-full">
      {/* Map Container */}
      <div className="relative w-full bg-muted/10 rounded-lg overflow-hidden border border-border">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{
            scale: 1000,
            center: [0, 0],
          }}
          width={800}
          height={500}
          style={{ width: "100%", height: "auto" }}
          viewBox="0 0 800 500"
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateCode = findStateCode(geo);
                  const data = stateCode
                    ? breachCountsByState[stateCode] || {
                        total: 0,
                        byStatus: {
                          reported: 0,
                          investigating: 0,
                          contained: 0,
                          resolved: 0,
                          closed: 0,
                        },
                      }
                    : {
                        total: 0,
                        byStatus: {
                          reported: 0,
                          investigating: 0,
                          contained: 0,
                          resolved: 0,
                          closed: 0,
                        },
                      };
                  const fillColor = getColorForCount(data.total, maxCount);
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#1F2937"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        },
                        hover: {
                          fill: fillColor,
                          stroke: "#3B82F6",
                          strokeWidth: 2,
                          outline: "none",
                        },
                        pressed: {
                          fill: fillColor,
                          stroke: "#2563EB",
                          strokeWidth: 2,
                          outline: "none",
                        },
                      }}
                      onClick={() => handleGeographyClick(geo)}
                      onMouseEnter={(e) => handleGeographyMouseEnter(geo, e)}
                      onMouseLeave={handleGeographyMouseLeave}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-50 bg-background border border-border rounded-lg px-4 py-3 shadow-lg pointer-events-none min-w-[200px]"
          style={{
            left: `${tooltipContent.x + 10}px`,
            top: `${tooltipContent.y - 10}px`,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-semibold text-foreground mb-2">{tooltipContent.state}</div>
          <div className="text-base font-semibold text-foreground mb-2">
            Total: {tooltipContent.data.total} {tooltipContent.data.total === 1 ? "breach" : "breaches"}
          </div>
          <div className="space-y-1.5 border-t border-border pt-2">
            <div className="text-xs text-muted-foreground mb-1 font-medium">Status Breakdown:</div>
            {Object.entries(tooltipContent.data.byStatus).map(([status, count]) => {
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full ring-1 ring-border/50"
                      style={{ backgroundColor: statusColors[status as BreachStatus] }}
                    />
                    <span className="text-muted-foreground">
                      {statusLabels[status as BreachStatus]}:
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-col gap-6">
        {/* Total and Count Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">
            Breaches by State
          </h3>
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{totalBreaches}</span> breaches
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Breaches by Status</h4>
            <span className="text-xs text-muted-foreground italic">(Status breakdown, not map colors)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(statusLabels).map(([status, label]) => {
              const count = totalsByStatus[status as BreachStatus];
              return (
                <div
                  key={status}
                  className="flex items-center gap-2 p-2 rounded bg-background/50"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-border"
                    style={{ backgroundColor: statusColors[status as BreachStatus] }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm font-semibold text-foreground">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Color Intensity Legend */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Map Color Intensity:</span>
            <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getColorForCount(0, maxCount) }}
            />
            <span className="text-sm text-muted-foreground">0</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getColorForCount(Math.ceil(maxCount * 0.25), maxCount) }}
            />
            <span className="text-sm text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getColorForCount(Math.ceil(maxCount * 0.5), maxCount) }}
            />
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getColorForCount(Math.ceil(maxCount * 0.75), maxCount) }}
            />
            <span className="text-sm text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getColorForCount(maxCount, maxCount) }}
            />
            <span className="text-sm text-muted-foreground">Very High</span>
          </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Hover over a state to see the breach count and status breakdown
          </p>
        </div>
      </div>
    </div>
  );
}

