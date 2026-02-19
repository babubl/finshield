/**
 * Financial Independence Calculator
 * Uses the 4% safe withdrawal rule adapted for India.
 */
export function calculateFI(profile) {
  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    totalEMI = 0,
    investments = 0,
    age = 30,
  } = profile;

  const annualExpenses = (monthlyExpenses + totalEMI) * 12;
  const annualSavings = (monthlyIncome - monthlyExpenses - totalEMI) * 12;
  const fiNumber = annualExpenses * 25; // 4% rule
  const currentProgress = fiNumber > 0 ? Math.min((investments / fiNumber) * 100, 100) : 0;

  if (annualSavings <= 0 || monthlyIncome <= 0) {
    return {
      fiNumber,
      currentProgress,
      yearsToFI: Infinity,
      fiAge: "N/A",
      monthlyGap: Math.abs(annualSavings / 12),
      suggestions: [
        "Your expenses + EMIs exceed your income. Focus on reducing expenses or increasing income first.",
        "Start with eliminating high-interest debt (credit cards, personal loans).",
        "Even saving ₹5,000/month can start building your financial foundation.",
      ],
      scenarios: [],
    };
  }

  // Base scenario: 10% nominal - 6% inflation = 4% real return
  const calcYears = (corpus, annualSaving, realReturn) => {
    let c = corpus;
    let y = 0;
    const maxYears = 70;
    while (c < fiNumber && y < maxYears) {
      c = c * (1 + realReturn) + annualSaving;
      y++;
    }
    return y >= maxYears ? Infinity : y;
  };

  const baseYears = calcYears(investments, annualSavings, 0.04);
  const fiAge = baseYears === Infinity ? "65+" : age + baseYears;

  // Scenario analysis
  const scenarios = [
    {
      label: "Current Path",
      description: "Continue current savings rate",
      years: baseYears,
      fiAge: baseYears === Infinity ? "65+" : age + baseYears,
      monthlySavings: annualSavings / 12,
    },
    {
      label: "+10% Annual Step-up",
      description: "Increase savings by 10% every year",
      years: (() => {
        let c = investments;
        let saving = annualSavings;
        let y = 0;
        while (c < fiNumber && y < 70) {
          c = c * 1.04 + saving;
          saving *= 1.10;
          y++;
        }
        return y >= 70 ? Infinity : y;
      })(),
      fiAge: (() => {
        let c = investments;
        let saving = annualSavings;
        let y = 0;
        while (c < fiNumber && y < 70) { c = c * 1.04 + saving; saving *= 1.10; y++; }
        return y >= 70 ? "65+" : age + y;
      })(),
      monthlySavings: annualSavings / 12,
    },
    {
      label: "Aggressive (15% return)",
      description: "Higher equity allocation, 15% nominal return",
      years: calcYears(investments, annualSavings, 0.085), // 15% - 6.5%
      fiAge: (() => {
        const y = calcYears(investments, annualSavings, 0.085);
        return y === Infinity ? "65+" : age + y;
      })(),
      monthlySavings: annualSavings / 12,
    },
    {
      label: "Coast FI",
      description: "Stop saving, let investments compound to FI",
      years: (() => {
        let c = investments;
        let y = 0;
        while (c < fiNumber && y < 70) { c = c * 1.04; y++; }
        return y >= 70 ? Infinity : y;
      })(),
      fiAge: (() => {
        let c = investments;
        let y = 0;
        while (c < fiNumber && y < 70) { c = c * 1.04; y++; }
        return y >= 70 ? "65+" : age + y;
      })(),
      monthlySavings: 0,
    },
  ];

  // Suggestions
  const suggestions = [];
  if (baseYears > 25)
    suggestions.push("Increase monthly SIP by ₹10,000 — this alone could cut 3-5 years from your FI timeline.");
  if (baseYears > 20)
    suggestions.push("Consider annual step-up of 10% on investments to dramatically accelerate FI.");
  if (totalEMI > monthlyIncome * 0.3)
    suggestions.push("High EMI burden is delaying FI. Aggressively paying off debt frees up cash for investments.");
  if (investments < annualExpenses * 3)
    suggestions.push("Your corpus is less than 3x annual expenses. Priority: build this to at least 5x.");
  if (annualSavings / (annualExpenses + annualSavings) < 0.3)
    suggestions.push("Savings rate below 30% — aim for 40%+ to reach FI within 15-20 years.");
  if (age > 45 && baseYears > 15)
    suggestions.push("At your age, consider part-time work or phased retirement as a bridge to full FI.");
  if (suggestions.length === 0) {
    suggestions.push("You're on an excellent track! Consider tax-loss harvesting and rebalancing to optimize returns.");
    suggestions.push("Look into NPS for additional tax benefits under Section 80CCD(1B).");
  }

  return {
    fiNumber,
    currentProgress,
    yearsToFI: baseYears,
    fiAge,
    annualExpenses,
    annualSavings,
    monthlySavings: annualSavings / 12,
    suggestions,
    scenarios,
  };
}
