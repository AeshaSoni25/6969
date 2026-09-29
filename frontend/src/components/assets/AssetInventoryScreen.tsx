import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  Boxes,
  Search,
  Lock,
  Unlock,
  Server,
  Globe,
  Database,
  Radio,
  FileCode,
  ShieldAlert,
  ArrowUpRight,
  Network,
  Cpu,
  Layers,
} from 'lucide-react';

export const AssetInventoryScreen: React.FC = () => {
  const { assets, findings, setSelectedFinding } = useAegis();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = assets.filter((a) => {
    const matchesType = filterType === 'ALL' || a.type === filterType;
    const matchesSearch =
      a.urlOrPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.techFingerprint && a.techFingerprint.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Calculate asset statistics for graphics
  const totalAssets = assets.length;
  const endpointCount = assets.filter((a) => a.type === 'ENDPOINT').length;
  const pageCount = assets.filter((a) => a.type === 'PAGE').length;
  const wsCount = assets.filter((a) => a.type === 'WS_CHANNEL').length;
  const scriptCount = assets.filter((a) => a.type === 'SCRIPT' || a.type === 'COOKIE').length;
  const unauthCount = assets.filter((a) => !a.authRequired).length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Boxes className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Discovered Asset Inventory</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated crawler and passive XHR inventory of pages, API endpoints, web sockets, and client-side storage keys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">Surface Exposure:</span>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-subtle text-teal-800 dark:text-teal-300 border border-line">
            {totalAssets} Indexed Assets
          </span>
        </div>
      </div>

      {/* Visual Analytics & Attack Surface Topology Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Graphic 1: Attack Surface Architecture Topology (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-card border border-line shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Attack Surface Network Topology</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Target: worldmonitor.app</span>
          </div>

          {/* Graphical Topology Map Diagram */}
          <div className="relative p-4 rounded-xl bg-subtle border border-line overflow-hidden">
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 dark:stroke-slate-700 fill-none" strokeDasharray="3 3">
              <line x1="16%" y1="50%" x2="35%" y2="50%" strokeWidth="2" stroke="#0d9488" strokeDasharray="none" />
              <line x1="45%" y1="50%" x2="65%" y2="25%" strokeWidth="1.5" />
              <line x1="45%" y1="50%" x2="65%" y2="50%" strokeWidth="1.5" stroke="#f59e0b" />
              <line x1="45%" y1="50%" x2="65%" y2="75%" strokeWidth="1.5" stroke="#ef4444" />
              <line x1="75%" y1="25%" x2="90%" y2="50%" strokeWidth="1.5" />
              <line x1="75%" y1="50%" x2="90%" y2="50%" strokeWidth="1.5" />
              <line x1="75%" y1="75%" x2="90%" y2="50%" strokeWidth="1.5" />
            </svg>

            <div className="relative grid grid-cols-4 gap-4 items-center min-h-[140px] text-center">
              {/* Node 1: Ingress / Edge CDN */}
              <div className="p-3 rounded-xl bg-card border border-line shadow-xs flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-1">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">Edge Gateway</span>
                <span className="text-[9px] text-teal-600 font-mono">Cloudflare CDN</span>
              </div>

              {/* Node 2: App Reverse Proxy */}
              <div className="p-3 rounded-xl bg-card border border-line shadow-xs flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-1">
                  <Server className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">API Reverse Proxy</span>
                <span className="text-[9px] text-teal-600 font-mono">nginx:1.24 (Port 443)</span>
              </div>

              {/* Node 3: Service Layer (3 mini badges) */}
              <div className="flex flex-col gap-2">
                <div className="p-1.5 rounded-lg bg-card border border-line text-left flex items-center gap-1.5 shadow-2xs">
                  <Globe className="w-3 h-3 text-blue-500 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Web UI SPA</span>
                </div>
                <div className="p-1.5 rounded-lg bg-card border border-amber-300/60 text-left flex items-center gap-1.5 shadow-2xs">
                  <Cpu className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">REST API Microservices</span>
                </div>
                <div className="p-1.5 rounded-lg bg-card border border-rose-300/60 text-left flex items-center gap-1.5 shadow-2xs">
                  <Radio className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">WebSocket Stream</span>
                </div>
              </div>

              {/* Node 4: Persistence / Storage */}
              <div className="p-3 rounded-xl bg-card border border-line shadow-xs flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-subtle text-slate-700 dark:text-slate-300 flex items-center justify-center mb-1">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">Datastore / Cache</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">Postgres & Redis</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px]">
            <div className="p-2 rounded-lg bg-subtle border border-line">
              <span className="text-slate-400 block">Endpoints</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{endpointCount} active</span>
            </div>
            <div className="p-2 rounded-lg bg-subtle border border-line">
              <span className="text-slate-400 block">Web Pages</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{pageCount} crawled</span>
            </div>
            <div className="p-2 rounded-lg bg-subtle border border-line">
              <span className="text-slate-400 block">Sockets</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{wsCount} channels</span>
            </div>
            <div className="p-2 rounded-lg bg-subtle border border-line">
              <span className="text-slate-400 block">Public No-Auth</span>
              <span className="font-bold text-amber-700 dark:text-amber-400 text-xs">{unauthCount} exposed</span>
            </div>
          </div>
        </div>

        {/* Visual Graphic 2: Asset Exposure Breakdown Donut & Criticality (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Surface Type Distribution</h2>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">100% Verified</span>
          </div>

          <div className="flex items-center justify-around gap-4">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0d9488" strokeWidth="12" strokeDasharray="110 238.7" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="60 238.7" strokeDashoffset="-115" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="40 238.7" strokeDashoffset="-180" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="25 238.7" strokeDashoffset="-225" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">{totalAssets}</span>
                <span className="text-[9px] text-slate-400">Total</span>
              </div>
            </div>

            {/* Bars & Percentages */}
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-teal-600" />
                  API Endpoints
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">46%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Web Pages (SPA)
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  WebSocket Feeds
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">17%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Scripts & Storage
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">12%</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-subtle border border-line flex items-center justify-between text-xs text-teal-800 dark:text-teal-300">
            <span className="font-medium">Active Guardrail Interception:</span>
            <span className="font-bold font-mono">Zero Egress Breaches</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Type Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-line text-xs overflow-x-auto w-full sm:w-auto shadow-card">
          {['ALL', 'ENDPOINT', 'PAGE', 'WS_CHANNEL', 'SCRIPT', 'COOKIE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === type
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-subtle'
              }`}
            >
              {type === 'ALL' ? 'All Assets' : type}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search path, protocol, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-subtle border border-line text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>
      </div>

      {/* Asset Catalog Table */}
      <div className="rounded-2xl bg-card border border-line overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-subtle border-b border-line text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">URL / Path Pattern</th>
                <th className="py-3 px-4">Auth Required</th>
                <th className="py-3 px-4">Criticality</th>
                <th className="py-3 px-4">Associated Flaws</th>
                <th className="py-3 px-4">Tech Fingerprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-mono">
              {filtered.map((asset) => (
                <tr key={asset.id} className="hover:bg-subtle transition-colors">
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-subtle text-slate-700 dark:text-slate-300 border border-line">
                      {asset.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{asset.urlOrPath}</div>
                    {asset.method && (
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold uppercase">{asset.method} method</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {asset.authRequired ? (
                      <span className="flex items-center gap-1 text-[11px] font-sans font-medium text-slate-700 dark:text-slate-300">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        Bearer Token
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-sans font-medium text-amber-700 dark:text-amber-400">
                        <Unlock className="w-3 h-3 text-amber-600" />
                        Public (Unauthenticated)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        asset.criticality === 'HIGH'
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                          : asset.criticality === 'MEDIUM'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                          : 'bg-subtle text-slate-700 dark:text-slate-300 border border-line'
                      }`}
                    >
                      {asset.criticality}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {asset.hasFindingsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-sans text-xs font-semibold">
                        {asset.hasFindingsCount} {asset.hasFindingsCount === 1 ? 'Finding' : 'Findings'}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-sans text-[11px]">0 Flaws</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-400">
                    {asset.techFingerprint || <span className="text-slate-400 italic">None detected</span>}
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
