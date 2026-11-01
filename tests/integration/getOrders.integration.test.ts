import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { startTestDb, stopTestDb, clearTestDb } from './db';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('GET /orders', () => {
  it('returns empty list initially', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it('returns created orders', async () => {
    await request(app).post('/orders').send({
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'A', quantity: 1, price: 1 }],
    });
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('filters by status', async () => {
    await request(app).post('/orders').send({
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'A', quantity: 1, price: 1 }],
    });
    await request(app).post('/orders').send({
      status: 'shipped',
      courier: 'FedEx',
      products: [{ name: 'B', quantity: 1, price: 1 }],
    });
    const res = await request(app).get('/orders?status=shipped');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe('shipped');
  });

  it('filters by courier', async () => {
    await request(app).post('/orders').send({
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'A', quantity: 1, price: 1 }],
    });
    await request(app).post('/orders').send({
      status: 'pending',
      courier: 'FedEx',
      products: [{ name: 'B', quantity: 1, price: 1 }],
    });
    const res = await request(app).get('/orders?courier=FedEx');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].courier).toBe('FedEx');
  });

  it('filters by date range', async () => {
    await request(app).post('/orders').send({
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'A', quantity: 1, price: 1 }],
    });
    const now = new Date();
    const start = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    const res = await request(app).get(
      `/orders?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`
    );
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('returns 400 for unknown status', async () => {
    const res = await request(app).get('/orders?status=definitely-unknown-status');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for unknown courier', async () => {
    const res = await request(app).get('/orders?courier=definitely-unknown-courier');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
