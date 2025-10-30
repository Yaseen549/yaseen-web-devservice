"use client";

import React, { useState, useEffect } from "react";
// import { useTheme } from "next-themes";
import Link from "next/link";

// --- Circuit Paths & Nodes ---
const predefinedPaths = [
  { d: "M 0 0 L 0 60 L 70 60" },
  { d: "M 40 0 L 40 40 L 80 40 L 80 80" },
  { d: "M 200 0 L 200 60 L 130 60" },
  { d: "M 160 0 L 160 40 L 120 40 L 120 80" },
  { d: "M 0 200 L 0 140 L 70 140" },
  { d: "M 40 200 L 40 160 L 80 160 L 80 120" },
  { d: "M 200 200 L 200 140 L 130 140" },
  { d: "M 160 200 L 160 160 L 120 160 L 120 120" },
  { d: "M 80 80 L 120 80" },
  { d: "M 80 120 L 120 120" },
  { d: "M 80 80 L 80 120" },
  { d: "M 120 80 L 120 120" },
];

const nodeCoordinates = [
  { cx: 0, cy: 0 }, { cx: 200, cy: 0 },
  { cx: 0, cy: 200 }, { cx: 200, cy: 200 },
  { cx: 40, cy: 0 }, { cx: 160, cy: 0 },
  { cx: 40, cy: 200 }, { cx: 160, cy: 200 },
  { cx: 80, cy: 80 }, { cx: 120, cy: 80 },
  { cx: 80, cy: 120 }, { cx: 120, cy: 120 },
  { cx: 70, cy: 60 }, { cx: 130, cy: 60 },
  { cx: 70, cy: 140 }, { cx: 130, cy: 140 },
];

// --- AiCircuitIcon without glow ---
export const AiCircuitIcon = React.memo(({ className, traceWidth = 6.5, pulseWidth = 8.5, fontSize = 130 }) => {
  // const { theme } = useTheme();

  // --- FIX: Use state to hold random values ---
  // Initialize with an empty array.
  const [animationValues, setAnimationValues] = useState([]);

  // --- FIX: Generate random values only on the client after mount ---
  useEffect(() => {
    // This code only runs in the browser, *after* hydration.
    setAnimationValues(
      predefinedPaths.map(() => ({
        dur: `${2 + Math.random() * 2}s`,
        begin: `${Math.random() * 2}s`,
      }))
    );
  }, []); // Empty dependency array `[]` ensures this runs only once.

  const colors = {
    dark: { trace: "currentColor", pulse: "#00E5FF", text: "currentColor", node: "#60efffff", bg: "#000000" },
    light: { trace: "currentColor", pulse: "#0056b3", text: "currentColor", node: "#0056b3", bg: "#ffffff" },
  };

  const currentColors = colors.dark;

  return (
    <svg
      className={className}
      viewBox="-5 -5 210 210"   // add 5px padding around edges
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"     // ensures strokes outside edges are visible
    >
      {/* Background */}
      <rect x="0" y="0" width="200" height="200" fill={currentColors.bg} />

      <g fill="none" strokeLinecap="round">
        {/* Static traces */}
        <g stroke={currentColors.trace} strokeWidth={traceWidth} strokeOpacity={0.4}>
          {predefinedPaths.map((path, idx) => (
            <path key={`trace-${idx}`} d={path.d} />
          ))}
        </g>

        {/* Pulses */}
        <g stroke={currentColors.pulse} strokeWidth={pulseWidth}>
          {predefinedPaths.map((path, idx) => (
            <path key={`pulse-${idx}`} d={path.d} strokeDasharray="5 50">

              {/* --- FIX: Only render <animate> if values exist (client-side) --- */}
              {/* This ensures the server renders no <animate> tags, matching the initial client render */}
              {animationValues.length > 0 && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="55"
                  to="-55"
                  dur={animationValues[idx].dur}
                  begin={animationValues[idx].begin}
                  repeatCount="indefinite"
                />
              )}
            </path>
          ))}
        </g>

        {/* Nodes */}
        <g fill={currentColors.node}>
          {nodeCoordinates.map((node, idx) => (
            <circle key={`node-${idx}`} cx={node.cx} cy={node.cy} r="3.5" />
          ))}
        </g>

        {/* Central text */}
        <text
          x="50%" y="51%"
          fill={"white"}
          fontSize={fontSize}
          fontFamily="monospace, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          AI
        </text>
      </g>
    </svg>

  );
});

AiCircuitIcon.displayName = "AiCircuitIcon";
export default AiCircuitIcon;
