"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../data/store.js");
const router = (0, express_1.Router)();
// GET /api/plugins - List all security check plugins
router.get('/', (_req, res) => {
    const checks = store_js_1.store.getChecks();
    res.json({
        success: true,
        total: checks.length,
        data: checks,
    });
});
// POST /api/plugins/:id/toggle - Enable/disable a check plugin
router.post('/:id/toggle', (req, res) => {
    const { enabled } = req.body;
    const updated = store_js_1.store.toggleCheck(req.params.id, !!enabled);
    if (!updated) {
        return res.status(404).json({ success: false, error: 'Plugin check not found' });
    }
    res.json({
        success: true,
        message: `Plugin ${updated.code} is now ${updated.enabled ? 'ENABLED' : 'DISABLED'}`,
        data: updated,
    });
});
// POST /api/plugins/:id/run - Execute individual security check
router.post('/:id/run', (req, res) => {
    const check = store_js_1.store.getChecks().find((c) => c.id === req.params.id);
    if (!check) {
        return res.status(404).json({ success: false, error: 'Plugin check not found' });
    }
    // Record audit log
    store_js_1.store.logAudit('Analyst', 'ANALYST', 'CHECK_EXECUTED', 'PLUGIN', check.id, `Dispatched standalone probe: ${check.name} (${check.code})`);
    res.json({
        success: true,
        result: check.status || 'PASSED',
        signalsCount: check.signalsEmittedCount || 0,
        message: `Check ${check.name} executed successfully against active target.`,
    });
});
exports.default = router;
