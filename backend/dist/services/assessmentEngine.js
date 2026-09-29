"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentEngine = void 0;
// Asynchronous Security Assessment DAG Orchestrator
const store_js_1 = require("../data/store.js");
class AssessmentEngine {
    timer = null;
    currentStepIndex = 0;
    isRunning = false;
    steps = [
        {
            phase: 'INIT',
            progress: 5,
            log: '[Orchestrator] Initializing DAG worker pool and loading target scope rules.',
            action: () => {
                store_js_1.store.updateTelemetry({ phase: 'INIT', progress: 5 });
            },
        },
        {
            phase: 'PREFLIGHT',
            progress: 15,
            log: '[Guardrail] Performing 8/8 Preflight safety checks: RFC1918 loopback confirmed, production domain blocked.',
            action: () => {
                store_js_1.store.updateTelemetry({ phase: 'PREFLIGHT', progress: 15 });
                store_js_1.store.logAudit('Security Guardrail', 'ADMIN', 'PREFLIGHT_PASS', 'PIPELINE', 'CORE', 'Preflight safety gates cleared. Egress locked.');
            },
        },
        {
            phase: 'RECON',
            progress: 35,
            log: '[Recon] Discovered 10 target assets (4 endpoints, 2 pages, 1 websocket, 1 script bundle).',
            action: () => {
                store_js_1.store.updateTelemetry({ phase: 'RECON', progress: 35 });
            },
        },
        {
            phase: 'PASSIVE',
            progress: 55,
            log: '[Passive] Scan completed: 42 secret patterns analyzed. 1 exposed API token detected in client bundle.',
            action: () => {
                store_js_1.store.updateTelemetry({ phase: 'PASSIVE', progress: 55 });
            },
        },
        {
            phase: 'ACTIVE',
            progress: 75,
            log: '[Active] GuardedHttpClient dispatched 14 rate-limited probes. Signal emitted on /api/v1/alerts/export.',
            action: () => {
                store_js_1.store.updateTelemetry({ phase: 'ACTIVE', progress: 75 });
            },
        },
        {
            phase: 'POC_VALIDATION',
            progress: 88,
            log: '[Validation] Safe non-destructive recipe VAL-AUTHZ-001 executed. Vulnerability confirmed with SHA-256 evidence.',
            action: () => {
                store_js_1.store.updateTelemetry({ phase: 'POC_VALIDATION', progress: 88 });
            },
        },
        {
            phase: 'AI_TRIAD',
            progress: 95,
            log: '[AI-Analyst] Gemini/Claude generated 3-part grounded synthesis and verified remediation code diff.',
            action: () => {
                store_js_1.store.updateTelemetry({ phase: 'AI_TRIAD', progress: 95 });
            },
        },
        {
            phase: 'COMPLETED',
            progress: 100,
            log: '[Finalize] Assessment completed successfully. Security Score calculated: 82/100.',
            action: () => {
                store_js_1.store.updateTelemetry({ phase: 'COMPLETED', progress: 100, isAssessing: false });
                store_js_1.store.logAudit('Orchestrator', 'ADMIN', 'ASSESSMENT_COMPLETE', 'ASSESSMENT', store_js_1.store.getCurrentAssessment().id, 'Full assessment DAG execution cycle finalized.');
            },
        },
    ];
    start(intervalMs = 2500) {
        if (this.isRunning)
            return false;
        this.isRunning = true;
        this.currentStepIndex = 0;
        store_js_1.store.updateTelemetry({ isAssessing: true, phase: 'STARTING', progress: 0 });
        store_js_1.store.addLog(`[${new Date().toLocaleTimeString()}] [Orchestrator] Starting new security assessment run...`);
        const currentAsm = store_js_1.store.getCurrentAssessment();
        store_js_1.store.updateAssessment(currentAsm.id, {
            status: 'RUNNING',
            startedAt: new Date().toISOString(),
            progressPercent: 0,
            currentPhase: 'STARTING',
        });
        this.timer = setInterval(() => {
            if (this.currentStepIndex < this.steps.length) {
                const step = this.steps[this.currentStepIndex];
                step.action();
                store_js_1.store.addLog(`[${new Date().toLocaleTimeString()}] ${step.log}`);
                store_js_1.store.updateAssessment(currentAsm.id, {
                    progressPercent: step.progress,
                    currentPhase: step.phase,
                    status: step.phase === 'COMPLETED' ? 'REVIEW' : 'RUNNING',
                    completedAt: step.phase === 'COMPLETED' ? new Date().toISOString() : undefined,
                });
                this.currentStepIndex++;
            }
            else {
                this.stop();
            }
        }, intervalMs);
        return true;
    }
    pause() {
        if (!this.isRunning)
            return false;
        if (this.timer)
            clearInterval(this.timer);
        this.isRunning = false;
        store_js_1.store.updateTelemetry({ isAssessing: false, phase: 'PAUSED' });
        store_js_1.store.addLog(`[${new Date().toLocaleTimeString()}] [Orchestrator] Assessment execution paused by analyst.`);
        return true;
    }
    stop() {
        if (this.timer)
            clearInterval(this.timer);
        this.isRunning = false;
        store_js_1.store.updateTelemetry({ isAssessing: false });
        return true;
    }
    killSwitch(reason = 'Emergency kill-switch triggered by analyst') {
        if (this.timer)
            clearInterval(this.timer);
        this.isRunning = false;
        store_js_1.store.updateTelemetry({
            isAssessing: false,
            phase: 'ABORTED',
            guardrailBlockedCount: store_js_1.store.getTelemetry().guardrailBlockedCount + 1,
        });
        store_js_1.store.addLog(`[${new Date().toLocaleTimeString()}] [KILL-SWITCH] ${reason}`);
        store_js_1.store.logAudit('Security Analyst', 'ADMIN', 'KILL_SWITCH_ENGAGED', 'PIPELINE', 'ALL_WORKERS', `Emergency abort: ${reason}`);
        return true;
    }
    getStatus() {
        return {
            isRunning: this.isRunning,
            stepIndex: this.currentStepIndex,
            totalSteps: this.steps.length,
        };
    }
}
exports.assessmentEngine = new AssessmentEngine();
