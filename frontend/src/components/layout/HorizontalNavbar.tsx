import React, { useState } from 'react';
import { useAegis, ViewType } from '../../context/AegisContext';
import { UserRole } from '../../types';
import {
  Shield,
  Search,
  AlertOctagon,
  ChevronDown,
  Building2,
  FolderGit2,
  CheckCircle2,
  UserCheck,
  PlusCircle,
  Sun,
  Moon,
  ToggleLeft,
  ToggleRight,
  SlidersHorizontal,
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
} from 'lucide-react';

interface HorizontalNavbarProps {
  onOpenCreateWizard: () => void;
}

export const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ onOpenCreateWizard }) => {
  const {
    role,
    setRole,
    currentAssessment,
    setCurrentAssessment,
    assessments,
    activeView,
    setActiveView,
    findings,
    isAssessing,
    isCanaryFixEnabled,
    toggleCanaryFix,
    triggerKillSwitch,
    setCommandPaletteOpen,
    executiveView,
    setExecutiveView,
    theme,
    toggleTheme,
  } = useAegis();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [assessmentMenuOpen, setAssessmentMenuOpen] = useState(false);
  const [killModalOpen, setKillModalOpen] = useState(false);

  const openFindingsCount = findings.filter(
    (f) => !['FIXED', 'FALSE_POSITIVE'].includes(f.status)
  ).length;

  const retestPendingCount = findings.filter(
    (f) => f.status === 'RETEST_PENDING' || f.status === 'FIX_APPLIED'
  ).length;

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: 'ANALYST', label: 'Security Analyst', desc: 'Runs assessments, triages findings, validates PoC, generates reports' },
    { value: 'APPSEC', label: 'AppSec Engineer', desc: 'Configures checks, reviews code root causes, tunes guardrails' },
    { value: 'ADMIN', label: 'Security Admin', desc: 'Full governance, target approvals, audit logs, user management' },
    { value: 'DEVELOPER', label: 'Developer', desc: 'Fixes assigned vulnerabilities, requests one-click retests' },
    { value: 'MANAGER', label: 'Project / IT Manager', desc: 'Monitors SLAs, remediation burn-down, assigns owners' },
    { value: 'EXECUTIVE', label: 'Executive / Decision Maker', desc: 'High-level business risk posture, residual risk summary' },
  ];

  const navTabs: { id: ViewType; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Security Posture', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'scope', label: 'Scope & Auth', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />, badge: 'Gated' },
    {
      id: 'running',
      label: 'Live Orchestration',
      icon: <Radio className={`w-3.5 h-3.5 ${isAssessing ? 'text-cyan-500 animate-spin' : ''}`} />,
      badge: isAssessing ? 'RUNNING' : undefined,
    },
    { id: 'assets', label: 'Asset Inventory', icon: <Boxes className="w-3.5 h-3.5" />, badge: '10' },
    {
      id: 'findings',
      label: 'Vulnerabilities',
      icon: <Bug className="w-3.5 h-3.5 text-orange-500" />,
      badge: openFindingsCount,
      badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30',
    },
    {
      id: 'retest',
      label: 'Retesting Center',
      icon: <RotateCcw className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />,
      badge: retestPendingCount > 0 ? retestPendingCount : undefined,
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30',
    },
    { id: 'cvss', label: 'CVSS 3.1', icon: <Calculator className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 'risk', label: 'Risk Heatmap', icon: <Flame className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'ai', label: 'AI Assistant', icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />, badge: 'Grounded' },
    { id: 'remediation', label: 'Remediation Board', icon: <Kanban className="w-3.5 h-3.5 text-sky-500" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-3.5 h-3.5 text-slate-500" /> },
    { id: 'audit', label: 'Audit Trail', icon: <History className="w-3.5 h-3.5 text-slate-400" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-topbar shadow-card">
      {/* Top Utility Bar */}
      <div className="px-4 lg:px-6 h-15 flex items-center justify-between gap-4 border-b border-line">
        {/* Left: Brand + Target Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-700 text-white shadow-card">
              <Shield className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Aegis<span className="text-teal-600 dark:text-teal-400">Lens</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  SIH26163 · NTRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block mt-0.5">
                Target: {currentAssessment.target.name} ({currentAssessment.target.baseUrl})
              </p>
            </div>
          </div>

          <div className="h-5 w-px bg-line hidden md:block" />

          {/* Assessment Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setAssessmentMenuOpen(!assessmentMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-subtle hover:bg-card border border-line text-slate-700 dark:text-slate-200 transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="max-w-[150px] truncate">{currentAssessment.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {assessmentMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-72 rounded-xl bg-card border border-line shadow-card p-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Assessment Project
                </div>
                {assessments.map((asm) => (
                  <button
                    key={asm.id}
                    onClick={() => {
                      setCurrentAssessment(asm);
                      setAssessmentMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      asm.id === currentAssessment.id
                        ? 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-800'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-semibold truncate">{asm.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{asm.target.envType} · {asm.target.baseUrl}</div>
                    </div>
                    {asm.id === currentAssessment.id && <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setAssessmentMenuOpen(false);
                      onOpenCreateWizard();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    New Assessment Project...
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-sm hidden lg:block">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              <span>Search findings, CVEs, assets, or checks...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Theme Toggle + Canary Switch + RBAC + Kill Switch */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Canary Target Patch State Switch */}
          <button
            onClick={toggleCanaryFix}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isCanaryFixEnabled
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
            title="Toggles FIX_ENABLED=1 on canary target for live retest demonstrations"
          >
            <span className={`w-2 h-2 rounded-full ${isCanaryFixEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>Canary: {isCanaryFixEnabled ? 'Patched' : 'Vulnerable'}</span>
          </button>

          {/* RBAC Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{role}</span>
              <ChevronDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-card border border-line shadow-card p-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Persona (RBAC Demo)
                </div>
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      setRole(r.value);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      role === r.value
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{r.label}</span>
                      {role === r.value && <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-bold">ACTIVE</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kill Switch */}
          <button
            onClick={() => setKillModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-bold transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kill Switch</span>
          </button>
        </div>
      </div>

      {/* Horizontal Subnav Tabs */}
      <nav className="px-4 lg:px-6 flex items-center gap-1.5 overflow-x-auto py-2 bg-subtle border-t border-line">
        {navTabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-700 text-white shadow-card'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-card'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isActive
                      ? 'bg-teal-800 text-white'
                      : tab.badgeColor || 'bg-subtle text-slate-700 dark:text-slate-300 border border-line'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Emergency Kill Switch Modal */}
      {killModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-card border border-red-300 dark:border-red-600/50 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertOctagon className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Emergency Kill Switch</h3>
                <p className="text-xs text-red-600 dark:text-red-300">Global Security Guardrail Trigger</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              This will immediately cancel all active background BullMQ check jobs, drop active TCP connections in the GuardedHttpClient, and write an immutable audit trail entry.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setKillModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  triggerKillSwitch('Manual operator emergency latch depression');
                  setKillModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/30"
              >
                Halt All Active Scans
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
