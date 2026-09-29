import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Finding, FindingStatus } from '../../types';
import { SeverityBadge, StatusBadge } from '../common/Badges';
import { Kanban, Clock, User, ArrowRight, CheckCircle2, RotateCcw, TrendingDown, ShieldCheck, AlertCircle } from 'lucide-react';

export const RemediationKanbanScreen: React.FC = () => {
  const { findings, transitionFindingStatus, setSelectedFinding, runRetest } = useAegis();
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');

  const columns: { id: string; title: string; statuses: FindingStatus[]; color: string; dot: string }[] = [
    { id: 'col-1', title: 'To Fix', statuses: ['DETECTED', 'VERIFIED'], color: 'border-t-4 border-t-rose-500', dot: 'bg-rose-500' },
    { id: 'col-2', title: 'In Progress', statuses: ['IN_REMEDIATION'], color: 'border-t-4 border-t-amber-500', dot: 'bg-amber-500' },
    { id: 'col-3', title: 'Fix Applied', statuses: ['FIX_APPLIED'], color: 'border-t-4 border-t-teal-600', dot: 'bg-teal-600' },
    { id: 'col-4', title: 'Retest Pending', statuses: ['RETEST_PENDING'], color: 'border-t-4 border-t-orange-500', dot: 'bg-orange-500' },
    { id: 'col-5', title: 'Resolved & Done', statuses: ['FIXED', 'ACCEPTED_RISK'], color: 'border-t-4 border-t-emerald-500', dot: 'bg-emerald-500' },
  ];

  const totalFixed = findings.filter((f) => f.status === 'FIXED' || f.status === 'ACCEPTED_RISK').length;
  const inProgress = findings.filter((f) => f.status === 'IN_REMEDIATION' || f.status === 'FIX_APPLIED').length;
  const toFix = findings.filter((f) => f.status === 'DETECTED' || f.status === 'VERIFIED').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Kanban className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Remediation Center & SLA Tracking</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section 15 Developer & AppSec remediation lifecycle with SLA timers and transition controls.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-line text-xs font-semibold shadow-card">
          <button
            onClick={() => setViewMode('KANBAN')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'KANBAN' ? 'bg-teal-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'TABLE' ? 'bg-teal-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Visual Analytics Banner: Burndown Metric & SLA Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SLA Burn-down Progress */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              Sprint Remediation Velocity
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              {Math.round((totalFixed / (findings.length || 1)) * 100)}% Resolved
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-subtle border border-line/40 flex overflow-hidden">
            <div style={{ width: `${(totalFixed / (findings.length || 1)) * 100}%` }} className="bg-emerald-500 h-full" title="Fixed" />
            <div style={{ width: `${(inProgress / (findings.length || 1)) * 100}%` }} className="bg-amber-500 h-full" title="In Progress" />
            <div style={{ width: `${(toFix / (findings.length || 1)) * 100}%` }} className="bg-rose-500 h-full" title="To Fix" />
          </div>

          <div className="grid grid-cols-3 text-center text-[11px] pt-1">
            <div>
              <span className="text-slate-400 block">Resolved</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">{totalFixed}</span>
            </div>
            <div>
              <span className="text-slate-400 block">In Progress</span>
              <span className="font-bold text-amber-700 dark:text-amber-400 font-mono">{inProgress}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Open Backlog</span>
              <span className="font-bold text-rose-700 dark:text-rose-400 font-mono">{toFix}</span>
            </div>
          </div>
        </div>

        {/* SLA Timers & Deadlines */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              Active SLA Clocks
            </span>
            <span className="text-[10px] text-slate-400">NTRO Mandate</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
              <span className="font-medium text-rose-900 dark:text-rose-200">Critical Severity SLA (7d)</span>
              <span className="font-mono font-bold text-rose-700 dark:text-rose-400">4 Days Left</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
              <span className="font-medium text-amber-900 dark:text-amber-200">High Severity SLA (14d)</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">11 Days Left</span>
            </div>
          </div>
        </div>

        {/* Canary Verification Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border border-teal-200 dark:border-teal-800/60 shadow-card space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              Automated Retesting Hook
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
              Ready
            </span>
          </div>
          <p className="text-xs text-teal-900 dark:text-teal-300 leading-relaxed">
            Developer patch commits trigger automated sandbox retesting without manual analyst intervention.
          </p>
          <div className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold font-mono">
            CI/CD Webhook: /api/webhooks/retest-on-commit
          </div>
        </div>
      </div>

      {/* KANBAN BOARD */}
      {viewMode === 'KANBAN' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colFindings = findings.filter((f) => col.statuses.includes(f.status));
            return (
              <div
                key={col.id}
                className={`flex flex-col min-w-[260px] rounded-2xl bg-subtle border border-line ${col.color} p-4 space-y-3 shadow-card`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-line text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{col.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[10px] bg-card text-slate-700 dark:text-slate-300 border border-line shadow-card">
                    {colFindings.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px]">
                  {colFindings.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFinding(f)}
                      className="p-4 rounded-xl bg-card border border-line hover:border-teal-500 cursor-pointer transition-all space-y-2.5 group shadow-card"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-teal-700 dark:text-teal-400 font-bold text-xs">{f.id}</span>
                        <SeverityBadge severity={f.severity} />
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug line-clamp-2">
                        {f.title}
                      </h4>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-line">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {f.owner || 'Unassigned'}
                        </span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">CVSS {f.cvss.score}</span>
                      </div>

                      {/* Advance Button */}
                      {f.status === 'IN_REMEDIATION' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            transitionFindingStatus(f.id, 'FIX_APPLIED');
                          }}
                          className="w-full mt-1 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Mark Fix Applied</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {f.status === 'FIX_APPLIED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            runRetest(f.id);
                          }}
                          className="w-full mt-1 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-card"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Trigger Sandbox Retest</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-card border border-line overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-subtle border-b border-line text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Finding ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">SLA Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-mono">
                {findings.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => setSelectedFinding(f)}
                    className="hover:bg-subtle cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-teal-700 dark:text-teal-400">{f.id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">{f.title}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <SeverityBadge severity={f.severity} />
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300">{f.owner || 'Unassigned'}</td>
                    <td className="py-3 px-4 font-sans text-slate-500 dark:text-slate-400">
                      {f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '7 Days'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-subtle text-slate-700 dark:text-slate-300 border border-line">
                        {f.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => runRetest(f.id)}
                        className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[11px] font-semibold transition-colors"
                      >
                        Retest
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
