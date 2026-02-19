import { Card, ProgressRing } from './ui';
import { formatINR } from '../engine';

export function FITimer({ fiResult }) {
  if (!fiResult) return null;

  return (
    <div className="stagger" style={{ display: 'grid', gap: 20 }}>
      {/* Main FI Card */}
      <Card accent="var(--accent-teal)">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: 'var(--text-dim)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
            Your Financial Independence Number
          </div>
          <div style={{ color: 'var(--accent-teal)', fontSize: 40, fontWeight: 800 }}>
            {formatINR(fiResult.fiNumber)}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
            Based on 25× annual expenses (4% safe withdrawal rate)
          </div>
        </div>

        {/* Progress Ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <ProgressRing progress={fiResult.currentProgress} />
        </div>

        {/* Key Metrics */}
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Years to FI</div>
            <div style={{ color: fiResult.yearsToFI === Infinity ? '#DC2626' : 'var(--text-primary)', fontSize: 32, fontWeight: 800 }}>
              {fiResult.yearsToFI === Infinity ? '∞' : fiResult.yearsToFI}
            </div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>FI Age</div>
            <div style={{ color: 'var(--text-primary)', fontSize: 32, fontWeight: 800 }}>
              {fiResult.fiAge}
            </div>
          </div>
        </div>
      </Card>

      {/* Scenario Comparison */}
      {fiResult.scenarios && fiResult.scenarios.length > 0 && (
        <Card title="Scenario Analysis" icon="📊" accent="var(--accent-violet)">
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
            How different strategies impact your FI timeline:
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            {fiResult.scenarios.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: i === 0 ? 'rgba(99,102,241,0.08)' : 'var(--bg-tertiary)',
                border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', padding: '12px 16px',
              }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>{s.description}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{
                    color: s.years === Infinity ? '#DC2626' : s.years <= fiResult.yearsToFI ? '#16A34A' : 'var(--text-primary)',
                    fontSize: 20, fontWeight: 800,
                  }}>
                    {s.years === Infinity ? '∞' : s.years}
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>
                    {s.fiAge === '65+' ? '65+' : `Age ${s.fiAge}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Suggestions */}
      {fiResult.suggestions.length > 0 && (
        <Card title="Accelerate Your FI" icon="🚀" accent="var(--accent-amber)">
          {fiResult.suggestions.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0',
              borderBottom: i < fiResult.suggestions.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ color: 'var(--accent-amber)', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>→</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{s}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Assumptions */}
      <Card title="FI Assumptions" icon="📐" accent="var(--text-dim)">
        <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.9 }}>
          <p style={{ margin: '0 0 6px' }}>• Expected nominal return: 10% (equity-heavy diversified portfolio)</p>
          <p style={{ margin: '0 0 6px' }}>• Inflation assumption: 6% (India long-term average)</p>
          <p style={{ margin: '0 0 6px' }}>• Real return used: 4% (nominal - inflation)</p>
          <p style={{ margin: '0 0 6px' }}>• Safe withdrawal rate: 4% (consider 3-3.5% for conservative Indian planning)</p>
          <p style={{ margin: 0 }}>• FI Number = 25× your current annual expenses (scales with inflation over time)</p>
        </div>
      </Card>
    </div>
  );
}
