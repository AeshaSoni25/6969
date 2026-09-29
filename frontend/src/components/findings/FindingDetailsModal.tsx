import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Finding, FindingStatus } from '../../types';
import { SeverityBadge, ConfidenceBadge, StatusBadge, CvssScoreBadge } from '../common/Badges';
import {
  X,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileCode,
  Layers,
  Terminal,
  Clock,
  User,
  Hash,
  ExternalLink,
  Code2,
  Copy,
  Check,
} from 'lucide-react';

interface FindingDetailsModalProps {
  finding: Finding;
  onClose: () => void;
}

export const FindingDetailsModal: React.FC<FindingDetailsModalProps> = ({ finding, onClose }) => {
  const {
    transitionFindingStatus,
    setValidationModalFinding,
    runRetest,
    approveAIText,
    setActiveView,
  } = useAegis();

  const [audience, setAudience] = useState<'ANALYST' | 'DEVELOPER' | 'EXECUTIVE'>('DEVELOPER');
  const [activeTab, setActiveTab] = useState<'REMEDIATION' | 'EVIDENCE' | 'AUDIT' | 'CODE'>('REMEDIATION');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getExplanationByAudience = () => {
    if (!finding.ai) return finding.description;
    if (audience === 'DEVELOPER') return finding.ai.developerExplanation;
    if (audience === 'EXECUTIVE') return finding.ai.executiveExplanation;
    return finding.ai.explanationPlain;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 lg:p-6 overflow-y-auto">
      <div className="max-w-6xl w-full rounded-2xl bg-card border border-line shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Sticky Modal Header */}
        <div className="px-6 py-4 border-b border-line bg-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-teal-600 dark:text-teal-400 font-extrabold text-sm">{finding.id}</span>
              <SeverityBadge severity={finding.severity} />
              <CvssScoreBadge score={finding.cvss.score} />
              <ConfidenceBadge confidence={finding.confidence} />
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-subtle text-slate-700 dark:text-slate-300 border border-line">
                {finding.owasp.split(' ')[0]}
              </span>
              {finding.cwe.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded text-[10px] font-mono bg-subtle text-slate-700 dark:text-slate-300 border border-line">
                  {c}
                </span>
              ))}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {finding.title}
            </h2>
          </div>

          {/* Action Header Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Status Transition Dropdown */}
            <select
              value={finding.status}
              onChange={(e) => transitionFindingStatus(finding.id, e.target.value as FindingStatus)}
              className="px-2.5 py-1.5 rounded-lg bg-card border border-line text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-teal-500 shadow-sm"
            >
              <option value="DETECTED">Status: Detected</option>
              <option value="VALIDATING">Status: Validating</option>
              <option value="VERIFIED">Status: Verified</option>
              <option value="IN_REMEDIATION">Status: In Remediation</option>
              <option value="FIX_APPLIED">Status: Fix Applied</option>
              <option value="RETEST_PENDING">Status: Retest Pending</option>
              <option value="FIXED">Status: Fixed (Resolved)</option>
              <option value="REOPENED">Status: Reopened</option>
              <option value="ACCEPTED_RISK">Status: Accepted Risk</option>
              <option value="FALSE_POSITIVE">Status: False Positive</option>
            </select>

            <button
              onClick={() => setValidationModalFinding(finding)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              Safe PoC
            </button>

            <button
              onClick={() => runRetest(finding.id)}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              Retest
            </button>

            <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: 8 cols main / 4 cols sidebar */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-page">
          {/* Main 8-Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Description & Why It Matters */}
            <div className="p-4 rounded-xl bg-card border border-line space-y-3 shadow-card">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Technical Overview</h3>
                <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">{finding.description}</p>
              </div>
              <div className="pt-2 border-t border-line">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Why It Matters (Plain Language)</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{finding.whyItMatters}</p>
              </div>
            </div>

            {/* 2. Grounded AI Explanation Card (Section 10 & 14) */}
            {finding.ai && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-indigo-100/50 dark:from-slate-900 dark:to-indigo-950/40 border border-line shadow-card space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">AI-Assisted Intelligence Layer</span>
                    <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800">
                      {finding.ai.model}
                    </span>
                  </div>

                  {/* Audience Switcher */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-subtle border border-line text-[11px] shadow-sm">
                    {(['ANALYST', 'DEVELOPER', 'EXECUTIVE'] as const).map((aud) => (
                      <button
                        key={aud}
                        onClick={() => setAudience(aud)}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                          audience === aud
                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {aud.charAt(0) + aud.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-card border border-line text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans shadow-xs">
                  {getExplanationByAudience()}
                </div>

                {/* Grounding Facts Panel */}
                <div className="p-2.5 rounded-lg bg-subtle border border-line text-[11px] space-y-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                    Grounded Telemetry Facts Used:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {finding.ai.factsUsed.map((fact, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-card text-teal-700 dark:text-teal-300 font-mono text-[10px] border border-line">
                        {fact}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Approval Gate */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Status:{' '}
                    {finding.ai.approved ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                        APPROVED BY {finding.ai.approvedBy}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono">
                        DRAFT (Analyst Approval Required)
                      </span>
                    )}
                  </span>
                  {!finding.ai.approved && (
                    <button
                      onClick={() => approveAIText(finding.id)}
                      className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve for Report</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 3. Technical Evidence & Request/Response Split */}
            <div className="p-4 rounded-xl bg-card border border-line space-y-3 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Technical Evidence & Request/Response Split
                </h3>
                {finding.technicalEvidence[0] && (
                  <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    SHA-256: {finding.technicalEvidence[0].sha256.slice(0, 16)}...
                  </span>
                )}
              </div>

              {finding.technicalEvidence.map((ev) => (
                <div key={ev.id} className="space-y-2">
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-300">{ev.caption}</div>

                  {ev.requestSnippet && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Outbound Probe Request:</span>
                      <pre className="p-2.5 rounded bg-slate-900 text-teal-300 font-mono text-[11px] overflow-x-auto border border-slate-800 shadow-inner">
                        {`${ev.requestSnippet.method} ${ev.requestSnippet.url}\n` +
                          Object.entries(ev.requestSnippet.headers)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join('\n')}
                      </pre>
                    </div>
                  )}

                  {ev.responseSnippet && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
                        Target Response (Status: {ev.responseSnippet.status} {ev.responseSnippet.statusText}):
                      </span>
                      <pre className="p-2.5 rounded bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800 shadow-inner">
                        {ev.responseSnippet.bodyMasked}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 4. Actionable Remediation Guidance with Code Snippet */}
            <div className="p-4 rounded-xl bg-card border border-line space-y-3 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5" />
                  Actionable Remediation & Fix Plan
                </h3>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  Effort: {finding.recommendation.effort} (Small)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-subtle border border-line">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Immediate Fix:</span>
                  <p className="text-slate-800 dark:text-slate-200 mt-1">{finding.recommendation.immediate}</p>
                </div>
                <div className="p-2.5 rounded bg-subtle border border-line">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Long-term Fix:</span>
                  <p className="text-slate-800 dark:text-slate-200 mt-1">{finding.recommendation.longTerm}</p>
                </div>
              </div>

              {/* Developer Code Snippet */}
              {finding.recommendation.codeSnippet && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      Patch Implementation ({finding.recommendation.codeSnippet.language})
                    </span>
                    <button
                      onClick={() => handleCopyCode(finding.recommendation.codeSnippet!.after)}
                      className="px-2 py-0.5 rounded bg-subtle hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] flex items-center gap-1 transition-colors border border-line"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Patch'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-teal-300 font-mono text-[11px] overflow-x-auto leading-relaxed shadow-inner">
                    {finding.recommendation.codeSnippet.after}
                  </pre>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    {finding.recommendation.codeSnippet.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* 5. Reproduction Steps */}
            <div className="p-4 rounded-xl bg-card border border-line space-y-2 shadow-card">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Safe Reproduction Steps (Recipe)
              </h3>
              <ol className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                {finding.reproductionSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar 4-Columns */}
          <div className="lg:col-span-4 space-y-5">
            {/* CVSS Card */}
            <div className="p-4 rounded-xl bg-card border border-line space-y-3 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">CVSS v3.1 Base Score</span>
                <CvssScoreBadge score={finding.cvss.score} />
              </div>
              <div className="p-2 rounded bg-subtle font-mono text-[10px] text-teal-700 dark:text-teal-400 break-all border border-line">
                {finding.cvss.vector}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 py-1 border-b border-line">
                  <span>Attack Vector:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-mono font-bold">{finding.cvss.av} (Network)</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 py-1 border-b border-line">
                  <span>Attack Complexity:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-mono font-bold">{finding.cvss.ac} (Low)</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 py-1 border-b border-line">
                  <span>Privileges Required:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-mono font-bold">{finding.cvss.pr} (None)</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 py-1 border-b border-line">
                  <span>User Interaction:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-mono font-bold">{finding.cvss.ui} (None)</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 py-1 border-b border-line">
                  <span>Scope:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-mono font-bold">{finding.cvss.s} (Unchanged)</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 py-1">
                  <span>Confidentiality:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-mono font-bold">{finding.cvss.c} (High)</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveView('cvss');
                }}
                className="w-full py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Open in Calculator</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Business Impact Card */}
            <div className="p-4 rounded-xl bg-card border border-line space-y-3 shadow-card">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Business Impact & CIA</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{finding.businessImpact.statement}</p>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                <div className="p-1.5 rounded bg-subtle border border-line">
                  <div className="text-slate-500">Conf</div>
                  <div className="font-bold text-red-600 dark:text-red-400">{finding.businessImpact.ciaDimensions.confidentiality}</div>
                </div>
                <div className="p-1.5 rounded bg-subtle border border-line">
                  <div className="text-slate-500">Integ</div>
                  <div className="font-bold text-slate-600 dark:text-slate-400">{finding.businessImpact.ciaDimensions.integrity}</div>
                </div>
                <div className="p-1.5 rounded bg-subtle border border-line">
                  <div className="text-slate-500">Avail</div>
                  <div className="font-bold text-slate-600 dark:text-slate-400">{finding.businessImpact.ciaDimensions.availability}</div>
                </div>
              </div>
            </div>

            {/* Ownership & SLA */}
            <div className="p-4 rounded-xl bg-card border border-line space-y-2.5 text-xs shadow-card">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Governance & Assignment</span>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Owner: <strong className="text-slate-900 dark:text-white">{finding.owner || 'Unassigned'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>SLA Due: {finding.dueDate ? new Date(finding.dueDate).toLocaleDateString() : '7 Days'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
