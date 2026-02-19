import { Card, InputField } from './ui';
import { formatINR } from '../engine';
import { LOAN_TYPES } from '../constants';

export function DebtPlan({ loans, debtResult, extraPayment, onExtraPaymentChange }) {
  const activeLoans = loans.filter(l => (l.emi || 0) > 0);

  if (activeLoans.length === 0) {
    return (
      <Card title="Debt-Free! 🎉" icon="🎉" accent="var(--accent-green)">
        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7 }}>
          Congratulations — you have no active loans. You're already ahead of most Indian households.
          Focus your cashflow on building investments and your emergency fund.
        </p>
      </Card>
    );
  }

  const getLoanIcon = (type) => LOAN_TYPES.find(t => t.id === type)?.icon || '📋';

  return (
    <div className="stagger" style={{ display: 'grid', gap: 20 }}>
      {/* Summary */}
      <Card title="Debt Overview" icon="📊" accent="var(--accent-amber)">
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Total Outstanding</div>
            <div style={{ color: '#EA580C', fontSize: 22, fontWeight: 800 }}>{formatINR(debtResult.totalOutstanding)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Monthly EMI</div>
            <div style={{ color: 'var(--accent-amber)', fontSize: 22, fontWeight: 800 }}>{formatINR(debtResult.totalEMI)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Normal Payoff</div>
            <div style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 800 }}>{debtResult.normalMonths} mo</div>
          </div>
        </div>
        <InputField label="Extra Monthly Payment Toward Debt" value={extraPayment} onChange={onExtraPaymentChange}
          hint="This amount will be directed to the priority loan each month" />
      </Card>

      {/* Strategy Comparison */}
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Avalanche */}
        <Card title="Avalanche Method" icon="🏔️" accent="var(--accent-indigo)">
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
            Pay highest interest rate first. <strong style={{ color: 'var(--accent-soft)' }}>Saves the most money</strong> mathematically.
          </p>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center', marginBottom: 12 }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Interest Saved</div>
            <div style={{ color: '#16A34A', fontSize: 24, fontWeight: 800 }}>{formatINR(debtResult.avalancheSaving)}</div>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', marginBottom: 14 }}>
            Debt-free in <strong style={{ color: 'var(--accent-soft)' }}>{debtResult.avalancheMonths} months</strong>
            {debtResult.normalMonths > debtResult.avalancheMonths && (
              <span style={{ color: '#16A34A' }}> ({debtResult.normalMonths - debtResult.avalancheMonths} months faster)</span>
            )}
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Payment Priority Order:</div>
          {debtResult.avalanche.map((l, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13,
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-indigo)', fontWeight: 700, marginRight: 6 }}>#{i + 1}</span>
                {getLoanIcon(l.type)} {l.rate}% p.a.
              </span>
              <span style={{ color: 'var(--accent-soft)', fontWeight: 600 }}>{formatINR(l.outstanding)}</span>
            </div>
          ))}
        </Card>

        {/* Snowball */}
        <Card title="Snowball Method" icon="⛄" accent="var(--accent-green)">
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
            Pay smallest balance first. <strong style={{ color: '#10b981' }}>Quick wins for motivation</strong> and psychological momentum.
          </p>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 14, textAlign: 'center', marginBottom: 12 }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Interest Saved</div>
            <div style={{ color: '#16A34A', fontSize: 24, fontWeight: 800 }}>{formatINR(debtResult.snowballSaving)}</div>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', marginBottom: 14 }}>
            Debt-free in <strong style={{ color: '#10b981' }}>{debtResult.snowballMonths} months</strong>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Payment Priority Order:</div>
          {debtResult.snowball.map((l, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13,
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: '#10b981', fontWeight: 700, marginRight: 6 }}>#{i + 1}</span>
                {getLoanIcon(l.type)} {formatINR(l.outstanding)}
              </span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>{l.rate}% p.a.</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Recommendation */}
      <Card title="💡 Which strategy is right for you?" accent="var(--accent-violet)">
        <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.8 }}>
          <p style={{ margin: '0 0 8px' }}>
            <strong style={{ color: 'var(--accent-soft)' }}>Avalanche</strong> saves you <strong style={{ color: '#16A34A' }}>{formatINR(debtResult.avalancheSaving)}</strong> more in interest.
            Choose this if you're disciplined and motivated by numbers.
          </p>
          <p style={{ margin: '0 0 8px' }}>
            <strong style={{ color: '#10b981' }}>Snowball</strong> gives you quick wins by eliminating small debts first.
            Choose this if you need psychological momentum to stay on track.
          </p>
          <p style={{ margin: '0 0 8px' }}>
            Either strategy is far better than paying minimum EMIs only. The key is committing the extra ₹{extraPayment?.toLocaleString('en-IN') || 0}/month consistently.
          </p>
          <p style={{ margin: 0, color: 'var(--accent-amber)' }}>
            ⚡ Pro tip: Every time a loan gets paid off, redirect its EMI + extra payment to the next loan for accelerating effect.
          </p>
        </div>
      </Card>
    </div>
  );
}
