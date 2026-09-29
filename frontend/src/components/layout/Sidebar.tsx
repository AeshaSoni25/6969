import React from 'react';
import { useAegis, ViewType } from '../../context/AegisContext';
import {
  LayoutDashboard,
  ShieldCheck,
  Radio,
  Boxes,
  Bug,
  RotateCcw,
  Calculator,
  Flame,
  Sparkles,
  Kanban,
  FileText,
  History,
  Settings,
  ToggleLeft,
  ToggleRight,
  Lock,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    findings,
    isAssessing,
    isCanaryFixEnabled,
    toggleCanaryFix,
  } = useAegis();

  const openFindingsCount = findings.filter(
    (f) => !['FIXED', 'FALSE_POSITIVE'].includes(f.status)
  ).length;

  const retestPendingCount = findings.filter(
    (f) => f.status === 'RETEST_PENDING' || f.status === 'FIX_APPLIED'
  ).length;

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Security Posture',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'running',
      label: 'Live Orchestration',
      icon: <Radio className={`w-4 h-4 ${isAssessing ? 'text-cyan-400 animate-spin' : ''}`} />,
      badge: isAssessing ? 'RUNNING' : undefined,
      badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-800',
    },
    {
      id: 'scope',
      label: 'Scope & Authorization',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      badge: 'Gated',
      badgeColor: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800',
    },
    {
      id: 'assets',
      label: 'Asset Inventory',
      icon: <Boxes className="w-4 h-4" />,
      badge: '10',
    },
    {
      id: 'findings',
      label: 'Vulnerabilities',
      icon: <Bug className="w-4 h-4 text-orange-400" />,
      badge: openFindingsCount,
      badgeColor: 'bg-orange-950/60 text-orange-400 border border-orange-800',
    },
    {
      id: 'retest',
      label: 'Retesting Center',
      icon: <RotateCcw className="w-4 h-4 text-cyan-400" />,
      badge: retestPendingCount > 0 ? retestPendingCount : undefined,
      badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-700',
    },
    {
      id: 'cvss',
      label: 'CVSS 3.1 Engine',
      icon: <Calculator className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'risk',
      label: 'Risk Heatmap',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'ai',
      label: 'AI Analyst Assistant',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      badge: 'Grounded',
      badgeColor: 'bg-amber-950/60 text-amber-300 border border-amber-800',
    },
    {
      id: 'remediation',
      label: 'Remediation Board',
      icon: <Kanban className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'reports',
      label: 'Executive Reports',
      icon: <FileText className="w-4 h-4 text-slate-300" />,
    },
    {
      id: 'audit',
      label: 'Tamper-Evident Audit',
      icon: <History className="w-4 h-4 text-slate-400" />,
    },
    {
      id: 'settings',
      label: 'Settings & Plugins',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Assessment Pipeline
        </div>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-cyan-400' : 'group-hover:text-slate-200 transition-colors'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    item.badgeColor || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom SIH Demo Panel: Canary Target Fix Switch */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50 space-y-3">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Canary Fix State
            </span>
            <button
              onClick={toggleCanaryFix}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
              title="Simulates developer toggling FIX_ENABLED=1 on the vulnerable canary target"
            >
              {isCanaryFixEnabled ? (
                <ToggleRight className="w-6 h-6 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-500" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {isCanaryFixEnabled
              ? 'Fix Applied (FIX_ENABLED=1). Retest will pass.'
              : 'Vulnerable (FIX_ENABLED=0). Retest will fail.'}
          </p>
        </div>

        {/* Guardrail Status Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Guardrails</span>
          </span>
          <span className="text-emerald-400 font-mono text-[10px] font-semibold">ENFORCED</span>
        </div>
      </div>
    </aside>
  );
};
