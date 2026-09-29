import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { aiService } from '../services/aiService.js';

const router = Router();

// POST /api/ai/analyze - Generate grounded 3-part intelligence for a finding
router.post('/analyze', (req: Request, res: Response) => {
  const { findingId } = req.body;
  const finding = store.getFinding(findingId);

  if (!finding) {
    return res.status(404).json({ success: false, error: 'Finding not found' });
  }

  const analysis = aiService.generateFindingAnalysis(finding);
  store.updateFinding(finding.id, { ai: analysis });

  res.json({
    success: true,
    data: analysis,
  });
});

// POST /api/ai/chat - Interactive security assistant copilot
router.post('/chat', (req: Request, res: Response) => {
  const { message, findingId } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, error: 'Message cannot be empty' });
  }

  const finding = findingId ? store.getFinding(findingId) : undefined;
  const reply = aiService.chatResponse(message, finding);

  res.json({
    success: true,
    reply,
    groundedInFinding: finding?.id || null,
    model: 'gemini-1.5-pro-security-tuned',
    timestamp: new Date().toISOString(),
  });
});

// POST /api/ai/approve - Formally approve AI text for inclusion in report
router.post('/approve', (req: Request, res: Response) => {
  const { findingId, approverName } = req.body;
  const finding = store.getFinding(findingId);

  if (!finding || !finding.ai) {
    return res.status(404).json({ success: false, error: 'Finding or AI analysis not found' });
  }

  finding.ai.approved = true;
  finding.ai.approvedBy = approverName || 'Lead AppSec Analyst';

  store.logAudit(
    finding.ai.approvedBy || approverName || 'Lead AppSec Analyst',
    'APPSEC',
    'AI_ANALYSIS_APPROVED',
    'FINDING',
    finding.id,
    `Analyst reviewed and approved AI explanation for ${finding.id}.`
  );

  res.json({
    success: true,
    message: 'AI analysis verified and approved for executive report inclusion.',
    data: finding.ai,
  });
});

export default router;
