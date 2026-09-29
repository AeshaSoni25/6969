import { CVSSMetrics, FindingSeverity } from '../types';

export function calculateCVSS31(metrics: Omit<CVSSMetrics, 'version' | 'score' | 'vector'>): {
  score: number;
  severity: FindingSeverity;
  vector: string;
  exploitabilitySubscore: number;
  impactSubscore: number;
} {
  const { av, ac, pr, ui, s, c, i, a } = metrics;

  // Weight tables according to CVSS 3.1 Specification
  const AV_WEIGHTS = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
  const AC_WEIGHTS = { L: 0.77, H: 0.44 };
  const UI_WEIGHTS = { N: 0.85, R: 0.62 };
  const CIA_WEIGHTS = { N: 0.0, L: 0.22, H: 0.56 };

  // PR weights depend on Scope
  const PR_WEIGHTS_U = { N: 0.85, L: 0.62, H: 0.27 };
  const PR_WEIGHTS_C = { N: 0.85, L: 0.68, H: 0.50 };

  const avW = AV_WEIGHTS[av];
  const acW = AC_WEIGHTS[ac];
  const uiW = UI_WEIGHTS[ui];
  const prW = s === 'U' ? PR_WEIGHTS_U[pr] : PR_WEIGHTS_C[pr];

  const cW = CIA_WEIGHTS[c];
  const iW = CIA_WEIGHTS[i];
  const aW = CIA_WEIGHTS[a];

  // ISS = 1 - [ (1 - ImpactConf) * (1 - ImpactInteg) * (1 - ImpactAvail) ]
  const iss = 1 - (1 - cW) * (1 - iW) * (1 - aW);

  // Impact calculation
  let impactSubscore = 0;
  if (s === 'U') {
    impactSubscore = 6.42 * iss;
  } else {
    impactSubscore = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
  }

  // Exploitability calculation
  const exploitabilitySubscore = 8.22 * avW * acW * prW * uiW;

  let score = 0;
  if (impactSubscore <= 0) {
    score = 0.0;
  } else if (s === 'U') {
    score = Math.ceil(Math.min(impactSubscore + exploitabilitySubscore, 10.0) * 10) / 10;
  } else {
    score = Math.ceil(Math.min(1.08 * (impactSubscore + exploitabilitySubscore), 10.0) * 10) / 10;
  }

  // Exact vector string
  const vector = `CVSS:3.1/AV:${av}/AC:${ac}/PR:${pr}/UI:${ui}/S:${s}/C:${c}/I:${i}/A:${a}`;

  let severity: FindingSeverity = 'INFO';
  if (score >= 9.0) severity = 'CRITICAL';
  else if (score >= 7.0) severity = 'HIGH';
  else if (score >= 4.0) severity = 'MEDIUM';
  else if (score >= 0.1) severity = 'LOW';
  else severity = 'INFO';

  return {
    score: Number(score.toFixed(1)),
    severity,
    vector,
    exploitabilitySubscore: Number(exploitabilitySubscore.toFixed(2)),
    impactSubscore: Number(impactSubscore.toFixed(2)),
  };
}

export function generateMetricRationale(
  metric: string,
  val: string,
  context?: { endpoint?: string; evidenceId?: string; isAuth?: boolean }
): string {
  switch (metric) {
    case 'av':
      return val === 'N'
        ? `Remotely exploitable over network/HTTP without physical or local access requirements.`
        : `Requires adjacent or local access to target segment.`;
    case 'ac':
      return val === 'L'
        ? `Standard request structure; no specialized preconditions or race conditions required.`
        : `Requires complex preconditions or specific environmental timing.`;
    case 'pr':
      return val === 'N'
        ? `No privileges required. Succeeded unauthenticated without credentials.`
        : val === 'L'
        ? `Requires low-privilege authenticated user account session.`
        : `Requires elevated administrator privileges.`;
    case 'ui':
      return val === 'N'
        ? `Server-side vulnerability; no user interaction or victim action required.`
        : `Requires victim to click link or navigate to cross-origin page.`;
    case 's':
      return val === 'U'
        ? `Impact is constrained to the vulnerable component security authority.`
        : `Scope changed; flaws compromise assets outside the initial security boundary.`;
    case 'c':
      return val === 'H'
        ? `Full confidential data exposure (PII, authentication tokens, or internal alerts).`
        : val === 'L'
        ? `Partial disclosure of non-sensitive metadata or configuration hints.`
        : `No confidentiality impact observed.`;
    case 'i':
      return val === 'H'
        ? `Complete integrity loss; state or configuration can be arbitrarily modified.`
        : val === 'L'
        ? `Partial modification of limited fields.`
        : `No unauthorized modification of data or state.`;
    case 'a':
      return val === 'H'
        ? `Complete denial of service or critical resource exhaustion.`
        : val === 'L'
        ? `Partial degradation or intermittent throttling.`
        : `No direct availability disruption.`;
    default:
      return `Metric derived from automated validation assertion.`;
  }
}
