# AegisLens Frontend — AI-Assisted Security Assessment Platform
**SIH 2026 · Problem Statement SIH26163 · NTRO**
*Target Application Under Assessment: World Monitor (https://worldmonitor.app)*

---

## 🌟 Executive Overview
AegisLens is a centralized, safe-by-design AppSec assessment platform built around authorized security testing. It orchestrates non-destructive checks across the 7 mandatory scope areas, safely validates flaws in an isolated sandbox, captures tamper-evident hashed evidence, calculates explainable CVSS 3.1 scores, formulates grounded AI explanations, tracks remediation, and executes closed-loop automated retesting with before/after diffs.

---

## 🚀 Tech Stack & Design System
- **Core Framework**: React 18 / 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Tailwind v4), Glassmorphism, Custom Cybersecurity Dark Aesthetic
- **Data Visualization**: Recharts (Risk Trend Lines, Severity Donut, OWASP Top 10 Bars)
- **Icons**: Lucide React
- **Typography**: Inter (Body) & JetBrains Mono (Code/Vectors/Hashes)

---

## 🛡️ Implemented Core Screens & Modules (PRD v1.0)

| Module / Screen | PRD Ref | Capabilities Implemented |
|---|---|---|
| **Top Navigation & RBAC** | §3, §12 | Org selector, Assessment dropdown (`ASM-001` vs `ASM-CANARY`), ⌘K command palette, Role Switcher (Analyst, AppSec, Admin, Developer, Manager, Exec), Emergency Kill-Switch. |
| **Security Posture Dashboard** | §12, §35 | Score gauge (61/100, +9 delta), 6 KPI cards (Critical, High, Medium, Low, Info, Active Flaws), Historical Risk Trend line chart, Severity donut chart, OWASP distribution bar chart, Architecture layers, Recent Findings table, Prioritized Recommended Actions, and Executive View toggle. |
| **Create Assessment Wizard** | §13 (Screen 4) | 4-step wizard: Basics -> Target & Safety Gate (with **strict production blocking alert** that prohibits testing live production domains) -> Scope Whitelist/Blacklist & Rate Limits -> Review & Pre-flight. |
| **Scope & Authorization Gate** | §13 (Screen 6) | Enforces digital ownership proofs (`/.well-known/aegislens-authorization.txt`), Scope Manifest SHA-256 hash badge, method whitelist (GET/HEAD only), and 5 automated Pre-flight compliance checks. |
| **Live Orchestration & Telemetry** | §13 (Screen 8) | Real-time DAG check execution stream, 6 pipeline phases (Discovery -> Checks -> Rule Engine -> Sandbox Validation -> AI Intelligence -> Complete), live auto-scrolling log console, worker telemetry, and Emergency Kill-Switch. |
| **Discovered Asset Inventory** | §13 (Screen 7) | Indexed assets (Pages, Endpoints, Cookies, WebSocket channels, Scripts), auth requirements, criticality tags, tech fingerprints, and direct links to findings. |
| **Findings Triage & Noise Reduction** | §13 (Screen 9) | Multi-filtering (Severity, Category, Status, OWASP), search bar, and prominent **Correlation & Deduplication Banner** ("40 missing CSP alerts consolidated into 1 root-cause finding"). |
| **Finding Details Modal** | §14 | Complete 2-column layout: Description, Why it matters (plain language), Bounded AI Explanation with Audience switcher (Analyst, Dev, Exec) and Grounding Facts panel, Masked HTTP Request/Response split, Step-by-step reproduction recipe, Business impact with CIA dimensions, Root cause analysis, Developer Code Patch diff with copy button, and interactive CVSS card. |
| **Safe Sandbox Proof-of-Concept** | §11 | Interactive non-destructive sandbox runner (e.g. `VAL-AUTHZ-001`, `VAL-SESS-001`), live execution telemetry, assertion confirmation, and SHA-256 evidence integrity hashing. |
| **Explainable CVSS 3.1 Calculator** | §9, §13 (Screen 12) | Complete FIRST/NVD deterministic calculator with 8 metric selectors (AV, AC, PR, UI, S, C, I, A), live score computation, vector string, exploitability/impact breakdown, plain-English rationale generator, and "Apply to Finding" capability. |
| **Business Risk Heatmap** | §9.4, §13 (Screen 13) | Interactive 5x5 Likelihood (1–5) × Impact (1–5) matrix with interactive finding bubbles. |
| **AI Analyst Assistant** | §10, §13 (Screen 14) | Bounded AI assistant with 4 tabs: Plain-Language Narrative, Target-Specific Developer Code Patch, Executive Risk Brief, and Finding-Scoped Q&A chat. |
| **Remediation Board (Kanban & Table)** | §13 (Screen 15) | Kanban board across 5 lifecycle stages (To Fix, In Progress, Fix Applied, Retest Pending, Done) with SLA countdown timers. |
| **Closed-Loop Retesting Center** | §13 (Screen 16) | Validation replay engine with Before vs After diff inspector. Includes interactive **Canary Target Patch State Toggle (`FIX_ENABLED=0/1`)** for live SIH demonstration! |
| **Executive & Technical Reports** | §15, §13 (Screen 17) | 17-section report previewer with cover page, executive summary, posture metrics, detailed finding catalog, evidence hashes, and one-click PDF printing. |
| **Tamper-Evident Audit Trail** | §13 (Screen 19) | Append-only audit log with SHA-256 cryptographic hash chains (`prev_hash` -> `sha256Hash`) and integrity status badge. |
| **Settings & Plugins Library** | §13 (Screen 20) | Management of 14 security check plugins, bounded AI hyperparameters, and non-root sandbox execution profiles. |

