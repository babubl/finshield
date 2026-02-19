import { useState } from 'react';
import { getGrade, pctColor } from '../engine';

// ── Score Gauge (SVG Arc) ──
export function ScoreGauge({ score, size = 220 }) {
  const grade = getGrade(score);
  const arcLength = 2 * Math.PI * 80 * 0.75;
  const offset = arcLength - (score / 100) * arcLength;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.68} viewBox="0 0 200 136">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="25%" stopColor="#EA580C" />
            <stop offset="50%" stopColor="#CA8A04" />
            <stop offset="75%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Background arc */}
        <path d="M 20 120 A 80 80 0 1 1 180 120" fill="none" stroke="#1a1a2e" strokeWidth="14" strokeLinecap="round" />
        {/* Score arc */}
        <path d="M 20 120 A 80 80 0 1 1 180 120" fill="none" stroke="url(#scoreGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={arcLength} strokeDashoffset={offset} filter="url(#glow)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        {/* Score text */}
        <text x="100" y="82" textAnchor="middle" fill={grade.color} fontSize="46" fontWeight="800"
          fontFamily="'DM Sans', sans-serif">{score}</text>
        <text x="100" y="105" textAnchor="middle" fill={grade.color} fontSize="13" fontWeight="700"
          fontFamily="'DM Sans', sans-serif" letterSpacing="3">{grade.label}</text>
        <text x="100" y="125" textAnchor="middle" fill="#94a3b8" fontSize="9"
          fontFamily="'DM Sans', sans-serif">{grade.desc}</text>
      </svg>
    </div>
  );
}

// ── Breakdown Bar ──
export function BreakdownBar({ label, score, max, icon }) {
  const pct = (score / max) * 100;
  const color = pctColor(pct);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ color: '#c5c6d0', fontSize: 13 }}>
          {icon && <span style={{ marginRight: 6 }}>{icon}</span>}{label}
        </span>
        <span style={{ color, fontSize: 13, fontWeight: 700 }}>{score}/{max}</span>
      </div>
      <div style={{ background: '#1a1a2e', borderRadius: 6, height: 8, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color, borderRadius: 6,
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

// ── Input Field ──
export function InputField({ label, value, onChange, prefix = "₹", suffix = "", type = "number", placeholder = "0", hint = "" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        color: 'var(--accent-soft)', fontSize: 11, fontWeight: 600, letterSpacing: 0.8,
        display: 'block', marginBottom: 6, textTransform: 'uppercase',
      }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--bg-tertiary)', border: `1px solid ${focused ? 'var(--accent-indigo)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)', padding: '10px 14px', transition: 'border-color 0.2s',
      }}>
        {prefix && <span style={{ color: 'var(--accent-indigo)', fontWeight: 700, marginRight: 8, fontSize: 15 }}>{prefix}</span>}
        <input type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: 15, width: '100%', fontWeight: 500,
          }} />
        {suffix && <span style={{ color: 'var(--text-dim)', fontSize: 13, marginLeft: 8, whiteSpace: 'nowrap' }}>{suffix}</span>}
      </div>
      {hint && <span style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 4, display: 'block' }}>{hint}</span>}
    </div>
  );
}

// ── Select Field ──
export function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        color: 'var(--accent-soft)', fontSize: 11, fontWeight: 600, letterSpacing: 0.8,
        display: 'block', marginBottom: 6, textTransform: 'uppercase',
      }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '10px 14px',
          color: 'var(--text-primary)', fontSize: 15, width: '100%', cursor: 'pointer', outline: 'none',
        }}>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

// ── Card ──
export function Card({ children, title, icon, accent = 'var(--accent-indigo)', className = '', style = {} }) {
  return (
    <div className={`animate-fade-in-up ${className}`} style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)', padding: 24, position: 'relative', overflow: 'hidden', ...style,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
          <h3 style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 700, margin: 0 }}>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

// ── Tab Button ──
export function TabButton({ label, active, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      background: active ? 'var(--gradient-brand)' : 'transparent',
      border: active ? 'none' : '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '10px 18px',
      color: active ? '#fff' : 'var(--text-muted)',
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>{label}
    </button>
  );
}

// ── Badge ──
export function Badge({ color, children }) {
  return (
    <span style={{
      background: color + '22', color, fontSize: 11, fontWeight: 700,
      padding: '3px 10px', borderRadius: 20, letterSpacing: 0.5, textTransform: 'uppercase',
    }}>{children}</span>
  );
}

// ── Metric Box ──
export function MetricBox({ label, value, color = 'var(--text-primary)', small = false }) {
  return (
    <div style={{
      background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
      padding: small ? 12 : 16, textAlign: 'center',
    }}>
      <div style={{
        color: 'var(--text-dim)', fontSize: 11, fontWeight: 600,
        letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: small ? 4 : 6,
      }}>{label}</div>
      <div style={{ color, fontSize: small ? 18 : 26, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

// ── Progress Ring ──
export function ProgressRing({ progress, size = 160, color = '#0d9488' }) {
  const r = (size / 2) - 10;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a1a2e" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', textAlign: 'center',
      }}>
        <div style={{ color, fontSize: 28, fontWeight: 800 }}>{progress.toFixed(1)}%</div>
        <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>achieved</div>
      </div>
    </div>
  );
}
