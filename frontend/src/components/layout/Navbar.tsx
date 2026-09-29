import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
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
  Bell,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  onOpenCreateWizard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateWizard }) => {
  const {
    role,
    setRole,
    currentAssessment,
    setCurrentAssessment,
    assessments,
    triggerKillSwitch,
    setCommandPaletteOpen,
    executiveView,
    setExecutiveView,
  } = useAegis();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [assessmentMenuOpen, setAssessmentMenuOpen] = useState(false);
  const [killModalOpen, setKillModalOpen] = useState(false);

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: 'ANALYST', label: 'Security Analyst', desc: 'Runs assessments, triages findings, validates PoC, generates reports' },
    { value: 'APPSEC', label: 'AppSec Engineer', desc: 'Configures checks, reviews code root causes, tunes guardrails' },
    { value: 'ADMIN', label: 'Security Admin', desc: 'Full governance, target approvals, audit logs, user management' },
    { value: 'DEVELOPER', label: 'Developer', desc: 'Fixes assigned vulnerabilities, requests one-click retests' },
    { value: 'MANAGER', label: 'Project / IT Manager', desc: 'Monitors SLAs, remediation burn-down, assigns owners' },
    { value: 'EXECUTIVE', label: 'Executive / Decision Maker', desc: 'High-level business risk posture, residual risk summary' },
  ];

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand + Context Selectors */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  Aegis<span className="text-cyan-400 font-extrabold">Lens</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  SIH26163 · NTRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Automated Vulnerability Intelligence</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Org & Assessment Selectors */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>National Threat Assessment Unit</span>
            </div>

            {/* Assessment Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAssessmentMenuOpen(!assessmentMenuOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="max-w-[170px] truncate">{currentAssessment.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {assessmentMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-lg bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Assessment
                  </div>
                  {assessments.map((asm) => (
                    <button
                      key={asm.id}
                      onClick={() => {
                        setCurrentAssessment(asm);
                        setAssessmentMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                        asm.id === currentAssessment.id
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                          : 'text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-medium truncate">{asm.name}</div>
                        <div className="text-[10px] text-slate-400">{asm.target.envType} · {asm.target.baseUrl}</div>
                      </div>
                      {asm.id === currentAssessment.id && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setAssessmentMenuOpen(false);
                        onOpenCreateWizard();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-1.5 font-medium transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Create New Assessment...
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span>Search findings, assets, CVEs, or checks...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Mode Toggles + RBAC Persona + Kill-Switch */}
        <div className="flex items-center gap-3">
          {/* Executive View Toggle */}
          <button
            onClick={() => setExecutiveView(!executiveView)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              executiveView
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle between Technical Analyst view and Executive Summary view"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{executiveView ? 'Exec Mode' : 'Tech Mode'}</span>
          </button>

          {/* RBAC Persona Switcher (Crucial for SIH demoing different personas) */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs text-slate-200 transition-all shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">{role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 rounded-lg bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Persona (RBAC Demo)
                </div>
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      setRole(r.value);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                      role === r.value
                        ? 'bg-emerald-500/10 text-emerald-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{r.label}</span>
                      {role === r.value && <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Kill-Switch Button */}
          <button
            onClick={() => setKillModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-400 text-xs font-semibold transition-colors shadow-[0_0_8px_rgba(220,38,38,0.2)]"
            title="Halt all in-flight testing requests immediately"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Kill Switch</span>
          </button>
        </div>
      </header>

      {/* Emergency Kill Switch Confirmation Modal */}
      {killModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-xl bg-slate-900 border border-red-600/50 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertOctagon className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg text-white">Emergency Kill Switch</h3>
                <p className="text-xs text-red-300">Global Security Guardrail Trigger</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              This will immediately cancel all active background BullMQ check jobs, drop active TCP connections in the GuardedHttpClient, and write an immutable audit trail entry.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setKillModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 border border-slate-700"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  triggerKillSwitch('Manual operator emergency latch depression');
                  setKillModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                Halt All Workers
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
