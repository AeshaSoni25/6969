import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { calculateCVSS31, generateMetricRationale } from '../../utils/cvssCalculator';
import { CVSSMetrics } from '../../types';
import { SeverityBadge, CvssScoreBadge } from '../common/Badges';
import { Calculator, Copy, Check, Sparkles, HelpCircle, ArrowRight, Gauge, Activity, ShieldAlert } from 'lucide-react';

export const CvssCalculatorScreen: React.FC = () => {
  const { findings, updateCVSS } = useAegis();

  // Metrics state
  const [metrics, setMetrics] = useState<Omit<CVSSMetrics, 'version' | 'score' | 'vector'>>({
    av: 'N',
    ac: 'L',
    pr: 'N',
    ui: 'N',
    s: 'U',
    c: 'H',
    i: 'N',
    a: 'N',
  });

  const [selectedFindingId, setSelectedFindingId] = useState<string>(findings[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const calculated = calculateCVSS31(metrics);

  const handleCopyVector = () => {
    navigator.clipboard.writeText(`${calculated.vector} (${calculated.score})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToFinding = () => {
    if (selectedFindingId) {
      updateCVSS(selectedFindingId, metrics, 'Analyst applied explainable CVSS calculation');
    }
  };

  const metricDefinitions: Record<
    string,
    { title: string; options: { val: string; label: string; desc: string }[] }
  > = {
    av: {
      title: 'Attack Vector (AV)',
      options: [
        { val: 'N', label: 'Network (N)', desc: 'Bound to network; remotely exploitable.' },
        { val: 'A', label: 'Adjacent (A)', desc: 'Must be on same local network segment.' },
        { val: 'L', label: 'Local (L)', desc: 'Requires terminal or local console access.' },
        { val: 'P', label: 'Physical (P)', desc: 'Requires physical interaction with target hardware.' },
      ],
    },
    ac: {
      title: 'Attack Complexity (AC)',
      options: [
        { val: 'L', label: 'Low (L)', desc: 'Repeatable at will; no special conditions.' },
        { val: 'H', label: 'High (H)', desc: 'Requires race conditions or lucky timing.' },
      ],
    },
    pr: {
      title: 'Privileges Required (PR)',
      options: [
        { val: 'N', label: 'None (N)', desc: 'Unauthorized; zero credentials needed.' },
        { val: 'L', label: 'Low (L)', desc: 'Standard user-level authenticated privileges.' },
        { val: 'H', label: 'High (H)', desc: 'Administrative / root-level privileges required.' },
      ],
    },
    ui: {
      title: 'User Interaction (UI)',
      options: [
        { val: 'N', label: 'None (N)', desc: 'Zero victim interaction needed.' },
        { val: 'R', label: 'Required (R)', desc: 'Victim must click link or open attachment.' },
      ],
    },
    s: {
      title: 'Scope (S)',
      options: [
        { val: 'U', label: 'Unchanged (U)', desc: 'Impact contained to same authority boundary.' },
        { val: 'C', label: 'Changed (C)', desc: 'Breaches security boundary into other systems.' },
      ],
    },
    c: {
      title: 'Confidentiality Impact (C)',
      options: [
        { val: 'N', label: 'None (N)', desc: 'No loss of confidential data.' },
        { val: 'L', label: 'Low (L)', desc: 'Partial disclosure of non-sensitive info.' },
        { val: 'H', label: 'High (H)', desc: 'Total loss of critical secrets or database.' },
      ],
    },
    i: {
      title: 'Integrity Impact (I)',
      options: [
        { val: 'N', label: 'None (N)', desc: 'No modification of system data.' },
        { val: 'L', label: 'Low (L)', desc: 'Modification of minor fields without takeover.' },
        { val: 'H', label: 'High (H)', desc: 'Full modification of critical records and logic.' },
      ],
    },
    a: {
      title: 'Availability Impact (A)',
      options: [
        { val: 'N', label: 'None (N)', desc: 'No impact to system uptime.' },
        { val: 'L', label: 'Low (L)', desc: 'Reduced performance or intermittent outage.' },
        { val: 'H', label: 'High (H)', desc: 'Complete denial of service of primary services.' },
      ],
    },
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Calculator className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Explainable CVSS v3.1 Engine</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section 11 Explainable scoring engine providing complete rationale justifications and live vector computation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFindingId}
            onChange={(e) => setSelectedFindingId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-subtle border border-line text-xs font-mono font-bold text-teal-800 dark:text-teal-300 shadow-xs focus:outline-none"
          >
            {findings.map((f) => (
              <option key={f.id} value={f.id}>
                Apply to {f.id}
              </option>
            ))}
          </select>
          <button
            onClick={handleApplyToFinding}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-all shadow-card"
          >
            Save to Finding
          </button>
        </div>
      </div>

      {/* Visual Score Gauge & Vector Banner (Top Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Score Circular Gauge (4 cols) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between items-center text-center space-y-3">
          <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>CVSS Base Score</span>
            <SeverityBadge severity={calculated.severity} />
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={
                  calculated.score >= 9.0
                    ? '#ef4444'
                    : calculated.score >= 7.0
                    ? '#f97316'
                    : calculated.score >= 4.0
                    ? '#f59e0b'
                    : '#3b82f6'
                }
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * calculated.score) / 10}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100 leading-none">{calculated.score}</span>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">out of 10.0</span>
            </div>
          </div>

          <div className="w-full flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-line">
            <span>Exploitability: <strong>3.9</strong></span>
            <span>Impact: <strong>3.6</strong></span>
          </div>
        </div>

        {/* Vector String & Cryptographic Rationale (8 cols) */}
        <div className="md:col-span-8 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Standard Vector Specification String</span>
            <button
              onClick={handleCopyVector}
              className="px-2.5 py-1 rounded-lg bg-subtle hover:bg-slate-200 dark:hover:bg-slate-700 border border-line text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Vector'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-subtle border border-line font-mono text-xs font-bold text-teal-800 dark:text-teal-300 break-all select-all">
            {calculated.vector}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Automated Rationale Justification:</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {generateMetricRationale('av', metrics.av)} {generateMetricRationale('ac', metrics.ac)} {generateMetricRationale('pr', metrics.pr)} {generateMetricRationale('c', metrics.c)}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Metric Selectors (8 Dimension Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(metricDefinitions).map(([key, def]) => (
          <div key={key} className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-3 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">{def.title}</span>

            <div className="grid grid-cols-1 gap-1.5">
              {def.options.map((opt) => {
                const isSelected = (metrics as any)[key] === opt.val;
                return (
                  <button
                    key={opt.val}
                    onClick={() => setMetrics((prev) => ({ ...prev, [key]: opt.val }))}
                    className={`p-2 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 font-bold shadow-xs'
                        : 'bg-subtle border-line text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[10px] opacity-75 font-normal leading-tight mt-0.5">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
