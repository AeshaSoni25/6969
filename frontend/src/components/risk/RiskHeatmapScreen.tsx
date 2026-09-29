import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { Flame, ShieldAlert, ArrowUpRight, BarChart3, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export const RiskHeatmapScreen: React.FC = () => {
  const { findings, setSelectedFinding } = useAegis();

  const likelihoodLabels = [
    { level: 5, label: '5 · Almost Certain' },
    { level: 4, label: '4 · Likely' },
    { level: 3, label: '3 · Possible' },
    { level: 2, label: '2 · Unlikely' },
    { level: 1, label: '1 · Rare' },
  ];

  const impactLabels = [
    { level: 1, label: '1 · Minimal' },
    { level: 2, label: '2 · Minor' },
    { level: 3, label: '3 · Moderate' },
    { level: 4, label: '4 · Major' },
    { level: 5, label: '5 · Severe' },
  ];

  const getCellRisk = (likelihood: number, impact: number) => {
    const prod = likelihood * impact;
    if (prod >= 16)
      return {
        label: 'CRITICAL',
        bg: 'bg-rose-50/90 border-rose-200 text-rose-800 hover:bg-rose-100',
        badge: 'bg-rose-600 text-white',
      };
    if (prod >= 10)
      return {
        label: 'HIGH',
        bg: 'bg-orange-50/90 border-orange-200 text-orange-800 hover:bg-orange-100',
        badge: 'bg-orange-500 text-white',
      };
    if (prod >= 6)
      return {
        label: 'MEDIUM',
        bg: 'bg-amber-50/90 border-amber-200 text-amber-800 hover:bg-amber-100',
        badge: 'bg-amber-500 text-white',
      };
    if (prod >= 3)
      return {
        label: 'LOW',
        bg: 'bg-blue-50/90 border-blue-200 text-blue-800 hover:bg-blue-100',
        badge: 'bg-blue-500 text-white',
      };
    return {
      label: 'INFO',
      bg: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
      badge: 'bg-slate-400 text-white',
    };
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Flame className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Risk Intelligence & Heatmap (Likelihood × Impact)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section 9.4 Risk matrix mapping technical exploitability likelihood against asset business impact dimensions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Enterprise Risk Score:</span>
          <span className="font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900 font-mono">
            High Severity Exposure (14.2)
          </span>
        </div>
      </div>

      {/* Visual Analytics Banner: CIA Triad + Risk Exposure Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CIA Triad Impact Dimension Visual */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              CIA Dimension Exposure
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Asset Criticality</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Confidentiality (High)</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">85% Threat</span>
              </div>
              <div className="w-full h-2 rounded-full bg-subtle border border-line overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Integrity (Moderate)</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">45% Threat</span>
              </div>
              <div className="w-full h-2 rounded-full bg-subtle border border-line overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Availability (Guarded)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">20% Threat</span>
              </div>
              <div className="w-full h-2 rounded-full bg-subtle border border-line overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Cell Distribution */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              Risk Cell Distribution
            </span>
            <span className="text-[10px] text-slate-400 font-mono">25 Grid Coordinates</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-center">
              <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold block uppercase">Critical Cells</span>
              <span className="text-lg font-black text-rose-900 dark:text-rose-200 font-mono">
                {findings.filter((f) => f.severity === 'CRITICAL').length} {findings.filter((f) => f.severity === 'CRITICAL').length === 1 ? 'Finding' : 'Findings'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900 text-center">
              <span className="text-[10px] text-orange-700 dark:text-orange-400 font-semibold block uppercase">High Cells</span>
              <span className="text-lg font-black text-orange-900 dark:text-orange-200 font-mono">
                {findings.filter((f) => f.severity === 'HIGH').length} {findings.filter((f) => f.severity === 'HIGH').length === 1 ? 'Finding' : 'Findings'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-center">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block uppercase">Medium Cells</span>
              <span className="text-lg font-black text-amber-900 dark:text-amber-200 font-mono">
                {findings.filter((f) => f.severity === 'MEDIUM').length} {findings.filter((f) => f.severity === 'MEDIUM').length === 1 ? 'Finding' : 'Findings'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-center">
              <span className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold block uppercase">Low Cells</span>
              <span className="text-lg font-black text-blue-900 dark:text-blue-200 font-mono">
                {findings.filter((f) => f.severity === 'LOW').length} {findings.filter((f) => f.severity === 'LOW').length === 1 ? 'Finding' : 'Findings'}
              </span>
            </div>
          </div>
        </div>

        {/* Threat Trend Vector */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 shadow-card flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              Remediation Velocity
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
              -32% Risk Down
            </span>
          </div>
          <p className="text-xs text-teal-900 dark:text-teal-300 leading-relaxed">
            Applying the proposed Canary fix (FIX_ENABLED=1) successfully de-escalates 2 critical cells to neutral green state.
          </p>
          <div className="text-[10px] font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Target Safety Margin: Exceeds NTRO Thresholds</span>
          </div>
        </div>
      </div>

      {/* 5x5 Heatmap Matrix */}
      <div className="p-6 rounded-2xl bg-card border border-line space-y-4 shadow-card overflow-x-auto">
        <div className="min-w-[760px]">
          {/* Column Header (Impact) */}
          <div className="grid grid-cols-6 gap-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-300 pb-2">
            <div className="text-left text-slate-400 text-[11px] font-mono self-center">
              Likelihood ↓ / Impact →
            </div>
            {impactLabels.map((imp) => (
              <div key={imp.level} className="py-2 rounded-xl bg-subtle border border-line text-slate-800 dark:text-slate-200 font-semibold shadow-xs">
                {imp.label}
              </div>
            ))}
          </div>

          {/* Rows (Likelihood) */}
          <div className="space-y-2.5">
            {likelihoodLabels.map((lik) => (
              <div key={lik.level} className="grid grid-cols-6 gap-2.5">
                {/* Row Label */}
                <div className="flex items-center text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 rounded-xl bg-subtle border border-line shadow-xs">
                  {lik.label}
                </div>

                {/* 5 Cells */}
                {impactLabels.map((imp) => {
                  const cellMeta = getCellRisk(lik.level, imp.level);
                  const cellFindings = findings.filter(
                    (f) =>
                      f.businessImpact.likelihood === lik.level &&
                      f.businessImpact.impact === imp.level
                  );

                  return (
                    <div
                      key={imp.level}
                      className={`min-h-[72px] p-2.5 rounded-xl border flex flex-col justify-between transition-all ${cellMeta.bg} shadow-xs`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="opacity-70 font-mono">
                          L{lik.level} × I{imp.level}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-md font-mono text-[9px] ${cellMeta.badge}`}>
                          {cellMeta.label}
                        </span>
                      </div>

                      {cellFindings.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cellFindings.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setSelectedFinding(f)}
                              title={f.title}
                              className="px-1.5 py-0.5 rounded-md bg-card border border-line font-mono text-[10px] font-bold text-slate-900 dark:text-slate-100 shadow-xs hover:border-teal-600 transition-colors"
                            >
                              {f.id}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] opacity-40 font-mono italic">0</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
