// Embedded Simulated Target (World Monitor Canary Target Endpoints)
import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /target/health
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'UP',
    version: '1.4.2-wm',
    service: 'world-monitor-canary',
    environment: 'DOCKER_SANDBOX',
    timestamp: new Date().toISOString(),
  });
});

// GET /target/api/v1/alerts/export - The Vulnerable BOLA Endpoint
router.get('/api/v1/alerts/export', (req: Request, res: Response) => {
  const { jobId, format } = req.query;
  const isPatched = store.getCanaryFixStatus();

  // If patched, require authorization header!
  if (isPatched) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied: Active session does not have permission to read export dossier.',
        code: 'TENANT_ISOLATION_REJECTED',
      });
    }
  }

  // If unpatched (VULNERABLE), returns confidential data without any auth check!
  res.setHeader('X-Data-Classification', 'RESTRICTED');
  res.setHeader('X-AegisLens-Nonce', '7f8a9b2c');

  res.status(200).json({
    jobId: jobId || 'exp_99812',
    status: 'READY',
    format: format || 'json',
    tenant: 'ALPHA_CORP',
    totalRecords: 240,
    records: [
      {
        alertId: 'AL-0981',
        timestamp: '2026-09-29T08:12:00Z',
        type: 'INTRUSION_ATTEMPT',
        sourceIp: '198.51.100.44',
        severity: 'HIGH',
        internalServerConfig: 'nginx/1.24 (alpine)',
      },
      {
        alertId: 'AL-0982',
        timestamp: '2026-09-29T08:14:30Z',
        type: 'PRIVILEGE_ESCALATION',
        targetUser: 'sec_admin',
        severity: 'CRITICAL',
      },
    ],
  });
});

// GET /target/api/v1/user/profile - CORS Reflection Endpoint
router.get('/api/v1/user/profile', (req: Request, res: Response) => {
  const origin = req.headers.origin || '*';

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-AegisLens-Nonce', '7f8a9b2c');

  res.json({
    userId: 'usr_8829',
    email: 'analyst@worldmonitor.internal',
    role: 'SECURITY_MONITOR',
    tenantId: 'ALPHA_CORP',
  });
});

// GET /target/metrics - Unauthenticated Metrics Leaker
router.get('/metrics', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('X-AegisLens-Nonce', '7f8a9b2c');
  res.send(`# HELP http_requests_total Total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{code="200",handler="export"} 492
http_requests_total{code="403",handler="export"} 12
# HELP process_resident_memory_bytes Resident memory size in bytes.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 68420000
`);
});

export default router;
