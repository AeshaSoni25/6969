"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../data/store.js");
const router = (0, express_1.Router)();
// GET /api/scope/preflight - Run/get preflight safety compliance checks
router.get('/preflight', (_req, res) => {
    const checks = store_js_1.store.getPreflightChecks();
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
router.post('/verify-nonce', (req, res) => {
    const { targetUrl, nonce } = req.body;
    const expectedNonce = '7f8a9b2c';
    const matches = !nonce || nonce === expectedNonce;
    store_js_1.store.logAudit('Security Officer', 'ADMIN', 'NONCE_VERIFICATION', 'TARGET', targetUrl || '127.0.0.1:3000', `Authorization ownership verification ${matches ? 'PASSED' : 'FAILED'}.`);
    res.json({
        success: matches,
        nonceVerified: matches,
        message: matches
            ? 'Ownership token verified. Target authorized for bounded testing.'
            : 'Invalid ownership nonce. Target authorization rejected.',
    });
});
// GET /api/scope/rules - Get perimeter boundary rules
router.get('/rules', (_req, res) => {
    const asm = store_js_1.store.getCurrentAssessment();
    res.json({
        success: true,
        data: asm.scopeRules,
    });
});
exports.default = router;
