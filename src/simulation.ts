export type Policies = {
  tax: number;
  technology: number;
  infrastructure: number;
  education: number;
};
export const defaultPolicies: Policies = {
  tax: 20,
  technology: 55,
  infrastructure: 60,
  education: 50,
};
export const config = {
  population: 240,
  workers: 50,
  output: 1_000_000,
  hoursPerWorker: 160,
  businesses: 10,
  industries: 4,
  consumption: 0.7,
  investment: 0.18,
  yearDuration: 8,
  technologyGrowth: 4.4,
  infrastructureEffect: 18,
  educationEffect: 16,
  capacityPerBusiness: 25000,
  outputGrowth: 0.035,
};
export type Economy = {
  year: number;
  population: number;
  workers: number;
  gdp: number;
  productivity: number;
  hours: number;
  freed: number;
  cumulativeFreed: number;
  businesses: number;
  industries: number;
  transactions: number;
  taxes: number;
  investment: number;
  treasury: number;
  infrastructure: number;
  education: number;
  technology: number;
  privateInvestment: number;
};
export function simulate(year: number, policy: Policies): Economy {
  const t = Math.max(0, Math.min(19, year - 1));
  let treasury = 0,
    cumulativeFreed = 0,
    investment = 0,
    publicInfrastructure = 0,
    education = 0;
  let gdp = config.output,
    productivity = 100,
    workers = config.workers,
    freed = 0,
    taxes = (gdp * policy.tax) / 100;
  const months = Math.round(t * 12);
  for (let month = 1; month <= months; month++) {
    const elapsed = month / 12;
    taxes = (gdp * policy.tax) / 100;
    const receipts = taxes / 12;
    treasury += receipts;
    const expenditure =
      treasury * 0.075 * ((policy.infrastructure + policy.education) / 110);
    treasury -= expenditure;
    investment += expenditure;
    const totalWeight = policy.infrastructure + policy.education || 1;
    publicInfrastructure += (expenditure * policy.infrastructure) / totalWeight;
    education += (expenditure * policy.education) / totalWeight;
    const digital = (Math.max(0, elapsed - 2) * policy.technology) / 55;
    const publicEffect =
      Math.log1p(publicInfrastructure / 320_000) * config.infrastructureEffect;
    const skills =
      Math.log1p(education / 550_000) *
      config.educationEffect *
      Math.min(1, elapsed / 8);
    productivity =
      100 + digital * config.technologyGrowth + publicEffect + skills;
    const privateFactor = 1 + (20 - policy.tax) * 0.007;
    gdp =
      (config.output *
        (1 + elapsed * config.outputGrowth * privateFactor) *
        productivity) /
      100;
    workers = Math.round(config.workers * (1 + elapsed * 0.025));
    freed = Math.round(
      config.workers * config.hoursPerWorker * (1 - 100 / productivity),
    );
    cumulativeFreed += freed;
  }
  const businesses =
    config.businesses +
    Math.min(
      26,
      Math.floor(cumulativeFreed / config.capacityPerBusiness),
      Math.floor((Math.max(0, t - 7) * 26) / 12),
    );
  const industries =
    config.industries +
    Math.min(10, Math.floor((businesses - config.businesses) / 2.3));
  return {
    year,
    population: Math.round(config.population + t * 7.2),
    workers,
    gdp,
    productivity,
    hours: workers * config.hoursPerWorker,
    freed,
    cumulativeFreed,
    businesses,
    industries,
    transactions: Math.round(((180 * gdp) / config.output) * (1 + t * 0.055)),
    taxes: (gdp * policy.tax) / 100,
    investment,
    treasury,
    infrastructure: publicInfrastructure,
    education,
    technology: policy.technology,
    privateInvestment: gdp * config.investment * (1 - policy.tax / 100),
  };
}
export const milestones = [
  {
    year: 1,
    title: "A small town. A world of potential.",
    text: "People work, businesses produce, and every purchase sets something in motion.",
    tag: "THE BEGINNING",
  },
  {
    year: 4,
    title: "Small payments. Bigger connections.",
    text: "Digital payments make transactions faster. More of the town’s money gets moving.",
    tag: "DIGITAL PAYMENTS",
  },
  {
    year: 6,
    title: "Better roads open new routes.",
    text: "Public investment connects producers to customers. Goods arrive faster, at a lower cost.",
    tag: "INFRASTRUCTURE",
  },
  {
    year: 8,
    title: "Same output. More time.",
    text: "A new oven makes 1,000 loaves in 24 hours instead of 40. Sixteen hours become new possibilities.",
    tag: "PRODUCTIVITY",
  },
  {
    year: 10,
    title: "Human capacity, released.",
    text: "Freed hours are becoming restaurants, design studios, and new livelihoods.",
    tag: "NEW POSSIBILITIES",
  },
  {
    year: 12,
    title: "An entirely new industry appears.",
    text: "Skills, connectivity, and time come together. The town’s first software studio opens.",
    tag: "NEW MARKETS",
  },
  {
    year: 15,
    title: "An economy with more possibilities.",
    text: "Services grow alongside agriculture. A more diverse town keeps its economic flywheel turning.",
    tag: "DIVERSIFICATION",
  },
  {
    year: 20,
    title: "Productivity creates time.",
    text: "Time creates possibilities. Possibilities create new markets.",
    tag: "THE NEXT CHAPTER",
  },
];
export function stage(year: number) {
  return year < 4
    ? "A basic local economy"
    : year < 8
      ? "Building the foundations"
      : year < 12
        ? "Releasing human capacity"
        : year < 16
          ? "New markets emerge"
          : "A thriving, connected economy";
}
export const currency = (n: number, compact = true) =>
  compact
    ? n >= 1e6
      ? `$${(n / 1e6).toFixed(2)}M`
      : n >= 1000
        ? `$${(n / 1000).toFixed(1)}k`
        : `$${Math.round(n)}`
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n);
