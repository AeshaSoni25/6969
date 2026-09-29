import React from 'react';
import { FindingConfidence, FindingSeverity, FindingStatus } from '../../types';

export const SeverityBadge: React.FC<{ severity: FindingSeverity; className?: string }> = ({
  severity,
  className = '',
}) => {
  const styles: Record<FindingSeverity, string> = {
    CRITICAL: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/70 dark:text-red-400 dark:border-red-500/40 shadow-xs',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/70 dark:text-orange-400 dark:border-orange-500/40 shadow-xs',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-400 dark:border-amber-500/40 shadow-xs',
    LOW: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-400 dark:border-blue-500/40 shadow-xs',
    INFO: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600/40',
  };

  const icons: Record<FindingSeverity, string> = {
    CRITICAL: '⚡',
    HIGH: '▲',
    MEDIUM: '●',
    LOW: '▼',
    INFO: 'ℹ',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide border uppercase ${styles[severity]} ${className}`}
    >
      <span className="text-[10px]">{icons[severity]}</span>
      {severity}
    </span>
  );
};

export const ConfidenceBadge: React.FC<{ confidence: FindingConfidence }> = ({ confidence }) => {
  const styles: Record<FindingConfidence, string> = {
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40',
    LIKELY: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-500/40',
    POSSIBLE: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    FALSE_POSITIVE: 'bg-rose-50 text-rose-600 border-rose-200 line-through dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/40',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border uppercase tracking-wider ${styles[confidence]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {confidence.replace('_', ' ')}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: FindingStatus }> = ({ status }) => {
  const map: Record<FindingStatus, { label: string; color: string }> = {
    DETECTED: { label: 'Detected', color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
    VALIDATING: { label: 'Validating', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-600/40 animate-pulse' },
    VALIDATED: { label: 'Validated', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-600/40' },
    VERIFIED: { label: 'Verified', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-600/40' },
    IN_REMEDIATION: { label: 'In Remediation', color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-600/40' },
    FIX_APPLIED: { label: 'Fix Applied', color: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-600/40' },
    RETEST_PENDING: { label: 'Retest Pending', color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-600/40' },
    FIXED: { label: 'Fixed (Closed)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/40' },
    REOPENED: { label: 'Reopened', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-600/40' },
    ACCEPTED_RISK: { label: 'Accepted Risk', color: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700' },
    FALSE_POSITIVE: { label: 'False Positive', color: 'bg-slate-50 text-slate-400 border-slate-200 line-through dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800' },
  };

  const item = map[status] || { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${item.color}`}>
      {item.label}
    </span>
  );
};

export const CvssScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  if (score >= 9.0) color = 'bg-red-600 text-white font-bold border-red-500 shadow-sm';
  else if (score >= 7.0) color = 'bg-orange-600 text-white font-semibold border-orange-500 shadow-sm';
  else if (score >= 4.0) color = 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm';
  else if (score > 0.0) color = 'bg-blue-600 text-white font-semibold border-blue-500 shadow-sm';

  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded font-mono text-xs border ${color}`}>
      CVSS {score.toFixed(1)}
    </span>
  );
};
