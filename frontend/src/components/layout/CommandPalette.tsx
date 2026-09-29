import React, { useState, useEffect } from 'react';
import { useAegis, ViewType } from '../../context/AegisContext';
import { Search, Bug, Boxes, Shield, Terminal, ArrowRight, X } from 'lucide-react';
import { SeverityBadge } from '../common/Badges';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    findings,
    assets,
    checks,
    setActiveView,
    setSelectedFinding,
  } = useAegis();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredFindings = findings.filter(
    (f) =>
      f.id.toLowerCase().includes(query.toLowerCase()) ||
      f.title.toLowerCase().includes(query.toLowerCase()) ||
      f.cwe.some((c) => c.toLowerCase().includes(query.toLowerCase())) ||
      f.affectedComponent.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAssets = assets.filter(
    (a) =>
      a.urlOrPath.toLowerCase().includes(query.toLowerCase()) ||
      a.type.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChecks = checks.filter(
    (c) =>
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase())
  );

  const views: { id: ViewType; label: string; desc: string }[] = [
    { id: 'dashboard', label: 'Security Posture Dashboard', desc: 'Overview, KPIs, and risk distribution' },
    { id: 'findings', label: 'Vulnerability Findings List', desc: 'Triage, filter, and review detected flaws' },
    { id: 'running', label: 'Live Assessment Orchestration', desc: 'Real-time DAG checks, logs, and kill switch' },
    { id: 'scope', label: 'Scope & Authorization Gate', desc: 'Pre-flight checklist and target manifest' },
    { id: 'cvss', label: 'CVSS 3.1 Calculator', desc: 'Interactive CVSS metric calculator and rationale' },
    { id: 'risk', label: 'Business Risk Heatmap', desc: '5x5 Likelihood x Impact matrix' },
    { id: 'ai', label: 'AI Analyst Assistant', desc: 'Grounded finding explanations and developer fixes' },
    { id: 'remediation', label: 'Remediation Center', desc: 'Kanban board and SLA tracking' },
    { id: 'retest', label: 'Retesting Center', desc: 'Validation replay and before/after diffs' },
    { id: 'reports', label: 'Report Generator', desc: 'Executive & technical PDF export' },
    { id: 'audit', label: 'Tamper-Evident Audit Logs', desc: 'Append-only hash-chained activity records' },
  ];

  const filteredViews = views.filter(
    (v) =>
      v.label.toLowerCase().includes(query.toLowerCase()) ||
      v.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in-50">
      <div className="max-w-2xl w-full rounded-2xl bg-card border border-line shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-line bg-subtle gap-3">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, finding ID (FND-0001), endpoint, or CVE..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-subtle p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
          {/* Views */}
          {filteredViews.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Platform Navigation
              </div>
              <div className="space-y-1 mt-1">
                {filteredViews.slice(0, 4).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveView(v.id);
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-teal-50/80 dark:hover:bg-teal-950/40 hover:border-teal-200/80 dark:hover:border-teal-800/60 border border-transparent flex items-center justify-between text-slate-700 dark:text-slate-300 group transition-all"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-800 dark:group-hover:text-teal-300 transition-colors">
                        {v.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{v.desc}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Findings */}
          {filteredFindings.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bug className="w-3 h-3 text-orange-500" />
                Vulnerability Findings ({filteredFindings.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredFindings.slice(0, 6).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFinding(f);
                      setActiveView('findings');
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-subtle hover:border-line border border-transparent flex items-center justify-between text-slate-700 dark:text-slate-300 group transition-all"
                  >
                    <div className="truncate mr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">{f.id}</span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                          {f.title}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">{f.endpoint}</div>
                    </div>
                    <SeverityBadge severity={f.severity} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assets */}
          {filteredAssets.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Boxes className="w-3 h-3 text-blue-500" />
                Discovered Assets ({filteredAssets.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredAssets.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setActiveView('assets');
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-subtle hover:border-line border border-transparent flex items-center justify-between text-slate-700 dark:text-slate-300 group transition-all"
                  >
                    <div className="truncate">
                      <div className="font-mono text-slate-900 dark:text-white font-semibold group-hover:text-teal-800 dark:group-hover:text-teal-300 transition-colors">
                        {a.urlOrPath}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Type: {a.type}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-subtle text-slate-600 dark:text-slate-400 font-medium border border-line">
                      {a.criticality}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-line bg-subtle text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-card text-slate-600 dark:text-slate-400 border border-line text-[10px] font-mono shadow-card">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-card text-slate-600 dark:text-slate-400 border border-line text-[10px] font-mono shadow-card">↓</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-card text-slate-600 dark:text-slate-400 border border-line text-[10px] font-mono shadow-card">ESC</kbd>
          </div>
          <span className="text-teal-700 dark:text-teal-400 font-semibold text-[11px]">AegisLens Command Registry</span>
        </div>
      </div>
    </div>
  );
};
