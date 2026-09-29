import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Finding } from '../../types';
import { SeverityBadge, StatusBadge } from '../common/Badges';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  GitCompare,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Check,
  X,
  FileCode,
  Flame,
  Zap,
} from 'lucide-react';

export const RetestCenterScreen: React.FC = () => {
  const {
    findings,
    runRetest,
    isCanaryFixEnabled,
    toggleCanaryFix,
    setSelectedFinding,
  } = useAegis();

  const [activeRetestFinding, setActiveRetestFinding] = useState<Finding | null>(findings[0] || null);
  const [retestResult, setRetestResult] = useState<{
    success: boolean;
    result: 'FIXED' | 'STILL_VULNERABLE';
    diff: string;
  } | null>(null);
  const [isRetesting, setIsRetesting] = useState(false);

  const retestQueue = findings.filter(
    (f) => ['RETEST_PENDING', 'FIX_APPLIED', 'IN_REMEDIATION', 'VERIFIED'].includes(f.status)
  );

  const handleExecuteRetest = async (finding: Finding) => {
    setIsRetesting(true);
    const res = await runRetest(finding.id);
    setRetestResult(res);
    setIsRetesting(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Closed-Loop Retesting Engine</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Replays original safe validation recipes against newly patched builds; confirms resolution with before/after diffs.
          </p>
        </div>

        {/* Demo Canary Toggle */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-card border border-line shadow-card">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Target Patch State</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {isCanaryFixEnabled ? 'FIX_ENABLED=1 (Patched)' : 'FIX_ENABLED=0 (Vulnerable)'}
            </div>
          </div>
          <button onClick={toggleCanaryFix} className="text-teal-700 hover:text-teal-800 transition-colors">
            {isCanaryFixEnabled ? (
              <ToggleRight className="w-7 h-7 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Visual State Machine Diagram: Retest Lifecycle */}
      <div className="p-5 rounded-2xl bg-card border border-line shadow-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            Deterministic Retest Workflow
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Guaranteed Non-Destructive</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-subtle border border-line space-y-1">
            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center mx-auto">
              1
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Original PoC Probe</span>
            <span className="text-[10px] text-slate-400">Replays identical inputs</span>
          </div>

          <div className="p-3 rounded-xl bg-subtle border border-line space-y-1">
            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center mx-auto">
              2
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Sandbox Verification</span>
            <span className="text-[10px] text-slate-400">Non-root isolated runtime</span>
          </div>

          <div className="p-3 rounded-xl bg-subtle border border-line space-y-1">
            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center mx-auto">
              3
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Diff Assertion</span>
            <span className="text-[10px] text-slate-400">Byte-for-byte state change</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
              ✓
            </div>
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Resolved Certificate</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Cryptographically signed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Queue Table (5 cols) + Diff Inspector (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Retest Queue Table */}
        <div className="lg:col-span-5 rounded-2xl bg-card border border-line p-5 space-y-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Retest Queue ({retestQueue.length})</h3>
            <span className="text-[11px] text-slate-400 font-mono">Select finding</span>
          </div>

          <div className="space-y-2.5">
            {retestQueue.map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  setActiveRetestFinding(f);
                  setRetestResult(null);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeRetestFinding?.id === f.id
                    ? 'bg-teal-50/80 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                    : 'bg-subtle border-line hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">{f.id}</span>
                  <SeverityBadge severity={f.severity} />
                </div>
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">{f.title}</div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">{f.endpoint}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Retest Execution & Diff Inspector */}
        <div className="lg:col-span-7 rounded-2xl bg-card border border-line p-5 space-y-4 shadow-card">
          {activeRetestFinding ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                <div>
                  <span className="font-mono text-teal-700 dark:text-teal-400 text-xs font-bold">{activeRetestFinding.id}</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{activeRetestFinding.title}</h3>
                </div>

                <button
                  disabled={isRetesting}
                  onClick={() => handleExecuteRetest(activeRetestFinding)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-card"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRetesting ? 'animate-spin' : ''}`} />
                  <span>{isRetesting ? 'Replaying in Sandbox...' : 'Run Retest Now'}</span>
                </button>
              </div>

              {/* Retest Result Banner */}
              {retestResult && (
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    retestResult.result === 'FIXED'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {retestResult.result === 'FIXED' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                    <div>
                      <div className="font-bold text-xs">
                        {retestResult.result === 'FIXED' ? 'VULNERABILITY RESOLVED' : 'EXPLOIT STILL EFFECTIVE'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {retestResult.result === 'FIXED'
                          ? 'Target returned hardened status code and denied malformed payload.'
                          : 'Target continues to reflect unsafe payload in response body.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Side-by-Side Diff Inspector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Side-by-Side Telemetry Diff</span>
                  <span className="font-mono text-[10px] text-slate-400">Base vs Retest</span>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed shadow-inner border border-slate-800">
                  {retestResult?.diff ||
                    `--- baseline_response.http\n+++ retest_response.http\n@@ -1,4 +1,4 @@\n-HTTP/1.1 200 OK (Vulnerable payload executed)\n+HTTP/1.1 400 Bad Request (Input validated & sanitized)\n-Content-Length: 1420\n+Content-Length: 42`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">Select a finding from the queue to start.</div>
          )}
        </div>
      </div>
    </div>
  );
};
