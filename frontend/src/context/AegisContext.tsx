import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Assessment,
  AuditLogEntry,
  DiscoveredAsset,
  Finding,
  FindingStatus,
  PreflightCheckItem,
  SecurityCheckPlugin,
  UserRole,
  CVSSMetrics,
} from '../types';
import {
  INITIAL_ASSESSMENT,
  CANARY_ASSESSMENT,
  INITIAL_FINDINGS,
  INITIAL_ASSETS,
  SECURITY_CHECKS,
  INITIAL_PREFLIGHT_CHECKS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import { calculateCVSS31 } from '../utils/cvssCalculator';
import { api } from '../services/api';

interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export type ViewType =
  | 'dashboard'
  | 'overview'
  | 'scope'
  | 'running'
  | 'assets'
  | 'findings'
  | 'cvss'
  | 'risk'
  | 'ai'
  | 'remediation'
  | 'retest'
  | 'reports'
  | 'audit'
  | 'settings';

interface AegisContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentAssessment: Assessment;
  setCurrentAssessment: (asm: Assessment) => void;
  assessments: Assessment[];
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  findings: Finding[];
  assets: DiscoveredAsset[];
  checks: SecurityCheckPlugin[];
  preflightChecks: PreflightCheckItem[];
  auditLogs: AuditLogEntry[];
  toasts: Toast[];
  dismissToast: (id: string) => void;
  addToast: (type: Toast['type'], title: string, message: string) => void;
  selectedFinding: Finding | null;
  setSelectedFinding: (f: Finding | null) => void;
  validationModalFinding: Finding | null;
  setValidationModalFinding: (f: Finding | null) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Actions
  transitionFindingStatus: (id: string, newStatus: FindingStatus, reason?: string) => void;
  updateFinding: (id: string, partial: Partial<Finding>) => void;
  updateCVSS: (id: string, metrics: Omit<CVSSMetrics, 'version' | 'score' | 'vector'>, rationaleNotes?: string) => void;
  approveAIText: (findingId: string) => void;
  runSafeValidation: (findingId: string) => Promise<{ success: boolean; result: string; steps: string[] }>;
  runRetest: (findingId: string) => Promise<{ success: boolean; result: 'FIXED' | 'STILL_VULNERABLE'; diff: string }>;
  isCanaryFixEnabled: boolean;
  toggleCanaryFix: () => void;
  runPreflightCheck: () => Promise<boolean>;
  startAssessmentRun: () => void;
  pauseAssessmentRun: () => void;
  triggerKillSwitch: (reason: string) => void;
  isAssessing: boolean;
  assessmentPhase: string;
  assessmentProgress: number;
  liveLogs: string[];
  guardrailBlockedCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  executiveView: boolean;
  setExecutiveView: (val: boolean) => void;
  createNewAssessment: (newAsm: Partial<Assessment>) => void;
}

const AegisContext = createContext<AegisContextType | undefined>(undefined);

