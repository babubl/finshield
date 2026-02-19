/**
 * Debt Optimizer — Avalanche vs Snowball comparison
 * Calculates interest savings and time-to-debt-free for each strategy.
 */
export function optimizeDebt(loans, extraPayment = 0) {
  const activeLloans = loans.filter(l => (l.emi || 0) > 0 && (l.outstanding || 0) > 0);

  if (activeLloans.length === 0) {
    return {
      avalanche: [], snowball: [],
      avalancheSaving: 0, snowballSaving: 0,
      avalancheMonths: 0, snowballMonths: 0, normalMonths: 0,
      totalOutstanding: 0, totalEMI: 0,
    };
  }

  const avalanche = [...activeLloans].sort((a, b) => (b.rate || 0) - (a.rate || 0));
  const snowball = [...activeLloans].sort((a, b) => (a.outstanding || 0) - (b.outstanding || 0));
  const normal = [...activeLloans]; // original order

  const simulate = (sorted, extra) => {
    let remaining = sorted.map(l => ({
      ...l,
      balance: l.outstanding || 0,
    }));
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 480; // 40 year cap
    const milestones = []; // when each loan gets paid off

    while (remaining.length > 0 && months < maxMonths) {
      months++;
      let extraLeft = extra;

      for (let i = 0; i < remaining.length; i++) {
        const l = remaining[i];
        const monthlyRate = (l.rate || 0) / (12 * 100);
        const interest = l.balance * monthlyRate;
        totalInterest += interest;

        let payment = (l.emi || 0);
        // Extra payment goes to first loan in sorted order
        if (i === 0 && extraLeft > 0) {
          payment += extraLeft;
          extraLeft = 0;
        }

        l.balance -= (payment - interest);

        if (l.balance <= 0) {
          milestones.push({ ...l, paidOffMonth: months });
          // Freed-up EMI gets added to extra for next month
          extraLeft += l.emi || 0;
        }
      }

      remaining = remaining.filter(l => l.balance > 0);
    }

    return { totalInterest, months, milestones };
  };

  const normalResult = simulate(normal, 0);
  const avalancheResult = simulate(avalanche, extraPayment);
  const snowballResult = simulate(snowball, extraPayment);

  const totalOutstanding = activeLloans.reduce((s, l) => s + (l.outstanding || 0), 0);
  const totalEMI = activeLloans.reduce((s, l) => s + (l.emi || 0), 0);

  return {
    avalanche: avalanche.map((l, i) => ({ ...l, priority: i + 1, strategy: "Highest interest first" })),
    snowball: snowball.map((l, i) => ({ ...l, priority: i + 1, strategy: "Smallest balance first" })),
    avalancheSaving: Math.max(0, normalResult.totalInterest - avalancheResult.totalInterest),
    snowballSaving: Math.max(0, normalResult.totalInterest - snowballResult.totalInterest),
    avalancheMonths: avalancheResult.months,
    snowballMonths: snowballResult.months,
    normalMonths: normalResult.months,
    avalancheMilestones: avalancheResult.milestones,
    snowballMilestones: snowballResult.milestones,
    totalOutstanding,
    totalEMI,
    normalInterest: normalResult.totalInterest,
  };
}
