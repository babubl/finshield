# FinShield - AI-Powered Financial Resilience Planner

**Your household's financial crash-test.** Know your vulnerability score, get your rescue plan.

## The Problem

69% of Indian households struggle with financial insecurity. 59% of Gen Z have zero emergency savings. Household debt is at a 17-year high. Yet no single app provides a holistic financial vulnerability assessment for Indian households.

## Features

- **Vulnerability Score (0-100)** — Weighted across Savings Rate, Emergency Fund, Debt Health, Insurance Cover, and Wealth Buffer
- **Shock Simulator** — Stress-test against Job Loss, Medical Emergency, Income Cut, and Double Shock scenarios
- **Debt Optimizer** — Avalanche vs Snowball strategy comparison with interest savings calculations
- **Insurance Gap Analyzer** — Identifies critical gaps in health, term life, critical illness coverage
- **FI Timer** — Financial Independence calculator with scenario analysis and acceleration tips

## Tech Stack

- React 18 + Vite
- Pure CSS (no framework dependency)
- Zero backend — all calculations run client-side
- Privacy-first — no data leaves the browser
- GitHub Pages deployment via Actions

## Quick Start

```bash
git clone https://github.com/babubl/finshield.git
cd finshield
npm install
npm run dev
```

## Deployment

Push to `main` branch triggers automatic deployment to GitHub Pages via GitHub Actions.

### Manual Deploy

```bash
npm run build
npm run deploy
```

## Project Structure

```
src/
  engine/           # Core calculation engines
    scoring.js      # Vulnerability score algorithm
    shockSimulator.js
    debtOptimizer.js
    insuranceAnalyzer.js
    fiCalculator.js
    utils.js
  components/       # React UI components
    ui.jsx          # Reusable primitives (Card, Badge, InputField, etc.)
    ProfileInput.jsx
    Dashboard.jsx
    ShockTest.jsx
    DebtPlan.jsx
    InsuranceGaps.jsx
    FITimer.jsx
  styles/
    global.css
  constants.js
  App.jsx
  main.jsx
```

## Indian Market Specifics

- 20 Indian cities with cost-of-living multipliers
- 10 Indian loan types (Home, Car, Gold, BNPL, Credit Card, etc.)
- Insurance recommendations aligned with Indian products
- INR formatting with Lakhs and Crores
- FI assumptions calibrated for Indian inflation and return rates

## License

MIT

## Author

Built with care for Indian households.
