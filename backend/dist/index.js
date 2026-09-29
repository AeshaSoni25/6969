"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import Routers
const assessments_js_1 = __importDefault(require("./routes/assessments.js"));
const findings_js_1 = __importDefault(require("./routes/findings.js"));
const assets_js_1 = __importDefault(require("./routes/assets.js"));
const scope_js_1 = __importDefault(require("./routes/scope.js"));
const plugins_js_1 = __importDefault(require("./routes/plugins.js"));
const canary_js_1 = __importDefault(require("./routes/canary.js"));
const ai_js_1 = __importDefault(require("./routes/ai.js"));
const reports_js_1 = __importDefault(require("./routes/reports.js"));
const auditLogs_js_1 = __importDefault(require("./routes/auditLogs.js"));
const settings_js_1 = __importDefault(require("./routes/settings.js"));
const events_js_1 = __importDefault(require("./routes/events.js"));
const mockWorldMonitor_js_1 = __importDefault(require("./target/mockWorldMonitor.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, _res, next) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'HEALTHY',
        service: 'SecureMon-AegisLens-API',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        endpoints: {
            assessments: '/api/assessments',
            findings: '/api/findings',
            assets: '/api/assets',
            scope: '/api/scope',
            plugins: '/api/plugins',
            canary: '/api/canary',
            ai: '/api/ai',
            reports: '/api/reports',
            auditLogs: '/api/audit-logs',
            settings: '/api/settings',
            events: '/api/events',
            targetApp: '/target',
        },
    });
});
// API Routes
app.use('/api/assessments', assessments_js_1.default);
app.use('/api/findings', findings_js_1.default);
app.use('/api/assets', assets_js_1.default);
app.use('/api/scope', scope_js_1.default);
app.use('/api/plugins', plugins_js_1.default);
app.use('/api/canary', canary_js_1.default);
app.use('/api/ai', ai_js_1.default);
app.use('/api/reports', reports_js_1.default);
app.use('/api/audit-logs', auditLogs_js_1.default);
app.use('/api/settings', settings_js_1.default);
app.use('/api/events', events_js_1.default);
// Simulated Target Application
app.use('/target', mockWorldMonitor_js_1.default);
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
    });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error('[Error]', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
});
// Start Server
app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🛡️  SecureMon / AegisLens API Backend running on:`);
    console.log(`👉  http://localhost:${PORT}/api/health`);
    console.log(`👉  Target Canary: http://localhost:${PORT}/target/health`);
    console.log('====================================================');
});
