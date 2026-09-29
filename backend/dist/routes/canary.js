"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../data/store.js");
const router = (0, express_1.Router)();
// GET /api/canary/status - Get current canary vulnerability state
router.get('/status', (_req, res) => {
    const isFixed = store_js_1.store.getCanaryFixStatus();
    res.json({
        success: true,
        isCanaryFixEnabled: isFixed,
        targetState: isFixed ? 'PATCHED' : 'VULNERABLE',
        description: isFixed
            ? 'Target Canary is currently running with the authorization patch (HTTP 403 Forbidden on unauthenticated access).'
            : 'Target Canary is currently in vulnerable state (BOLA bug active, HTTP 200 on unauthenticated export).',
    });
});
// POST /api/canary/toggle - Toggle canary vulnerability state
router.post('/toggle', (_req, res) => {
    const newState = store_js_1.store.toggleCanaryFix();
    res.json({
        success: true,
        isCanaryFixEnabled: newState,
        targetState: newState ? 'PATCHED' : 'VULNERABLE',
        message: newState
            ? 'Canary target updated: Security patch applied. Retests should now pass!'
            : 'Canary target reset: Vulnerable behavior restored. Retests will flag finding.',
    });
});
exports.default = router;
