import { GRADES } from '../constants';

export const formatINR = (n) => {
  if (n === undefined || n === null || isNaN(n)) return "₹0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
};

export const formatINRFull = (n) => {
  if (n === undefined || n === null || isNaN(n)) return "₹0";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const getGrade = (score) => GRADES.find(g => score >= g.min && score <= g.max) || GRADES[0];

export const pctColor = (pct) => {
  if (pct >= 70) return "#16A34A";
  if (pct >= 40) return "#CA8A04";
  return "#DC2626";
};
