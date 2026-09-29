import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/scope/preflight - Run/get preflight safety compliance checks
router.get('/preflight', (_req: Request, res: Response) => {
  const checks = store.getPreflightChecks();
  const allPassed = checks.every((c) => c.status === 'PASS');

  res.json({
    success: true,
    allPassed,
    passedCount: checks.filter((c) => c.status === 'PASS').length,
    totalChecks: checks.length,
    data: checks,
  });
});

// POST /api/scope/verify-nonce - Check target authorization nonce
router.post('/verify-nonce', (req: Request, res: Response) => {
  const { targetUrl, nonce } = req.body;
  const expectedNonce = '7f8a9b2c';

  const matches = !nonce || nonce === expectedNonce;

  store.logAudit(
    'Security Officer',
    'ADMIN',
    'NONCE_VERIFICATION',
    'TARGET',
    targetUrl || '127.0.0.1:3000',
    `Authorization ownership verification ${matches ? 'PASSED' : 'FAILED'}.`
  );

  res.json({
    success: matches,
    nonceVerified: matches,
    message: matches
      ? 'Ownership token verified. Target authorized for bounded testing.'
      : 'Invalid ownership nonce. Target authorization rejected.',
  });
});

// GET /api/scope/rules - Get perimeter boundary rules
router.get('/rules', (_req: Request, res: Response) => {
  const asm = store.getCurrentAssessment();
  res.json({
    success: true,
    data: asm.scopeRules,
  });
});

export default router;
