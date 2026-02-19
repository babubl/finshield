import { useState, useMemo, useCallback } from 'react';
import { ProfileInput, Dashboard, ShockTest, DebtPlan, InsuranceGaps, FITimer, TabButton } from './components';
import { computeVulnerabilityScore, simulateAllShocks, optimizeDebt, analyzeInsuranceGaps, calculateFI, getGrade } from './engine';
import { DEFAULT_PROFILE } from './constants';

const TABS = [
  { id: 'input', label: 'Profile', icon: '📝' },
  { id: 'dashboard', label: 'Score', icon: '🎯' },
  { id: 'shock', label: 'Shock Test', icon: '⚡' },
  { id: 'debt', label: 'Debt Plan', icon: '📊' },
  { id: 'insurance', label: 'Insurance', icon: '🛡️' },
  { id: 'fi', label: 'FI Timer', icon: '🏁' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE });
  const [results, setResults] = useState(null);
  const [shockResults, setShockResults] = useState({});
  const [extraPayment, setExtraPayment] = useState(5000);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Derived values
  const totalEMI = useMemo(() =>
    profile.loans.reduce((s, l) => s + (l.emi || 0), 0), [profile.loans]);

  const debtResult = useMemo(() =>
    optimizeDebt(profile.loans.filter(l => (l.emi || 0) > 0 && (l.outstanding || 0) > 0), extraPayment),
    [profile.loans, extraPayment]);

  const insuranceResult = useMemo(() =>
    analyzeInsuranceGaps({ ...profile, totalEMI }),
    [profile, totalEMI]);

  const fiResult = useMemo(() =>
    calculateFI({ ...profile, totalEMI }),
    [profile, totalEMI]);

  // Profile handlers
  const handleProfileChange = useCallback((key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  }, []);

  const addLoan = useCallback(() => {
    setProfile(prev => ({
      ...prev,
      loans: [...prev.loans, {
        id: Date.now(),
        type: 'personal',
        label: 'Personal Loan',
        emi: '',
        outstanding: '',
        rate: 14,
        tenure: 36,
      }],
    }));
  }, []);

  const updateLoan = useCallback((id, field, value) => {
    setProfile(prev => ({
      ...prev,
      loans: prev.loans.map(l => l.id === id ? { ...l, [field]: value } : l),
    }));
  }, []);

  const removeLoan = useCallback((id) => {
    setProfile(prev => ({ ...prev, loans: prev.loans.filter(l => l.id !== id) }));
  }, []);

  const toggleInsurance = useCallback((type, field, value) => {
    setProfile(prev => ({
      ...prev,
      insuranceCoverage: {
        ...prev.insuranceCoverage,
        [type]: { ...prev.insuranceCoverage[type], [field]: value },
      },
    }));
  }, []);

  // Analysis
  const analyzeProfile = useCallback(() => {
    const fullProfile = { ...profile, totalEMI };
    const res = computeVulnerabilityScore(fullProfile);
    setResults(res);

    const shocks = simulateAllShocks(fullProfile);
    setShockResults(shocks);

    // Animate score counter
    setAnimatedScore(0);
    const target = res.score;
    let current = 0;
    const step = () => {
      current += Math.max(1, Math.floor((target - current) / 8));
      if (current >= target) {
        setAnimatedScore(target);
        return;
      }
      setAnimatedScore(current);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [profile, totalEMI]);

  const handleTabClick = useCallback((tabId) => {
    if (tabId === 'input' || results) {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [results]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--gradient-header)',
        borderBottom: '1px solid var(--border)',
        padding: '20px 24px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'var(--gradient-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: '#fff',
                boxShadow: 'var(--shadow-glow)',
              }}>🛡</div>
              <div>
                <h1 style={{
                  color: 'var(--text-primary)', fontSize: 24, fontWeight: 800, margin: 0,
                  fontFamily: 'var(--font-display)', letterSpacing: -0.5,
                }}>FinShield</h1>
                <p style={{
                  color: 'var(--text-dim)', fontSize: 11, margin: 0,
                  letterSpacing: 1.5, textTransform: 'uppercase',
                }}>Financial Resilience Planner</p>
              </div>
            </div>
            {results && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: getGrade(results.score).color, fontSize: 30, fontWeight: 800 }}>{animatedScore}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>/100</span>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <nav style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {TABS.map(t => (
              <TabButton key={t.id} label={t.label} icon={t.icon}
                active={activeTab === t.id}
                onClick={() => handleTabClick(t.id)} />
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '24px 16px' }}>
        {activeTab === 'input' && (
          <ProfileInput
            profile={profile}
            onProfileChange={handleProfileChange}
            onAddLoan={addLoan}
            onUpdateLoan={updateLoan}
            onRemoveLoan={removeLoan}
            onToggleInsurance={toggleInsurance}
            totalEMI={totalEMI}
            onAnalyze={analyzeProfile}
          />
        )}

        {activeTab === 'dashboard' && results && (
          <Dashboard results={results} animatedScore={animatedScore} />
        )}

        {activeTab === 'shock' && results && (
          <ShockTest shockResults={shockResults} />
        )}

        {activeTab === 'debt' && results && (
          <DebtPlan
            loans={profile.loans}
            debtResult={debtResult}
            extraPayment={extraPayment}
            onExtraPaymentChange={setExtraPayment}
          />
        )}

        {activeTab === 'insurance' && results && (
          <InsuranceGaps insuranceResult={insuranceResult} />
        )}

        {activeTab === 'fi' && results && (
          <FITimer fiResult={fiResult} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '30px 16px 40px' }}>
        <p style={{ color: 'var(--text-ghost)', fontSize: 12, lineHeight: 1.6 }}>
          FinShield is a financial planning tool, not financial advice.
          Consult a SEBI-registered advisor for personalized recommendations.
        </p>
        <p style={{ color: '#1e293b', fontSize: 11, marginTop: 8 }}>
          Built with 💜 for Indian households • v1.0.0
        </p>
      </footer>
    </div>
  );
}
