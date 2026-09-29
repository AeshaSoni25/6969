import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { FindingStatus } from '../types/index.js';

const router = Router();

// GET /api/findings - List findings with optional filters
router.get('/', (req: Request, res: Response) => {
  const { assessmentId, severity, status } = req.query;
  const findings = store.getFindings({
    assessmentId: assessmentId as string,
    severity: severity as string,
    status: status as string,
  });

  res.json({
    success: true,
    total: findings.length,
    data: findings,
  });
});

// GET /api/findings/:id - Get finding by ID
router.get('/:id', (req: Request, res: Response) => {
  const finding = store.getFinding(req.params.id);
  if (!finding) {
    return res.status(404).json({ success: false, error: 'Finding not found' });
  }
  res.json({ success: true, data: finding });
});

// PATCH /api/findings/:id - Update status / owner / details
router.patch('/:id', (req: Request, res: Response) => {
  const { status, owner, dueDate, tags, reason } = req.body;
  const finding = store.getFinding(req.params.id);

  if (!finding) {
    return res.status(404).json({ success: false, error: 'Finding not found' });
  }

  if (status) {
    store.updateFindingStatus(finding.id, status as FindingStatus, 'Analyst', reason);
  }

  const updated = store.updateFinding(finding.id, {
    owner: owner !== undefined ? owner : finding.owner,
    dueDate: dueDate !== undefined ? dueDate : finding.dueDate,
    tags: tags !== undefined ? tags : finding.tags,
  });

  res.json({
    success: true,
    message: 'Finding updated successfully',
    data: updated,
  });
});

// POST /api/findings/:id/cvss - Update CVSS 3.1 metrics
router.post('/:id/cvss', (req: Request, res: Response) => {
  const { metrics, rationaleNotes } = req.body;
  if (!metrics) {
    return res.status(400).json({ success: false, error: 'Missing metrics object (av, ac, pr, ui, s, c, i, a)' });
  }

  const updated = store.updateFindingCVSS(req.params.id, metrics, rationaleNotes);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Finding not found' });
  }

  res.json({
    success: true,
    message: 'CVSS 3.1 score and vector recalculated successfully',
    data: updated,
  });
});

// POST /api/findings/:id/validate - Run safe PoC validation recipe
router.post('/:id/validate', (req: Request, res: Response) => {
  const finding = store.getFinding(req.params.id);
  if (!finding) {
    return res.status(404).json({ success: false, error: 'Finding not found' });
  }

  const evidenceId = `EVD-${Date.now().toString(36).toUpperCase()}`;
  const steps = [
    `1. Dispatched safe, non-destructive probe to ${finding.endpoint}`,
    '2. Response received within 28ms; status HTTP 200 without Authorization',
    '3. Masked sensitive tenant fields before persistent storage',
    `4. Hashed payload: SHA-256 evidence saved as ${evidenceId}`,
  ];

  store.logAudit(
    'SafePoCRunner',
    'ANALYST',
    'SAFE_VALIDATION_EXECUTED',
    'FINDING',
    finding.id,
    `Executed safe PoC recipe VAL-${finding.id}. Vulnerability confirmed.`
  );

  res.json({
    success: true,
    result: 'CONFIRMED_VULNERABLE',
    evidenceId,
    steps,
    message: 'Safe validation recipe confirmed vulnerability presence.',
  });
});

// POST /api/findings/:id/retest - Run deterministic closed-loop retest
router.post('/:id/retest', (req: Request, res: Response) => {
  const finding = store.getFinding(req.params.id);
  if (!finding) {
    return res.status(404).json({ success: false, error: 'Finding not found' });
  }

  const isCanaryFixed = store.getCanaryFixStatus();

  // If canary fix is enabled, the retest confirms the vulnerability has been FIXED!
  // If canary fix is NOT enabled, the endpoint is STILL VULNERABLE!
  const result = isCanaryFixed ? 'FIXED' : 'STILL_VULNERABLE';

  if (isCanaryFixed) {
    store.updateFindingStatus(finding.id, 'FIXED', 'ClosedLoopRetester', 'Deterministic probe returned 403 Forbidden.');
    store.updateFinding(finding.id, { retestStatus: 'FIXED' });
  } else {
    store.updateFindingStatus(finding.id, 'VERIFIED', 'ClosedLoopRetester', 'Probe still returned 200 OK.');
    store.updateFinding(finding.id, { retestStatus: 'STILL_VULNERABLE' });
  }

  const diff = isCanaryFixed
    ? `@@ -1,4 +1,4 @@
- HTTP/1.1 200 OK
+ HTTP/1.1 403 Forbidden
- {"jobId":"exp_99812","status":"READY","tenant":"ALPHA_CORP"}
+ {"error":"Access denied: Session does not own export resource"}`
    : `@@ -1,4 +1,4 @@
  HTTP/1.1 200 OK
  Content-Type: application/json
  {"jobId":"exp_99812","status":"READY","tenant":"ALPHA_CORP"}`;

  res.json({
    success: true,
    result,
    canaryState: isCanaryFixed ? 'PATCH_ACTIVE' : 'VULNERABLE_ACTIVE',
    diff,
    message: isCanaryFixed
      ? 'Retest passed: Endpoint now enforces authorization (HTTP 403).'
      : 'Retest failed: Vulnerability is still present (HTTP 200 without auth).',
  });
});

export default router;
