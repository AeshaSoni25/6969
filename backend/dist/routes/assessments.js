"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../data/store.js");
const assessmentEngine_js_1 = require("../services/assessmentEngine.js");
const router = (0, express_1.Router)();
// GET /api/assessments - List all assessments
router.get('/', (_req, res) => {
    res.json({
        success: true,
        data: store_js_1.store.getAssessments(),
        currentId: store_js_1.store.getCurrentAssessment().id,
    });
});
// GET /api/assessments/current - Get active assessment
router.get('/current', (_req, res) => {
    res.json({
        success: true,
        data: store_js_1.store.getCurrentAssessment(),
    });
});
// GET /api/assessments/:id - Get assessment by ID
router.get('/:id', (req, res) => {
    const assessment = store_js_1.store.getAssessment(req.params.id);
    if (!assessment) {
        return res.status(404).json({ success: false, error: 'Assessment not found' });
    }
    res.json({ success: true, data: assessment });
});
// POST /api/assessments - Create new assessment
router.post('/', (req, res) => {
    const { name, description, profile, target, scopeRules } = req.body;
    // Strict Production Safety Gate Check
    if (target?.envType === 'PRODUCTION' || target?.baseUrl?.includes('worldmonitor.app')) {
        return res.status(403).json({
            success: false,
            code: 'ENV_PRODUCTION_REJECTED',
            error: 'AegisLens enforces an absolute technical ban on active testing against PRODUCTION environments or public production domains (worldmonitor.app). Only RFC1918 / Loopback / Docker targets are permitted.',
        });
    }
    const created = store_js_1.store.createAssessment({
        name,
        description,
        profile,
        target,
        scopeRules,
    });
    res.status(201).json({
        success: true,
        message: 'Authorized assessment created successfully',
        data: created,
    });
});
// POST /api/assessments/:id/select - Set as active assessment
router.post('/:id/select', (req, res) => {
    const selected = store_js_1.store.setCurrentAssessment(req.params.id);
    if (!selected) {
        return res.status(404).json({ success: false, error: 'Assessment not found' });
    }
    res.json({ success: true, data: selected });
});
// POST /api/assessments/:id/start - Trigger security assessment run
router.post('/:id/start', (req, res) => {
    const assessment = store_js_1.store.getAssessment(req.params.id);
    if (!assessment) {
        return res.status(404).json({ success: false, error: 'Assessment not found' });
    }
    const started = assessmentEngine_js_1.assessmentEngine.start();
    res.json({
        success: started,
        message: started ? 'Assessment execution started' : 'Assessment is already running',
        telemetry: store_js_1.store.getTelemetry(),
    });
});
// POST /api/assessments/:id/pause - Pause running assessment
router.post('/:id/pause', (_req, res) => {
    const paused = assessmentEngine_js_1.assessmentEngine.pause();
    res.json({
        success: paused,
        message: paused ? 'Assessment paused' : 'Assessment is not running',
        telemetry: store_js_1.store.getTelemetry(),
    });
});
// POST /api/assessments/:id/kill-switch - Emergency stop
router.post('/:id/kill-switch', (req, res) => {
    const { reason } = req.body;
    const killed = assessmentEngine_js_1.assessmentEngine.killSwitch(reason);
    res.json({
        success: killed,
        message: 'Kill-switch triggered. All scanner workers terminated.',
        telemetry: store_js_1.store.getTelemetry(),
    });
});
// GET /api/assessments/:id/telemetry - Live progress and telemetry
router.get('/:id/telemetry', (_req, res) => {
    res.json({
        success: true,
        data: store_js_1.store.getTelemetry(),
        engine: assessmentEngine_js_1.assessmentEngine.getStatus(),
    });
});
exports.default = router;
