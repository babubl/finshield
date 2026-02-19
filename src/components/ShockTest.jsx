import { Card, Badge, MetricBox } from './ui';
import { formatINR } from '../engine';
import { SEVERITY_COLORS } from '../constants';

export function ShockTest({ shockResults }) {
  return (
    <div className="stagger" style={{ display: 'grid', gap: 16 }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>
        How long can your household survive each financial shock? This stress-tests your emergency fund, liquid assets, and insurance coverage against real-world scenarios.
      </div>

      {Object.entries(shockResults).map(([key, shock]) => {
        if (!shock) return null;
        const sColor = SEVERITY_COLORS[shock.severity] || SEVERITY_COLORS.warning;

        return (
          <Card key={key} accent={sColor}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 26 }}>{shock.icon}</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}>{shock.title}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{shock.description}</p>
              </div>
              <Badge color={sColor}>{shock.severity}</Badge>
            </div>

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={{
                background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                padding: 14, textAlign: 'center',
              }}>
                <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Survival</div>
                <div style={{ color: sColor, fontSize: 26, fontWeight: 800 }}>{shock.survivalMonths}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>months</div>
              </div>
              <div style={{
                background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                padding: 14, textAlign: 'center',
              }}>
                <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Shortfall</div>
                <div style={{ color: shock.shortfall > 0 ? '#DC2626' : '#16A34A', fontSize: 18, fontWeight: 800 }}>
                  {shock.shortfall > 0 ? formatINR(shock.shortfall) : 'None'}
                </div>
              </div>
              <div style={{
                background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                padding: 14, textAlign: 'center',
              }}>
                <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Forced Loan EMI</div>
                <div style={{ color: shock.needsLoan ? '#EA580C' : '#16A34A', fontSize: 18, fontWeight: 800 }}>
                  {shock.needsLoan ? `${formatINR(shock.estimatedEMI)}/mo` : '—'}
                </div>
              </div>
            </div>

            {shock.severity === 'critical' && (
              <div style={{
                marginTop: 12, padding: '10px 14px', background: 'rgba(220,38,38,0.08)',
                borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #DC2626',
              }}>
                <span style={{ color: '#DC2626', fontSize: 12, fontWeight: 600 }}>⚠️ You would run out of funds within {shock.survivalMonths} months and need to borrow or sell assets.</span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
