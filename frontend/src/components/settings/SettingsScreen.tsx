import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Settings, Shield, Sparkles, Server, Lock, CheckCircle2, Sliders, Cpu, Activity, Clock, Award } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { checks } = useAegis();
  const [activeTab, setActiveTab] = useState<'CHECKS' | 'AI' | 'SANDBOX' | 'GOVERNANCE'>('CHECKS');

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Settings & Governance</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure modular security check plugins, bounded AI hyperparameters, and non-root sandbox execution profiles.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-line text-xs w-fit shadow-card">
        <button
          onClick={() => setActiveTab('CHECKS')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'CHECKS' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Check Plugins Library
        </button>
        <button
          onClick={() => setActiveTab('AI')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'AI' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          AI Gateway Config
        </button>
        <button
          onClick={() => setActiveTab('SANDBOX')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'SANDBOX' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Sandbox Profiles
        </button>
        <button
          onClick={() => setActiveTab('GOVERNANCE')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'GOVERNANCE' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Governance & SLAs
        </button>
      </div>

      {/* TAB 1: CHECKS */}
      {activeTab === 'CHECKS' && (
        <div className="rounded-2xl bg-card border border-line p-5 space-y-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Configured Check Plugins ({checks.length})</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">14 MUST MVP checks active</span>
          </div>

          <div className="divide-y divide-line">
            {checks.map((chk) => (
              <div key={chk.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-teal-700 dark:text-teal-400">{chk.code}</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{chk.name}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-subtle text-slate-700 dark:text-slate-300 border border-line">
                      {chk.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{chk.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{chk.intrusiveness}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ENABLED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI */}
      {activeTab === 'AI' && (
        <div className="p-6 rounded-2xl bg-card border border-line space-y-4 max-w-2xl shadow-card">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bounded AI Gateway Parameters</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Active LLM Provider Model</label>
              <input
                disabled
                value="gemini-1.5-pro-defense (Grounding Gateway Enabled)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Temperature (Strict Determinism)</label>
              <input
                disabled
                value="0.0 (Grounded facts only, zero hallucination tolerance)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Output Schema Enforcement</label>
              <input
                disabled
                value="JSON Schema V2 · Citations Mandatory"
                className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SANDBOX */}
      {activeTab === 'SANDBOX' && (
        <div className="p-6 rounded-2xl bg-card border border-line space-y-4 max-w-2xl text-xs shadow-card">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Safe Execution Sandbox Policies</h3>
          <div className="p-4 rounded-xl bg-subtle border border-line space-y-2.5 font-mono text-slate-700 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-slate-500 dark:text-slate-400">Security Profile:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">non-root / cap_drop ALL</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-slate-500 dark:text-slate-400">Network Isolation:</span>
              <span className="text-slate-900 dark:text-white font-bold">isolated bridge (egress: blocked)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-slate-500 dark:text-slate-400">Memory Cap per Worker:</span>
              <span className="text-slate-900 dark:text-white font-bold">512 MB</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Max Execution Timeout:</span>
              <span className="text-slate-900 dark:text-white font-bold">60 Seconds</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOVERNANCE */}
      {activeTab === 'GOVERNANCE' && (
        <div className="p-6 rounded-2xl bg-card border border-line space-y-4 max-w-2xl text-xs shadow-card">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">SLA Timers & Audit Retention</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-subtle border border-line">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Critical Severity SLA</span>
              <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">7 Days</span>
            </div>
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-subtle border border-line">
              <span className="text-slate-700 dark:text-slate-300 font-medium">High Severity SLA</span>
              <span className="font-mono text-orange-700 dark:text-orange-400 font-bold">14 Days</span>
            </div>
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-subtle border border-line">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Immutable Audit Trail Retention</span>
              <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">365 Days (Append-Only)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
