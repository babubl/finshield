import { Card, Badge } from './ui';
import { formatINR } from '../engine';
import { SEVERITY_COLORS, INSURANCE_TYPES } from '../constants';

export function InsuranceGaps({ insuranceResult }) {
  const { gaps, totalAnnualPremium, criticalCount, warningCount } = insuranceResult;

  return (
    <div className="stagger" style={{ display: 'grid', gap: 16 }}>
      {/* Summary */}
      {gaps.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
        }} className="grid-3">
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 16, textAlign: 'center',
          }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Gaps Found</div>
            <div style={{ color: '#DC2626', fontSize: 28, fontWeight: 800 }}>{gaps.length}</div>
          </div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 16, textAlign: 'center',
          }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Critical</div>
            <div style={{ color: criticalCount > 0 ? '#DC2626' : '#16A34A', fontSize: 28, fontWeight: 800 }}>{criticalCount}</div>
          </div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 16, textAlign: 'center',
          }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Est. Annual Cost</div>
            <div style={{ color: 'var(--accent-soft)', fontSize: 22, fontWeight: 800 }}>{formatINR(totalAnnualPremium)}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>to fix all gaps</div>
          </div>
        </div>
      )}

      {/* Gap Cards */}
      {gaps.length === 0 ? (
        <Card title="Insurance Coverage Looks Good! ✅" icon="✅" accent="var(--accent-green)">
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7 }}>
            No critical insurance gaps detected. Review your coverage annually as your family and income grows.
            Consider increasing health cover every 2-3 years to keep up with medical inflation.
          </p>
        </Card>
      ) : (
        gaps.map((gap, i) => {
          const sColor = SEVERITY_COLORS[gap.severity] || SEVERITY_COLORS.moderate;
          return (
            <Card key={i} accent={sColor}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{gap.icon}</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>{gap.title}</span>
                </div>
                <Badge color={sColor}>{gap.severity}</Badge>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 14, lineHeight: 1.6 }}>
                {gap.recommendation}
              </p>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Coverage Gap</div>
                  <div style={{ color: sColor, fontSize: 20, fontWeight: 800 }}>{gap.gap > 0 ? formatINR(gap.gap) : '—'}</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Est. Annual Premium</div>
                  <div style={{ color: 'var(--accent-soft)', fontSize: 20, fontWeight: 800 }}>{formatINR(gap.premiumEstimate)}</div>
                </div>
              </div>
            </Card>
          );
        })
      )}

      {/* Pro Tips */}
      <Card title="Insurance Pro Tips" icon="💡" accent="var(--accent-teal)">
        <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.9 }}>
          <p style={{ margin: '0 0 8px' }}>• Always buy <strong style={{ color: 'var(--text-secondary)' }}>pure term insurance</strong> — never endowment, money-back, or ULIP plans</p>
          <p style={{ margin: '0 0 8px' }}>• Health insurance: Get a <strong style={{ color: 'var(--text-secondary)' }}>base plan + super top-up</strong> for cost-effective high coverage</p>
          <p style={{ margin: '0 0 8px' }}>• Review and increase coverage annually — medical inflation in India is 10-14% per year</p>
          <p style={{ margin: '0 0 8px' }}>• Critical illness riders are significantly cheaper when added <strong style={{ color: 'var(--text-secondary)' }}>before age 40</strong></p>
          <p style={{ margin: '0 0 8px' }}>• Compare quotes across platforms before buying (PolicyBazaar, Ditto, Coverfox)</p>
          <p style={{ margin: 0 }}>• Ensure all family members including parents are covered under health insurance</p>
        </div>
      </Card>
    </div>
  );
}
