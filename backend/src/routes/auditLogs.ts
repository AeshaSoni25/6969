import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { verifyChainIntegrity } from '../utils/hashChain.js';

const router = Router();

// GET /api/audit-logs - List immutable audit entries
router.get('/', (_req: Request, res: Response) => {
  const logs = store.getAuditLogs();
  res.json({
    success: true,
    total: logs.length,
    data: logs,
  });
});

// POST /api/audit-logs/verify - Cryptographically verify Merkle hash chain
router.post('/verify', (_req: Request, res: Response) => {
  const logs = store.getAuditLogs();
  const verification = verifyChainIntegrity(logs);

  res.json({
    success: true,
    data: verification,
    message: verification.valid
      ? `Cryptographic chain intact. Verified ${verification.totalEntries} parent-to-child SHA-256 hashes without tampering.`
      : `Chain broken at block index ${verification.brokenIndex}! Possible unauthorized tampering detected.`,
  });
});

// POST /api/audit-logs - Append new audit event
router.post('/', (req: Request, res: Response) => {
  const { actor, role, action, entityType, entityId, details } = req.body;

  if (!action || !details) {
    return res.status(400).json({ success: false, error: 'Missing action or details' });
  }

  const created = store.logAudit(
    actor || 'Analyst',
    role || 'ANALYST',
    action,
    entityType || 'SYSTEM',
    entityId || 'SYS-01',
    details
  );

  res.status(201).json({
    success: true,
    data: created,
  });
});

export default router;
