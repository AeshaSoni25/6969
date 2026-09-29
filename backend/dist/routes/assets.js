"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../data/store.js");
const router = (0, express_1.Router)();
// GET /api/assets - List all discovered attack surface assets
router.get('/', (req, res) => {
    const { targetId } = req.query;
    const assets = store_js_1.store.getAssets(targetId);
    res.json({
        success: true,
        total: assets.length,
        data: assets,
    });
});
// GET /api/assets/topology - Get network attack surface topology graph
router.get('/topology', (_req, res) => {
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
router.post('/', (req, res) => {
    const { targetId, type, urlOrPath, method, authRequired, criticality, techFingerprint } = req.body;
    if (!urlOrPath || !type) {
        return res.status(400).json({ success: false, error: 'Missing required asset fields: type, urlOrPath' });
    }
    const created = store_js_1.store.addAsset({
        id: `AST-${Date.now().toString(36).toUpperCase()}`,
        targetId: targetId || store_js_1.store.getCurrentAssessment().target.id,
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
exports.default = router;
