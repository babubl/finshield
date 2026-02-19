import { formatINR } from './utils';

/**
 * Simulate financial shocks against household profile.
 * Returns survival months, shortfall, and whether a forced loan would be needed.
 */
export function simulateShock(profile, shockType) {
  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    totalEMI = 0,
    emergencyFund = 0,
    investments = 0,
    insuranceCoverage = {},
  } = profile;

  const monthlyBurn = monthlyExpenses + totalEMI;
  // 30% of investments treated as accessible (liquid MF, FD that can be broken)
  const liquidInvestments = investments * 0.3;
  const totalLiquid = emergencyFund + liquidInvestments;

  const healthCover = insuranceCoverage.health?.covered
    ? (insuranceCoverage.health?.amount || 0)
    : 0;

  const shocks = {
    job_loss: {
      title: "Job Loss",
      icon: "💼",
      description: "Complete income loss for the primary earner. You need to survive on savings until you find a new role.",
      monthlyImpact: monthlyIncome * 0.8, // lose 80% (some side income assumed)
      oneTimeImpact: 0,
    },
    medical_5l: {
      title: "₹5L Medical Emergency",
      icon: "🏥",
      description: "Major hospitalization or surgery. Insurance may cover part of it.",
      monthlyImpact: 0,
      oneTimeImpact: Math.max(0, 500000 - healthCover * 0.7), // insurance covers 70%
    },
    medical_10l: {
      title: "₹10L Medical Crisis",
      icon: "🚨",
      description: "Critical illness, prolonged ICU stay, or major accident requiring extensive treatment.",
      monthlyImpact: 15000, // ongoing medication costs
      oneTimeImpact: Math.max(0, 1000000 - healthCover * 0.6),
    },
    income_50: {
      title: "50% Income Cut",
      icon: "📉",
      description: "Salary cut, business slowdown, or freelance drought. EMIs still need to be paid.",
      monthlyImpact: monthlyIncome * 0.5,
      oneTimeImpact: 0,
    },
    home_repair: {
      title: "Major Home Repair",
      icon: "🏠",
      description: "Roof damage, plumbing overhaul, or structural repair that can't wait.",
      monthlyImpact: 0,
      oneTimeImpact: 300000,
    },
    double_shock: {
      title: "Double Shock",
      icon: "⚡",
      description: "Job loss AND a medical emergency hitting simultaneously — the nightmare scenario.",
      monthlyImpact: monthlyIncome * 0.8,
      oneTimeImpact: Math.max(0, 500000 - healthCover * 0.5),
    },
  };

  const shock = shocks[shockType];
  if (!shock) return null;

  // Calculate impact
  const remainingAfterOneTime = totalLiquid - shock.oneTimeImpact;
  const adjustedMonthlyBurn = monthlyBurn + shock.monthlyImpact;
  const survivalMonths = remainingAfterOneTime > 0 && adjustedMonthlyBurn > 0
    ? remainingAfterOneTime / adjustedMonthlyBurn
    : 0;

  const shortfall = shock.oneTimeImpact > totalLiquid
    ? shock.oneTimeImpact - totalLiquid
    : 0;

  const needsLoan = shortfall > 0;
  // Estimated EMI at ~18% PA for the shortfall over 24 months
  const estimatedEMI = needsLoan
    ? Math.round((shortfall * (0.015) * Math.pow(1.015, 24)) / (Math.pow(1.015, 24) - 1))
    : 0;

  // Severity classification
  let severity;
  if (survivalMonths < 1) severity = "critical";
  else if (survivalMonths < 3) severity = "danger";
  else if (survivalMonths < 6) severity = "warning";
  else severity = "safe";

  return {
    ...shock,
    shockType,
    survivalMonths: Math.max(0, survivalMonths).toFixed(1),
    shortfall,
    needsLoan,
    estimatedEMI,
    severity,
    totalLiquid,
    adjustedMonthlyBurn,
  };
}

/**
 * Run all shock simulations at once.
 */
export function simulateAllShocks(profile) {
  const types = ["job_loss", "medical_5l", "medical_10l", "income_50", "home_repair", "double_shock"];
  const results = {};
  types.forEach(type => {
    results[type] = simulateShock(profile, type);
  });
  return results;
}
