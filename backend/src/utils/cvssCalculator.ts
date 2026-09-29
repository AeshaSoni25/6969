// CVSS v3.1 Specification Engine
import { CVSSMetrics, FindingSeverity } from '../types/index.js';

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
  val: string
): string {
  switch (metric) {
    case 'av':
      return val === 'N'
        ? 'Remotely exploitable over network/HTTP without physical access.'
        : 'Requires local or adjacent network access to target segment.';
    case 'ac':
      return val === 'L'
        ? 'Low attack complexity; repeatable standard HTTP payload.'
        : 'High complexity; requires specialized timing or race condition.';
    case 'pr':
      return val === 'N'
        ? 'No privileges required; unauthenticated attacker can exploit.'
        : val === 'L'
        ? 'Requires standard low-privilege user session.'
        : 'Requires administrator or elevated system rights.';
    case 'ui':
      return val === 'N'
        ? 'No user interaction required; directly triggers server-side.'
        : 'Requires victim user interaction (e.g. click link or open attachment).';
    case 's':
      return val === 'U'
        ? 'Unchanged scope; impact is constrained to target authority.'
        : 'Changed scope; allows breach into neighboring services or systems.';
    case 'c':
      return val === 'H'
        ? 'High confidentiality loss; unauthorized access to sensitive secrets/PII.'
        : val === 'L'
        ? 'Low confidentiality loss; limited metadata disclosure.'
        : 'No unauthorized disclosure of confidential data.';
    case 'i':
      return val === 'H'
        ? 'High integrity impact; unauthorized modification of core records.'
        : val === 'L'
        ? 'Low integrity impact; minor modification of non-critical fields.'
        : 'No integrity modification observed.';
    case 'a':
      return val === 'H'
        ? 'High availability impact; complete resource exhaustion or crash.'
        : val === 'L'
        ? 'Low availability impact; reduced performance or intermittent error.'
        : 'No availability disruption observed.';
    default:
      return 'Metric assessed by automated security check engine.';
  }
}
