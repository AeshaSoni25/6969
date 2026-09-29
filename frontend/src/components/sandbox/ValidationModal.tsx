import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Finding } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  X,
  Lock,
  Hash,
  Terminal,
} from 'lucide-react';

export const ValidationModal: React.FC = () => {
  const { validationModalFinding, setValidationModalFinding, runSafeValidation } = useAegis();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    result: string;
    steps: string[];
  } | null>(null);

  if (!validationModalFinding) return null;

  const handleRun = async () => {
    setIsValidating(true);
    const res = await runSafeValidation(validationModalFinding.id);
    setValidationResult(res);
    setIsValidating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full rounded-2xl bg-card border border-line shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Safe Proof-of-Concept Sandbox</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Non-Destructive Validation Recipe Execution</p>
            </div>
          </div>
          <button
            onClick={() => setValidationModalFinding(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-xl bg-subtle border border-line space-y-1">
            <span className="font-mono text-teal-700 dark:text-teal-400 text-xs font-bold">{validationModalFinding.id}</span>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{validationModalFinding.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">{validationModalFinding.endpoint}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-subtle border border-line">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Recipe Script</span>
              <div className="font-mono text-teal-700 dark:text-teal-400 font-bold mt-0.5">
                {validationModalFinding.validationRecipeId || 'VAL-GENERIC-PROBE'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-subtle border border-line">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Sandbox Boundary</span>
              <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                Isolated Net / Egress Deny
              </div>
            </div>
          </div>

          {/* Execution steps */}
          {validationResult && (
            <div className="space-y-2 animate-in fade-in-50">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Sandbox Telemetry Steps</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">ASSERTION CONFIRMED</span>
              </div>
              <div className="p-3.5 rounded-xl bg-subtle border border-line font-mono text-[11px] text-slate-800 dark:text-slate-200 space-y-2 shadow-inner">
                {validationResult.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-line bg-subtle flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>GuardedHttpClient active</span>
          </div>

          <button
            disabled={isValidating}
            onClick={handleRun}
            className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-card disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isValidating ? 'Executing in Sandbox...' : 'Run Safe Validation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
