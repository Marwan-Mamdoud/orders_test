import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startServer } from './server';

describe('startServer', () => {
  let mongoServer: MongoMemoryServer;
  let server: http.Server;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoServer.getUri();
    process.env.PORT = '0'; // let OS assign a free port
    server = await startServer();
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await mongoServer.stop();
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('starts the server and responds on /health', async () => {
    const address = server.address();
    const port = typeof address === 'string' ? 0 : address!.port;
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});
