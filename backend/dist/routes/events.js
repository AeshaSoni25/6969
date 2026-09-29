"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../data/store.js");
const router = (0, express_1.Router)();
// GET /api/events - Server-Sent Events (SSE) telemetry stream
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    // Send initial snapshot
    const initialPayload = JSON.stringify({
        type: 'SNAPSHOT',
        telemetry: store_js_1.store.getTelemetry(),
        currentAssessment: store_js_1.store.getCurrentAssessment(),
    });
    res.write(`data: ${initialPayload}\n\n`);
    // Event listeners
    const onTelemetry = (telemetry) => {
        res.write(`data: ${JSON.stringify({ type: 'TELEMETRY_UPDATE', data: telemetry })}\n\n`);
    };
    const onLog = (line) => {
        res.write(`data: ${JSON.stringify({ type: 'NEW_LOG', data: line })}\n\n`);
    };
    const onFinding = (finding) => {
        res.write(`data: ${JSON.stringify({ type: 'FINDING_UPDATED', data: finding })}\n\n`);
    };
    const onAudit = (entry) => {
        res.write(`data: ${JSON.stringify({ type: 'AUDIT_ENTRY', data: entry })}\n\n`);
    };
    store_js_1.store.on('telemetry:updated', onTelemetry);
    store_js_1.store.on('telemetry:log', onLog);
    store_js_1.store.on('finding:updated', onFinding);
    store_js_1.store.on('audit:new', onAudit);
    // Clean up on client disconnect
    req.on('close', () => {
        store_js_1.store.off('telemetry:updated', onTelemetry);
        store_js_1.store.off('telemetry:log', onLog);
        store_js_1.store.off('finding:updated', onFinding);
        store_js_1.store.off('audit:new', onAudit);
    });
});
exports.default = router;
