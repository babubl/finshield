import { formatINR } from './utils';

/**
 * Analyze insurance gaps and return actionable recommendations.
 */
export function analyzeInsuranceGaps(profile) {
  const {
    monthlyIncome = 0,
    age = 30,
    dependents = 0,
    earningMembers = 1,
    insuranceCoverage = {},
    city = "Other Tier 2",
  } = profile;

  const annualIncome = monthlyIncome * 12;
  const gaps = [];

  // ── Health Insurance ──
  const idealHealth = dependents >= 3 ? 2500000 : dependents >= 1 ? 1500000 : 500000;
  const currentHealth = insuranceCoverage.health?.amount || 0;

  if (!insuranceCoverage.health?.covered) {
    gaps.push({
      type: "health",
      severity: "critical",
      title: "No Health Insurance",
      icon: "🏥",
      recommendation: `Get a family floater of at least ${formatINR(idealHealth)}. A single hospitalization in a private hospital can cost ₹3-10L+.`,
      gap: idealHealth,
      premiumEstimate: Math.round(idealHealth * 0.02),
      priority: 1,
    });
  } else if (currentHealth < idealHealth * 0.7) {
    gaps.push({
      type: "health",
      severity: "warning",
      title: "Insufficient Health Cover",
      icon: "🏥",
      recommendation: `Current cover of ${formatINR(currentHealth)} is low. Get a super top-up plan to reach ${formatINR(idealHealth)} at very low cost.`,
      gap: idealHealth - currentHealth,
      premiumEstimate: Math.round((idealHealth - currentHealth) * 0.008),
      priority: 2,
    });
  }

  // ── Term Life Insurance ──
  const idealTerm = annualIncome * (age < 40 ? 15 : age < 50 ? 12 : 10);
  const currentTerm = insuranceCoverage.term_life?.amount || 0;

  if (dependents > 0 && !insuranceCoverage.term_life?.covered) {
    gaps.push({
      type: "term_life",
      severity: "critical",
      title: "No Term Life Insurance",
      icon: "🛡️",
      recommendation: `With ${dependents} dependents, you need at least ${formatINR(idealTerm)} term cover. This is the most critical insurance for any earning member.`,
      gap: idealTerm,
      premiumEstimate: Math.round(idealTerm * (age < 35 ? 0.002 : age < 45 ? 0.004 : 0.007)),
      priority: 1,
    });
  } else if (dependents > 0 && currentTerm < idealTerm * 0.6) {
    gaps.push({
      type: "term_life",
      severity: "warning",
      title: "Insufficient Term Cover",
      icon: "🛡️",
      recommendation: `Cover of ${formatINR(currentTerm)} is below recommended ${formatINR(idealTerm)} (10-15x annual income). Top up with another term plan.`,
      gap: idealTerm - currentTerm,
      premiumEstimate: Math.round((idealTerm - currentTerm) * (age < 35 ? 0.002 : 0.004)),
      priority: 2,
    });
  }

  // ── Critical Illness ──
  if (age >= 30 && !insuranceCoverage.critical_illness?.covered) {
    const ciCover = Math.max(2500000, annualIncome * 3);
    gaps.push({
      type: "critical_illness",
      severity: age > 40 ? "warning" : "moderate",
      title: "No Critical Illness Cover",
      icon: "💊",
      recommendation: `Cancer, heart attack, stroke — these require ₹25-50L+ treatment. Get CI cover of ${formatINR(ciCover)} as rider or standalone.`,
      gap: ciCover,
      premiumEstimate: age < 40 ? 6000 : age < 50 ? 12000 : 22000,
      priority: 3,
    });
  }

  // ── Personal Accident ──
  if (!insuranceCoverage.personal_accident?.covered) {
    const paCover = annualIncome * 3;
    gaps.push({
      type: "personal_accident",
      severity: "moderate",
      title: "No Personal Accident Cover",
      icon: "⚕️",
      recommendation: `PA cover of ${formatINR(paCover)} protects against disability and accidental death at very low premiums.`,
      gap: paCover,
      premiumEstimate: Math.round(paCover * 0.0005),
      priority: 4,
    });
  }

  // ── Home Insurance ──
  if (!insuranceCoverage.home?.covered) {
    gaps.push({
      type: "home",
      severity: "moderate",
      title: "No Home Insurance",
      icon: "🏠",
      recommendation: "Protect your home against fire, flood, earthquake, and theft. Often costs less than ₹5000/year.",
      gap: 0,
      premiumEstimate: 3000,
      priority: 5,
    });
  }

  // Sort by priority
  gaps.sort((a, b) => a.priority - b.priority);

  // Calculate total premium cost
  const totalAnnualPremium = gaps.reduce((s, g) => s + g.premiumEstimate, 0);
  const totalGap = gaps.reduce((s, g) => s + g.gap, 0);

  return {
    gaps,
    totalAnnualPremium,
    totalGap,
    criticalCount: gaps.filter(g => g.severity === "critical").length,
    warningCount: gaps.filter(g => g.severity === "warning").length,
    score: gaps.length === 0 ? 100 : Math.max(0, 100 - gaps.reduce((s, g) => {
      if (g.severity === "critical") return s + 30;
      if (g.severity === "warning") return s + 15;
      return s + 5;
    }, 0)),
  };
}
