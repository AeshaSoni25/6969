import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/settings - Get platform configuration
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: store.getSettings(),
  });
});

// PUT /api/settings - Update platform configuration
router.put('/', (req: Request, res: Response) => {
  const updated = store.updateSettings(req.body);

  store.logAudit(
    'Admin User',
    'ADMIN',
    'SETTINGS_UPDATE',
    'PLATFORM',
    'CONFIG',
    'Updated platform settings (AI Gateway, Guardrails, or SLAs).'
  );

  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: updated,
  });
});

export default router;
