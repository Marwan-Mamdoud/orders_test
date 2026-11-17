import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('App routes', () => {
  it('returns ok from health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
