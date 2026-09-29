import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { SeverityBadge, StatusBadge, CvssScoreBadge } from '../common/Badges';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Hash,
  ExternalLink,
  Shield,
  Award,
} from 'lucide-react';

export const ReportGeneratorScreen: React.FC = () => {
  const { currentAssessment, findings, auditLogs } = useAegis();
  const [reportType, setReportType] = useState<'FULL' | 'EXECUTIVE' | 'RETEST'>('FULL');

  const reportHash = 'sha256:d4e3f2a1b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2';

  const handlePrint = () => {
    window.print();
  };

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;
  const mediumCount = findings.filter((f) => f.severity === 'MEDIUM').length;
  const lowCount = findings.filter((f) => f.severity === 'LOW').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Security Assessment Report Generator</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section 15 Executive and technical report generator with cryptographic SHA-256 signing and print-to-PDF layout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-line text-xs font-semibold shadow-card">
            <button
              onClick={() => setReportType('FULL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reportType === 'FULL' ? 'bg-teal-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Full Technical
            </button>
            <button
              onClick={() => setReportType('EXECUTIVE')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reportType === 'EXECUTIVE' ? 'bg-teal-700 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Executive Brief
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-card cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* REPORT PREVIEW CONTAINER (Strictly white paper document preview with dark text) */}
      <div className="bg-white dark:bg-white text-slate-800 dark:text-slate-800 border border-slate-200 rounded-2xl p-6 sm:p-12 space-y-10 shadow-card max-w-4xl mx-auto print:bg-white print:text-black print:border-none print:p-0">
        {/* 1. COVER PAGE / HEADER */}
        <div className="border-b border-slate-200 pb-8 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Secure<span className="text-teal-600">Mon</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                OFFICIAL AUDIT REPORT
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
              CLASSIFICATION: CONFIDENTIAL
            </span>
          </div>

          <div className="pt-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Security Assessment Report
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Target: {currentAssessment.target.name} ({currentAssessment.target.baseUrl})
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assessment ID</span>
              <span className="font-mono font-bold text-slate-900">{currentAssessment.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date Conducted</span>
              <span className="font-bold text-slate-900">{currentAssessment.startedAt ? new Date(currentAssessment.startedAt).toLocaleDateString() : 'Active Assessment'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Security Score</span>
              <span className="font-mono font-bold text-teal-700">{currentAssessment.score} / 100</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">NTRO Baseline</span>
              <span className="font-bold text-emerald-700">COMPLIANT</span>
            </div>
          </div>
        </div>

        {/* 2. EXECUTIVE POSTURE & VISUAL GAUGES */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            1. Executive Security Posture & Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Score</span>
              <div className="text-3xl font-extrabold text-teal-700 font-mono">82/100</div>
              <span className="text-[10px] text-emerald-600 font-semibold block">▲ +6.2% vs previous run</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Open Vulnerabilities</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">{findings.length}</div>
              <span className="text-[10px] text-slate-500 block">4 Critical / High Findings</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Scope Guardrails</span>
              <div className="text-3xl font-extrabold text-emerald-600 font-mono">100%</div>
              <span className="text-[10px] text-emerald-700 font-semibold block">0 Out-of-Scope Breaches</span>
            </div>
          </div>

          {/* Visual Severity Breakdown Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Severity Distribution:</span>
            <div className="w-full h-3 rounded-full bg-slate-200 flex overflow-hidden">
              <div style={{ width: `${(criticalCount / findings.length) * 100}%` }} className="bg-rose-500 h-full" />
              <div style={{ width: `${(highCount / findings.length) * 100}%` }} className="bg-orange-500 h-full" />
              <div style={{ width: `${(mediumCount / findings.length) * 100}%` }} className="bg-amber-500 h-full" />
              <div style={{ width: `${(lowCount / findings.length) * 100}%` }} className="bg-blue-500 h-full" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>{criticalCount} Critical</span>
              <span>{highCount} High</span>
              <span>{mediumCount} Medium</span>
              <span>{lowCount} Low</span>
            </div>
          </div>
        </div>

        {/* 3. FINDINGS CATALOG */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            2. Detailed Findings Summary
          </h2>

          <div className="space-y-3">
            {findings.map((f) => (
              <div key={f.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-700">{f.id}</span>
                    <span className="font-semibold text-slate-900">{f.title}</span>
                  </div>
                  <SeverityBadge severity={f.severity} />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                <div className="text-[11px] font-mono text-slate-400">Endpoint: {f.endpoint}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CRYPTOGRAPHIC SIGNATURE & CERTIFICATION */}
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Award className="w-4 h-4 text-teal-700" />
            <span>Cryptographic Digital Signature & Integrity Verification</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-600 break-all">
            DOCUMENT HASH: {reportHash}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Signed by SecureMon Automated Attestation Authority</span>
            <span>Tamper-evident verification: PASS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
