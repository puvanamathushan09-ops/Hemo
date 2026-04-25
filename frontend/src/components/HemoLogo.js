import React from "react";

// Hemo SVG Logo — blood drop with H letterform
export default function HemoLogo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Hemo Logo"
    >
      <defs>
        <linearGradient id="hemo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#9b111e" />
        </linearGradient>
        <filter id="hemo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Blood drop shape */}
      <path
        d="M20 4 C20 4 8 17 8 25.5 C8 32.4 13.4 38 20 38 C26.6 38 32 32.4 32 25.5 C32 17 20 4 20 4Z"
        fill="url(#hemo-grad)"
        filter="url(#hemo-glow)"
      />
      {/* H letterform cut-out / inner highlight */}
      <path
        d="M14.5 19 L14.5 30 M14.5 24.5 L25.5 24.5 M25.5 19 L25.5 30"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
