import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { startTestDb, stopTestDb, clearTestDb } from './db';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('POST /orders/export', () => {
  it('returns 400 when no filters provided', async () => {
    const res = await request(app).post('/orders/export').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns same orders as list for identical filters', async () => {
    await request(app).post('/orders').send({
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'A', quantity: 1, price: 1 }],
    });

    const listRes = await request(app).get('/orders?status=pending');
    const exportRes = await request(app).post('/orders/export').send({ status: 'pending' });

    expect(listRes.status).toBe(200);
    expect(exportRes.status).toBe(200);
    expect(exportRes.body).toEqual(listRes.body);
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

    const res = await request(app).post('/orders/export').send({ courier: 'FedEx' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].courier).toBe('FedEx');
  });

  it('returns 400 for unknown status', async () => {
    const res = await request(app).post('/orders/export').send({ status: 'definitely-unknown-status' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
