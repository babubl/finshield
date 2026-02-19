import { Card, InputField, SelectField } from './ui';
import { CITIES, LOAN_TYPES, INSURANCE_TYPES } from '../constants';

export function ProfileInput({ profile, onProfileChange, onAddLoan, onUpdateLoan, onRemoveLoan, onToggleInsurance, totalEMI, onAnalyze }) {
  return (
    <div className="stagger" style={{ display: 'grid', gap: 20 }}>
      {/* Basic Info */}
      <Card title="Household Profile" icon="👨‍👩‍👧‍👦" accent="var(--accent-indigo)">
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <InputField label="Monthly Income (Net)" value={profile.monthlyIncome} onChange={v => onProfileChange('monthlyIncome', v)} hint="After tax take-home" />
          <InputField label="Monthly Expenses" value={profile.monthlyExpenses} onChange={v => onProfileChange('monthlyExpenses', v)} hint="Rent, food, utilities, etc." />
          <InputField label="Emergency Fund" value={profile.emergencyFund} onChange={v => onProfileChange('emergencyFund', v)} hint="Liquid savings for emergencies" />
          <InputField label="Total Investments" value={profile.investments} onChange={v => onProfileChange('investments', v)} hint="MF, stocks, FD, PF, NPS, etc." />
          <InputField label="Your Age" value={profile.age} onChange={v => onProfileChange('age', v)} prefix="" suffix="years" />
          <InputField label="Dependents" value={profile.dependents} onChange={v => onProfileChange('dependents', v)} prefix="" suffix="people" hint="Spouse, kids, parents" />
          <InputField label="Earning Members" value={profile.earningMembers} onChange={v => onProfileChange('earningMembers', v)} prefix="" />
          <SelectField label="City" value={profile.city} onChange={v => onProfileChange('city', v)}
            options={Object.keys(CITIES).map(c => ({ value: c, label: c }))} />
        </div>
      </Card>

      {/* Loans */}
      <Card title="Loans & EMIs" icon="🏦" accent="var(--accent-amber)">
        {profile.loans.map((loan, idx) => (
          <div key={loan.id} style={{
            background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
            padding: 16, marginBottom: 12, border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>Loan #{idx + 1}</span>
              <button onClick={() => onRemoveLoan(loan.id)} style={{
                background: 'rgba(220,38,38,0.12)', color: '#DC2626', border: 'none',
                borderRadius: 8, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600,
              }}>Remove</button>
            </div>
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <SelectField label="Type" value={loan.type} onChange={v => {
                const lt = LOAN_TYPES.find(t => t.id === v);
                onUpdateLoan(loan.id, 'type', v);
                if (lt) {
                  onUpdateLoan(loan.id, 'rate', lt.avgRate);
                  onUpdateLoan(loan.id, 'label', lt.label);
                }
              }} options={LOAN_TYPES.map(t => ({ value: t.id, label: `${t.icon} ${t.label}` }))} />
              <InputField label="Interest Rate" value={loan.rate} onChange={v => onUpdateLoan(loan.id, 'rate', v)} prefix="" suffix="% p.a." />
              <InputField label="Monthly EMI" value={loan.emi} onChange={v => onUpdateLoan(loan.id, 'emi', v)} />
              <InputField label="Outstanding Amount" value={loan.outstanding} onChange={v => onUpdateLoan(loan.id, 'outstanding', v)} />
            </div>
          </div>
        ))}

        <button onClick={onAddLoan} style={{
          width: '100%', padding: 14,
          background: 'var(--bg-secondary)', border: '2px dashed var(--border-hover)',
          borderRadius: 'var(--radius-md)', color: 'var(--accent-soft)',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
        }}>+ Add Loan / EMI</button>

        {totalEMI > 0 && (
          <div style={{
            marginTop: 12, padding: '10px 16px', background: 'rgba(245,158,11,0.06)',
            borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between',
          }}>
            <span style={{ color: 'var(--accent-amber)', fontSize: 13, fontWeight: 600 }}>Total Monthly EMI</span>
            <span style={{ color: 'var(--accent-amber)', fontSize: 15, fontWeight: 800 }}>
              ₹{Math.round(totalEMI).toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </Card>

      {/* Insurance */}
      <Card title="Insurance Coverage" icon="🛡️" accent="var(--accent-green)">
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {INSURANCE_TYPES.map(ins => {
            const covered = profile.insuranceCoverage[ins.id]?.covered;
            return (
              <div key={ins.id} style={{
                background: covered ? 'rgba(16,185,129,0.06)' : 'var(--bg-tertiary)',
                border: `1px solid ${covered ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', padding: 14, cursor: 'pointer', transition: 'all 0.2s',
              }} onClick={() => onToggleInsurance(ins.id, 'covered', !covered)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: ins.hasAmount && covered ? 10 : 0 }}>
                  <span style={{ fontSize: 18 }}>{ins.icon}</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{ins.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 18 }}>{covered ? '✅' : '⬜'}</span>
                </div>
                {covered && ins.hasAmount && (
                  <div onClick={e => e.stopPropagation()}>
                    <InputField label="Cover Amount" value={profile.insuranceCoverage[ins.id]?.amount || ''}
                      onChange={v => onToggleInsurance(ins.id, 'amount', v)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Analyze Button */}
      <button onClick={onAnalyze} style={{
        width: '100%', padding: 18,
        background: 'var(--gradient-brand)', border: 'none',
        borderRadius: 'var(--radius-lg)', color: '#fff', fontSize: 18, fontWeight: 700,
        cursor: 'pointer', boxShadow: 'var(--shadow-brand)', transition: 'all 0.3s', letterSpacing: 0.5,
      }}>
        🛡️ Analyze My Financial Resilience
      </button>
    </div>
  );
}
