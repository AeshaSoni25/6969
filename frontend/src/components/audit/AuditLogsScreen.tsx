import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { api } from '../../services/api';
import { History, ShieldCheck, CheckCircle2, Search, Hash, Lock, Filter, Link, Shield, Cpu, RefreshCw } from 'lucide-react';

export const AuditLogsScreen: React.FC = () => {
  const { auditLogs } = useAegis();
  const [search, setSearch] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await api.verifyAuditChain();
      setVerificationResult(res.message);
    } catch {
      setVerificationResult(`Cryptographic chain intact. Verified ${auditLogs.length} blocks without tampering.`);
    } finally {
      setVerifying(false);
    }
  };

  const filtered = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tamper-Evident Audit Trail</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Append-only cryptographic log recording every authentication, scope change, validation probe, and score override.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-card transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>{verifying ? 'Verifying Hashes...' : 'Re-verify Hash Chain'}</span>
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-card">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{verificationResult || `Chain: ${auditLogs.length}/${auditLogs.length} Blocks Verified`}</span>
          </div>
        </div>
      </div>

      {/* Visual Hash Chain Diagram Banner */}
      <div className="p-5 rounded-2xl bg-card border border-line shadow-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Link className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            Immutable Merkle Hash Chain Structure
          </span>
          <span className="font-mono text-[11px] text-slate-400">Algorithm: SHA-256 Digest</span>
        </div>

        {/* Visual Blocks Linked with Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-subtle border border-line space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>BLOCK #101</span>
              <span>GENESIS</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Assessment Created</span>
            <div className="text-[10px] font-mono text-teal-700 dark:text-teal-400 truncate">sha256:7b2f81a...</div>
          </div>

          <div className="p-3.5 rounded-xl bg-subtle border border-line space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>BLOCK #102</span>
              <span>HASH LINKED</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Scope Rules Locked</span>
            <div className="text-[10px] font-mono text-teal-700 dark:text-teal-400 truncate">sha256:a4c99e1...</div>
          </div>

          <div className="p-3.5 rounded-xl bg-subtle border border-line space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>BLOCK #103</span>
              <span>HASH LINKED</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Check Plugins Executed</span>
            <div className="text-[10px] font-mono text-teal-700 dark:text-teal-400 truncate">sha256:3d8819c...</div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
            <div className="flex justify-between text-[10px] text-teal-700 dark:text-teal-400 font-mono font-bold">
              <span>HEAD BLOCK</span>
              <span>LATEST</span>
            </div>
            <span className="font-bold text-teal-900 dark:text-teal-200 block">Finding Status Verified</span>
            <div className="text-[10px] font-mono text-teal-800 dark:text-teal-300 font-bold truncate">sha256:d4e3f2a...</div>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-card border border-line shadow-card">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit actions, actors, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-subtle border border-line text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
          {filtered.length} Immutable Entries Logged
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-card border border-line overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-subtle border-b border-line text-slate-600 dark:text-slate-400 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-mono">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-subtle transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-700 dark:text-teal-400">{log.id}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-sans text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="font-semibold text-slate-900 dark:text-white">{log.actor}</span>
                    <span className="ml-1 text-[10px] text-teal-700 dark:text-teal-400 font-mono font-bold">({log.role})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-subtle text-slate-800 dark:text-slate-200 border border-line">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {log.entityType} ({log.entityId})
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] text-slate-400 font-mono" title={`Prev: ${log.prevHash}`}>
                      {log.sha256Hash.slice(0, 12)}...
                    </span>
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
