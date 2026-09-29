# SecureMon / AegisLens — Security Assessment Backend

RESTful backend service for **SecureMon / AegisLens** (AI-Assisted Automated Security Assessment & Vulnerability Intelligence Platform, SIH 2026 Problem Statement SIH26163 — NTRO).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Server starts on `http://localhost:4000`.

### 3. Build & Production Run
```bash
npm run build
npm start
```

---

## 📡 API Endpoints Reference

### Health & Diagnostics
- `GET /api/health` — Service health, uptime, and endpoint directory.

### Security Assessments (`/api/assessments`)
- `GET /api/assessments` — List all assessments.
- `GET /api/assessments/current` — Get active assessment details.
- `GET /api/assessments/:id` — Get single assessment by ID.
- `POST /api/assessments` — Create new assessment (with automated RFC1918 loopback check and production domain ban).
- `POST /api/assessments/:id/select` — Set active assessment.
- `POST /api/assessments/:id/start` — Start asynchronous security assessment DAG run.
- `POST /api/assessments/:id/pause` — Pause assessment DAG worker queue.
- `POST /api/assessments/:id/kill-switch` — Emergency abort all workers and drop traffic.
- `GET /api/assessments/:id/telemetry` — Live phase, progress %, and telemetry metrics.

### Findings & Triage (`/api/findings`)
- `GET /api/findings` — Query findings with optional filters (`assessmentId`, `severity`, `status`).
- `GET /api/findings/:id` — Full finding dossier with technical evidence, reproduction steps, CIA impact, and recommendations.
- `PATCH /api/findings/:id` — Update status (`VERIFIED`, `IN_REMEDIATION`, `FIXED`, `REOPENED`), assignee, due date, tags.
- `POST /api/findings/:id/cvss` — Recalculate CVSS 3.1 score and vector from metric dimensions.
- `POST /api/findings/:id/validate` — Execute safe, non-destructive proof-of-concept (PoC) recipe and generate hashed SHA-256 evidence.
- `POST /api/findings/:id/retest` — Execute closed-loop deterministic retest against target/canary.

### Discovered Assets & Attack Surface (`/api/assets`)
- `GET /api/assets` — Discovered endpoints, pages, forms, scripts, storage keys, and websocket channels.
- `GET /api/assets/topology` — Multi-tier network topology graph (CDN ➔ Gateway ➔ Services ➔ Datastore).
- `POST /api/assets` — Register newly discovered asset.

### Perimeter Scope & Pre-Flight (`/api/scope`)
- `GET /api/scope/preflight` — Execute 8 preflight safety checks (loopback, DNS, production block, admin nonce).
- `POST /api/scope/verify-nonce` — Verify target authorization nonce header.
- `GET /api/scope/rules` — Retrieve in-scope vs excluded path boundaries.

### Security Check Plugins (`/api/plugins`)
- `GET /api/plugins` — Catalog of 14 security check plugins across 7 scope areas.
- `POST /api/plugins/:id/toggle` — Enable or disable a check plugin.
- `POST /api/plugins/:id/run` — Execute standalone check against target.

### Canary Target Controls (`/api/canary`)
- `GET /api/canary/status` — Get target canary patch state (`isCanaryFixEnabled: boolean`).
- `POST /api/canary/toggle` — Toggle canary target between VULNERABLE and PATCHED states for live retest demonstrations.

### Grounded AI Vulnerability Intelligence (`/api/ai`)
- `POST /api/ai/analyze` — Generate 3-part grounded synthesis (Plain Language, Code Patch Diff, Executive Brief).
- `POST /api/ai/chat` — Context-aware AI security copilot chat.
- `POST /api/ai/approve` — Formally sign off on AI text for inclusion in executive reports.

### Executive Reports (`/api/reports`)
- `GET /api/reports/:id` — Executive security scorecard with cryptographic SHA-256 seal.
- `GET /api/reports/:id/export` — Download full assessment report JSON.

### Merkle Hash Chain Auditing (`/api/audit-logs`)
- `GET /api/audit-logs` — Immutable audit log trail with parent SHA-256 hash chaining.
- `POST /api/audit-logs/verify` — Cryptographically traverses and validates every block from Genesis to Head.
- `POST /api/audit-logs` — Record new audit event.

### Platform Configuration (`/api/settings`)
- `GET /api/settings` — AI Gateway settings, guardrails, and SLA remediation timelines.
- `PUT /api/settings` — Update configuration.

### Live Telemetry Streaming (`/api/events`)
- `GET /api/events` — Server-Sent Events (SSE) stream broadcasting live DAG updates, signals, and audit logs.

### Embedded Canary Target (`/target/...`)
- `GET /target/health` — Canary service health check.
- `GET /target/api/v1/alerts/export` — Vulnerable BOLA endpoint (responds with 200 when unpatched, 403 when patch enabled).
- `GET /target/api/v1/user/profile` — CORS reflection test endpoint.
- `GET /target/metrics` — Metrics exposure test endpoint.