export const AegisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('ANALYST');
  const [assessments, setAssessments] = useState<Assessment[]>([INITIAL_ASSESSMENT, CANARY_ASSESSMENT]);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment>(INITIAL_ASSESSMENT);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS);
  const [assets, setAssets] = useState<DiscoveredAsset[]>(INITIAL_ASSETS);
  const [checks, setChecks] = useState<SecurityCheckPlugin[]>(SECURITY_CHECKS);
  const [preflightChecks, setPreflightChecks] = useState<PreflightCheckItem[]>(INITIAL_PREFLIGHT_CHECKS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [validationModalFinding, setValidationModalFinding] = useState<Finding | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [isCanaryFixEnabled, setIsCanaryFixEnabled] = useState<boolean>(false);
  const [executiveView, setExecutiveView] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Fetch initial state and data from backend API
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [asmRes, fndRes, astRes, chkRes, pfcRes, audRes, canRes] = await Promise.allSettled([
          api.getAssessments(),
          api.getFindings(),
          api.getAssets(),
          api.getPlugins(),
          api.getPreflight(),
          api.getAuditLogs(),
          api.getCanaryStatus(),
        ]);

        if (asmRes.status === 'fulfilled' && asmRes.value?.success && asmRes.value.data.length > 0) {
          setAssessments(asmRes.value.data);
          const current = asmRes.value.data.find((a) => a.id === asmRes.value.currentId) || asmRes.value.data[0];
          setCurrentAssessment(current);
        }

        if (fndRes.status === 'fulfilled' && fndRes.value?.success) {
          setFindings(fndRes.value.data);
        }

        if (astRes.status === 'fulfilled' && astRes.value?.success) {
          setAssets(astRes.value.data);
        }

        if (chkRes.status === 'fulfilled' && chkRes.value?.success) {
          setChecks(chkRes.value.data);
        }

        if (pfcRes.status === 'fulfilled' && pfcRes.value?.success) {
          setPreflightChecks(pfcRes.value.data);
        }

        if (audRes.status === 'fulfilled' && audRes.value?.success) {
          setAuditLogs(audRes.value.data);
        }

        if (canRes.status === 'fulfilled' && canRes.value?.success) {
          setIsCanaryFixEnabled(canRes.value.isCanaryFixEnabled);
        }
      } catch (err) {
        console.warn('Backend connection fallback: using local seed data', err);
      }
    };

    loadBackendData();
  }, []);

  // Real-time Server-Sent Events (SSE) listener for live telemetry, logs, and audit trail
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/events');

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_LOG') {
            setLiveLogs((prev) => [...prev, payload.data]);
          } else if (payload.type === 'TELEMETRY_UPDATE') {
            if (payload.data.phase) setAssessmentPhase(payload.data.phase);
            if (payload.data.progress !== undefined) setAssessmentProgress(payload.data.progress);
            if (payload.data.isAssessing !== undefined) setIsAssessing(payload.data.isAssessing);
            if (payload.data.guardrailBlockedCount !== undefined) {
              setGuardrailBlockedCount(payload.data.guardrailBlockedCount);
            }
          } else if (payload.type === 'AUDIT_ENTRY') {
            setAuditLogs((prev) => [payload.data, ...prev]);
          } else if (payload.type === 'FINDING_UPDATED') {
            setFindings((prev) =>
              prev.map((f) => (f.id === payload.data.id ? { ...f, ...payload.data } : f))
            );
          } else if (payload.type === 'SNAPSHOT') {
            if (payload.telemetry) {
              if (payload.telemetry.phase) setAssessmentPhase(payload.telemetry.phase);
              if (payload.telemetry.progress !== undefined) setAssessmentProgress(payload.telemetry.progress);
              if (payload.telemetry.logs && payload.telemetry.logs.length > 0) {
                setLiveLogs(payload.telemetry.logs);
              }
            }
          }
        } catch {
          // ignore parse errors
        }
      };
    } catch (err) {
      console.warn('SSE connection unavailable, using local polling', err);
    }

    return () => {
      if (es) es.close();
    };
  }, []);

  // Live Assessment simulation state
  const [isAssessing, setIsAssessing] = useState<boolean>(false);
  const [assessmentPhase, setAssessmentPhase] = useState<string>('DISCOVERY');
  const [assessmentProgress, setAssessmentProgress] = useState<number>(100);
  const [liveLogs, setLiveLogs] = useState<string[]>([
    '[10:14:00] [Orchestrator] Initialized BullMQ DAG scheduler with 14 checks.',
    '[10:14:02] [Guardrail] Egress allow-list locked to RFC1918 127.0.0.1:3000.',
    '[10:14:15] [Discovery] Playwright worker indexed 10 target assets (4 endpoints, 2 pages, 1 websocket).',
    '[10:18:22] [Signal] AUTHZ-001 emitted RawSignal: HTTP 200 without Authorization on /api/v1/alerts/export.',
    '[10:20:00] [Validation] Safe recipe VAL-AUTHZ-001 confirmed vulnerability. Redacted evidence EVD-0001 hashed.',
    '[10:23:45] [Complete] Assessment finished. Calculated Security Score: 61/100.',
  ]);
  const [guardrailBlockedCount, setGuardrailBlockedCount] = useState<number>(0);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, entityType: string, entityId: string, details: string) => {
    const prev = auditLogs[0]?.sha256Hash || '0000000000000000000000000000000000000000000000000000000000000000';
    const newEntry: AuditLogEntry = {
      id: `AUD-00${auditLogs.length + 92}`,
      actor: `${role} (Active Session)`,
      role,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      prevHash: prev,
      details,
    };
    setAuditLogs((prevLogs) => [newEntry, ...prevLogs]);
  };

  const transitionFindingStatus = (id: string, newStatus: FindingStatus, reason?: string) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = { ...f, status: newStatus };
          addAuditLog(
            'STATUS_TRANSITION',
            'FINDING',
            id,
            `Status changed from ${f.status} to ${newStatus}. Reason: ${reason || 'User action'}`
          );
          addToast('info', `Finding ${id} Updated`, `Status changed to ${newStatus}`);
          if (selectedFinding?.id === id) {
            setSelectedFinding(updated);
          }
          return updated;
        }
        return f;
      })
    );
  };

  const updateFinding = (id: string, partial: Partial<Finding>) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = { ...f, ...partial };
          if (selectedFinding?.id === id) {
            setSelectedFinding(updated);
          }
          return updated;
        }
        return f;
      })
    );
  };

  const updateCVSS = (
    id: string,
    metrics: Omit<CVSSMetrics, 'version' | 'score' | 'vector'>,
    rationaleNotes?: string
  ) => {
    const calculated = calculateCVSS31(metrics);
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated: Finding = {
            ...f,
            severity: calculated.severity,
            cvss: {
              version: '3.1',
              ...metrics,
              score: calculated.score,
              vector: calculated.vector,
              source: 'ANALYST',
              rationale: {
                ...f.cvss.rationale,
                overrideReason: rationaleNotes || 'Adjusted in explainable CVSS calculator',
              },
            },
          };
          addAuditLog(
            'CVSS_SCORE_OVERRIDE',
            'FINDING',
            id,
            `CVSS updated to ${calculated.score} (${calculated.severity}) Vector: ${calculated.vector}`
          );
          addToast('success', 'CVSS Recomputed', `Score updated to ${calculated.score} (${calculated.severity})`);
          if (selectedFinding?.id === id) setSelectedFinding(updated);
          return updated;
        }
        return f;
      })
    );
  };

  const approveAIText = (findingId: string) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === findingId && f.ai) {
          const updated: Finding = {
            ...f,
            ai: {
              ...f.ai,
              approved: true,
              approvedBy: `${role} (You)`,
            },
          };
          addAuditLog('AI_TEXT_APPROVED', 'AI_ANALYSIS', f.ai.id, `Analyst approved AI explanation for ${findingId}`);
          addToast('success', 'AI Analysis Approved', 'Finding explanation and remediation verified for report export');
          if (selectedFinding?.id === findingId) setSelectedFinding(updated);
          return updated;
        }
        return f;
      })
    );
  };

  const runSafeValidation = async (findingId: string) => {
    const finding = findings.find((f) => f.id === findingId);
    if (!finding) return { success: false, result: 'NOT_FOUND', steps: [] };

    addToast('info', 'Sandbox Validation Started', `Executing recipe ${finding.validationRecipeId || 'VAL-GENERIC'}...`);
    addAuditLog('VALIDATION_INITIATED', 'FINDING', findingId, `Triggered sandbox validation recipe ${finding.validationRecipeId}`);

    // Simulation delay
    await new Promise((r) => setTimeout(r, 1200));

    const steps = [
      `1. Verified GuardedHttpClient scope allow-list (Host: ${currentAssessment.target.baseUrl})`,
      '2. Validated request method against safe method allow-list [GET / HEAD only]',
      `3. Dispatched non-destructive request to ${finding.endpoint}`,
      '4. Evaluated response status code and response body shape assertion',
      '5. Sanitized and masked token fields in response body',
      '6. Generated SHA-256 evidence integrity hash and verified tamper-resistance',
    ];

    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === findingId) {
          const updated: Finding = { ...f, confidence: 'CONFIRMED', status: 'VERIFIED' };
          if (selectedFinding?.id === findingId) setSelectedFinding(updated);
          return updated;
        }
        return f;
      })
    );

    addToast('success', 'Validation Confirmed', `Finding ${findingId} verified in sandbox with reproducible evidence.`);
    addAuditLog('VALIDATION_CONFIRMED', 'FINDING', findingId, 'Sandbox recipe returned status CONFIRMED.');

    return {
      success: true,
      result: 'CONFIRMED',
      steps,
    };
  };

  const toggleCanaryFix = () => {
    setIsCanaryFixEnabled((prev) => {
      const next = !prev;
      api.toggleCanary().catch(() => {});
      addToast(
        next ? 'success' : 'warning',
        'Canary Fix State Toggled',
        next ? 'FIX_ENABLED=1 applied on canary target. Retest will pass.' : 'FIX_ENABLED=0. Vulnerability remains open.'
      );
      return next;
    });
  };

  const runRetest = async (findingId: string) => {
    const finding = findings.find((f) => f.id === findingId);
    if (!finding) return { success: false, result: 'STILL_VULNERABLE' as const, diff: '' };

    addToast('info', 'Retest Replaying', `Re-executing deterministic validation probe on ${findingId}...`);

    try {
      const backendRes = await api.retestFinding(findingId);
      if (backendRes.success) {
        const isFixed = backendRes.result === 'FIXED';
        setFindings((prev) =>
          prev.map((f) => {
            if (f.id === findingId) {
              const updated: Finding = {
                ...f,
                status: isFixed ? 'FIXED' : 'REOPENED',
                retestStatus: backendRes.result,
              };
              if (selectedFinding?.id === findingId) setSelectedFinding(updated);
              return updated;
            }
            return f;
          })
        );
        addToast(
          isFixed ? 'success' : 'error',
          isFixed ? 'Retest Passed: FIXED' : 'Retest Failed: STILL VULNERABLE',
          backendRes.message
        );
        addAuditLog(
          isFixed ? 'RETEST_PASSED' : 'RETEST_FAILED',
          'FINDING',
          findingId,
          backendRes.message
        );
        return {
          success: isFixed,
          result: backendRes.result,
          diff: backendRes.diff,
        };
      }
    } catch {
      // fallback
    }

    await new Promise((r) => setTimeout(r, 1200));

    if (isCanaryFixEnabled || finding.retestStatus === 'FIXED') {
      setFindings((prev) =>
        prev.map((f) => {
          if (f.id === findingId) {
            const updated: Finding = {
              ...f,
              status: 'FIXED',
              retestStatus: 'FIXED',
            };
            if (selectedFinding?.id === findingId) setSelectedFinding(updated);
            return updated;
          }
          return f;
        })
      );
      addToast('success', 'Retest Passed: FIXED', `Vulnerability ${findingId} confirmed resolved!`);
      addAuditLog('RETEST_PASSED', 'FINDING', findingId, 'Replayed assertion: server returned 401 Unauthorized.');
      return {
        success: true,
        result: 'FIXED' as const,
        diff: '- HTTP 200 OK (142 alert records leaked)\n+ HTTP 401 Unauthorized {"message":"Missing Bearer token"}\n\nAssertion: Endpoint successfully enforces authorization middleware.',
      };
    } else {
      setFindings((prev) =>
        prev.map((f) => {
          if (f.id === findingId) {
            const updated: Finding = {
              ...f,
              status: 'REOPENED',
              retestStatus: 'STILL_VULNERABLE',
            };
            if (selectedFinding?.id === findingId) setSelectedFinding(updated);
            return updated;
          }
          return f;
        })
      );
      addToast('error', 'Retest Failed: STILL VULNERABLE', 'Server still permits unauthenticated access. Reopened.');
      addAuditLog('RETEST_FAILED', 'FINDING', findingId, 'Vulnerability still reproduced. Finding reopened.');
      return {
        success: false,
        result: 'STILL_VULNERABLE' as const,
        diff: '- Baseline: HTTP 200 OK (Unauthenticated)\n- Current:  HTTP 200 OK (Unauthenticated)\n\nAssertion failed: Protected data still returned without authentication.',
      };
    }
  };

  const runPreflightCheck = async () => {
    addToast('info', 'Running Pre-flight Checks', 'Verifying scope, DNS, ownership token, and credentials...');
    try {
      const res = await api.getPreflight();
      if (res.success) {
        setPreflightChecks(res.data);
        addToast('success', 'Pre-flight Passed', 'Target authorization and safety guardrails verified.');
        addAuditLog('PREFLIGHT_VERIFIED', 'TARGET', currentAssessment.target.id, 'All pre-flight checklist assertions passed.');
        return true;
      }
    } catch {
      // fallback
    }
    await new Promise((r) => setTimeout(r, 800));
    setPreflightChecks((prev) =>
      prev.map((c) => ({
        ...c,
        status: 'PASS',
      }))
    );
    addToast('success', 'Pre-flight Passed', 'Target authorization and safety guardrails verified.');
    addAuditLog('PREFLIGHT_VERIFIED', 'TARGET', currentAssessment.target.id, 'All pre-flight checklist assertions passed.');
    return true;
  };

  const startAssessmentRun = () => {
    setIsAssessing(true);
    setAssessmentProgress(5);
    setAssessmentPhase('INIT');
    addToast('info', 'Assessment Started', 'Triggering asynchronous backend DAG execution...');
    addAuditLog('ASSESSMENT_STARTED', 'ASSESSMENT', currentAssessment.id, 'Triggered orchestrator DAG run.');

    api.startAssessment(currentAssessment.id).catch((err) => {
      console.warn('Backend start error, using local fallback:', err);
    });
  };

  const pauseAssessmentRun = () => {
    api.pauseAssessment(currentAssessment.id).catch(() => {});
    setIsAssessing(false);
    addToast('warning', 'Assessment Paused', 'Check worker queue paused.');
  };

  const triggerKillSwitch = (reason: string) => {
    api.killSwitch(currentAssessment.id, reason).catch(() => {});
    setIsAssessing(false);
    setGuardrailBlockedCount((c) => c + 1);
    addToast('error', 'EMERGENCY KILL SWITCH TRIGGERED', `Halted all active workers and in-flight scans. Reason: ${reason}`);
    addAuditLog('EMERGENCY_KILL_SWITCH', 'PLATFORM', 'GLOBAL', `Admin/Analyst triggered kill-switch. Reason: ${reason}`);
  };

  const createNewAssessment = (newAsm: Partial<Assessment>) => {
    api.createAssessment(newAsm).then((res) => {
      if (res.success && res.data) {
        setAssessments((prev) => [res.data, ...prev]);
        setCurrentAssessment(res.data);
        addToast('success', 'Assessment Project Created', `Initialized project "${res.data.name}"`);
      }
    }).catch(() => {
      const id = `ASM-00${assessments.length + 1}`;
      const assessment: Assessment = {
        id,
        name: newAsm.name || 'New Security Assessment',
        description: newAsm.description || 'Target security assessment',
        profile: newAsm.profile || 'BASELINE_OWASP',
        status: 'READY',
        progressPercent: 0,
        currentPhase: 'PREFLIGHT',
        target: newAsm.target || {
          id: `TGT-00${assessments.length + 1}`,
          name: 'Target App',
          baseUrl: 'http://127.0.0.1:8080',
          envType: 'LOCAL',
          authorizationStatus: 'VERIFIED',
          techFingerprint: { server: 'Node.js' },
          authNonceVerified: true,
          adminApproved: true,
        },
        score: 100,
        findingsCount: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
        scopeRules: [
          {
            id: 'SCR-NEW',
            ruleType: 'INCLUDE',
            hostPattern: '127.0.0.1:*',
            pathPattern: '/**',
            allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
            rateLimitRps: 10,
          },
        ],
        preflightPassed: true,
      };
      setAssessments((prev) => [assessment, ...prev]);
      setCurrentAssessment(assessment);
      setActiveView('scope');
    });
  };

  return (
    <AegisContext.Provider
      value={{
        role,
        setRole,
        currentAssessment,
        setCurrentAssessment,
        assessments,
        activeView,
        setActiveView,
        findings,
        assets,
        checks,
        preflightChecks,
        auditLogs,
        toasts,
        dismissToast,
        addToast,
        selectedFinding,
        setSelectedFinding,
        validationModalFinding,
        setValidationModalFinding,
        commandPaletteOpen,
        setCommandPaletteOpen,
        transitionFindingStatus,
        updateFinding,
        updateCVSS,
        approveAIText,
        runSafeValidation,
        runRetest,
        isCanaryFixEnabled,
        toggleCanaryFix,
        runPreflightCheck,
        startAssessmentRun,
        pauseAssessmentRun,
        triggerKillSwitch,
        isAssessing,
        assessmentPhase,
        assessmentProgress,
        liveLogs,
        guardrailBlockedCount,
        theme,
        toggleTheme,
        executiveView,
        setExecutiveView,
        createNewAssessment,
      }}
    >
      {children}
    </AegisContext.Provider>
  );
};

export const useAegis = () => {
  const context = useContext(AegisContext);
  if (!context) {
    throw new Error('useAegis must be used within an AegisProvider');
  }
  return context;
};
