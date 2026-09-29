"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.MemoryStore = void 0;
const events_1 = require("events");
const seedData_js_1 = require("./seedData.js");
const cvssCalculator_js_1 = require("../utils/cvssCalculator.js");
const hashChain_js_1 = require("../utils/hashChain.js");
class MemoryStore extends events_1.EventEmitter {
    assessments = [seedData_js_1.INITIAL_ASSESSMENT, seedData_js_1.CANARY_ASSESSMENT];
    currentAssessmentId = seedData_js_1.INITIAL_ASSESSMENT.id;
    findings = [...seedData_js_1.INITIAL_FINDINGS];
    assets = [...seedData_js_1.INITIAL_ASSETS];
    checks = [...seedData_js_1.SECURITY_CHECKS];
    preflightChecks = [...seedData_js_1.INITIAL_PREFLIGHT_CHECKS];
    auditLogs = [...seedData_js_1.INITIAL_AUDIT_LOGS];
    isCanaryFixEnabled = false;
    liveTelemetry = {
        isAssessing: false,
        phase: 'COMPLETED',
        progress: 100,
        logs: [
            '[10:14:00] [Orchestrator] Initialized BullMQ DAG scheduler with 14 checks.',
            '[10:14:02] [Guardrail] Egress allow-list locked to RFC1918 127.0.0.1:3000.',
            '[10:14:15] [Discovery] Playwright worker indexed 10 target assets (4 endpoints, 2 pages, 1 websocket).',
            '[10:18:22] [Signal] AUTHZ-001 emitted RawSignal: HTTP 200 without Authorization on /api/v1/alerts/export.',
            '[10:20:00] [Validation] Safe recipe VAL-AUTHZ-001 confirmed vulnerability. Redacted evidence EVD-0001 hashed.',
            '[10:23:45] [Complete] Assessment finished. Calculated Security Score: 82/100.',
        ],
        guardrailBlockedCount: 0,
    };
    settings = {
        aiGateway: {
            provider: 'Google Gemini Pro / Claude 3.5 Sonnet',
            model: 'gemini-1.5-pro-security-tuned',
            temperature: 0.1,
            maxOutputTokens: 2048,
            piiFilterEnabled: true,
            requireHumanApproval: true,
        },
        guardrails: {
            maxRateLimitRps: 15,
            enforceRfc1918Only: true,
            blockProductionDomains: true,
            evidenceRedactionStrict: true,
        },
        slas: {
            criticalDays: 2,
            highDays: 7,
            mediumDays: 30,
            lowDays: 90,
        },
    };
    // ASSESSMENTS
    getAssessments() {
        return this.assessments;
    }
    getAssessment(id) {
        return this.assessments.find((a) => a.id === id);
    }
    getCurrentAssessment() {
        return this.assessments.find((a) => a.id === this.currentAssessmentId) || this.assessments[0];
    }
    setCurrentAssessment(id) {
        const found = this.assessments.find((a) => a.id === id);
        if (found) {
            this.currentAssessmentId = id;
            this.emit('assessment:changed', found);
        }
        return found;
    }
    createAssessment(data) {
        const newAsm = {
            id: `ASM-${Date.now().toString(36).toUpperCase()}`,
            name: data.name || 'Untitled Security Assessment',
            description: data.description || 'Targeted security audit',
            profile: data.profile || 'BASELINE_OWASP',
            status: 'READY',
            progressPercent: 0,
            currentPhase: 'INITIALIZED',
            score: 100,
            startedAt: new Date().toISOString(),
            target: data.target || {
                id: `TGT-${Date.now()}`,
                name: 'Local Target',
                baseUrl: 'http://127.0.0.1:3000',
                envType: 'DOCKER_SANDBOX',
                authorizationStatus: 'VERIFIED',
                techFingerprint: { server: 'nginx/1.24 (Docker)' },
                authNonceVerified: true,
                adminApproved: true,
            },
            findingsCount: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
            scopeRules: data.scopeRules || [
                {
                    id: `SCR-${Date.now()}`,
                    ruleType: 'INCLUDE',
                    hostPattern: '127.0.0.1:3000',
                    pathPattern: '/**',
                    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
                    rateLimitRps: 10,
                },
            ],
            preflightPassed: true,
        };
        this.assessments.unshift(newAsm);
        this.currentAssessmentId = newAsm.id;
        this.logAudit('Lead Analyst', 'ANALYST', 'ASSESSMENT_CREATE', 'ASSESSMENT', newAsm.id, `Created assessment "${newAsm.name}" for target ${newAsm.target.baseUrl}`);
        this.emit('assessment:created', newAsm);
        return newAsm;
    }
    updateAssessment(id, partial) {
        const idx = this.assessments.findIndex((a) => a.id === id);
        if (idx === -1)
            return undefined;
        this.assessments[idx] = { ...this.assessments[idx], ...partial };
        this.emit('assessment:updated', this.assessments[idx]);
        return this.assessments[idx];
    }
    // FINDINGS
    getFindings(filter) {
        let list = this.findings;
        if (filter?.assessmentId) {
            list = list.filter((f) => f.assessmentId === filter.assessmentId);
        }
        if (filter?.severity) {
            list = list.filter((f) => f.severity.toUpperCase() === filter.severity?.toUpperCase());
        }
        if (filter?.status) {
            list = list.filter((f) => f.status === filter.status);
        }
        return list;
    }
    getFinding(id) {
        return this.findings.find((f) => f.id === id);
    }
    updateFindingStatus(id, status, actor = 'Security Analyst', reason) {
        const f = this.findings.find((x) => x.id === id);
        if (!f)
            return undefined;
        const oldStatus = f.status;
        f.status = status;
        this.logAudit(actor, 'APPSEC', 'FINDING_STATUS_CHANGE', 'FINDING', f.id, `Transitioned ${f.id} from ${oldStatus} to ${status}${reason ? ` Reason: ${reason}` : ''}`);
        this.emit('finding:updated', f);
        return f;
    }
    updateFindingCVSS(id, metrics, rationaleNotes, actor = 'Security Analyst') {
        const f = this.findings.find((x) => x.id === id);
        if (!f)
            return undefined;
        const calc = (0, cvssCalculator_js_1.calculateCVSS31)(metrics);
        f.cvss = {
            version: '3.1',
            ...metrics,
            score: calc.score,
            vector: calc.vector,
            source: 'ANALYST',
        };
        f.severity = calc.severity;
        this.logAudit(actor, 'ANALYST', 'CVSS_SCORE_MODIFIED', 'FINDING', f.id, `Updated CVSS to ${calc.score} (${calc.severity}). Vector: ${calc.vector}${rationaleNotes ? ` Notes: ${rationaleNotes}` : ''}`);
        this.emit('finding:updated', f);
        return f;
    }
    updateFinding(id, partial) {
        const idx = this.findings.findIndex((f) => f.id === id);
        if (idx === -1)
            return undefined;
        this.findings[idx] = { ...this.findings[idx], ...partial };
        this.emit('finding:updated', this.findings[idx]);
        return this.findings[idx];
    }
    // ASSETS
    getAssets(targetId) {
        if (targetId) {
            return this.assets.filter((a) => a.targetId === targetId);
        }
        return this.assets;
    }
    addAsset(asset) {
        this.assets.push(asset);
        this.emit('asset:created', asset);
        return asset;
    }
    // CHECKS / PLUGINS
    getChecks() {
        return this.checks;
    }
    toggleCheck(id, enabled) {
        const check = this.checks.find((c) => c.id === id);
        if (check) {
            check.enabled = enabled;
            this.emit('check:updated', check);
        }
        return check;
    }
    // PREFLIGHT CHECKS
    getPreflightChecks() {
        return this.preflightChecks;
    }
    // AUDIT LOGS
    getAuditLogs() {
        return this.auditLogs;
    }
    logAudit(actor, role, action, entityType, entityId, details, ipAddress = '127.0.0.1') {
        const lastEntry = this.auditLogs[this.auditLogs.length - 1];
        const newEntry = (0, hashChain_js_1.createAuditEntry)(actor, role, action, entityType, entityId, details, lastEntry, ipAddress);
        this.auditLogs.push(newEntry);
        this.emit('audit:new', newEntry);
        return newEntry;
    }
    // CANARY FIX CONTROLS
    getCanaryFixStatus() {
        return this.isCanaryFixEnabled;
    }
    toggleCanaryFix() {
        this.isCanaryFixEnabled = !this.isCanaryFixEnabled;
        this.logAudit('Lead Analyst', 'APPSEC', 'CANARY_FIX_TOGGLE', 'TARGET', 'TGT-CANARY-001', `Toggled Canary vulnerable state. New state: ${this.isCanaryFixEnabled ? 'PATCH_APPLIED (Safe)' : 'VULNERABLE (Flaw active)'}`);
        this.emit('canary:toggled', this.isCanaryFixEnabled);
        return this.isCanaryFixEnabled;
    }
    // TELEMETRY
    getTelemetry() {
        return this.liveTelemetry;
    }
    updateTelemetry(partial) {
        this.liveTelemetry = { ...this.liveTelemetry, ...partial };
        this.emit('telemetry:updated', this.liveTelemetry);
    }
    addLog(line) {
        this.liveTelemetry.logs.push(line);
        if (this.liveTelemetry.logs.length > 100) {
            this.liveTelemetry.logs.shift();
        }
        this.emit('telemetry:log', line);
    }
    // SETTINGS
    getSettings() {
        return this.settings;
    }
    updateSettings(partial) {
        this.settings = { ...this.settings, ...partial };
        this.emit('settings:updated', this.settings);
        return this.settings;
    }
}
exports.MemoryStore = MemoryStore;
exports.store = new MemoryStore();
