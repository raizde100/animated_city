import { useEffect, useRef } from "react";
import type { Economy } from "../simulation";
export type BuildingData = {
  id: string;
  name: string;
  industry: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  color: string;
  roof: string;
  type:
    "home" | "business" | "government" | "school" | "clinic" | "farm" | "tech";
  appears: number;
  employees: number;
};
export type Selection =
  | { kind: "building"; data: BuildingData }
  | { kind: "worker"; id: number }
  | null;
export const project = (x: number, y: number, z = 0) => [
  555 + (x - y) * 29,
  55 + (x + y) * 14 - z,
];
const pt = (x: number, y: number, z = 0) => project(x, y, z).join(",");
const tile = (x: number, y: number, w: number, d: number, z = 0) =>
  `${pt(x, y, z)} ${pt(x + w, y, z)} ${pt(x + w, y + d, z)} ${pt(x, y + d, z)}`;
const palettes = [
  ["#e7ddc6", "#b17c61"],
  ["#eee5d0", "#91a38b"],
  ["#e3e0cc", "#c2a27a"],
  ["#e2d4be", "#956e58"],
];
const homes: BuildingData[] = Array.from({ length: 24 }, (_, i) => {
  const blocks = [
    [1, 1],
    [6.4, 1],
    [11.2, 1],
    [1, 6.5],
  ];
  const b = blocks[Math.floor(i / 6)];
  const [color, roof] = palettes[i % 4];
  return {
    id: `home-${i}`,
    name: `${i + 1} Willow Lane`,
    industry: "Household",
    x: b[0] + (i % 3) * 1.25,
    y: b[1] + Math.floor((i % 6) / 3) * 1.65,
    w: 1,
    d: 1.25,
    h: 22 + (i % 3) * 4,
    color,
    roof,
    type: "home",
    appears: 1,
    employees: 0,
  };
});
function business(
  id: string,
  name: string,
  industry: string,
  x: number,
  y: number,
  w: number,
  d: number,
  h: number,
  color: string,
  roof: string,
  type: BuildingData["type"] = "business",
  appears = 1,
  employees = 5,
): BuildingData {
  return {
    id,
    name,
    industry,
    x,
    y,
    w,
    d,
    h,
    color,
    roof,
    type,
    appears,
    employees,
  };
}
const businesses: BuildingData[] = [
  business(
    "townhall",
    "Commonwealth Town Hall",
    "Public administration",
    7.1,
    7.1,
    2.3,
    2.1,
    50,
    "#e9dfc6",
    "#789080",
    "government",
    1,
    6,
  ),
  business(
    "bakery",
    "Willow & Grain Bakery",
    "Food production",
    11.25,
    6.5,
    1.6,
    1.5,
    32,
    "#e7d8b8",
    "#b27954",
  ),
  business(
    "market",
    "Corner Market",
    "Retail",
    13.1,
    6.5,
    1.35,
    1.5,
    28,
    "#ecddbf",
    "#8e9b74",
  ),
  business(
    "cafe",
    "Sunday Café",
    "Hospitality",
    11.25,
    8.4,
    1.4,
    1.15,
    28,
    "#efddc6",
    "#be8863",
  ),
  business(
    "studio",
    "Oak Street Studio",
    "Design",
    13.2,
    8.4,
    1.35,
    1.2,
    36,
    "#ddded4",
    "#7f9285",
  ),
  business(
    "school",
    "Commonwealth School",
    "Education",
    6.7,
    11.1,
    2.35,
    1.8,
    36,
    "#e5dbbe",
    "#bb9164",
    "school",
  ),
  business(
    "clinic",
    "The Neighborhood Clinic",
    "Healthcare",
    11.2,
    11.2,
    1.5,
    1.5,
    40,
    "#eee8d8",
    "#8a9f93",
    "clinic",
  ),
  business(
    "logistics",
    "Northside Logistics",
    "Transportation",
    1.1,
    11.2,
    2.5,
    1.65,
    31,
    "#d8dbc9",
    "#869789",
  ),
  business(
    "mill",
    "Greenfield Mill",
    "Manufacturing",
    1.1,
    13.25,
    1.6,
    1.4,
    36,
    "#e4d6ba",
    "#aa7f5e",
  ),
  business(
    "farm",
    "Greenfield Farm",
    "Agriculture",
    2.2,
    8.6,
    1.3,
    1,
    24,
    "#e5d6b7",
    "#a16e55",
    "farm",
    1,
    8,
  ),
  business(
    "accounts",
    "Ledger & Co.",
    "Professional services",
    13.2,
    11.2,
    1.25,
    1.5,
    40,
    "#e8e1d1",
    "#9ca091",
  ),
  business(
    "software",
    "Good Future Software",
    "Software",
    11.2,
    13.25,
    1.55,
    1.6,
    68,
    "#b7cec4",
    "#607f75",
    "tech",
    12,
    8,
  ),
  business(
    "research",
    "The Discovery Lab",
    "Research",
    13.2,
    13.25,
    1.7,
    1.6,
    57,
    "#c8d9d1",
    "#718e83",
    "tech",
    16,
    7,
  ),
  business(
    "arts",
    "New Leaf Creative",
    "Creative industries",
    6.7,
    13.6,
    1.1,
    1,
    40,
    "#e2c6ad",
    "#af8064",
    "business",
    10,
    4,
  ),
  business(
    "startup",
    "Tomorrow Works",
    "Advanced manufacturing",
    8.2,
    13.6,
    1.2,
    1,
    48,
    "#c6cfbd",
    "#8b9c81",
    "tech",
    18,
    6,
  ),
  ...Array.from({ length: 7 }, (_, i) =>
    business(
      `new-${i}`,
      [
        "Bloom Financial",
        "The Learning House",
        "Motion Pictures",
        "Bright Energy",
        "Field Robotics",
        "Atelier North",
        "New Horizons",
      ][i],
      [
        "Finance",
        "Education",
        "Entertainment",
        "Energy",
        "Robotics",
        "Design",
        "Services",
      ][i],
      1.3 + (i % 3) * 1.3,
      15.5 + Math.floor(i / 3) * 1.2,
      1,
      1,
      30 + i * 4,
      "#d9dfca",
      ["#9da68a", "#97b3a4", "#b79671"][i % 3],
      "business",
      9 + i * 1.5,
      4 + i,
    ),
  ),
  ...Array.from({ length: 8 }, (_, i) =>
    business(
      `east-${i}`,
      [
        "Juniper Kitchen",
        "Community Care",
        "Studio Twenty",
        "Future Foods",
        "Open Research",
        "Next Chapter",
        "Connected City",
        "Green Ventures",
      ][i],
      [
        "Hospitality",
        "Healthcare",
        "Design",
        "Food technology",
        "Research",
        "Publishing",
        "Technology",
        "Finance",
      ][i],
      15.6 + (i % 2) * 1.1,
      1.2 + Math.floor(i / 2) * 1.35,
      0.9,
      1.05,
      30 + i * 4,
      "#dfe1d1",
      ["#91aaa0", "#b99c79"][i % 2],
      "business",
      10 + i * 1.2,
      5,
    ),
  ),
  ...Array.from({ length: 7 }, (_, i) =>
    business(
      `south-${i}`,
      [
        "Willow Finance",
        "Open Studio",
        "Solar Works",
        "Horizon Health",
        "Common Ground",
        "Thread & Co.",
        "Better Systems",
      ][i],
      [
        "Finance",
        "Design",
        "Energy",
        "Healthcare",
        "Education",
        "Creative industries",
        "Software",
      ][i],
      6.5 + (i % 4) * 2,
      16.2 + Math.floor(i / 4) * 1.2,
      1.4,
      0.85,
      30 + i * 5,
      "#d1dac9",
      ["#7f9b8b", "#b79875"][i % 2],
      "business",
      12 + i,
      5,
    ),
  ),
];
export const buildings = [...homes, ...businesses];
export function Building({
  data: b,
  selected,
  onSelect,
  year,
  infrastructure,
  technology,
  education,
}: {
  data: BuildingData;
  selected: boolean;
  onSelect: () => void;
  year: number;
  infrastructure: boolean;
  technology: number;
  education: number;
}) {
  const { x, y, w, d, h, color, roof } = b;
  const [cx, cy] = project(x + w / 2, y + d / 2, h);
  const home = b.type === "home" || b.type === "farm";
  const active =
    b.type === "tech" || (year >= 8 && technology > 0 && b.id === "bakery");
  return (
    <g
      className={`building ${b.appears > 1 ? "new-building" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${b.name}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <polygon
        points={tile(x - 0.15, y - 0.15, w + 0.3, d + 0.3)}
        fill={selected ? "#b8d495" : "#8a927b"}
        opacity={selected ? 0.65 : 0.12}
      />
      {selected && (
        <polygon
          points={tile(x - 0.2, y - 0.2, w + 0.4, d + 0.4)}
          fill="none"
          stroke="#537e5b"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      )}
      <polygon
        points={`${pt(x + w, y)} ${pt(x + w, y + d)} ${pt(x + w, y + d, h)} ${pt(x + w, y, h)}`}
        fill={color}
      />
      <polygon
        points={`${pt(x, y + d)} ${pt(x + w, y + d)} ${pt(x + w, y + d, h)} ${pt(x, y + d, h)}`}
        fill={color}
        style={{ filter: "brightness(.88)" }}
      />
      <polygon points={tile(x, y, w, d, h)} fill={roof} />
      {home ? (
        <>
          <polygon
            points={`${pt(x, y, h)} ${pt(x + w, y, h)} ${pt(x + w, y + d / 2, h + 14)} ${pt(x, y + d / 2, h + 14)}`}
            fill={roof}
            style={{ filter: "brightness(1.12)" }}
          />
          <polygon
            points={`${pt(x, y + d, h)} ${pt(x + w, y + d, h)} ${pt(x + w, y + d / 2, h + 14)} ${pt(x, y + d / 2, h + 14)}`}
            fill={roof}
          />
          <polygon
            points={`${pt(x + w, y, h)} ${pt(x + w, y + d, h)} ${pt(x + w, y + d / 2, h + 14)}`}
            fill={color}
          />
        </>
      ) : (
        <>
          <polygon
            points={tile(x + 0.08, y + 0.08, w - 0.16, d - 0.16, h + 3)}
            fill={roof}
          />
          <polygon
            points={tile(x + 0.15, y + 0.15, w - 0.3, d - 0.3, h + 3)}
            fill="#c5cbb2"
            opacity=".45"
          />
        </>
      )}
      {Array.from({ length: Math.max(1, Math.floor(h / 18)) }, (_, r) =>
        Array.from({ length: Math.max(1, Math.floor(w * 2)) }, (_, c) => {
          const a = x + 0.2 + c * 0.48;
          return (
            <polygon
              key={`${r}-${c}`}
              points={`${pt(a, y + d, 8 + r * 17)} ${pt(a + 0.23, y + d, 8 + r * 17)} ${pt(a + 0.23, y + d, 15 + r * 17)} ${pt(a, y + d, 15 + r * 17)}`}
              fill={home ? "#5c7870" : "#637c72"}
              opacity=".85"
            />
          );
        }),
      )}
      {Array.from({ length: Math.max(1, Math.floor(d * 1.5)) }, (_, c) => (
        <polygon
          key={c}
          points={`${pt(x + w, y + 0.2 + c * 0.6, 10)} ${pt(x + w, y + 0.48 + c * 0.6, 10)} ${pt(x + w, y + 0.48 + c * 0.6, 19)} ${pt(x + w, y + 0.2 + c * 0.6, 19)}`}
          fill="#6e8c80"
        />
      ))}
      <polygon
        points={`${pt(x + w * 0.48, y + d, 0)} ${pt(x + w * 0.7, y + d, 0)} ${pt(x + w * 0.7, y + d, 13)} ${pt(x + w * 0.48, y + d, 13)}`}
        fill="#8a7b61"
      />
      {b.type === "business" && h < 40 && (
        <>
          <polygon points={tile(x, y + d - 0.05, w, 0.35, 19)} fill={roof} />
          {Array.from({ length: 5 }, (_, i) => (
            <polygon
              key={i}
              points={tile(x + (i * w) / 5, y + d - 0.05, w / 10, 0.35, 19.1)}
              fill="#f1e9d6"
            />
          ))}
        </>
      )}
      {b.type === "government" && (
        <>
          <polygon
            points={tile(x + w * 0.35, y + 0.5, w * 0.3, 0.6, h + 17)}
            fill="#d9cdb3"
          />
          <polygon
            points={tile(x + w * 0.29, y + 0.4, w * 0.42, 0.8, h + 19)}
            fill="#758878"
          />
          <circle cx={cx} cy={cy - 10} r="5" fill="#f5f0dc" stroke="#9aa58b" />
          <path d={`M${cx},${cy - 10}v-3m0 3h2`} stroke="#647362" />
          <line
            x1={cx + 22}
            y1={cy - 27}
            x2={cx + 22}
            y2={cy - 51}
            stroke="#8b8b70"
          />
          <path d={`M${cx + 22} ${cy - 51}l15 4-15 5z`} fill="#648269" />
        </>
      )}
      {b.type === "school" && (
        <>
          <polygon
            points={tile(x + 0.2, y + 0.3, 1, 0.55, h + 5)}
            fill="#ddd1b4"
          />
          <text
            x={cx}
            y={cy + 18}
            fontSize="8"
            textAnchor="middle"
            fill="#faf7e9"
            fontWeight="700"
          >
            SCHOOL
          </text>
          {year >= 9 && education > 200000 && (
            <polygon
              points={tile(x + w + 0.15, y + 0.3, 0.6, 1, h * 0.75)}
              fill="#b7c8a9"
            />
          )}
        </>
      )}
      {b.type === "clinic" && (
        <path
          d={`M${cx - 4},${cy + 12}h8m-4-4v8`}
          stroke="#a95d4c"
          strokeWidth="3"
        />
      )}
      {active && (
        <>
          <polygon
            points={tile(x + 0.15, y + 0.12, w * 0.55, d * 0.4, h + 4)}
            fill="#4e7774"
          />
          {[0.2, 0.4, 0.6].map((n) => (
            <line
              key={n}
              x1={project(x + 0.15 + w * 0.55 * n, y + 0.12, h + 4)[0]}
              y1={project(x + 0.15 + w * 0.55 * n, y + 0.12, h + 4)[1]}
              x2={
                project(x + 0.15 + w * 0.55 * n, y + 0.12 + d * 0.4, h + 4)[0]
              }
              y2={
                project(x + 0.15 + w * 0.55 * n, y + 0.12 + d * 0.4, h + 4)[1]
              }
              stroke="#93b6ad"
              strokeWidth=".7"
            />
          ))}
        </>
      )}
      {infrastructure && (
        <circle cx={cx} cy={cy - 20} r="8" fill="#f0dcb0" stroke="#c09952" />
      )}
    </g>
  );
}
function Tree({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const [a, b] = project(x, y);
  return (
    <g pointerEvents="none" transform={`translate(${a} ${b}) scale(${size})`}>
      <ellipse cx="3" cy="2" rx="12" ry="5" fill="#698265" opacity=".1" />
      <path d="M0 1v-15" stroke="#8b8465" strokeWidth="2.5" />
      <ellipse cy="-18" rx="10" ry="15" fill="#819b6d" />
      <ellipse cx="-4" cy="-20" rx="7" ry="12" fill="#9db381" />
      <ellipse cx="3" cy="-23" rx="5" ry="10" fill="#b1c491" />
    </g>
  );
}
export function Person({
  id,
  x,
  y,
  onSelect,
}: {
  id: number;
  x: number;
  y: number;
  onSelect: () => void;
}) {
  const [a, b] = project(x, y);
  return (
    <g
      className="person"
      tabIndex={0}
      role="button"
      aria-label={`Inspect worker ${id + 1}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSelect();
        }
      }}
      transform={`translate(${a} ${b})`}
    >
      <circle r="8" fill="transparent" />
      <ellipse cy="1" rx="3" ry="1.4" fill="#5c7164" opacity=".18" />
      <path d="M-1 0v-3m2 3v-3" stroke="#596457" strokeWidth="1.3" />
      <path
        d="M0-3v-4"
        stroke={["#b58a5b", "#587c75", "#b67555"][id % 3]}
        strokeWidth="3"
      />
      <circle cy="-9" r="1.8" fill="#cda989" />
    </g>
  );
}
export function TransactionFlow({
  id,
  from,
  to,
  color,
  label,
  delay,
  labels,
}: {
  id: string;
  from: number[];
  to: number[];
  color: string;
  label: string;
  delay: number;
  labels: boolean;
}) {
  const path = `M${from[0]} ${from[1] - 15} Q${(from[0] + to[0]) / 2} ${Math.min(from[1], to[1]) - 65} ${to[0]} ${to[1] - 15}`;
  return (
    <g className="transaction">
      <path
        id={id}
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3 6"
        opacity=".35"
      />
      <circle r="3" fill={color}>
        <animateMotion
          dur="4s"
          begin={`${-delay}s`}
          repeatCount="indefinite"
          path={path}
        />
      </circle>
      {labels && (
        <g>
          <rect
            x={to[0] - 26}
            y={to[1] - 45}
            width="63"
            height="20"
            rx="6"
            fill="#fffef6"
            stroke={color}
            strokeOpacity=".25"
          />
          <text
            x={to[0] + 5}
            y={to[1] - 31}
            textAnchor="middle"
            fill={color}
            fontSize="9"
            fontWeight="600"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}
export function Town({
  economy,
  playing,
  layer,
  zoom,
  selected,
  onSelect,
  labels,
}: {
  economy: Economy;
  playing: boolean;
  layer: string;
  zoom: number;
  selected: Selection;
  onSelect: (s: Selection) => void;
  labels: boolean;
}) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (playing) svg.current?.unpauseAnimations();
    else svg.current?.pauseAnimations();
  }, [playing]);
  const baseBusinesses = businesses.filter((b) => b.appears === 1);
  const emerging = businesses
    .filter((b) => b.appears > 1)
    .sort((a, b) => a.appears - b.appears)
    .slice(0, economy.businesses - 10);
  const visibleBusinesses = [...baseBusinesses, ...emerging];
  const visible = [...homes, ...visibleBusinesses];
  const trees = Array.from({ length: 65 }, (_, i) => {
    const side = i % 4,
      t = (i * 0.79) % 17.5;
    return side === 0
      ? [t, -0.7]
      : side === 1
        ? [18.6, t]
        : side === 2
          ? [t, 18.6]
          : [-0.7, t];
  }).concat([
    [6.7, 6.5],
    [9.5, 6.5],
    [6.5, 9.5],
    [9.6, 9.4],
    [15.2, 6.8],
    [15.3, 9.2],
    [9.6, 12.2],
    [7.8, 15.1],
    [12.5, 15.1],
    [4.3, 9.5],
    [4.3, 12.3],
  ]);
  const plots = [1.2, 2.3, 3.4].map((x) => ({ x, y: 6.5 }));
  const roadColor =
    economy.year >= 6 && economy.infrastructure > 220000
      ? "#b3b6a4"
      : "#c9c5ad";
  return (
    <svg
      ref={svg}
      viewBox="0 0 1110 655"
      className={`town-svg ${!playing ? "paused" : ""} ${economy.year >= 20 ? "final-town" : ""}`}
      aria-label={`Isometric Commonwealth town, year ${Math.floor(economy.year)}`}
    >
      <defs>
        <filter id="ground-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow
            dx="0"
            dy="16"
            stdDeviation="15"
            floodColor="#77886d"
            floodOpacity=".14"
          />
        </filter>
        <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e0e9ce" />
          <stop offset="1" stopColor="#d5e1bf" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#b9d7ce" />
          <stop offset="1" stopColor="#d0e4d7" />
        </linearGradient>
      </defs>
      <g
        transform={`translate(${555 * (1 - zoom)} ${330 * (1 - zoom)}) scale(${zoom})`}
        style={{ transition: "transform .6s ease" }}
      >
        <path
          d="M64 252 Q115 245 114 312 T233 426 Q259 481 380 510 L355 550 Q220 511 200 461 T72 350 Q49 302 25 296Z"
          fill="url(#water)"
        />
        <path
          d="M58 279 Q119 273 100 326 T218 445 Q246 488 365 532"
          fill="none"
          stroke="#ecf3e5"
          strokeWidth="2"
          opacity=".6"
        />
        <g filter="url(#ground-shadow)">
          <polygon
            points={`${pt(0, 0)} ${pt(18, 0)} ${pt(18, 18)} ${pt(0, 18)}`}
            fill="url(#land)"
          />
          <polygon
            points={`${pt(0, 18)} ${pt(18, 18)} ${pt(18, 18, -11)} ${pt(0, 18, -11)}`}
            fill="#c3cfae"
          />
          <polygon
            points={`${pt(18, 0)} ${pt(18, 18)} ${pt(18, 18, -11)} ${pt(18, 0, -11)}`}
            fill="#b6c5a5"
          />
        </g>
        {[5.1, 10, 14.8].map((n) => (
          <g key={n}>
            <polygon points={tile(n, 0, 0.8, 18)} fill="#e7e6d5" />
            <polygon points={tile(n + 0.12, 0, 0.56, 18)} fill={roadColor} />
            <polygon points={tile(0, n, 18, 0.8)} fill="#e7e6d5" />
            <polygon points={tile(0, n + 0.12, 18, 0.56)} fill={roadColor} />
            <path
              d={`M${pt(n + 0.4, 0)}L${pt(n + 0.4, 18)}M${pt(0, n + 0.4)}L${pt(18, n + 0.4)}`}
              stroke="#efecdc"
              strokeWidth="1.4"
              strokeDasharray="7 9"
              opacity=".9"
            />
          </g>
        ))}
        {[5.1, 10, 14.8].flatMap((x) =>
          [5.1, 10, 14.8].map((y) => (
            <g key={`${x}-${y}`}>
              {[0, 1, 2, 3].map((i) => (
                <polygon
                  key={i}
                  points={tile(x + 0.04 + i * 0.19, y - 0.16, 0.1, 0.27)}
                  fill="#f6f2e1"
                />
              ))}
            </g>
          )),
        )}
        <polygon points={tile(6.3, 6.3, 3.4, 3.4)} fill="#c8d6af" />
        <polygon points={tile(6.6, 6.6, 2.8, 2.8)} fill="#e5ddc2" />
        <polygon points={tile(7, 9.3, 2.1, 0.3)} fill="#dad0b6" />
        {plots.map(({ x, y }) => (
          <g key={x}>
            <polygon points={tile(x, y, 0.9, 1.8)} fill="#b8ad7d" />
            {Array.from({ length: 7 }, (_, i) => (
              <path
                key={i}
                d={`M${pt(x + 0.12, y + 0.1 + i * 0.25)}L${pt(x + 0.8, y + 0.1 + i * 0.25)}`}
                stroke={i % 2 ? "#91a26b" : "#c4ba84"}
                strokeWidth="4"
              />
            ))}
          </g>
        ))}
        {economy.year >= 8 && economy.technology > 0 && (
          <g>
            <polygon points={tile(0.4, 8.7, 0.8, 1.1)} fill="#a0b19a" />
            {[0, 0.3, 0.6].map((n) => (
              <polygon
                key={n}
                points={tile(0.48 + n, 8.8, 0.2, 0.9, 10)}
                fill="#577970"
              />
            ))}
          </g>
        )}
        {visible
          .sort((a, b) => a.x + a.y - (b.x + b.y))
          .map((b) => (
            <Building
              key={b.id}
              data={b}
              selected={
                selected?.kind === "building" && selected.data.id === b.id
              }
              onSelect={() => onSelect({ kind: "building", data: b })}
              year={economy.year}
              technology={economy.technology}
              education={economy.education}
              infrastructure={
                layer === "infrastructure" &&
                ["school", "townhall", "logistics"].includes(b.id)
              }
            />
          ))}
        {trees.map(([x, y], i) => (
          <Tree key={i} x={x} y={y} size={0.65 + (i % 4) * 0.12} />
        ))}
        {[2, 7, 12, 17].map((n) => {
          const [a, b] = project(5, n);
          return (
            <g key={n}>
              <line
                x1={a}
                y1={b}
                x2={a}
                y2={b - 24}
                stroke="#90987c"
                strokeWidth="2"
              />
              <path
                d={`M${a - 8},${b - 20}h16`}
                stroke="#90987c"
                strokeWidth="2"
              />
              <circle cx={a + 8} cy={b - 20} r="2" fill="#eadfb4" />
            </g>
          );
        })}
        {economy.year >= 4 && economy.technology > 0 && (
          <g transform={`translate(${project(15.8, 10.5).join(" ")})`}>
            <path
              d="M-8 0L0-57 8 0M-5-22h10M-3-40h6"
              stroke="#819487"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M-9-51q-8-8 0-16m18 0q8 8 0 16"
              stroke="#7c9b8a"
              strokeWidth="1.5"
              fill="none"
              opacity=".7"
            />
          </g>
        )}
        {Array.from({ length: layer === "people" ? 28 : 16 }, (_, i) => (
          <g
            key={i}
            className="moving-person"
            style={{
              animationDuration: `${14 + (i % 5) * 3}s`,
              animationDelay: `-${i * 2}s`,
              animationPlayState: playing ? "running" : "paused",
            }}
          >
            <Person
              id={i}
              x={i % 2 ? 5.85 : 2 + (i % 15)}
              y={i % 2 ? 1 + (i % 16) : 10.85}
              onSelect={() => onSelect({ kind: "worker", id: i })}
            />
          </g>
        ))}
        {Array.from({ length: 6 }, (_, i) => {
          const horizontal = i % 2 === 0;
          const path = horizontal
            ? `M${pt(1, 5.55 + (i % 3) * 4.7)}L${pt(17, 5.55 + (i % 3) * 4.7)}`
            : `M${pt(10.45, 1)}L${pt(10.45, 17)}`;
          return (
            <g key={i} pointerEvents="none">
              <g>
                <animateMotion
                  dur={`${economy.year >= 6 && economy.infrastructure > 220000 ? 12 : 22}s`}
                  begin={`${-i * 4}s`}
                  repeatCount="indefinite"
                  path={path}
                />
                <g transform={horizontal ? "" : "scale(-1 1)"}>
                  <path
                    d="M-8-2l9-5 9 5-9 5z"
                    fill={["#c18e65", "#ece5d2", "#8ba7a0"][i % 3]}
                  />
                  <path
                    d="M-8-2v-6l9-5 9 5v6l-9 5z"
                    fill={["#c5a073", "#e3dcc7", "#8ba49a"][i % 3]}
                  />
                  <path
                    d="M1-13l9 5-9 5-9-5z"
                    fill={i % 2 ? "#f3eddd" : "#d8bd91"}
                  />
                  <circle cx="-3" cy="2" r="2" fill="#667163" />
                  <circle cx="6" cy="0" r="2" fill="#667163" />
                </g>
              </g>
            </g>
          );
        })}
        {layer === "economy" && (
          <g>
            {[
              {
                from: [3, 3],
                to: [12, 7],
                color: "#be8e54",
                label: "+$30 sale",
              },
              {
                from: [12, 7],
                to: [3, 8.5],
                color: "#739b93",
                label: "−$12 goods",
              },
              {
                from: [12, 7],
                to: [8, 8],
                color: "#927da2",
                label: `+$${Math.round((30 * economy.taxes) / economy.gdp)} tax`,
              },
              {
                from: [8, 8],
                to: [8, 12],
                color: "#6e9769",
                label: "investment",
              },
              {
                from: [2, 12],
                to: [7.5, 3],
                color: "#bf9976",
                label: "+$20 salary",
              },
            ]
              .filter((f) => f.color !== "#927da2" || economy.taxes > 0)
              .filter((f) => f.color !== "#6e9769" || economy.investment > 0)
              .map((f, i) => (
                <TransactionFlow
                  key={i}
                  id={`flow-${i}`}
                  from={project(...(f.from as [number, number]))}
                  to={project(...(f.to as [number, number]))}
                  color={f.color}
                  label={f.label}
                  delay={i * 0.7}
                  labels={labels && i < 3}
                />
              ))}
          </g>
        )}
        {economy.year >= 8 && economy.technology > 0 && layer === "people" && (
          <TransactionFlow
            id="capacity-flow"
            from={project(12, 7)}
            to={project(12, 13.5)}
            color="#729454"
            label="+16h freed"
            delay={0}
            labels={true}
          />
        )}
        {economy.year >= 20 && (
          <path
            pointerEvents="none"
            d="M320 120C700-10 1060 220 930 430S400 650 220 430 180 200 320 120"
            fill="none"
            stroke="#75945d"
            strokeWidth="2"
            strokeDasharray="4 10"
            opacity=".55"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-140"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
        )}
        {[
          [8, 8, "Town hall"],
          [2.4, 8.5, "Greenfield farm"],
          [8, 12.2, "School"],
        ].map(([x, y, label]) => {
          const [a, b] = project(Number(x), Number(y));
          return (
            <g key={label} pointerEvents="none">
              <rect
                x={a - 40}
                y={b + 17}
                width="80"
                height="19"
                rx="5"
                fill="#fbfcf3"
                fillOpacity=".88"
              />
              <text
                x={a}
                y={b + 29}
                fontSize="9"
                textAnchor="middle"
                fill="#647363"
              >
                {label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
