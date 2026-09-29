import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { SeverityBadge, StatusBadge, CvssScoreBadge } from '../common/Badges';
import {
  ShieldAlert,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export const MainDashboard: React.FC<{ onOpenCreateWizard: () => void }> = ({ onOpenCreateWizard }) => {
  const {
    currentAssessment,
    findings,
    setSelectedFinding,
    setActiveView,
    executiveView,
    setExecutiveView,
    startAssessmentRun,
    isAssessing,
  } = useAegis();

  // Metrics calculation
  const counts = {
    critical: findings.filter((f) => f.severity === 'CRITICAL' && f.status !== 'FIXED').length,
    high: findings.filter((f) => f.severity === 'HIGH' && f.status !== 'FIXED').length,
    medium: findings.filter((f) => f.severity === 'MEDIUM' && f.status !== 'FIXED').length,
    low: findings.filter((f) => f.severity === 'LOW' && f.status !== 'FIXED').length,
    info: findings.filter((f) => f.severity === 'INFO' && f.status !== 'FIXED').length,
    fixed: findings.filter((f) => f.status === 'FIXED').length,
    retestPending: findings.filter((f) => f.status === 'RETEST_PENDING' || f.status === 'FIX_APPLIED').length,
    open: findings.filter((f) => !['FIXED', 'FALSE_POSITIVE'].includes(f.status)).length,
  };

  // Risk Trend Chart Data (from Section 35)
  const riskTrendData = [
    { run: 'Run 1 (Sep 08)', score: 42, critical: 1, high: 4 },
    { run: 'Run 2 (Sep 15)', score: 51, critical: 0, high: 3 },
    { run: 'Run 3 (Sep 22)', score: 58, critical: 0, high: 3 },
    { run: 'Run 4 (Today)', score: currentAssessment.score, critical: counts.critical, high: counts.high },
  ];

  // Severity Distribution Data
  const severityData = [
    { name: 'Critical', value: counts.critical, color: '#DC2626' },
    { name: 'High', value: counts.high, color: '#EA580C' },
    { name: 'Medium', value: counts.medium, color: '#EAB308' },
    { name: 'Low', value: counts.low, color: '#2563EB' },
    { name: 'Info', value: counts.info, color: '#64748B' },
  ].filter((d) => d.value > 0);

  // OWASP Top 10 breakdown
  const owaspData = [
    { name: 'A01 Broken Access Control', count: 3 },
    { name: 'A02 Cryptographic Failures', count: 1 },
    { name: 'A03 Injection', count: 1 },
    { name: 'A05 Security Misconfig', count: 4 },
    { name: 'A07 Identification & Auth', count: 1 },
  ];

  // Component breakdown
  const componentData = [
    { name: 'REST APIs', count: 4 },
    { name: 'Auth & Session', count: 2 },
    { name: 'Client-Side (JS/DOM)', count: 3 },
    { name: 'Transport & Headers', count: 1 },
  ];

  // Recommended actions (from Section 35)
  const recommendedActions = [
    {
      id: 'REC-1',
      title: 'Fix FND-0001: Export API unprotected',
      impact: 'Critical Data Exposure',
      effort: 'Small (Add @UseGuards)',
      findingId: 'FND-0001',
    },
    {
      id: 'REC-2',
      title: 'Fix FND-0002: Add role check on admin summary',
      impact: 'Vertical Privilege Escalation',
      effort: 'Small (Add @Roles(Role.ADMIN))',
      findingId: 'FND-0002',
    },
    {
      id: 'REC-3',
      title: 'Replay Retest for FND-0005 (Fix Applied)',
      impact: 'Verify Cookie Protection',
      effort: '1-Click Retest Replay',
      findingId: 'FND-0005',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in-50">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Security Posture Dashboard</h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              {currentAssessment.target.envType}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time assessment intelligence for <span className="text-slate-900 dark:text-slate-200 font-semibold">{currentAssessment.name}</span> ({currentAssessment.target.baseUrl})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setExecutiveView(!executiveView)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-card ${
              executiveView
                ? 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                : 'bg-card text-slate-700 dark:text-slate-300 border-line hover:bg-subtle'
            }`}
          >
            {executiveView ? 'Executive View: ON' : 'Technical View: ON'}
          </button>

          <button
            disabled={isAssessing}
            onClick={() => {
              setActiveView('running');
              startAssessmentRun();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-card disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAssessing ? 'Assessing...' : 'Run Assessment'}</span>
          </button>

          <button
            onClick={onOpenCreateWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-subtle border border-line text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-card"
          >
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Row 1: Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Security Score Gauge Card */}
        <div className="col-span-2 sm:col-span-1 rounded-xl bg-card border border-line shadow-card p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all" />
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Security Score</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +9
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
              {currentAssessment.score}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-cyan-500 h-1.5 rounded-full"
              style={{ width: `${currentAssessment.score}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">Moderate Risk (Weighted CVSS)</p>
        </div>

        {/* Critical Card */}
        <div className="rounded-xl bg-card border border-line shadow-card p-4 hover:border-red-400 dark:hover:border-red-500/30 transition-colors shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Critical</span>
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-2">{counts.critical}</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">SLA: 7 days</p>
        </div>

        {/* High Card */}
        <div className="rounded-xl bg-card border border-line shadow-card p-4 hover:border-orange-400 dark:hover:border-orange-500/30 transition-colors shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>High Severity</span>
            <span className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400 mt-2">{counts.high}</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Requires immediate patch</p>
        </div>

        {/* Medium Card */}
        <div className="rounded-xl bg-card border border-line shadow-card p-4 hover:border-amber-400 dark:hover:border-amber-500/30 transition-colors shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Medium</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-2">{counts.medium}</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">SLA: 30 days</p>
        </div>

        {/* Low Card */}
        <div className="rounded-xl bg-card border border-line shadow-card p-4 hover:border-blue-400 dark:hover:border-blue-500/30 transition-colors shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Low</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-2">{counts.low}</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Defense-in-depth</p>
        </div>

        {/* Open Findings Total */}
        <div className="rounded-xl bg-card border border-line shadow-card p-4 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Active Flaws</span>
            <AlertTriangle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-700 dark:text-cyan-400 mt-2">{counts.open}</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Deduplicated from signals</p>
        </div>
      </div>

      {/* Row 2: Secondary Status Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="rounded-xl bg-card border border-line shadow-card p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Fixed Vulnerabilities</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Validated via automated retest diff</div>
            </div>
          </div>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{counts.fixed}</span>
        </div>

        <div className="rounded-xl bg-card border border-line shadow-card p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/40 text-orange-600 dark:text-orange-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Retest Pending</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Developers applied code fixes</div>
            </div>
          </div>
          <span className="text-lg font-bold font-mono text-orange-600 dark:text-orange-400">{counts.retestPending}</span>
        </div>

        <div className="rounded-xl bg-card border border-line shadow-card p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40 text-cyan-600 dark:text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Scope Coverage</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">14 Checks across 7 Areas</div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            100% COMPLETE
          </span>
        </div>
      </div>

      {/* Row 3: Charts (Risk Trend + Severity Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Risk Trend Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-xl bg-card border border-line shadow-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Security Posture & Score Trend Over Time
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Tracking score progression and high-severity reduction across assessment cycles</p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">4 Assessment Runs</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="run" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Security Score (0-100)"
                  stroke="#0891b2"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0891b2' }}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  name="Open High Flaws"
                  stroke="#ea580c"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut (4 cols) */}
        <div className="lg:col-span-4 rounded-xl bg-card border border-line shadow-card p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Severity Distribution</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Breakdown of validated vulnerabilities</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-800/80">
            {severityData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name}:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: OWASP & Component Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* OWASP Bar Chart (6 cols) */}
        <div className="lg:col-span-6 rounded-xl bg-card border border-line shadow-card p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">OWASP Top 10:2021 Alignment</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Vulnerabilities categorized by industry standard standards</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={owaspData} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={130} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Affected Components (6 cols) */}
        <div className="lg:col-span-6 rounded-xl bg-card border border-line shadow-card p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Affected Architecture Layers</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Concentration of risks across target subcomponents</p>
          </div>
          <div className="space-y-3 pt-2">
            {componentData.map((c) => {
              const pct = (c.count / 10) * 100;
              return (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{c.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">{c.count} findings ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-600 dark:bg-cyan-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 5: Recent Findings Table (8 cols) & Recommended Actions (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Findings Table (8 cols) */}
        <div className="lg:col-span-8 rounded-xl bg-card border border-line shadow-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Discovered Vulnerabilities</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Deduplicated findings with reproducible sandbox proof</p>
            </div>
            <button
              onClick={() => setActiveView('findings')}
              className="text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View All 10 Findings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                  <th className="pb-2.5">ID</th>
                  <th className="pb-2.5">Vulnerability Title</th>
                  <th className="pb-2.5">Severity</th>
                  <th className="pb-2.5">CVSS</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {findings.slice(0, 6).map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => {
                      setSelectedFinding(f);
                    }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 font-mono text-cyan-700 dark:text-cyan-400 font-bold">{f.id}</td>
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors max-w-xs truncate">
                        {f.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{f.endpoint}</div>
                    </td>
                    <td className="py-2.5">
                      <SeverityBadge severity={f.severity} />
                    </td>
                    <td className="py-2.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">{f.cvss.score.toFixed(1)}</td>
                    <td className="py-2.5">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFinding(f);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Actions Priority Cards (4 cols) */}
        <div className="lg:col-span-4 rounded-xl bg-card border border-line shadow-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Prioritized Remediation
            </h3>
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              AI-Optimized
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Rule-generated top recommendations ordered by risk reduction vs implementation effort.
          </p>

          <div className="space-y-3 pt-1">
            {recommendedActions.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-colors space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{rec.title}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{rec.impact}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">{rec.effort}</span>
                </div>
                <button
                  onClick={() => {
                    const finding = findings.find((f) => f.id === rec.findingId);
                    if (finding) setSelectedFinding(finding);
                  }}
                  className="w-full mt-2 py-1 rounded text-[11px] font-bold bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950 dark:hover:bg-cyan-900 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Review Fix in Details</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
