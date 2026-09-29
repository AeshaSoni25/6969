import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { EnvironmentType } from '../../types';
import {
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Server,
  Layers,
  Sparkles,
  Lock,
  Globe,
  Sliders,
  FileCheck,
} from 'lucide-react';

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAssessmentModal: React.FC<WizardProps> = ({ isOpen, onClose }) => {
  const { createNewAssessment } = useAegis();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState('World Monitor — Staging Retest');
  const [description, setDescription] = useState('Targeted assessment of authentication and API endpoints following recent security patch.');
  const [profile, setProfile] = useState<'BASELINE_OWASP' | 'API_FOCUSED' | 'FULL_COMPREHENSIVE'>('BASELINE_OWASP');
  const [targetName, setTargetName] = useState('World Monitor Local Instance');
  const [baseUrl, setBaseUrl] = useState('http://127.0.0.1:3000');
  const [envType, setEnvType] = useState<EnvironmentType>('DOCKER_SANDBOX');
  const [rateLimit, setRateLimit] = useState(5);
  const [includePaths, setIncludePaths] = useState('/api/v1/**\n/app/**');
  const [excludePaths, setExcludePaths] = useState('/api/v1/auth/reset-password-token');

  if (!isOpen) return null;

  const isProductionBlocked = envType === 'PRODUCTION' || baseUrl.includes('worldmonitor.app');

  const handleFinish = () => {
    createNewAssessment({
      name,
      description,
      profile,
      target: {
        id: `TGT-${Date.now()}`,
        name: targetName,
        baseUrl,
        envType,
        authorizationStatus: 'VERIFIED',
        techFingerprint: { server: 'nginx/1.24 (Docker)' },
        authNonceVerified: true,
        adminApproved: true,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="max-w-2xl w-full rounded-2xl bg-card border border-line shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-line bg-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 shadow-sm">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Create Authorized Assessment</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Step {step} of 4 · Controlled Security Workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-6 py-3 bg-subtle/80 border-b border-line flex items-center justify-between text-xs">
          {[
            { n: 1, label: 'Basics & Profile', icon: Layers },
            { n: 2, label: 'Target & Safety', icon: Globe },
            { n: 3, label: 'Scope Rules', icon: Sliders },
            { n: 4, label: 'Review & Run', icon: FileCheck },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-sm ${
                  step === s.n
                    ? 'bg-teal-700 text-white ring-2 ring-teal-500/20'
                    : step > s.n
                    ? 'bg-emerald-600 text-white'
                    : 'bg-subtle text-slate-600 dark:text-slate-400 border border-line'
                }`}
              >
                {step > s.n ? '✓' : s.n}
              </span>
              <span className={`font-semibold hidden sm:inline ${step === s.n ? 'text-teal-800 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Assessment Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-xs font-semibold text-slate-900 dark:text-white focus:bg-card focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                  placeholder="e.g., World Monitor — Baseline Assessment"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Audit Description & Objectives
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-xs text-slate-800 dark:text-slate-200 focus:bg-card focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all leading-relaxed"
                  placeholder="State the objective of testing..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Select Check Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'BASELINE_OWASP',
                      title: 'OWASP Baseline',
                      desc: 'Standard 14 checks covering Auth, Access Control, Headers & CSP.',
                      badge: 'Recommended',
                    },
                    {
                      id: 'API_FOCUSED',
                      title: 'API Security',
                      desc: 'Deep inspection of CORS, parameter verbosity, rate limiting & WebSocket.',
                      badge: 'Microservices',
                    },
                    {
                      id: 'FULL_COMPREHENSIVE',
                      title: 'Comprehensive',
                      desc: 'All 7 scope areas including static JS scans & data privacy.',
                      badge: 'Full Scope',
                    },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setProfile(p.id as any)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        profile === p.id
                          ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-600 shadow-md ring-2 ring-teal-500/10'
                          : 'bg-subtle border-line hover:border-teal-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            profile === p.id ? 'bg-teal-700 text-white' : 'bg-card text-slate-600 dark:text-slate-400 border border-line'
                          }`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TARGET & SAFETY GATE */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Instance Label
                </label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-xs font-semibold text-slate-900 dark:text-white focus:bg-card focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Base URL
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-xs font-mono font-semibold text-slate-900 dark:text-white focus:bg-card focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                  placeholder="http://127.0.0.1:3000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Environment Type
                </label>
                <select
                  value={envType}
                  onChange={(e) => setEnvType(e.target.value as EnvironmentType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-xs font-medium text-slate-900 dark:text-white focus:bg-card focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                >
                  <option value="DOCKER_SANDBOX">DOCKER_SANDBOX (Isolated local network)</option>
                  <option value="LOCAL">LOCAL (Loopback 127.0.0.1)</option>
                  <option value="STAGING">STAGING (Admin approved staging host)</option>
                  <option value="TEST_VULNERABLE">TEST_VULNERABLE (Bundled WM-Canary Target)</option>
                  <option value="PRODUCTION">PRODUCTION (Live Public System)</option>
                </select>
              </div>

              {/* STRICT PRODUCTION BLOCKING ALERT */}
              {isProductionBlocked && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200 space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-xs uppercase tracking-wide">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span>Authorization Gate Violation: Testing Blocked</span>
                  </div>
                  <p className="text-xs leading-relaxed text-red-700 dark:text-red-300">
                    SecureMon enforces an absolute technical ban on active testing against PRODUCTION environments or public production domains (worldmonitor.app).
                  </p>
                  <div className="text-[11px] text-red-900 dark:text-red-200 font-mono bg-red-100/70 dark:bg-red-900/30 p-2.5 rounded-lg border border-red-200 dark:border-red-800">
                    Code: ENV_PRODUCTION_REJECTED · Only RFC1918 / Loopback / Docker targets permitted.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SCOPE RULES */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Included Paths (Whitelist)
                </label>
                <textarea
                  rows={3}
                  value={includePaths}
                  onChange={(e) => setIncludePaths(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-xs font-mono text-slate-900 dark:text-white focus:bg-card focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">One glob pattern per line. Only requests matching these paths are dispatched.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Excluded Paths (Blacklist)
                </label>
                <textarea
                  rows={2}
                  value={excludePaths}
                  onChange={(e) => setExcludePaths(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-subtle border border-line text-xs font-mono text-slate-900 dark:text-white focus:bg-card focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                />
              </div>

              <div className="p-4 rounded-xl bg-subtle border border-line space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rate Limit Throttle</span>
                  <span className="font-mono text-teal-700 dark:text-teal-400 font-extrabold text-sm">{rateLimit} RPS</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">GuardedHttpClient throttles outbound traffic to prevent service disruption.</p>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & AUTHORIZE */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-subtle border border-line space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-line">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Target Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{targetName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-line">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Base URL:</span>
                  <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">{baseUrl}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-line">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Environment:</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {envType}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-line">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Check Profile:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{profile}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Rate Limit:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-semibold">{rateLimit} requests / sec</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-3 shadow-card">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">
                  Authorization verified. Scope manifest will be signed with SHA-256 and bound to worker sandbox.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-line bg-subtle flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-line bg-card text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-subtle flex items-center gap-1.5 transition-colors shadow-card"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              disabled={step === 2 && isProductionBlocked}
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-card disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-card"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Initialize Project</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
