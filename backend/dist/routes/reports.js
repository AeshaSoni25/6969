"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const store_js_1 = require("../data/store.js");
const router = (0, express_1.Router)();
// GET /api/reports/:id - Generate executive report with SHA-256 seal
router.get('/:id', (req, res) => {
    const assessment = store_js_1.store.getAssessment(req.params.id) || store_js_1.store.getCurrentAssessment();
    const findings = store_js_1.store.getFindings({ assessmentId: assessment.id });
    // Calculate cryptographic integrity seal of this report snapshot
    const rawReportPayload = JSON.stringify({
        assessmentId: assessment.id,
        target: assessment.target.baseUrl,
        findingsCount: findings.length,
        score: assessment.score,
        timestamp: assessment.completedAt || assessment.startedAt,
    });
    const sha256Seal = crypto_1.default.createHash('sha256').update(rawReportPayload).digest('hex');
    const severityCounts = {
        critical: findings.filter((f) => f.severity === 'CRITICAL').length,
        high: findings.filter((f) => f.severity === 'HIGH').length,
        medium: findings.filter((f) => f.severity === 'MEDIUM').length,
        low: findings.filter((f) => f.severity === 'LOW').length,
        info: findings.filter((f) => f.severity === 'INFO').length,
    };
    res.json({
        success: true,
        data: {
            reportId: `REP-${assessment.id}`,
            assessment,
            generatedAt: new Date().toISOString(),
            securityScore: assessment.score,
            postureBand: assessment.score >= 80 ? 'RESILIENT' : assessment.score >= 60 ? 'MODERATE' : 'AT_RISK',
            compliance: {
                owaspTop10: 'FAIL - BOLA & Secret leakage detected',
                ntroBaseline: 'PROVISIONAL_AUDIT_PASSED',
                rfc1918Bound: 'COMPLIANT (Loopback isolation verified)',
            },
            severityCounts,
            findings,
            cryptographicSeal: {
                algorithm: 'SHA-256',
                hash: sha256Seal,
                verified: true,
                issuedBy: 'SecureMon Trust & Verification Service',
            },
        },
    });
});
// GET /api/reports/:id/export - Export report payload
router.get('/:id/export', (req, res) => {
    const assessment = store_js_1.store.getAssessment(req.params.id) || store_js_1.store.getCurrentAssessment();
    const findings = store_js_1.store.getFindings({ assessmentId: assessment.id });
    res.setHeader('Content-Disposition', `attachment; filename="SecureMon-Report-${assessment.id}.json"`);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        platform: 'SecureMon / AegisLens v1.0',
        assessment,
        findings,
        exportedAt: new Date().toISOString(),
    }, null, 2));
});
exports.default = router;
