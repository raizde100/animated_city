import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  X,
  SlidersHorizontal,
  Check,
  Landmark,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  config,
  currency,
  type Economy,
  type Policies,
  defaultPolicies,
  milestones,
} from "../simulation";
import type { Selection } from "./Town";
export function Timeline({
  year,
  playing,
  speed,
  onPlay,
  onSpeed,
  onYear,
  onReset,
}: {
  year: number;
  playing: boolean;
  speed: number;
  onPlay: () => void;
  onSpeed: (s: number) => void;
  onYear: (n: number) => void;
  onReset: () => void;
}) {
  return (
    <section className="timeline-card" aria-label="Simulation timeline">
      <div className="timeline-controls">
        <button
          className="play-button"
          aria-label={playing ? "Pause simulation" : "Play simulation"}
          onClick={onPlay}
        >
          {playing ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
        <button
          className="icon-button restart"
          aria-label="Restart simulation"
          onClick={onReset}
        >
          <RotateCcw size={17} />
        </button>
        <div className="speed-control">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              className={speed === s ? "active" : ""}
              onClick={() => onSpeed(s)}
              aria-label={`${s} times speed`}
              aria-pressed={speed === s}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
      <div className="timeline-track">
        <div className="timeline-labels">
          <span>THE NEXT 20 YEARS</span>
          <span className="timeline-year">
            Year {Math.floor(year)} <span>/ 20</span>
          </span>
        </div>
        <div className="range-wrap">
          <input
            aria-label="Simulation year"
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={year}
            onChange={(e) => onYear(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right,#66816a ${((year - 1) / 19) * 100}%,#e0e5d9 ${((year - 1) / 19) * 100}%)`,
            }}
          />
          <div className="year-ticks">
            {[1, 4, 8, 12, 16, 20].map((n) => (
              <button onClick={() => onYear(n)} key={n}>
                Year {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function PolicyControls({
  open,
  onClose,
  policy,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  policy: Policies;
  onChange: (p: Policies) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            className="policy-modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <button
              className="icon-button modal-close"
              onClick={onClose}
              aria-label="Close policy controls"
            >
              <X size={20} />
            </button>
            <div className="dialog-icon">
              <SlidersHorizontal size={22} />
            </div>
            <p className="eyebrow">TRY A DIFFERENT PATH</p>
            <h2 id="policy-title">Every choice shapes the town.</h2>
            <p className="muted">
              Move the sliders to explore the trade-offs. The entire timeline
              recalculates with your choices.
            </p>
            {(
              [
                {
                  key: "tax",
                  title: "Tax rate",
                  text: "Fund public services, with less capital for private investment.",
                  max: 40,
                },
                {
                  key: "technology",
                  title: "Technology adoption",
                  text: "Better tools release more time for new activities.",
                  max: 100,
                },
                {
                  key: "infrastructure",
                  title: "Infrastructure investment",
                  text: "Connect the town with roads, energy, and better logistics.",
                  max: 100,
                },
                {
                  key: "education",
                  title: "Education investment",
                  text: "Build skills today. Unlock more productivity over time.",
                  max: 100,
                },
              ] as const
            ).map((p) => (
              <label className="policy-slider" key={p.key}>
                <span>
                  <strong>{p.title}</strong>
                  <b>
                    {policy[p.key]}
                    {p.key === "tax" ? "%" : " / 100"}
                  </b>
                </span>
                <input
                  type="range"
                  min="0"
                  max={p.max}
                  value={policy[p.key]}
                  onChange={(e) =>
                    onChange({ ...policy, [p.key]: Number(e.target.value) })
                  }
                />
                <small>{p.text}</small>
              </label>
            ))}
            <div className="dialog-actions">
              <button
                className="text-button"
                onClick={() => onChange(defaultPolicies)}
              >
                Restore defaults
              </button>
              <button className="dark-button" onClick={onClose}>
                Back to the town <ArrowRight size={16} />
              </button>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
export function EventOverlay({
  event,
  onClose,
}: {
  event: (typeof milestones)[number] | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          className="event-overlay"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="event-symbol">
            <Check size={19} />
          </div>
          <div>
            <span className="eyebrow">
              YEAR {event.year} · {event.tag}
            </span>
            <h3>{event.title}</h3>
            <p>{event.text}</p>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
            aria-label="Dismiss milestone"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function InspectionPanel({
  selected,
  economy,
  onClose,
}: {
  selected: Selection;
  economy: Economy;
  onClose: () => void;
}) {
  if (!selected) return null;
  const worker = selected.kind === "worker";
  const building = selected.kind === "building" ? selected.data : null;
  const government = building?.type === "government";
  const household = building?.type === "home";
  const productivity = economy.productivity / 100;
  const employees =
    building?.id === "bakery"
      ? economy.year >= 8 && economy.technology > 0
        ? 3
        : 5
      : Math.round(
          (building?.employees || 1) * (1 + (economy.year - 1) * 0.012),
        );
  const revenue =
    (economy.gdp / Math.max(1, economy.businesses)) *
    (1 + (building?.employees || 0) / 12);
  const items = worker
    ? [
        [
          "Occupation",
          economy.industries >= 7 && economy.technology > 0
            ? "Software designer"
            : "Market assistant",
        ],
        ["Monthly income", currency(economy.gdp / economy.workers / 12, false)],
        ["Working hours", "160h / month"],
        ["Productivity", `${Math.round(economy.productivity)} index`],
        [
          "Consumption",
          currency(
            (economy.gdp / economy.workers / 12) * config.consumption,
            false,
          ),
        ],
      ]
    : government
      ? [
          ["Tax revenue / year", currency(economy.taxes, false)],
          ["Total expenditure", currency(economy.investment, false)],
          ["Treasury balance", currency(economy.treasury, false)],
          ["Infrastructure", currency(economy.infrastructure, false)],
          ["Education", currency(economy.education, false)],
        ]
      : household
        ? [
            ["Residents", "4 people"],
            [
              "Monthly income",
              currency((economy.gdp / economy.workers / 12) * 1.4, false),
            ],
            ["Consumption", `${config.consumption * 100}% of income`],
            ["Savings", `${(1 - config.consumption) * 100}% of income`],
          ]
        : [
            ["Industry", building?.industry || ""],
            ["Employees", String(employees)],
            ["Revenue / year", currency(revenue, false)],
            ["Productivity", `${Math.round(economy.productivity)} index`],
            [
              "Labor hours / month",
              `${Math.round((employees * 160) / productivity).toLocaleString()}h`,
            ],
            [
              "Taxes / year",
              currency((revenue * economy.taxes) / economy.gdp, false),
            ],
            [
              "Technology",
              economy.year >= 8 && economy.technology > 0
                ? "Connected & automated"
                : "Manual processes",
            ],
          ];
  return (
    <motion.div
      className="inspection-panel"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      key={worker ? "worker" : building?.id}
    >
      <div className="inspection-top">
        <div className="inspection-icon">
          {worker ? (
            <Users size={19} />
          ) : government ? (
            <Landmark size={19} />
          ) : (
            <BriefcaseBusiness size={19} />
          )}
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close inspection"
        >
          <X size={17} />
        </button>
      </div>
      <span className="eyebrow">
        {worker
          ? "MEET A RESIDENT"
          : government
            ? "YOUR LOCAL GOVERNMENT"
            : household
              ? "A HOME IN COMMONWEALTH"
              : "INSIDE THE BUSINESS"}
      </span>
      <h3>
        {worker
          ? `Alex · Resident ${selected.kind === "worker" ? selected.id + 1 : ""}`
          : building?.name}
      </h3>
      <dl>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {building?.id === "bakery" && (
        <div className="bakery-story">
          <span>1,000 loaves. Every day.</span>
          <strong>
            {economy.year >= 8 && economy.technology > 0
              ? "40h → 24h · 16h released"
              : "5 workers × 8h = 40h"}
          </strong>
          <small>
            {economy.year >= 8 && economy.technology > 0
              ? "A better oven creates time for new ideas."
              : "Better equipment arrives in Year 8."}
          </small>
        </div>
      )}
    </motion.div>
  );
}
