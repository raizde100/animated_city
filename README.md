# Commonwealth — A living economy

An interactive, browser-only economic story, built with React, TypeScript, Vite, Framer Motion, and an original SVG isometric town. Fonts are bundled locally; no backend, API key, or runtime Internet connection is required.

## Development

Use the existing checkout at `/workspace/animated_city`. Cloud tasks are already isolated; no additional Git worktree is needed.

```sh
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173
```

The development server binds to all interfaces. In the cloud environment, validate it internally using `curl --fail http://127.0.0.1:5173/`; the onboarding interface does not provide localhost previews.

```sh
npm test       # Economic relationships and policy extremes
npm run build  # TypeScript checks and production bundle
npm run preview -- --port 4173
```

## Explore

- Press **Play**, switch between 1×, 2×, and 5× speed, or choose a year on the timeline. One simulated year takes eight seconds at normal speed.
- Restart returns to Year 1, preserving your chosen policies and speed. Restore defaults inside **Shape the economy** to reset policy choices.
- Click any building or worker for details. Change map layers, toggle payment labels, and zoom in or out.
- Use policy sliders to compare complete historical scenarios: changing a policy recalculates the selected year rather than applying only to future periods.
- Year 20 presents the actual outcome of your scenario against the baseline.

## Model and structure

`src/simulation.ts` is independent of rendering. It contains configurable population, workforce, baseline output, working hours, consumption, investment, and pacing. `simulate(year, policies)` is deterministic and updates tax receipts, treasury expenditure, public capital, education, technology, productivity, released hours, and business creation in monthly steps.

Output grows with private investment incentives and output per hour. Public expenditure is limited by available treasury funds; zero tax revenue yields no public investment. Education has a delayed effect. Released capacity accumulates; new businesses require both accumulated capacity and time. The map's business count matches the engine's count, excluding Town Hall. Civic education and healthcare are included as economic activities.

Components live in `src/components/`: Town, Building, Person, TransactionFlow, EconomicDashboard, Timeline, EventOverlay, InspectionPanel, and PolicyControls. Government and business inspection variants share the lightweight panel.

This is an educational illustration rather than a forecast. It assumes capacity can be redeployed through skills and investment. Prices, unemployment, distribution, and demand constraints are simplified. Annual output and taxes, monthly labor and released hours, and cumulative public investment are labeled separately. Later scenarios are computed values, not fixed Year 20 claims.

## Production on Vercel

Import the GitHub repository `raizde100/animated_city` into a Vercel project and select the `main` branch. Use the repository root as the project root. `vercel.json` sets the Vite framework, `npm ci` installation, `npm run build` build command, and `dist` output directory. No environment variables are required.

Once Vercel finishes deploying, open the production URL shown on the deployment page. Future pushes to `main` trigger automatic production deployments when the Git integration is enabled.

Publishing the Codex environment saves the development workspace. The public website is hosted by the Vercel project.
