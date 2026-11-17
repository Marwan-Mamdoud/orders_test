import express, { Request, Response, NextFunction } from 'express';
import { orderRoutes } from './modules/orders';

const app = express();

app.use(express.json({ limit: '1mb' }));

// Health check (no DB dependency, stays fast for probes)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Feature routes
app.use('/orders', orderRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Global error handler (Express requires 4 params)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (!err?.status) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  const status = typeof err?.status === 'number' ? err.status : 400;
  res.status(status).json({ error: err?.message || 'Internal server error' });
});

export default app;