import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/assets - List all discovered attack surface assets
router.get('/', (req: Request, res: Response) => {
  const { targetId } = req.query;
  const assets = store.getAssets(targetId as string);

  res.json({
    success: true,
    total: assets.length,
    data: assets,
  });
});

// GET /api/assets/topology - Get network attack surface topology graph
router.get('/topology', (_req: Request, res: Response) => {
  const nodes = [
    {
      id: 'node-cdn',
      label: 'Edge CDN / Cloudflare',
      layer: 'PERIMETER',
      protocol: 'HTTPS / TLS 1.3',
      port: 443,
      status: 'PROTECTED',
      criticality: 'MEDIUM',
    },
    {
      id: 'node-proxy',
      label: 'Nginx Reverse Proxy',
      layer: 'GATEWAY',
      protocol: 'HTTP/1.1 (Loopback)',
      port: 3000,
      status: 'VERIFIED',
      criticality: 'HIGH',
    },
    {
      id: 'node-app',
      label: 'World Monitor Core Services',
      layer: 'APPLICATION',
      protocol: 'Node.js Express / Next.js',
      port: 3000,
      status: 'VULNERABLE',
      criticality: 'CRITICAL',
      findingsCount: 4,
    },
    {
      id: 'node-db',
      label: 'PostgreSQL Datastore',
      layer: 'DATASTORE',
      protocol: 'TCP / PgWire',
      port: 5432,
      status: 'INTERNAL_ONLY',
      criticality: 'CRITICAL',
    },
  ];

  const edges = [
    { from: 'node-cdn', to: 'node-proxy', label: 'Egress Filtered', secure: true },
    { from: 'node-proxy', to: 'node-app', label: 'Local Routing', secure: true },
    { from: 'node-app', to: 'node-db', label: 'PgBouncer Pool', secure: true },
  ];

  res.json({
    success: true,
    data: {
      nodes,
      edges,
      summary: {
        totalLayers: 4,
        vulnerableNodes: 1,
        isolatedDatastores: 1,
      },
    },
  });
});

// POST /api/assets - Register newly discovered asset
router.post('/', (req: Request, res: Response) => {
  const { targetId, type, urlOrPath, method, authRequired, criticality, techFingerprint } = req.body;

  if (!urlOrPath || !type) {
    return res.status(400).json({ success: false, error: 'Missing required asset fields: type, urlOrPath' });
  }

  const created = store.addAsset({
    id: `AST-${Date.now().toString(36).toUpperCase()}`,
    targetId: targetId || store.getCurrentAssessment().target.id,
    type,
    urlOrPath,
    method,
    authRequired: !!authRequired,
    criticality: criticality || 'LOW',
    hasFindingsCount: 0,
    firstSeen: new Date().toISOString(),
    techFingerprint,
  });

  res.status(201).json({
    success: true,
    data: created,
  });
});

export default router;
