import { PACKAGES, type Pkg } from "@/lib/packages";

export const TRACK_D =
  "M 790 578 C 850 560 900 510 933 482 C 990 430 1000 370 1025 345 C 1070 300 1120 290 1188 238 C 1280 175 1380 150 1435 120 C 1480 95 1560 100 1555 70 C 1550 50 1500 82 1450 82 L 520 82 C 480 82 470 110 467 122 L 403 136 C 360 170 330 230 308 318 C 270 420 200 600 160 750 C 140 850 130 920 192 920 C 250 920 260 860 258 677 C 255 600 250 570 276 582 L 337 538 C 380 520 390 600 398 613 C 430 600 500 560 528 551 C 520 500 460 400 445 299 C 470 240 520 210 540 195 C 600 230 680 400 790 578 Z";

const TURNS: [string, number, number][] = [
  ["1", 790, 610], ["2", 960, 500], ["3", 1060, 360], ["4", 1200, 270], ["5", 1420, 150],
  ["6", 470, 160], ["7", 400, 170], ["8", 345, 330], ["9", 192, 955], ["10", 290, 700],
  ["11", 270, 620], ["12", 335, 505], ["13", 400, 650], ["14", 560, 575], ["15", 410, 300], ["16", 560, 170],
];

export function CircuitMap({
  active,
  onSelect,
  className = "",
}: {
  active?: string;
  onSelect?: (p: Pkg) => void;
  className?: string;
}) {
  return (
    <svg viewBox="-40 0 1660 1000" className={className} role="img" aria-label="Yas Marina Circuit map">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* grid */}
      {Array.from({ length: 17 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1000" stroke="currentColor" strokeOpacity="0.05" />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={`h${i}`} x1="-40" y1={i * 100} x2="1620" y2={i * 100} stroke="currentColor" strokeOpacity="0.05" />
      ))}
      <path d={TRACK_D} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="26" strokeLinejoin="round" />
      <path d={TRACK_D} fill="none" stroke="currentColor" strokeOpacity="0.9" strokeWidth="5" strokeLinejoin="round" />
      {/* comet trail — three layers fading from tail to head */}
      <path
        d={TRACK_D}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.15"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={1000}
        strokeDasharray="150 850"
      >
        <animate attributeName="stroke-dashoffset" from="164" to="-836" dur="7s" repeatCount="indefinite" />
      </path>
      <path
        d={TRACK_D}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.45"
        strokeWidth="6"
        strokeLinecap="round"
        pathLength={1000}
        strokeDasharray="60 940"
      >
        <animate attributeName="stroke-dashoffset" from="74" to="-926" dur="7s" repeatCount="indefinite" />
      </path>
      <path
        d={TRACK_D}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={1000}
        strokeDasharray="14 986"
      >
        <animate attributeName="stroke-dashoffset" from="14" to="-986" dur="7s" repeatCount="indefinite" />
      </path>
      <g filter="url(#glow)">
        <circle r="4.5" fill="var(--primary)">
          <animateMotion dur="7s" repeatCount="indefinite" path={TRACK_D} />
        </circle>
        <circle r="1.8" fill="var(--primary-foreground)" opacity="0.9">
          <animateMotion dur="7s" repeatCount="indefinite" path={TRACK_D} />
        </circle>
      </g>
      {TURNS.map(([n, x, y]) => (
        <g key={n} opacity="0.55">
          <circle cx={x} cy={y} r="17" fill="var(--background)" stroke="currentColor" strokeOpacity="0.5" />
          <text x={x} y={y + 6} textAnchor="middle" fontSize="16" fill="currentColor" fontFamily="var(--font-mono)">
            {n}
          </text>
        </g>
      ))}
      {PACKAGES.map((p) => {
        const on = active === p.id;
        return (
          <g
            key={p.id}
            transform={`translate(${p.pin.x} ${p.pin.y})`}
            className="cursor-pointer"
            onMouseEnter={() => onSelect?.(p)}
            onClick={() => onSelect?.(p)}
          >
            {on && (
              <circle r="30" fill="var(--primary)" opacity="0.5" className="animate-pulse-ring" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
            )}
            <rect
              x="-28"
              y="-22"
              width="56"
              height="44"
              fill={on ? "var(--primary)" : "var(--background)"}
              stroke="var(--primary)"
              strokeWidth="3"
              style={{ transition: "fill .3s" }}
            />
            <text
              y="9"
              textAnchor="middle"
              fontSize="24"
              fontWeight="600"
              fill={on ? "var(--primary-foreground)" : "var(--primary)"}
              fontFamily="var(--font-mono)"
            >
              {p.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
