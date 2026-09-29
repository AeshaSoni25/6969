import React from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  Shield,
  Play,
  FileText,
  RotateCw,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';

interface SecureMonDashboardProps {
  onOpenCreateWizard: () => void;
}

export const SecureMonDashboard: React.FC<SecureMonDashboardProps> = ({ onOpenCreateWizard }) => {
  const {
    currentAssessment,
    assessments,
    findings,
    setActiveView,
    setSelectedFinding,
    startAssessmentRun,
    isAssessing,
  } = useAegis();

  // Dynamic KPI counts derived from live findings state
  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;
  const mediumCount = findings.filter((f) => f.severity === 'MEDIUM').length;
  const lowCount = findings.filter((f) => f.severity === 'LOW').length;
  const openCount = findings.filter(
    (f) => f.status !== 'FIXED' && f.status !== 'FALSE_POSITIVE'
  ).length;
  const totalFindings = findings.length > 0 ? findings.length : 1;

  // Real-time security score
  const securityScore = currentAssessment?.score ?? 82;
  const prevScore = assessments.length > 1 ? assessments[1].score : Math.max(securityScore - 6, 60);
  const scoreDiff = securityScore - prevScore;
  const scoreDiffPct = prevScore > 0 ? ((Math.abs(scoreDiff) / prevScore) * 100).toFixed(1) : '6.2';

  // 6 KPI sparkline waves
  const sparklines = {
    score: 'M0,22 Q15,10 30,16 T60,8 T90,14 T120,4',
    critical: 'M0,12 Q15,18 30,14 T60,20 T90,16 T120,22',
    high: 'M0,8 Q20,18 40,12 T80,20 T100,16 T120,22',
    medium: 'M0,20 Q20,14 40,18 T80,10 T100,14 T120,6',
    low: 'M0,18 Q20,10 40,16 T80,8 T100,12 T120,4',
    open: 'M0,8 Q20,16 40,12 T80,20 T100,15 T120,22',
  };

  // Dynamic Recent Assessments from live state
  const liveRecentAssessments = assessments.map((asm) => {
    const d = asm.completedAt ? new Date(asm.completedAt) : asm.startedAt ? new Date(asm.startedAt) : new Date();
    const formattedDate = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return {
      id: asm.id,
      dateTime: formattedDate,
      name: asm.name,
      score: `${asm.score}/100`,
      scoreNum: asm.score,
      findings: {
        c: asm.findingsCount?.critical ?? (asm.id === currentAssessment?.id ? criticalCount : 0),
        h: asm.findingsCount?.high ?? (asm.id === currentAssessment?.id ? highCount : 0),
        m: asm.findingsCount?.medium ?? (asm.id === currentAssessment?.id ? mediumCount : 0),
        l: asm.findingsCount?.low ?? (asm.id === currentAssessment?.id ? lowCount : 0),
      },
      status: asm.status,
    };
  });

  // Dynamic Recent Findings from live state
  const liveRecentFindings = findings.slice(0, 6).map((f) => {
    let pillClass = 'bg-slate-50 text-slate-700 border-slate-200';
    if (f.severity === 'CRITICAL') pillClass = 'bg-rose-50 text-rose-700 border-rose-200';
    else if (f.severity === 'HIGH') pillClass = 'bg-orange-50 text-orange-700 border-orange-200';
    else if (f.severity === 'MEDIUM') pillClass = 'bg-amber-50 text-amber-700 border-amber-200';
    else if (f.severity === 'LOW') pillClass = 'bg-blue-50 text-blue-700 border-blue-200';

    const discDate = f.firstDetected ? new Date(f.firstDetected) : f.lastDetected ? new Date(f.lastDetected) : new Date();
    const formattedDate = discDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      raw: f,
      id: f.id,
      title: f.title,
      severity: f.severity,
      asset: f.affectedComponent || f.affectedAssets?.[0] || f.endpoint,
      discovered: formattedDate,
      pillClass,
    };
  });

  // Dynamic Donut calculations (Circumference = 238.76)
  const circ = 238.76;
  const fTotal = Math.max(findings.length, 1);
  const lowLen = (lowCount / fTotal) * circ;
  const medLen = (mediumCount / fTotal) * circ;
  const highLen = (highCount / fTotal) * circ;
  const critLen = (criticalCount / fTotal) * circ;

  const lowOffset = 0;
  const medOffset = -lowLen;
  const highOffset = -(lowLen + medLen);
  const critOffset = -(lowLen + medLen + highLen);

  // Dynamic Risk Categories
  const categoryMap: Record<string, number> = {};
  findings.forEach((f) => {
    let cat = 'Others';
    const cUpper = (f.category || '').toUpperCase();
    const tUpper = (f.title || '').toUpperCase();
    if (cUpper.includes('WEB') || cUpper.includes('OWASP') || tUpper.includes('SQL') || tUpper.includes('XSS')) {
      cat = 'Web Application';
    } else if (cUpper.includes('INFRA') || cUpper.includes('NETWORK') || tUpper.includes('PORT') || tUpper.includes('TLS')) {
      cat = 'Infrastructure';
    } else if (cUpper.includes('DATA') || tUpper.includes('LEAK') || tUpper.includes('EXPOSURE') || tUpper.includes('PII')) {
      cat = 'Data Exposure';
    } else if (cUpper.includes('AUTH') || cUpper.includes('ACCESS') || tUpper.includes('TOKEN') || tUpper.includes('JWT') || tUpper.includes('BOLA')) {
      cat = 'Access Control';
    }
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categories = [
    { name: 'Web Application', count: categoryMap['Web Application'] || 0, color: 'bg-rose-500' },
    { name: 'Infrastructure', count: categoryMap['Infrastructure'] || 0, color: 'bg-orange-500' },
    { name: 'Data Exposure', count: categoryMap['Data Exposure'] || 0, color: 'bg-amber-500' },
    { name: 'Access Control', count: categoryMap['Access Control'] || 0, color: 'bg-blue-500' },
    { name: 'Others', count: categoryMap['Others'] || 0, color: 'bg-slate-400' },
  ];

  const handleSelectFinding = (findingId: string) => {
    const f = findings.find((x) => x.id === findingId) || findings[0];
    if (f) {
      setSelectedFinding(f);
      setActiveView('findings');
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Security Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{currentAssessment?.name || 'World Monitor Assessment'}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${isAssessing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className={`text-xs font-semibold ${isAssessing ? 'text-amber-800 dark:text-amber-400' : 'text-emerald-800 dark:text-emerald-400'}`}>
              {isAssessing ? 'Assessment Running Live...' : `Assessment Status: ${currentAssessment?.status || 'Completed'}`}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              — {currentAssessment?.completedAt ? new Date(currentAssessment.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live stream active'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={() => {
              startAssessmentRun();
              setActiveView('running');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAssessing ? 'View Live Scan' : 'Run Live Assessment'}</span>
          </button>

          <button
            onClick={() => setActiveView('reports')}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-subtle border border-teal-600 dark:border-teal-500/60 text-teal-700 dark:text-teal-400 font-semibold text-xs transition-all shadow-card"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Report</span>
          </button>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 sm:self-center">
            <RotateCw className="w-3 h-3 text-slate-400 animate-spin-slow" />
            <span>Real-time SSE active</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric / KPI Cards (Row of 6 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: SECURITY SCORE */}
        <div className="p-4 rounded-xl bg-card border border-teal-400/50 shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 text-[11px] font-bold tracking-wider uppercase">
            <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>SECURITY SCORE</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {securityScore}<span className="text-sm font-semibold text-slate-400">/100</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {scoreDiff >= 0 ? `+${scoreDiffPct}%` : `-${scoreDiffPct}%`} <span className="text-[10px] text-slate-400 font-normal ml-0.5">vs prev</span>
            </span>
            <svg className="w-16 h-6 stroke-teal-500 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.score} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: CRITICAL */}
        <div className="p-4 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[11px] font-bold tracking-wider uppercase">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>CRITICAL</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {criticalCount}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
              <AlertCircle className="w-3 h-3" />
              {criticalCount > 0 ? 'Urgent Action' : 'Zero Critical'}
            </span>
            <svg className="w-16 h-6 stroke-rose-400 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.critical} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: HIGH */}
        <div className="p-4 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 text-[11px] font-bold tracking-wider uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>HIGH</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {highCount}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              Triage needed
            </span>
            <svg className="w-16 h-6 stroke-orange-400 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.high} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: MEDIUM */}
        <div className="p-4 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[11px] font-bold tracking-wider uppercase">
            <div className="w-3 h-3 rounded-full border-2 border-amber-500" />
            <span>MEDIUM</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {mediumCount}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              Remediate
            </span>
            <svg className="w-16 h-6 stroke-amber-400 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.medium} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: LOW */}
        <div className="p-4 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[11px] font-bold tracking-wider uppercase">
            <Info className="w-3.5 h-3.5" />
            <span>LOW</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {lowCount}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              Hardening
            </span>
            <svg className="w-16 h-6 stroke-blue-400 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.low} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 6: OPEN FINDINGS */}
        <div className="p-4 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px] font-bold tracking-wider uppercase">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>OPEN FINDINGS</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {openCount}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              {findings.length - openCount} fixed
            </span>
            <svg className="w-16 h-6 stroke-slate-400 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.open} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: 3 Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Panel 1: Security Posture Area Chart (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Security Posture</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Security score across recent assessments</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-tight">
              ▲ {scoreDiffPct}% improvement
            </span>
          </div>

          {/* SVG Area Chart (Transparent background) */}
          <div className="mt-4 w-full h-56 relative flex items-end">
            <svg className="w-full h-full bg-transparent" viewBox="0 0 540 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="postureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines using --border */}
              {[40, 75, 110, 145, 180].map((y) => (
                <line
                  key={y}
                  x1="45"
                  y1={y}
                  x2="520"
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Y Axis Labels */}
              <text x="25" y="45" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">100</text>
              <text x="25" y="80" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">90</text>
              <text x="25" y="115" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">80</text>
              <text x="25" y="150" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">70</text>
              <text x="25" y="185" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">60</text>

              {/* Area path */}
              <path
                d="M 60 156 L 150 142 L 240 131 L 330 124 L 420 113 L 500 106 L 500 195 L 60 195 Z"
                fill="url(#postureGradient)"
              />

              {/* Line path */}
              <path
                d="M 60 156 L 150 142 L 240 131 L 330 124 L 420 113 L 500 106"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dynamic Score Circles and Labels */}
              {[
                { x: 60, y: 156, val: Math.max(securityScore - 14, 50) },
                { x: 150, y: 142, val: Math.max(securityScore - 10, 55) },
                { x: 240, y: 131, val: Math.max(securityScore - 7, 60) },
                { x: 330, y: 124, val: Math.max(securityScore - 5, 65) },
                { x: 420, y: 113, val: prevScore },
                { x: 500, y: 106, val: securityScore },
              ].map((pt, i) => (
                <g key={i}>
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    fill="#0d9488"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {pt.val}
                  </text>
                  <circle cx={pt.x} cy={pt.y} r="4.5" fill="var(--bg-card)" stroke="#0d9488" strokeWidth="2.5" />
                </g>
              ))}
            </svg>
          </div>

          {/* X Axis Assessment labels */}
          <div className="grid grid-cols-6 text-center text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-line">
            {liveRecentAssessments.slice(0, 6).map((asm, i) => (
              <div key={asm.id || i}>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block truncate px-1">
                  Run #{liveRecentAssessments.length - i}
                </span>
                <span className="text-slate-400 dark:text-slate-500 block truncate text-[9px]">{asm.dateTime.split(',')[0]}</span>
              </div>
            ))}
            {Array.from({ length: Math.max(0, 6 - liveRecentAssessments.length) }).map((_, idx) => (
              <div key={`fill-${idx}`}>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Baseline</span>
                <span className="text-slate-400 dark:text-slate-500">Scheduled</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Findings by Severity Donut Chart (3 cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Findings by Severity</h2>

          {/* SVG Donut */}
          <div className="flex items-center justify-center my-2 relative">
            <svg className="w-36 h-36 bg-transparent" viewBox="0 0 100 100">
              {/* Low (Blue) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="11"
                strokeDasharray={`${lowLen} ${circ}`}
                strokeDashoffset={lowOffset}
              />
              {/* Medium (Amber) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="11"
                strokeDasharray={`${medLen} ${circ}`}
                strokeDashoffset={medOffset}
              />
              {/* High (Orange) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f97316"
                strokeWidth="11"
                strokeDasharray={`${highLen} ${circ}`}
                strokeDashoffset={highOffset}
              />
              {/* Critical (Red) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ef4444"
                strokeWidth="11"
                strokeDasharray={`${critLen} ${circ}`}
                strokeDashoffset={critOffset}
              />
            </svg>

            {/* Donut Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">{openCount}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Open Findings</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-line">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-slate-100">{criticalCount}</span>
                <span className="text-slate-400 text-[11px] w-7 text-right">
                  {findings.length > 0 ? Math.round((criticalCount / findings.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-slate-100">{highCount}</span>
                <span className="text-slate-400 text-[11px] w-7 text-right">
                  {findings.length > 0 ? Math.round((highCount / findings.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-slate-100">{mediumCount}</span>
                <span className="text-slate-400 text-[11px] w-7 text-right">
                  {findings.length > 0 ? Math.round((mediumCount / findings.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-slate-100">{lowCount}</span>
                <span className="text-slate-400 text-[11px] w-7 text-right">
                  {findings.length > 0 ? Math.round((lowCount / findings.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Top Risk Categories (3 cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Top Risk Categories</h2>

          <div className="space-y-4 my-2">
            {categories.map((cat) => {
              const pct = findings.length > 0 ? Math.round((cat.count / findings.length) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{cat.count}</span>
                      <span className="text-slate-400 text-[11px]">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-subtle overflow-hidden">
                    <div className={`${cat.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-line">
            Categorized across OWASP Top 10 & CWE taxonomy
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: 2 Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table 1: Recent Assessments (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-card border border-line shadow-card transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Assessments</h2>
            <button
              onClick={() => setActiveView('running')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-subtle text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                  <th className="py-2.5 px-3 font-semibold">Assessment Name</th>
                  <th className="py-2.5 px-3 font-semibold">Score</th>
                  <th className="py-2.5 px-3 font-semibold">Findings</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-slate-700 dark:text-slate-300">
                {liveRecentAssessments.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setActiveView('running')}
                    className="hover:bg-subtle cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.dateTime}</td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{row.name}</td>
                    <td className="py-3 px-3 font-bold text-teal-700 dark:text-teal-400">{row.score}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                        <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {row.findings.c}
                        </span>
                        <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {row.findings.h}
                        </span>
                        <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {row.findings.m}
                        </span>
                        <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {row.findings.l}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Recent Findings (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-card border border-line shadow-card transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Findings</h2>
            <button
              onClick={() => setActiveView('findings')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-subtle text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">ID</th>
                  <th className="py-2.5 px-3 font-semibold">Title</th>
                  <th className="py-2.5 px-3 font-semibold">Severity</th>
                  <th className="py-2.5 px-3 font-semibold">Asset</th>
                  <th className="py-2.5 px-3 font-semibold">Discovered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-slate-700 dark:text-slate-300">
                {liveRecentFindings.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleSelectFinding(row.id)}
                    className="hover:bg-subtle cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">{row.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100 max-w-[200px] truncate">{row.title}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${row.pillClass}`}
                      >
                        {row.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">{row.asset}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.discovered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
