"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../data/store.js");
const router = (0, express_1.Router)();
// GET /api/settings - Get platform configuration
router.get('/', (_req, res) => {
    res.json({
        success: true,
        data: store_js_1.store.getSettings(),
    });
});
// PUT /api/settings - Update platform configuration
router.put('/', (req, res) => {
    const updated = store_js_1.store.updateSettings(req.body);
    store_js_1.store.logAudit('Admin User', 'ADMIN', 'SETTINGS_UPDATE', 'PLATFORM', 'CONFIG', 'Updated platform settings (AI Gateway, Guardrails, or SLAs).');
    res.json({
        success: true,
        message: 'Settings updated successfully',
        data: updated,
    });
});
exports.default = router;
