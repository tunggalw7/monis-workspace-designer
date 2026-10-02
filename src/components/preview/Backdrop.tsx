import { STAGE } from "./layout";

/** Static Bali-ish scenery behind the workspace: an arched window and the platform. */
export function Backdrop({ width, offsetX }: { width: number; offsetX: number }) {
  const { height, floorY } = STAGE;
  const center = offsetX + STAGE.width / 2;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd6d2" />
          <stop offset="0.65" stopColor="#e9f3e8" />
          <stop offset="0.66" stopColor="#2a8c8c" />
          <stop offset="1" stopColor="#3b9e9a" />
        </linearGradient>
        <clipPath id="bd-window">
          <path d="M14 84 V34 A21 21 0 0 1 56 34 V84 Z" />
        </clipPath>
      </defs>

      {/* A soft floor line, so extras beside the platform have somewhere to stand */}
      <rect
        x="0"
        y={floorY - 14}
        width={width}
        height={height - floorY + 14}
        fill="#f2e3cb"
        opacity="0.55"
      />

      {/* Arched window with sea view and palm fronds */}
      <g transform={`translate(${offsetX} 0)`}>
        <path d="M11 87 V34 A24 24 0 0 1 59 34 V87 Z" fill="#fffaf2" />
        <g clipPath="url(#bd-window)">
          <rect x="14" y="10" width="42" height="74" fill="url(#bd-sky)" />
          <circle cx="45" cy="30" r="5" fill="#ffd98a" />
          <path d="M18 84 C20 64 22 52 26 40" stroke="#6e4a30" strokeWidth="2" fill="none" />
          <g fill="#3f6b4a">
            <path d="M26 40 C18 36 12 38 8 44 C15 41 20 41 26 40 Z" />
            <path d="M26 40 C22 31 16 28 10 29 C17 32 21 35 26 40 Z" />
            <path d="M26 40 C30 31 37 28 43 30 C36 32 31 35 26 40 Z" />
            <path d="M26 40 C34 37 41 40 44 46 C38 42 32 41 26 40 Z" />
          </g>
        </g>
        <rect x="9" y="85" width="52" height="3" rx="1.5" fill="#e6d7c0" />
      </g>

      {/* Platform */}
      <ellipse cx={center} cy={floorY + 13} rx={114} ry={21} fill="#e6d1b1" />
      <ellipse cx={center} cy={floorY + 11} rx={106} ry={17} fill="#efdfc6" />
    </svg>
  );
}
