import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/events - Server-Sent Events (SSE) telemetry stream
router.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial snapshot
  const initialPayload = JSON.stringify({
    type: 'SNAPSHOT',
    telemetry: store.getTelemetry(),
    currentAssessment: store.getCurrentAssessment(),
  });
  res.write(`data: ${initialPayload}\n\n`);

  // Event listeners
  const onTelemetry = (telemetry: any) => {
    res.write(`data: ${JSON.stringify({ type: 'TELEMETRY_UPDATE', data: telemetry })}\n\n`);
  };

  const onLog = (line: string) => {
    res.write(`data: ${JSON.stringify({ type: 'NEW_LOG', data: line })}\n\n`);
  };

  const onFinding = (finding: any) => {
    res.write(`data: ${JSON.stringify({ type: 'FINDING_UPDATED', data: finding })}\n\n`);
  };

  const onAudit = (entry: any) => {
    res.write(`data: ${JSON.stringify({ type: 'AUDIT_ENTRY', data: entry })}\n\n`);
  };

  store.on('telemetry:updated', onTelemetry);
  store.on('telemetry:log', onLog);
  store.on('finding:updated', onFinding);
  store.on('audit:new', onAudit);

  // Clean up on client disconnect
  req.on('close', () => {
    store.off('telemetry:updated', onTelemetry);
    store.off('telemetry:log', onLog);
    store.off('finding:updated', onFinding);
    store.off('audit:new', onAudit);
  });
});

export default router;
