"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../data/store.js");
const hashChain_js_1 = require("../utils/hashChain.js");
const router = (0, express_1.Router)();
// GET /api/audit-logs - List immutable audit entries
router.get('/', (_req, res) => {
    const logs = store_js_1.store.getAuditLogs();
    res.json({
        success: true,
        total: logs.length,
        data: logs,
    });
});
// POST /api/audit-logs/verify - Cryptographically verify Merkle hash chain
router.post('/verify', (_req, res) => {
    const logs = store_js_1.store.getAuditLogs();
    const verification = (0, hashChain_js_1.verifyChainIntegrity)(logs);
    res.json({
        success: true,
        data: verification,
        message: verification.valid
            ? `Cryptographic chain intact. Verified ${verification.totalEntries} parent-to-child SHA-256 hashes without tampering.`
            : `Chain broken at block index ${verification.brokenIndex}! Possible unauthorized tampering detected.`,
    });
});
// POST /api/audit-logs - Append new audit event
router.post('/', (req, res) => {
    const { actor, role, action, entityType, entityId, details } = req.body;
    if (!action || !details) {
        return res.status(400).json({ success: false, error: 'Missing action or details' });
    }
    const created = store_js_1.store.logAudit(actor || 'Analyst', role || 'ANALYST', action, entityType || 'SYSTEM', entityId || 'SYS-01', details);
    res.status(201).json({
        success: true,
        data: created,
    });
});
exports.default = router;
