import 'dotenv/config';
import { connectDB } from './db';
import app from './app';

export async function startServer() {
  await connectDB();
  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down gracefully...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
