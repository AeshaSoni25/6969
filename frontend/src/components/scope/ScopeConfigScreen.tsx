import React from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Lock,
  FileCheck2,
  Hash,
  Activity,
  Sliders,
  Server,
  Plus,
  Ban,
  Radio,
  FileText,
  KeyRound,
  Award,
} from 'lucide-react';

export const ScopeConfigScreen: React.FC = () => {
  const { currentAssessment, preflightChecks, runPreflightCheck, setActiveView, startAssessmentRun } = useAegis();

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Scope, Evidence & Authorization Gate</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enforces strict digital ownership proofs, network boundaries, and pre-flight compliance before checks run.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runPreflightCheck()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card hover:bg-subtle border border-line text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-card"
          >
            <Activity className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
            <span>Test Pre-flight</span>
          </button>
          <button
            onClick={() => {
              setActiveView('running');
              startAssessmentRun();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-card cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Approve & Launch Assessment</span>
          </button>
        </div>
      </div>

      {/* Target & Digital Authorization Certificate Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Certificate Card 1 */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Target Application</span>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
            {currentAssessment.target.name}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">{currentAssessment.target.baseUrl}</div>
        </div>

        {/* Certificate Card 2 */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Environment Class</span>
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            {currentAssessment.target.envType}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Isolated Docker Bridge Net</div>
        </div>

        {/* Certificate Card 3 */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ownership Proof Nonce</span>
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            VERIFIED & SIGNED
          </div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">/.well-known/security-auth.txt</div>
        </div>

        {/* Certificate Card 4 */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Scope Manifest Hash</span>
          <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 mt-1 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" />
            sha256:9f8e4c...
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Immutable signed policy v1.0</div>
        </div>
      </div>

      {/* Visual Pre-Flight Health Compliance Dial & Technical Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Dial: Pre-flight Verification Checklist (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Pre-flight Compliance Gate
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-subtle text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-line">
              5/5 Passed
            </span>
          </div>

          {/* Visual Progress Ring */}
          <div className="flex items-center justify-center gap-6 p-4 rounded-xl bg-subtle border border-line">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 leading-none">100%</span>
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold uppercase mt-0.5">Certified</span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Non-Destructive Guarantee</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">
                All 14 security check plugins operate with non-destructive passive probe rules.
              </p>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                ✓ Ready for automated execution
              </div>
            </div>
          </div>

          {/* 5-Point Checklist */}
          <div className="space-y-2">
            {preflightChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-subtle border border-line text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{check.name}</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Boundary Allow vs Deny Rules (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-card border border-line shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Perimeter In-Scope vs Excluded Boundaries</h2>
            <span className="text-xs text-slate-400">Strict Enforcement</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* IN-SCOPE CARD */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>IN-SCOPE (Authorized Targets)</span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-card border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 shadow-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">DOMAIN:</span> worldmonitor.app
                </div>
                <div className="p-2 rounded-lg bg-card border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 shadow-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">ROUTES:</span> /api/v1/*, /dashboard/*
                </div>
                <div className="p-2 rounded-lg bg-card border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 shadow-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">SOCKETS:</span> wss://worldmonitor.app/feed
                </div>
              </div>
            </div>

            {/* EXCLUDED BOUNDARY CARD */}
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>EXCLUDED (Strict Drop on Sight)</span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-card border border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-200 shadow-xs">
                  <span className="text-rose-700 dark:text-rose-400 font-bold">THIRD PARTY:</span> *.analytics.google.com
                </div>
                <div className="p-2 rounded-lg bg-card border border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-200 shadow-xs">
                  <span className="text-rose-700 dark:text-rose-400 font-bold">INTERNAL:</span> *.corp.internal, /admin/billing
                </div>
                <div className="p-2 rounded-lg bg-card border border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-200 shadow-xs">
                  <span className="text-rose-700 dark:text-rose-400 font-bold">PRODUCTION:</span> payment-gateway.prod
                </div>
              </div>
            </div>
          </div>

          {/* Rate-Limiter Telemetry Strip */}
          <div className="p-3.5 rounded-xl bg-subtle border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Outbound Probe Throttler: 5.0 RPS Cap</span>
                <span className="text-slate-400 text-[11px]">Guarantees zero operational degradation on target servers</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono font-bold text-teal-700 dark:text-teal-400 bg-card px-3 py-1 rounded-lg border border-line shadow-xs">
              <span>Current: 4.2 RPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
