import React, { useRef, useEffect } from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  Radio,
  Play,
  Pause,
  AlertOctagon,
  Terminal,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Layers,
  Flame,
  Cpu,
  Server,
  Zap,
} from 'lucide-react';

export const AssessmentRunningScreen: React.FC = () => {
  const {
    currentAssessment,
    isAssessing,
    assessmentPhase,
    assessmentProgress,
    liveLogs,
    guardrailBlockedCount,
    startAssessmentRun,
    pauseAssessmentRun,
    triggerKillSwitch,
    checks,
  } = useAegis();

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveLogs]);

  const phases = [
    { id: 'DISCOVERY', label: '1. Discovery', desc: 'Crawler & XHR Indexing' },
    { id: 'CHECKS_RUNNING', label: '2. Modular Checks', desc: '14 Active Plugins' },
    { id: 'DETECTION_RULES', label: '3. Rule Engine', desc: 'Signal Deduplication' },
    { id: 'SANDBOX_VALIDATION', label: '4. Safe Sandbox', desc: 'Non-Destructive PoC' },
    { id: 'AI_ANALYSIS', label: '5. AI Intelligence', desc: 'Grounded Remediation' },
    { id: 'COMPLETE', label: '6. Complete', desc: 'Executive Report Ready' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Radio className={`w-4 h-4 ${isAssessing ? 'animate-spin' : ''}`} />
              {isAssessing && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Live Assessment Orchestration</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time BullMQ DAG execution monitoring, worker telemetry, and non-destructive check progression.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isAssessing ? (
            <button
              onClick={pauseAssessmentRun}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-300 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-colors shadow-xs"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Workers</span>
            </button>
          ) : (
            <button
              onClick={startAssessmentRun}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-card"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{assessmentProgress === 100 ? 'Restart Pipeline' : 'Resume Pipeline'}</span>
            </button>
          )}

          <button
            onClick={() => triggerKillSwitch('Manual operator emergency latch')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 transition-all shadow-xs"
          >
            <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Emergency Kill Switch</span>
          </button>
        </div>
      </div>

      {/* Visual DAG Pipeline Stepper Card with Progress Graph */}
      <div className="p-6 rounded-2xl bg-card border border-line shadow-card space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            Active DAG Execution Phase:{' '}
            <span className="font-mono text-teal-700 dark:text-teal-400 uppercase font-extrabold">{assessmentPhase}</span>
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">{assessmentProgress}% Complete</span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-subtle rounded-full h-3 overflow-hidden p-0.5 border border-line">
          <div
            className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${assessmentProgress}%` }}
          />
        </div>

        {/* Interactive DAG Phase Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {phases.map((p, idx) => {
            const isDone = assessmentProgress > (idx + 1) * 16;
            const isCurrent = assessmentPhase === p.id;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-teal-50/90 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 font-bold shadow-xs'
                    : isDone
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-subtle border-line text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">{p.label}</div>
                <div className="text-[10px] opacity-75 mt-0.5 font-medium">{p.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Telemetry Strip (4 Gauge Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Active Workers</span>
            <Cpu className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-400">4 Node / 2 Py</div>
          <span className="text-[10px] text-slate-400 block">Non-root containers</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Outbound Rate</span>
            <Zap className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">4.2 req/s</div>
          <span className="text-[10px] text-slate-400 block">Cap: 5.0 RPS (Safe Throttled)</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Signals Emitted</span>
            <Activity className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-orange-600">48 Signals</div>
          <span className="text-[10px] text-slate-400 block">Deduped to 10 Findings</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Guardrail Interceptions</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{guardrailBlockedCount} Dropped</div>
          <span className="text-[10px] text-emerald-600 font-medium block">Zero leaks outside scope</span>
        </div>
      </div>

      {/* Two Column Layout: Security Check Plugin Progress (7 cols) + Live Terminal Stream (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Check Catalog Progress Table */}
        <div className="lg:col-span-7 rounded-2xl bg-card border border-line p-5 space-y-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Security Check Plugins (14 Active)</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">DAG Execution Order</span>
          </div>

          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-subtle border-b border-line text-slate-600 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Plugin Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-mono">
                {checks.map((chk) => (
                  <tr key={chk.id} className="hover:bg-subtle transition-colors">
                    <td className="py-2.5 px-3 font-bold text-teal-700 dark:text-teal-400">{chk.code}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-900 dark:text-slate-100 font-medium">{chk.name}</td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{chk.category}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-subtle text-slate-700 dark:text-slate-300 border border-line">
                        {chk.intrusiveness}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {chk.status === 'SIGNAL_FOUND' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                          SIGNAL FOUND ({chk.signalsEmittedCount})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          PASSED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Terminal Stream */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col h-[480px] shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono text-teal-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>live_worker_stream.log</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-[11px] p-2 space-y-1.5 text-slate-300">
            {liveLogs.map((log, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  log.includes('[Complete]')
                    ? 'text-emerald-400 font-semibold'
                    : log.includes('[Signal]')
                    ? 'text-orange-300'
                    : log.includes('[Guardrail]')
                    ? 'text-teal-300'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>SSE Heartbeat: OK</span>
            <span>Channel: /api/assessments/progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};