---

## 🏃 Quick Start

### 1. Development Mode
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Production Build
```bash
npm run build
npm run preview
```

---

## 🎯 8–10 Minute SIH Demonstration Flow (Section 23)

1. **Problem Framing (0:00 - 0:30)**: Point out alert noise and lack of proof in traditional scanning tools.
2. **Login & RBAC Persona Switcher (0:30 - 0:50)**: Use the top-right persona switcher to demonstrate RBAC (Security Analyst vs Developer vs Executive).
3. **Target Registration & Production Safety Gate (0:50 - 2:00)**: Click "New Project", try typing a production URL or selecting `PRODUCTION` environment. Show judges the immediate blocking alert preventing unauthorized testing.
4. **Scope & Pre-flight Checklist (2:00 - 2:40)**: Open "Scope & Authorization", click "Test Pre-flight", and show the 5 green compliance gates (IP pinning, Nonce proof, GuardedHttpClient).
5. **Live Orchestration (2:40 - 3:20)**: Go to "Live Orchestration", click "Run Assessment", and observe the real-time DAG phases and streaming worker logs.
6. **Correlation & Noise Reduction (3:20 - 4:30)**: Go to "Vulnerabilities", show the noise reduction banner ("40 missing CSP alerts -> 1 root cause finding").
7. **Finding Deep Dive & Proof (4:30 - 5:30)**: Click on `FND-0001` (Protected Export API accessible without authentication). Show:
   - Plain-language "Why it matters"
   - Masked HTTP Request / Response split with SHA-256 evidence hash
   - Safe reproduction recipe
8. **Bounded AI Layer (5:30 - 6:00)**: Toggle between **Analyst**, **Developer**, and **Executive** audience views. Highlight the "Facts Used" grounding panel and click "Approve for Report".
9. **Explainable CVSS (6:00 - 6:30)**: Open "CVSS 3.1 Engine", show the 8 metrics, live vector, and explainable rationale ("PR=None because request succeeded without Authorization header").
10. **Remediation & Closed-Loop Retest (6:30 - 8:10)**:
    - Open "Retesting Center".
    - Execute Retest while Canary is vulnerable: observe `STILL_VULNERABLE` (red diff).
    - Toggle **Canary Fix State (`FIX_ENABLED=1`)** in the sidebar.
    - Click "Run Automated Retest": observe transition to green `FIXED` with before/after diff!
11. **Executive Report & Export (8:10 - 9:00)**: Open "Executive Reports", preview the formatted 17-section report, and click "Export PDF / Print".
