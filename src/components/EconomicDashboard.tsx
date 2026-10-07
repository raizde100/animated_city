import {
  ArrowUpRight,
  ArrowRight,
  Clock3,
  Sprout,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { currency, type Economy, type Policies, simulate } from "../simulation";
export function EconomicDashboard({
  economy,
  policy,
  onExplore,
}: {
  economy: Economy;
  policy: Policies;
  onExplore: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const growth = (economy.gdp / 1e6 - 1) * 100;
  const series = Array.from(
    { length: 21 },
    (_, i) => simulate(1 + ((economy.year - 1) * i) / 20, policy).gdp,
  );
  const peak = Math.max(1_050_000, ...series);
  const path = series
    .map(
      (n, i) =>
        `${i === 0 ? "M" : "L"}${i * 13.5} ${50 - ((n - 1e6) / (peak - 1e6)) * 45}`,
    )
    .join(" ");
  return (
    <>
      <section className="economy-card">
        <div className="card-heading">
          <span className="eyebrow">THE TOWN AT A GLANCE</span>
          <span className="live-dot" />
        </div>
        <div className="gdp-label">
          Economic output <span>GDP / year</span>
        </div>
        <div className="gdp-value">{currency(economy.gdp)}</div>
        <div className="metric-trend">
          <ArrowUpRight size={14} />
          {growth.toFixed(1)}% <span>since Year 1</span>
        </div>
        <svg
          className="sparkline"
          viewBox="0 0 270 58"
          preserveAspectRatio="none"
          aria-label="GDP trend"
        >
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#c4d1b7" stopOpacity=".6" />
              <stop offset="1" stopColor="#c4d1b7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L270 58 L0 58 Z`} fill="url(#chart-fill)" />
          <path d={path} fill="none" stroke="#829770" strokeWidth="2" />
        </svg>
        <div className="stat-grid">
          <div>
            <span>Businesses</span>
            <strong>
              {economy.businesses}
              <small>+{economy.businesses - 10}</small>
            </strong>
          </div>
          <div>
            <span>Industries</span>
            <strong>
              {economy.industries}
              <small>+{economy.industries - 4}</small>
            </strong>
          </div>
          <div>
            <span>Transactions / day</span>
            <strong>{economy.transactions.toLocaleString()}</strong>
          </div>
          <div>
            <span>Productivity</span>
            <strong>
              {Math.round(economy.productivity)}
              <small>index</small>
            </strong>
          </div>
        </div>
        <div className="treasury-metric">
          <span>Tax revenue / year</span>
          <strong>{currency(economy.taxes)}</strong>
        </div>
        <div className="treasury-metric">
          <span>
            Public investment <small>cumulative</small>
          </span>
          <strong>{currency(economy.investment)}</strong>
        </div>
        <button
          className="details-button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {" "}
          {expanded ? "Fewer metrics" : "View all economic indicators"}{" "}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded && (
          <dl className="extra-metrics">
            {[
              ["Population", economy.population.toLocaleString()],
              ["Workers", String(economy.workers)],
              ["GDP per worker", currency(economy.gdp / economy.workers)],
              ["Total labor / month", `${economy.hours.toLocaleString()}h`],
              ["Treasury", currency(economy.treasury)],
              [
                "Private investment / year",
                currency(economy.privateInvestment),
              ],
            ].map(([a, b]) => (
              <div key={a}>
                <dt>{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
      <section className="capacity-card">
        <div className="capacity-title">
          <Clock3 size={16} />
          <span>THE REAL DIVIDEND</span>
          <span className="little-star">✳</span>
        </div>
        <h3>Time to do more.</h3>
        <div className="capacity-value">
          +{economy.freed.toLocaleString()}
          <span>h</span>
        </div>
        <p>Human hours freed each month</p>
        <div className="capacity-bar">
          <div
            style={{ width: `${Math.min(100, (economy.freed / 6000) * 100)}%` }}
          />
        </div>
        <div className="capacity-conversion">
          <Sprout size={15} />
          <span>{economy.businesses - 10} new businesses</span>
          <ArrowRight size={13} />
          <span>{Math.round((economy.businesses - 10) * 4.5)} jobs</span>
        </div>
        <button className="capacity-link" onClick={onExplore}>
          See how time creates possibilities <ArrowUpRight size={15} />
        </button>
      </section>
    </>
  );
}
