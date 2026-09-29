import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAegis();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />,
        };

        const borders = {
          success: 'border-emerald-300 dark:border-emerald-700 bg-card shadow-card text-slate-900 dark:text-white',
          warning: 'border-amber-300 dark:border-amber-700 bg-card shadow-card text-slate-900 dark:text-white',
          error: 'border-rose-300 dark:border-rose-700 bg-card shadow-card text-slate-900 dark:text-white',
          info: 'border-teal-300 dark:border-teal-700 bg-card shadow-card text-slate-900 dark:text-white',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-card transition-all duration-200 animate-in slide-in-from-right-4 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">{toast.title}</h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-subtle transition-colors p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
