import {
  Assessment,
  Finding,
  DiscoveredAsset,
  SecurityCheckPlugin,
  PreflightCheckItem,
  AuditLogEntry,
  CVSSMetrics,
  FindingStatus,
} from '../types';

const API_BASE = '/api';

export const api = {
  // HEALTH
  async checkHealth(): Promise<{ status: string; uptime: number }> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // ASSESSMENTS
  async getAssessments(): Promise<{ success: boolean; data: Assessment[]; currentId: string }> {
    const res = await fetch(`${API_BASE}/assessments`);
    return res.json();
  },

  async getCurrentAssessment(): Promise<{ success: boolean; data: Assessment }> {
    const res = await fetch(`${API_BASE}/assessments/current`);
    return res.json();
  },

  async createAssessment(data: Partial<Assessment>): Promise<{ success: boolean; data: Assessment; message?: string }> {
    const res = await fetch(`${API_BASE}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async startAssessment(id: string): Promise<{ success: boolean; message: string; telemetry: any }> {
    const res = await fetch(`${API_BASE}/assessments/${id}/start`, { method: 'POST' });
    return res.json();
  },

  async pauseAssessment(id: string): Promise<{ success: boolean; message: string; telemetry: any }> {
    const res = await fetch(`${API_BASE}/assessments/${id}/pause`, { method: 'POST' });
    return res.json();
  },

  async killSwitch(id: string, reason: string): Promise<{ success: boolean; message: string; telemetry: any }> {
    const res = await fetch(`${API_BASE}/assessments/${id}/kill-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    return res.json();
  },

  async getTelemetry(id: string): Promise<{ success: boolean; data: any; engine: any }> {
    const res = await fetch(`${API_BASE}/assessments/${id}/telemetry`);
    return res.json();
  },

  // FINDINGS
  async getFindings(filters?: { assessmentId?: string; severity?: string; status?: string }): Promise<{ success: boolean; total: number; data: Finding[] }> {
    const query = new URLSearchParams();
    if (filters?.assessmentId) query.set('assessmentId', filters.assessmentId);
    if (filters?.severity) query.set('severity', filters.severity);
    if (filters?.status) query.set('status', filters.status);

    const res = await fetch(`${API_BASE}/findings?${query.toString()}`);
    return res.json();
  },

  async getFinding(id: string): Promise<{ success: boolean; data: Finding }> {
    const res = await fetch(`${API_BASE}/findings/${id}`);
    return res.json();
  },

  async updateFindingStatus(id: string, status: FindingStatus, reason?: string): Promise<{ success: boolean; data: Finding }> {
    const res = await fetch(`${API_BASE}/findings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason }),
    });
    return res.json();
  },

  async updateFindingCVSS(
    id: string,
    metrics: Omit<CVSSMetrics, 'version' | 'score' | 'vector'>,
    rationaleNotes?: string
  ): Promise<{ success: boolean; data: Finding; message?: string }> {
    const res = await fetch(`${API_BASE}/findings/${id}/cvss`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metrics, rationaleNotes }),
    });
    return res.json();
  },

  async validateFinding(id: string): Promise<{ success: boolean; result: string; evidenceId: string; steps: string[]; message: string }> {
    const res = await fetch(`${API_BASE}/findings/${id}/validate`, { method: 'POST' });
    return res.json();
  },

  async retestFinding(id: string): Promise<{ success: boolean; result: 'FIXED' | 'STILL_VULNERABLE'; diff: string; message: string }> {
    const res = await fetch(`${API_BASE}/findings/${id}/retest`, { method: 'POST' });
    return res.json();
  },

  // ASSETS & TOPOLOGY
  async getAssets(): Promise<{ success: boolean; total: number; data: DiscoveredAsset[] }> {
    const res = await fetch(`${API_BASE}/assets`);
    return res.json();
  },

  async getTopology(): Promise<{ success: boolean; data: { nodes: any[]; edges: any[]; summary: any } }> {
    const res = await fetch(`${API_BASE}/assets/topology`);
    return res.json();
  },

  // SCOPE & PREFLIGHT
  async getPreflight(): Promise<{ success: boolean; allPassed: boolean; data: PreflightCheckItem[] }> {
    const res = await fetch(`${API_BASE}/scope/preflight`);
    return res.json();
  },

  async verifyNonce(targetUrl: string, nonce: string): Promise<{ success: boolean; nonceVerified: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/scope/verify-nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl, nonce }),
    });
    return res.json();
  },

  // PLUGINS
  async getPlugins(): Promise<{ success: boolean; total: number; data: SecurityCheckPlugin[] }> {
    const res = await fetch(`${API_BASE}/plugins`);
    return res.json();
  },

  async togglePlugin(id: string, enabled: boolean): Promise<{ success: boolean; data: SecurityCheckPlugin }> {
    const res = await fetch(`${API_BASE}/plugins/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    return res.json();
  },

  async runPlugin(id: string): Promise<{ success: boolean; result: string; signalsCount: number; message: string }> {
    const res = await fetch(`${API_BASE}/plugins/${id}/run`, { method: 'POST' });
    return res.json();
  },

  // CANARY TARGET CONTROLS
  async getCanaryStatus(): Promise<{ success: boolean; isCanaryFixEnabled: boolean; targetState: string }> {
    const res = await fetch(`${API_BASE}/canary/status`);
    return res.json();
  },

  async toggleCanary(): Promise<{ success: boolean; isCanaryFixEnabled: boolean; targetState: string; message: string }> {
    const res = await fetch(`${API_BASE}/canary/toggle`, { method: 'POST' });
    return res.json();
  },

  // AI INTELLIGENCE
  async analyzeFindingAI(findingId: string): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ findingId }),
    });
    return res.json();
  },

  async chatAI(message: string, findingId?: string): Promise<{ success: boolean; reply: string; timestamp: string }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, findingId }),
    });
    return res.json();
  },

  async approveAIAnalysis(findingId: string, approverName?: string): Promise<{ success: boolean; data: any; message: string }> {
    const res = await fetch(`${API_BASE}/ai/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ findingId, approverName }),
    });
    return res.json();
  },

  // AUDIT LOGS & CRYPTO MERKLE VERIFICATION
  async getAuditLogs(): Promise<{ success: boolean; total: number; data: AuditLogEntry[] }> {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return res.json();
  },

  async verifyAuditChain(): Promise<{ success: boolean; data: { valid: boolean; totalEntries: number; genesisHash: string; headHash: string }; message: string }> {
    const res = await fetch(`${API_BASE}/audit-logs/verify`, { method: 'POST' });
    return res.json();
  },

  // SETTINGS
  async getSettings(): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(data: any): Promise<{ success: boolean; data: any; message: string }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
