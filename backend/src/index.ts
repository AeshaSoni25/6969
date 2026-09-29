import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routers
import assessmentsRouter from './routes/assessments.js';
import findingsRouter from './routes/findings.js';
import assetsRouter from './routes/assets.js';
import scopeRouter from './routes/scope.js';
import pluginsRouter from './routes/plugins.js';
import canaryRouter from './routes/canary.js';
import aiRouter from './routes/ai.js';
import reportsRouter from './routes/reports.js';
import auditLogsRouter from './routes/auditLogs.js';
import settingsRouter from './routes/settings.js';
import eventsRouter from './routes/events.js';
import mockTargetRouter from './target/mockWorldMonitor.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
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
app.use('/api/assessments', assessmentsRouter);
app.use('/api/findings', findingsRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/scope', scopeRouter);
app.use('/api/plugins', pluginsRouter);
app.use('/api/canary', canaryRouter);
app.use('/api/ai', aiRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/events', eventsRouter);

// Simulated Target Application
app.use('/target', mockTargetRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
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
