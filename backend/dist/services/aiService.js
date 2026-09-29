"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
class AIService {
    generateFindingAnalysis(finding) {
        const isBola = finding.category === 'AUTHZ' || finding.cwe.includes('CWE-639');
        const isSecret = finding.category === 'CLIENT' || finding.cwe.includes('CWE-798');
        const isCors = finding.category === 'API' || finding.cwe.includes('CWE-346');
        let plain = '';
        let developer = '';
        let executive = '';
        let whyItMatters = '';
        let rootCause = '';
        let remediation = '';
        const factsUsed = [
            `Finding Title: ${finding.title}`,
            `Endpoint: ${finding.endpoint}`,
            `CVSS 3.1 Base Score: ${finding.cvss.score} (${finding.severity})`,
            `Reported CWE: ${finding.cwe.join(', ')}`,
            `Affected Component: ${finding.affectedComponent}`,
        ];
        if (finding.technicalEvidence.length > 0) {
            factsUsed.push(`Evidence ID: ${finding.technicalEvidence[0].id} (SHA-256: ${finding.technicalEvidence[0].sha256.slice(0, 12)}...)`);
        }
        if (isBola) {
            plain =
                'The application exposes private data because it does not verify whether the person requesting an export job actually owns it. Anyone who provides an export ID number can read or download confidential records without logging in.';
            developer =
                'The controller endpoint lacks authorization check interceptors. While authentication might be partially enforced on other endpoints, this route queries data directly by ID parameter without validating session tenant context. Fix by binding the query to the authenticated user ID.';
            executive =
                'High compliance risk under data privacy regulations. An unauthorized party could mass-download client data. We recommend an urgent emergency patch within 24 hours.';
            whyItMatters =
                'Allows horizontal privilege escalation across tenant boundaries and unauthenticated data exfiltration.';
            rootCause =
                'Endpoint was deployed as a worker callback without public API authorization gateway filters.';
            remediation =
                'Enforce requireAuth middleware and scope database queries to req.user.tenantId.';
        }
        else if (isSecret) {
            plain =
                'A secret API password or access token was packaged directly into public website code. Anyone visiting the website can view this key using their web browser developer tools.';
            developer =
                'Build environment variables prefixed with public identifiers (e.g. NEXT_PUBLIC_) are bundled into client-side JavaScript assets. Remove the public prefix and proxy API calls through a secure backend route.';
            executive =
                'Exposure of third-party credentials can result in financial loss through quota depletion and unauthorized access to external provider accounts.';
            whyItMatters =
                'Enables adversaries to abuse account quotas or pivot into integrated external service providers.';
            rootCause =
                'Mislabeled environment variable included in client build artifact.';
            remediation =
                'Rotate API secret immediately and refactor client calls to use server-side API proxy.';
        }
        else if (isCors) {
            plain =
                'The website allows any other webpage on the internet to ask for user details and automatically receives them. If a user visits an untrusted website while logged in, that site can steal their profile details.';
            developer =
                'CORS policy reflects the request Origin header in Access-Control-Allow-Origin while setting Access-Control-Allow-Credentials: true. Implement a strict origin allowlist array.';
            executive =
                'Session hijacking and cross-origin data theft risk. Low remediation effort required.';
            whyItMatters =
                'Circumvents browser same-origin policy, exposing authenticated user context to external attackers.';
            rootCause =
                'Permissive CORS reflection configuration applied to entire router.';
            remediation =
                'Replace origin reflection with an explicit whitelist of trusted frontend domains.';
        }
        else {
            plain = `The system exhibits a ${finding.severity.toLowerCase()} security defect on ${finding.endpoint}. Unintended access or configuration weakness could allow attackers to bypass security assumptions.`;
            developer = `Vulnerability identified in ${finding.affectedComponent}. Check input validation, authentication decorators, and response sanitization rules.`;
            executive = `Identified vulnerability rated CVSS ${finding.cvss.score}. Remediate in accordance with SLA timeline (${finding.severity === 'CRITICAL' ? '48 hours' : '7 days'}).`;
            whyItMatters = finding.whyItMatters || 'Potential vector for privilege escalation or sensitive information disclosure.';
            rootCause = finding.rootCause || 'Missing security boundary constraint.';
            remediation = finding.recommendation.immediate;
        }
        return {
            id: `AI-${Date.now()}`,
            findingId: finding.id,
            model: 'SecureMon-Claude-SecExpert-v2',
            promptVersion: 'prompts/vuln_analysis_v3.yaml',
            explanationPlain: plain,
            developerExplanation: developer,
            executiveExplanation: executive,
            whyItMatters,
            rootCauseHypothesis: rootCause,
            remediationDraft: remediation,
            factsUsed,
            approved: false,
            createdAt: new Date().toISOString(),
        };
    }
    chatResponse(userMessage, contextFinding) {
        const msg = userMessage.toLowerCase();
        if (contextFinding) {
            if (msg.includes('patch') || msg.includes('fix') || msg.includes('code')) {
                return `### Recommended Code Patch for ${contextFinding.id} (${contextFinding.title})

**Affected File:** \`${contextFinding.endpoint}\`  
**CWE Reference:** ${contextFinding.cwe.join(', ')}

\`\`\`typescript
// Secure Implementation
import { requireAuth } from '../middleware/auth';

router.get('${contextFinding.endpoint}', requireAuth, async (req, res) => {
  // Validate caller identity and tenant isolation
  const { tenantId, userId } = req.auth;
  
  const resource = await db.query({
    where: { 
      id: req.query.id, 
      tenantId: tenantId 
    }
  });

  if (!resource) {
    return res.status(403).json({ error: 'Access Denied: Resource not found or unowned' });
  }

  return res.json(resource);
});
\`\`\`

**Verification Step:**
After applying the patch, run the SecureMon Closed-Loop Retest. The endpoint should return \`403 Forbidden\` for unauthorized attempts.`;
            }
            if (msg.includes('cvss') || msg.includes('score') || msg.includes('severity')) {
                return `Finding **${contextFinding.id}** is evaluated at **CVSS ${contextFinding.cvss.score} (${contextFinding.severity})**.
Vector: \`${contextFinding.cvss.vector}\`

- **Attack Vector (AV):** ${contextFinding.cvss.av === 'N' ? 'Network (Remotely exploitable)' : 'Local'}
- **Attack Complexity (AC):** ${contextFinding.cvss.ac === 'L' ? 'Low (Simple HTTP request)' : 'High'}
- **Privileges Required (PR):** ${contextFinding.cvss.pr === 'N' ? 'None (Unauthenticated)' : 'Low'}
- **Confidentiality Impact (C):** ${contextFinding.cvss.c === 'H' ? 'High (Sensitive data exposed)' : 'Low'}`;
            }
            if (msg.includes('why') || msg.includes('impact') || msg.includes('business')) {
                return `**Business Impact Assessment for ${contextFinding.id}:**
${contextFinding.businessImpact.statement}

- **Likelihood:** ${contextFinding.businessImpact.likelihood} / 5
- **Impact:** ${contextFinding.businessImpact.impact} / 5
- **Asset Criticality:** ${contextFinding.businessImpact.assetCriticality}
- **Data Protection Compliance:** Non-compliant with DPDP Act & OWASP ASVS guidelines.`;
            }
        }
        return `I am your **SecureMon AI Security Copilot**. I have access to the active assessment data, 6 verified findings, and target network topology for World Monitor.

You can ask me to:
1. Generate an instant **code patch diff** for any finding (e.g. FND-0001 BOLA).
2. Calculate or justify **CVSS 3.1** vector rationales.
3. Draft an **executive summary** for C-suite briefings.
4. Explain step-by-step **reproduction recipes** for your dev team.`;
    }
}
exports.aiService = new AIService();
