import { ScoreGauge, BreakdownBar, Card, Badge, MetricBox } from './ui';

export function Dashboard({ results, animatedScore }) {
  if (!results) return null;

  const actions = [];
  const b = results.breakdown;

  if (b.emergency.score < 10) actions.push({ priority: 'HIGH', text: 'Build emergency fund — you have less than 3 months coverage. Target 6 months of expenses in liquid savings.', color: '#DC2626' });
  if (b.debt.score < 10) actions.push({ priority: 'HIGH', text: 'Debt-to-income is dangerously high. Focus on paying off high-interest debt first (credit cards, personal loans).', color: '#DC2626' });
  if (b.insurance.score < 8) actions.push({ priority: 'HIGH', text: 'Critical insurance gaps detected. Get health and term life coverage immediately — this protects your family.', color: '#DC2626' });
  if (b.savings.score < 10) actions.push({ priority: 'MEDIUM', text: 'Your savings rate is below 20%. Review subscriptions, lifestyle expenses, and find areas to optimize.', color: '#CA8A04' });
  if (b.wealth.score < 10) actions.push({ priority: 'MEDIUM', text: 'Investment corpus is low relative to income. Start SIPs in diversified equity funds for long-term growth.', color: '#CA8A04' });
  if (b.savings.score >= 15 && b.emergency.score >= 15 && b.debt.score >= 15 && b.insurance.score >= 12) {
    actions.push({ priority: 'OPTIMIZE', text: 'Solid foundation! Focus on tax-loss harvesting, rebalancing, and increasing equity allocation for higher returns.', color: '#16A34A' });
  }
  if (actions.length === 0) actions.push({ priority: 'GOOD', text: 'You\'re in great financial shape! Focus on optimizing tax efficiency and increasing equity allocation.', color: '#16A34A' });

  return (
    <div className="stagger" style={{ display: 'grid', gap: 20 }}>
      {/* Score Card */}
      <Card accent={results.score >= 60 ? 'var(--accent-green)' : results.score >= 40 ? 'var(--accent-yellow)' : 'var(--accent-red)'}>
        <ScoreGauge score={animatedScore} />
        <div style={{ marginTop: 20 }}>
          {Object.values(results.breakdown).map(b => (
            <BreakdownBar key={b.label} label={b.label} score={b.score} max={b.max} icon={b.icon} />
          ))}
        </div>
      </Card>

      {/* Quick Metrics */}
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <MetricBox label="Savings Rate" value={`${results.metrics.savingsRate}%`}
          color={parseFloat(results.metrics.savingsRate) > 20 ? '#16A34A' : '#DC2626'} />
        <MetricBox label="Months Covered" value={results.metrics.monthsCovered}
          color={parseFloat(results.metrics.monthsCovered) >= 6 ? '#16A34A' : '#CA8A04'} />
        <MetricBox label="Debt-to-Income" value={`${results.metrics.dti}%`}
          color={parseFloat(results.metrics.dti) < 30 ? '#16A34A' : '#DC2626'} />
      </div>

      {/* Priority Actions */}
      <Card title="Priority Actions" icon="🎯" accent="var(--accent-amber)">
        {actions.map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
            borderBottom: i < actions.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <Badge color={a.color}>{a.priority}</Badge>
            <span style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{a.text}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
