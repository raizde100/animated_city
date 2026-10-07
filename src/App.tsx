import { useEffect, useMemo, useRef, useState } from "react";
import {
  Layers3,
  ArrowUpRight,
  ChevronDown,
  SlidersHorizontal,
  Minus,
  Plus,
  Maximize2,
  Map,
  Activity,
  Users,
  X,
  ArrowRight,
  Info,
  CircleHelp,
  Landmark,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  config,
  currency,
  defaultPolicies,
  milestones,
  simulate,
  stage,
} from "./simulation";
import { Town, type Selection } from "./components/Town";
import { EconomicDashboard } from "./components/EconomicDashboard";
import {
  EventOverlay,
  InspectionPanel,
  PolicyControls,
  Timeline,
} from "./components/Controls";
export default function App() {
  const [year, setYear] = useState(1),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(1),
    [policy, setPolicy] = useState(defaultPolicies),
    [policyOpen, setPolicyOpen] = useState(false),
    [aboutOpen, setAboutOpen] = useState(false),
    [storyOpen, setStoryOpen] = useState(false),
    [layer, setLayer] = useState("economy"),
    [zoom, setZoom] = useState(1),
    [selection, setSelection] = useState<Selection>(null),
    [labels, setLabels] = useState(true),
    [event, setEvent] = useState<(typeof milestones)[number] | null>(null);
  const economy = useMemo(() => simulate(year, policy), [year, policy]);
  const lastYear = useRef(1);
  useEffect(() => {
    if (!playing) return;
    let previous = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const elapsed = (now - previous) / 1000;
      previous = now;
      setYear((y) => Math.min(20, y + (elapsed / config.yearDuration) * speed));
    }, 100);
    return () => clearInterval(id);
  }, [playing, speed]);
  useEffect(() => {
    const milestone = milestones
      .filter(
        (m) =>
          m.year > lastYear.current &&
          m.year <= year &&
          (![4, 8, 12].includes(m.year) || policy.technology > 0) &&
          (m.year !== 6 || economy.infrastructure > 220000) &&
          (m.year !== 10 || economy.freed > 0),
      )
      .at(-1);
    if (milestone) setEvent(milestone);
    lastYear.current = year;
    if (year >= 20) setPlaying(false);
  }, [year, policy.technology, economy.infrastructure, economy.freed]);
  useEffect(() => {
    if (!event) return;
    const id = setTimeout(() => setEvent(null), 8500);
    return () => clearTimeout(id);
  }, [event]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPolicyOpen(false);
        setAboutOpen(false);
        setStoryOpen(false);
        setSelection(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (!policyOpen && !aboutOpen && !storyOpen) return;
    const original = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const controls = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>("button,input,a[href]") || [],
      );
    controls()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = controls();
      const first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      original?.focus();
    };
  }, [policyOpen, aboutOpen, storyOpen]);
  const reset = () => {
    setYear(1);
    lastYear.current = 1;
    setPlaying(false);
    setEvent(null);
    setSelection(null);
    setZoom(1);
  };
  const setTime = (y: number) => {
    setYear(y);
    setPlaying(false);
    setSelection(null);
  };
  const select = (s: Selection) => {
    setSelection(s);
  };
  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="/" className="brand" aria-label="Commonwealth home">
          <span className="brand-icon">
            <Layers3 size={22} strokeWidth={1.7} />
          </span>
          commonwealth<span className="brand-period">.</span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={
              !storyOpen && !aboutOpen ? "nav-link active" : "nav-link"
            }
            onClick={() => {
              setStoryOpen(false);
              setAboutOpen(false);
            }}
          >
            The living economy
          </button>
          <button className="nav-link" onClick={() => setStoryOpen(true)}>
            The big idea <ArrowUpRight size={13} />
          </button>
          <button className="nav-link" onClick={() => setAboutOpen(true)}>
            About the model
          </button>
        </nav>
        <span className="header-note">
          <span />A little town. A bigger picture.
        </span>
      </header>
      <main>
        <section className="page-heading">
          <div>
            <div className="eyebrow heading-eyebrow">
              <span className="tiny-line" />
              AN INTERACTIVE ECONOMIC EXPLORATION
            </div>
            <h1>
              Small town. <span>Extraordinary possibilities.</span>
            </h1>
            <p>
              Watch work become wealth, productivity become time, and time
              become something new.
            </p>
          </div>
          <button className="policy-button" onClick={() => setPolicyOpen(true)}>
            <SlidersHorizontal size={16} /> Shape the economy{" "}
            <ArrowUpRight size={15} />
          </button>
        </section>
        <div className="experience-grid">
          <div className="town-column">
            <section className="town-card">
              <div className="town-toolbar">
                <div className="town-name">
                  <span className="town-status" />
                  <strong>Commonwealth</strong>
                  <span className="town-separator" />
                  <span>{economy.population} residents</span>
                  <ChevronDown size={13} />
                </div>
                <div
                  className="map-layers"
                  role="group"
                  aria-label="Map layers"
                >
                  {[
                    { id: "economy", icon: Activity, title: "Economy" },
                    {
                      id: "infrastructure",
                      icon: Map,
                      title: "Infrastructure",
                    },
                    { id: "people", icon: Users, title: "People" },
                  ].map(({ id, icon: Icon, title }) => (
                    <button
                      key={id}
                      className={id === layer ? "active" : ""}
                      onClick={() => setLayer(id)}
                      aria-pressed={id === layer}
                    >
                      <Icon size={14} />
                      <span>{title}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="map-stage">
                <div className="year-badge">
                  <div>
                    <span className="live-dot" /> YEAR {Math.floor(year)}
                  </div>
                  <p>{stage(year)}</p>
                </div>
                <div className="map-coordinate">
                  38° N · 122° W <span>AN IMAGINED PLACE</span>
                </div>
                <Town
                  economy={economy}
                  playing={playing}
                  layer={layer}
                  zoom={zoom}
                  selected={selection}
                  onSelect={select}
                  labels={labels}
                />
                <div className="map-hint">
                  <span className="hint-dot" />
                  <span>Every building has a story. Click to explore.</span>
                </div>
                <div className="zoom-controls">
                  <button
                    aria-label="Zoom in"
                    disabled={zoom >= 1.35}
                    onClick={() => setZoom((z) => Math.min(1.35, z + 0.1))}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    aria-label="Zoom out"
                    disabled={zoom <= 0.7}
                    onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    aria-label="Fit town to view"
                    onClick={() => setZoom(1)}
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
                <EventOverlay event={event} onClose={() => setEvent(null)} />
              </div>
              <div className="map-legend">
                <span className="legend-title">FOLLOW THE FLOW</span>
                <span>
                  <i style={{ background: "#be8e54" }} />
                  Purchases
                </span>
                <span>
                  <i style={{ background: "#739b93" }} />
                  Suppliers
                </span>
                <span>
                  <i style={{ background: "#bf9976" }} />
                  Wages
                </span>
                <span>
                  <i style={{ background: "#927da2" }} />
                  Taxes
                </span>
                <span>
                  <i style={{ background: "#6e9769" }} />
                  Investment
                </span>
                <button
                  className="flow-toggle"
                  onClick={() => setLabels(!labels)}
                  aria-pressed={labels}
                >
                  Labels <span className={labels ? "toggle on" : "toggle"} />
                </button>
              </div>
            </section>
            <Timeline
              year={year}
              playing={playing}
              speed={speed}
              onPlay={() => {
                if (year >= 20) {
                  setYear(1);
                  lastYear.current = 1;
                }
                setPlaying(!playing);
              }}
              onSpeed={setSpeed}
              onYear={setTime}
              onReset={reset}
            />
          </div>
          <aside className="dashboard">
            <AnimatePresence mode="wait">
              {selection ? (
                <InspectionPanel
                  selected={selection}
                  economy={economy}
                  onClose={() => setSelection(null)}
                />
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <EconomicDashboard
                    economy={economy}
                    policy={policy}
                    onExplore={() => setStoryOpen(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="simulation-note">
              <Info size={13} />
              <span>Simulated numbers. Real economic ideas.</span>
            </div>
          </aside>
        </div>
        <section className="story-strip">
          <div className="story-strip-icon">
            <Sparkles size={19} />
          </div>
          <div>
            <span className="eyebrow">
              GROWTH IS MORE THAN A BIGGER NUMBER.
            </span>
            <p>It’s having the time to create what didn’t exist before.</p>
          </div>
          <button onClick={() => setStoryOpen(true)}>
            Explore the flywheel <ArrowRight size={16} />
          </button>
        </section>
        {year >= 20 && (
          <motion.section
            className="final-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="eyebrow">TWENTY YEARS OF POSSIBILITY</p>
            <h2>
              Productivity creates time.
              <br />
              <span>Time creates possibilities.</span>
            </h2>
            <div className="final-stats">
              {[
                ["Economic output", "$1.00M", currency(economy.gdp)],
                [
                  "GDP per worker",
                  "$20.0k",
                  currency(economy.gdp / economy.workers),
                ],
                ["Productivity", "100", Math.round(economy.productivity)],
                [
                  "Cumulative hours freed",
                  "0",
                  `${economy.cumulativeFreed.toLocaleString()}h`,
                ],
                ["Businesses", "10", economy.businesses],
                ["Industries", "4", economy.industries],
              ].map(([a, b, c]) => (
                <div key={a}>
                  <span>{a}</span>
                  <strong>
                    {b} <ArrowRight size={14} /> {c}
                  </strong>
                </div>
              ))}
            </div>
            <p>
              Economic growth is about freeing human capacity to create what did
              not exist before.
            </p>
            <button className="dark-button" onClick={reset}>
              <RotateIcon />
              Start a new story
            </button>
          </motion.section>
        )}
      </main>
      <footer>
        <span>
          COMMONWEALTH <span className="footer-dot">/</span> A living economy
        </span>
        <button onClick={() => setAboutOpen(true)}>
          <CircleHelp size={13} /> How this works
        </button>
        <span>Made for the curious.</span>
      </footer>
      <PolicyControls
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
        policy={policy}
        onChange={setPolicy}
      />
      <AnimatePresence>
        {(aboutOpen || storyOpen) && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setAboutOpen(false);
                setStoryOpen(false);
              }}
            />
            <motion.section
              className={`info-modal ${storyOpen ? "story-modal" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="info-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <button
                className="icon-button modal-close"
                aria-label="Close explanation"
                onClick={() => {
                  setAboutOpen(false);
                  setStoryOpen(false);
                }}
              >
                <X size={20} />
              </button>
              <div className="dialog-icon">
                {storyOpen ? <Sparkles size={24} /> : <Landmark size={24} />}
              </div>
              <p className="eyebrow">
                {storyOpen
                  ? "THE ECONOMIC FLYWHEEL"
                  : "A SIMPLE MODEL. A POWERFUL IDEA."}
              </p>
              <h2 id="info-title">
                {storyOpen
                  ? "Time creates possibilities."
                  : "A town you can learn from."}
              </h2>
              {storyOpen ? (
                <>
                  <p className="muted">
                    A better oven makes the same 1,000 loaves in 24 hours
                    instead of 40. Those 16 freed hours can become a new idea, a
                    new service, a new business.
                  </p>
                  <div className="flywheel">
                    {[
                      "People work & produce",
                      "Income & purchases",
                      "Taxes fund the town",
                      "Infrastructure & education",
                      "Productivity improves",
                      "Human hours are freed",
                      "New businesses & markets",
                      "More income & transactions",
                    ].map((s, i) => (
                      <div key={s}>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        {s}
                        <ArrowRight size={15} />
                      </div>
                    ))}
                  </div>
                  <div className="story-released">
                    <ClockIcon />
                    <span>
                      <strong>
                        {economy.cumulativeFreed.toLocaleString()} hours
                      </strong>{" "}
                      of human capacity released so far
                    </span>
                  </div>
                  <p className="muted small">
                    This scenario assumes released time can be redeployed
                    through skills and investment. Actual outcomes depend on
                    demand, access, and opportunity.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    The model starts with 240 residents, 50 workers, 10
                    businesses, and $1 million in annual output. One year takes
                    eight seconds at normal speed.
                  </p>
                  <p>
                    Every simulated month, tax receipts fund a treasury. A share
                    is invested in infrastructure and education. Technology,
                    infrastructure, and skills raise output per hour. Released
                    hours accumulate and help new businesses emerge.
                  </p>
                  <p>
                    Tax rates also influence private investment. Education takes
                    longer to pay off. All policy sliders recalculate the same
                    20-year scenario, so comparisons are repeatable.
                  </p>
                  <div className="model-notice">
                    <Info size={18} />
                    <span>
                      An educational illustration, not a forecast. Prices,
                      inequality, unemployment, and many real-world constraints
                      are simplified.
                    </span>
                  </div>
                  <p className="muted small">
                    All calculations run in your browser. No account, data
                    collection, or backend required.
                  </p>
                </>
              )}
              <button
                className="dark-button"
                onClick={() => {
                  setAboutOpen(false);
                  setStoryOpen(false);
                }}
              >
                Back to Commonwealth <ArrowRight size={16} />
              </button>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
function RotateIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 10a9 9 0 1 1 2 9M3 4v6h6" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
