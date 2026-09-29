// SecureMon / AegisLens Backend Core Types (Aligned with PRD v1.0 & NTRO Requirements)

export type UserRole = 'ANALYST' | 'APPSEC' | 'ADMIN' | 'DEVELOPER' | 'MANAGER' | 'EXECUTIVE';

export type EnvironmentType = 'LOCAL' | 'DOCKER_SANDBOX' | 'STAGING' | 'TEST_VULNERABLE' | 'PRODUCTION';

export type AssessmentStatus = 'DRAFT' | 'READY' | 'RUNNING' | 'REVIEW' | 'REMEDIATION' | 'RETEST' | 'COMPLETE' | 'FAILED' | 'CANCELLED';

export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type FindingConfidence = 'CONFIRMED' | 'LIKELY' | 'POSSIBLE' | 'FALSE_POSITIVE';

export type FindingStatus =
  | 'DETECTED'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'FALSE_POSITIVE'
  | 'VERIFIED'
  | 'IN_REMEDIATION'
  | 'FIX_APPLIED'
  | 'RETEST_PENDING'
  | 'FIXED'
  | 'REOPENED'
  | 'ACCEPTED_RISK';

export type FindingCategory =
  | 'AUTH'
  | 'SESSION'
  | 'AUTHZ'
  | 'INPUT'
  | 'API'
  | 'CLIENT'
  | 'TRANSPORT'
  | 'DATA'
  | 'PRIVACY'
  | 'CONFIG';

export type RetestResult = 'FIXED' | 'STILL_VULNERABLE' | 'PARTIAL' | 'INCONCLUSIVE';

export interface CVSSMetrics {
  version: '3.1';
  av: 'N' | 'A' | 'L' | 'P';
  ac: 'L' | 'H';
  pr: 'N' | 'L' | 'H';
  ui: 'N' | 'R';
  s: 'U' | 'C';
  c: 'N' | 'L' | 'H';
  i: 'N' | 'L' | 'H';
  a: 'N' | 'L' | 'H';
  score: number;
  vector: string;
  rationale?: Record<string, string>;
  source?: 'RULE' | 'ANALYST' | 'AI_SUGGESTED';
}

export interface TechnicalEvidence {
  id: string;
  type: 'HTTP_EXCHANGE' | 'SCREENSHOT' | 'LOG' | 'CODE_SNIPPET' | 'DIFF';
  storageKey: string;
  sha256: string;
  sizeBytes: number;
  mime: string;
  caption: string;
  redactionStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  includeInReport: boolean;
  capturedAt: string;
  requestSnippet?: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
  };
  responseSnippet?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    bodyMasked: string;
  };
  screenshotUrl?: string;
}

export interface RecommendationPlan {
  immediate: string;
  longTerm: string;
  verification: string;
  effort: 'S' | 'M' | 'L';
  codeSnippet?: {
    language: string;
    before?: string;
    after: string;
    explanation: string;
  };
}

export interface AIAnalysis {
  id: string;
  findingId?: string;
  explanationPlain: string;
  developerExplanation: string;
  executiveExplanation: string;
  whyItMatters: string;
  rootCauseHypothesis: string;
  remediationDraft: string;
  factsUsed: string[];
  approved: boolean;
  approvedBy?: string;
  model: string;
  promptVersion: string;
  createdAt: string;
}

export interface Finding {
  id: string;
  assessmentId: string;
  title: string;
  category: FindingCategory;
  cwe: string[];
  owasp: string;
  severity: FindingSeverity;
  cvss: CVSSMetrics;
  confidence: FindingConfidence;
  status: FindingStatus;
  affectedComponent: string;
  endpoint: string;
  description: string;
  whyItMatters: string;
  technicalEvidence: TechnicalEvidence[];
  reproductionSteps: string[];
  businessImpact: {
    statement: string;
    likelihood: 1 | 2 | 3 | 4 | 5;
    impact: 1 | 2 | 3 | 4 | 5;
    ciaDimensions: {
      confidentiality: 'HIGH' | 'LOW' | 'NONE';
      integrity: 'HIGH' | 'LOW' | 'NONE';
      availability: 'HIGH' | 'LOW' | 'NONE';
    };
    assetCriticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  };
  rootCause: string;
  recommendation: RecommendationPlan;
  references: string[];
  firstDetected: string;
  lastDetected: string;
  retestStatus: 'NOT_REQUESTED' | 'PENDING' | 'FIXED' | 'STILL_VULNERABLE' | 'PARTIAL';
  affectedAssets: string[];
  relatedFindings?: Array<{ id: string; type: string }>;
  tags: string[];
  owner?: string;
  dueDate?: string;
  ai?: AIAnalysis;
  validationRecipeId?: string;
}

export interface DiscoveredAsset {
  id: string;
  targetId: string;
  type: 'PAGE' | 'ENDPOINT' | 'FORM' | 'SCRIPT' | 'COOKIE' | 'STORAGE_KEY' | 'WS_CHANNEL';
  urlOrPath: string;
  method?: string;
  authRequired: boolean;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  hasFindingsCount: number;
  firstSeen: string;
  techFingerprint?: string;
}

export interface SecurityCheckPlugin {
  id: string;
  code: string;
  name: string;
  category: FindingCategory;
  version: string;
  intrusiveness: 'PASSIVE' | 'LIGHT' | 'ACTIVE_SAFE';
  environments: EnvironmentType[];
  timeoutSeconds: number;
  defaultCwe: string;
  owasp: string;
  enabled: boolean;
  description: string;
  status?: 'IDLE' | 'QUEUED' | 'RUNNING' | 'PASSED' | 'SIGNAL_FOUND' | 'ERROR';
  signalsEmittedCount?: number;
}

export interface Target {
  id: string;
  name: string;
  baseUrl: string;
  envType: EnvironmentType;
  authorizationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'BLOCKED';
  techFingerprint: {
    server?: string;
    framework?: string;
    frontend?: string;
    database?: string;
    tlsVersion?: string;
  };
  authNonceVerified: boolean;
  adminApproved: boolean;
}

export interface ScopeRule {
  id: string;
  ruleType: 'INCLUDE' | 'EXCLUDE';
  hostPattern: string;
  pathPattern: string;
  allowedMethods: ('GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS')[];
  rateLimitRps: number;
}

export interface PreflightCheckItem {
  id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'PASS' | 'FAIL' | 'BLOCKED';
  detail: string;
}

export interface Assessment {
  id: string;
  name: string;
  description: string;
  profile: 'BASELINE_OWASP' | 'API_FOCUSED' | 'FULL_COMPREHENSIVE' | 'CANARY_DEMO';
  status: AssessmentStatus;
  progressPercent: number;
  currentPhase: string;
  target: Target;
  score: number;
  startedAt?: string;
  completedAt?: string;
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  scopeRules: ScopeRule[];
  preflightPassed: boolean;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  sha256Hash: string;
  prevHash: string;
  details: string;
}

export interface GuardrailEvent {
  id: string;
  timestamp: string;
  checkId: string;
  targetUrl: string;
  ruleViolated: string;
  actionTaken: 'BLOCKED' | 'RATE_LIMITED' | 'REDACTED' | 'ALLOWED';
}
