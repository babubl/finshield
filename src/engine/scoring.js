import { CITIES } from '../constants';
import { clamp } from './utils';

/**
 * Compute Financial Vulnerability Score (0–100)
 * 5 weighted dimensions, 20 points each:
 *   1. Savings Rate
 *   2. Emergency Fund Adequacy
 *   3. Debt Health
 *   4. Insurance Coverage
 *   5. Wealth Buffer & Dependencies
 */
export function computeVulnerabilityScore(profile) {
  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    totalEMI = 0,
    emergencyFund = 0,
    investments = 0,
    dependents = 0,
    earningMembers = 1,
    insuranceCoverage = {},
    loans = [],
    age = 30,
    city = "Other Tier 2",
  } = profile;

  if (monthlyIncome <= 0) return { score: 0, breakdown: {}, metrics: {} };

  const cityData = CITIES[city] || { costMultiplier: 1, tier: 2 };
  const annualIncome = monthlyIncome * 12;

  // ── 1. Savings Rate Score (0-20) ──
  const savingsRate = (monthlyIncome - monthlyExpenses - totalEMI) / monthlyIncome;
  const savingsScore = clamp(savingsRate * 100, 0, 20);

  // ── 2. Emergency Fund Score (0-20) ──
  const monthlyBurn = Math.max(monthlyExpenses + totalEMI, 1);
  const monthsCovered = emergencyFund / monthlyBurn;
  const emergencyScore = clamp((monthsCovered / 9) * 20, 0, 20);

  // ── 3. Debt Health Score (0-20) ──
  const dti = totalEMI / monthlyIncome;
  let debtScore = 20;
  if (dti > 0.5) debtScore = 0;
  else if (dti > 0.4) debtScore = 5;
  else if (dti > 0.3) debtScore = 10;
  else if (dti > 0.2) debtScore = 15;

  // Penalize high-interest debt (credit cards, BNPL, personal loans)
  const highInterestEMI = loans
    .filter(l => l.rate > 15)
    .reduce((s, l) => s + (l.emi || 0), 0);
  if (highInterestEMI > monthlyIncome * 0.1) debtScore = Math.max(0, debtScore - 5);

  // Bonus for zero debt
  if (loans.length === 0 || totalEMI === 0) debtScore = 20;

  // ── 4. Insurance Coverage Score (0-20) ──
  let insuranceScore = 0;

  // Health insurance (max 8 points)
  const hasHealth = insuranceCoverage.health?.covered;
  const healthCover = insuranceCoverage.health?.amount || 0;
  if (hasHealth) {
    const idealHealth = dependents >= 2 ? 1500000 : 500000;
    insuranceScore += Math.min(8, (healthCover / idealHealth) * 8);
  }

  // Term life insurance (max 8 points)
  const hasTermLife = insuranceCoverage.term_life?.covered;
  const termCover = insuranceCoverage.term_life?.amount || 0;
  if (hasTermLife && dependents > 0) {
    const idealTerm = annualIncome * 10;
    insuranceScore += Math.min(8, (termCover / idealTerm) * 8);
  } else if (hasTermLife) {
    insuranceScore += 4; // some credit even without dependents
  }

  // Vehicle insurance (1 point)
  if (insuranceCoverage.vehicle?.covered) insuranceScore += 1;

  // Home insurance (1 point)
  if (insuranceCoverage.home?.covered) insuranceScore += 1;

  // Critical illness (1 point)
  if (insuranceCoverage.critical_illness?.covered) insuranceScore += 1;

  // Personal accident (1 point)
  if (insuranceCoverage.personal_accident?.covered) insuranceScore += 1;

  insuranceScore = Math.min(20, insuranceScore);

  // ── 5. Wealth Buffer & Dependencies Score (0-20) ──
  const wealthRatio = investments / Math.max(annualIncome, 1);
  let wealthScore = clamp(wealthRatio * 10, 0, 12);

  // Dependency penalty
  const dependencyRatio = dependents / Math.max(earningMembers, 1);
  if (dependencyRatio > 4) wealthScore = Math.max(0, wealthScore - 4);
  else if (dependencyRatio > 2) wealthScore = Math.max(0, wealthScore - 2);

  // Age adjustment
  if (age < 35 && wealthRatio > 1) wealthScore += 3;
  if (age > 50 && wealthRatio < 5) wealthScore = Math.max(0, wealthScore - 3);

  // City cost-of-living adjustment
  if (cityData.tier === 1 && savingsRate < 0.15) wealthScore = Math.max(0, wealthScore - 2);

  wealthScore = clamp(wealthScore, 0, 20);

  // ── Total ──
  const totalScore = Math.round(
    savingsScore + emergencyScore + debtScore + insuranceScore + wealthScore
  );

  return {
    score: clamp(totalScore, 0, 100),
    breakdown: {
      savings: { score: Math.round(savingsScore), max: 20, label: "Savings Rate", icon: "💰" },
      emergency: { score: Math.round(emergencyScore), max: 20, label: "Emergency Fund", icon: "🆘" },
      debt: { score: Math.round(debtScore), max: 20, label: "Debt Health", icon: "📊" },
      insurance: { score: Math.round(insuranceScore), max: 20, label: "Insurance Cover", icon: "🛡️" },
      wealth: { score: Math.round(wealthScore), max: 20, label: "Wealth Buffer", icon: "📈" },
    },
    metrics: {
      savingsRate: (savingsRate * 100).toFixed(1),
      monthsCovered: monthsCovered.toFixed(1),
      dti: (dti * 100).toFixed(1),
      annualIncome,
      monthlyBurn,
      totalLoans: loans.length,
    },
  };
}
