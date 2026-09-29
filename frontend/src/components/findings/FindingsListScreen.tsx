import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Finding, FindingSeverity, FindingStatus } from '../../types';
import { SeverityBadge, ConfidenceBadge, CvssScoreBadge } from '../common/Badges';
import {
  Bug,
  Search,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Download,
  BarChart2,
  PieChart,
  ShieldAlert,
  Flame,
} from 'lucide-react';

export const FindingsListScreen: React.FC = () => {
  const {
    findings,
    setSelectedFinding,
    setValidationModalFinding,
    transitionFindingStatus,
  } = useAegis();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = findings.filter((f) => {
    const matchesSearch =
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.endpoint.toLowerCase().includes(search.toLowerCase()) ||
      f.cwe.some((c) => c.toLowerCase().includes(search.toLowerCase()));

    const matchesSeverity = severityFilter === 'ALL' || f.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;
  const mediumCount = findings.filter((f) => f.severity === 'MEDIUM').length;
  const lowCount = findings.filter((f) => f.severity === 'LOW').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Bug className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Vulnerability Findings & Triage</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validated security flaws with reproducible sandbox proof-of-concept, explainable CVSS, and developer remediation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const csv = findings.map((f) => `${f.id},"${f.title}",${f.severity},${f.cvss.score},${f.status}`).join('\n');
              const blob = new Blob([`ID,Title,Severity,CVSS,Status\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `securemon-findings-${Date.now()}.csv`;
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-subtle border border-line text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-card"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Visual Analytics Graphs: Severity Distribution & CVSS Spectrum */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Severity Visual Bar Chart */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-teal-600" />
              Severity Breakdown
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{findings.length} total</span>
          </div>

          {/* Stacked Percentage Bar */}
          <div className="w-full h-3 rounded-full bg-subtle flex overflow-hidden border border-line">
            <div style={{ width: `${(criticalCount / findings.length) * 100}%` }} className="bg-rose-500 h-full" title="Critical" />
            <div style={{ width: `${(highCount / findings.length) * 100}%` }} className="bg-orange-500 h-full" title="High" />
            <div style={{ width: `${(mediumCount / findings.length) * 100}%` }} className="bg-amber-500 h-full" title="Medium" />
            <div style={{ width: `${(lowCount / findings.length) * 100}%` }} className="bg-blue-500 h-full" title="Low" />
          </div>

          <div className="grid grid-cols-4 text-center text-xs pt-1">
            <div>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block">Critical</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{criticalCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold block">High</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{highCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">Medium</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{mediumCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">Low</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{lowCount}</span>
            </div>
          </div>
        </div>

        {/* CVSS v3.1 Risk Intensity Gauge */}
        <div className="p-4 rounded-2xl bg-card border border-line shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              CVSS 3.1 Peak Threat
            </span>
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
              Max 9.8 / 10
            </span>
          </div>

          <div className="relative pt-1">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>0.0 (None)</span>
              <span>3.9 (Low)</span>
              <span>6.9 (Med)</span>
              <span>8.9 (High)</span>
              <span>10.0 (Crit)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-blue-400 via-amber-400 via-orange-400 to-rose-600 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 right-1 w-1.5 bg-white shadow-xs" />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            2 findings rated above 8.0 require immediate SLA remediation within 7 days.
          </p>
        </div>

        {/* Noise Reduction & Deduplication Pill */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              Noise Deduplication
            </span>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-[10px]">
              -75% Noise
            </span>
          </div>
          <p className="text-xs text-teal-800 dark:text-teal-300 leading-relaxed">
            Consolidated 40 raw probe signals into 1 root-cause action finding across all affected API endpoints.
          </p>
          <div className="text-[10px] text-teal-700 dark:text-teal-400 font-mono font-semibold">
            Status: Zero Alert Fatigue Enforced
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-line shadow-card">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, title, endpoint, CWE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-subtle border border-line text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Severity Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-subtle border border-line text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-subtle border border-line text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="DETECTED">Detected</option>
            <option value="VERIFIED">Verified</option>
            <option value="IN_REMEDIATION">In Remediation</option>
            <option value="FIX_APPLIED">Fix Applied</option>
            <option value="FIXED">Fixed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-card border border-line overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-subtle border-b border-line text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Finding ID</th>
                <th className="py-3 px-4">Vulnerability Title</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">CVSS</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Target Endpoint</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-mono">
              {filtered.map((f) => (
                <tr
                  key={f.id}
                  onClick={() => setSelectedFinding(f)}
                  className="hover:bg-subtle cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-teal-700 dark:text-teal-400">{f.id}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-slate-100 max-w-[260px] truncate">
                    {f.title}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <SeverityBadge severity={f.severity} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <CvssScoreBadge score={f.cvss.score} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-sans">
                    <ConfidenceBadge confidence={f.confidence} />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px] max-w-[180px] truncate">
                    {f.endpoint}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-subtle text-slate-700 dark:text-slate-300 border border-line">
                      {f.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setValidationModalFinding(f)}
                        className="px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold transition-colors"
                      >
                        Safe PoC
                      </button>
                      <button
                        onClick={() => setSelectedFinding(f)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
