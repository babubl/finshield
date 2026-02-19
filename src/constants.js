// ============================================================
// FINSHIELD CONSTANTS
// ============================================================

export const CITIES = {
  "Mumbai": { costMultiplier: 1.35, tier: 1 },
  "Delhi NCR": { costMultiplier: 1.25, tier: 1 },
  "Bangalore": { costMultiplier: 1.20, tier: 1 },
  "Chennai": { costMultiplier: 1.10, tier: 1 },
  "Hyderabad": { costMultiplier: 1.08, tier: 1 },
  "Pune": { costMultiplier: 1.05, tier: 1 },
  "Kolkata": { costMultiplier: 0.95, tier: 1 },
  "Ahmedabad": { costMultiplier: 0.90, tier: 2 },
  "Jaipur": { costMultiplier: 0.85, tier: 2 },
  "Lucknow": { costMultiplier: 0.80, tier: 2 },
  "Coimbatore": { costMultiplier: 0.82, tier: 2 },
  "Vizag": { costMultiplier: 0.78, tier: 2 },
  "Indore": { costMultiplier: 0.75, tier: 2 },
  "Nagpur": { costMultiplier: 0.76, tier: 2 },
  "Bhopal": { costMultiplier: 0.74, tier: 2 },
  "Kochi": { costMultiplier: 0.85, tier: 2 },
  "Chandigarh": { costMultiplier: 0.88, tier: 2 },
  "Other Tier 1": { costMultiplier: 1.0, tier: 1 },
  "Other Tier 2": { costMultiplier: 0.80, tier: 2 },
  "Other Tier 3": { costMultiplier: 0.65, tier: 3 },
};

export const LOAN_TYPES = [
  { id: "home", label: "Home Loan", icon: "🏠", avgRate: 8.5 },
  { id: "car", label: "Car Loan", icon: "🚗", avgRate: 9.5 },
  { id: "personal", label: "Personal Loan", icon: "💳", avgRate: 14 },
  { id: "education", label: "Education Loan", icon: "🎓", avgRate: 10 },
  { id: "gold", label: "Gold Loan", icon: "✨", avgRate: 9 },
  { id: "credit_card", label: "Credit Card Debt", icon: "💳", avgRate: 36 },
  { id: "bnpl", label: "BNPL / EMI Cards", icon: "📱", avgRate: 18 },
  { id: "two_wheeler", label: "Two-Wheeler Loan", icon: "🏍️", avgRate: 12 },
  { id: "business", label: "Business Loan", icon: "🏢", avgRate: 15 },
  { id: "other", label: "Other Loans", icon: "📋", avgRate: 12 },
];

export const INSURANCE_TYPES = [
  { id: "health", label: "Health Insurance", icon: "🏥", hasAmount: true },
  { id: "term_life", label: "Term Life Insurance", icon: "🛡️", hasAmount: true },
  { id: "vehicle", label: "Vehicle Insurance", icon: "🚗", hasAmount: false },
  { id: "home", label: "Home Insurance", icon: "🏠", hasAmount: false },
  { id: "critical_illness", label: "Critical Illness Cover", icon: "💊", hasAmount: true },
  { id: "personal_accident", label: "Personal Accident", icon: "⚕️", hasAmount: false },
];

export const GRADES = [
  { min: 0, max: 20, label: "FRAGILE", color: "#DC2626", bg: "#FEF2F2", emoji: "🔴", desc: "Extremely vulnerable to financial shocks" },
  { min: 21, max: 40, label: "EXPOSED", color: "#EA580C", bg: "#FFF7ED", emoji: "🟠", desc: "Significant gaps in financial safety net" },
  { min: 41, max: 60, label: "STABLE", color: "#CA8A04", bg: "#FEFCE8", emoji: "🟡", desc: "Basic coverage but room for improvement" },
  { min: 61, max: 80, label: "RESILIENT", color: "#16A34A", bg: "#F0FDF4", emoji: "🟢", desc: "Well-prepared for most financial shocks" },
  { min: 81, max: 100, label: "ANTI-FRAGILE", color: "#0D9488", bg: "#F0FDFA", emoji: "💎", desc: "Thrives under financial uncertainty" },
];

export const SHOCK_TYPES = [
  { id: "job_loss", label: "Job Loss", icon: "💼" },
  { id: "medical_5l", label: "₹5L Medical Emergency", icon: "🏥" },
  { id: "medical_10l", label: "₹10L Medical Crisis", icon: "🚨" },
  { id: "income_50", label: "50% Income Cut", icon: "📉" },
  { id: "home_repair", label: "Major Home Repair", icon: "🏠" },
  { id: "double_shock", label: "Double Shock", icon: "⚡" },
];

export const SEVERITY_COLORS = {
  critical: "#DC2626",
  danger: "#EA580C",
  warning: "#CA8A04",
  safe: "#16A34A",
  moderate: "#6366f1",
};

export const DEFAULT_PROFILE = {
  monthlyIncome: "",
  monthlyExpenses: "",
  emergencyFund: "",
  investments: "",
  dependents: 0,
  earningMembers: 1,
  age: 30,
  city: "Bangalore",
  loans: [],
  insuranceCoverage: {},
};
