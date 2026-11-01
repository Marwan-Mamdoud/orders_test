import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { startTestDb, stopTestDb, clearTestDb } from './db';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('POST /orders', () => {
  it('creates an order and computes total', async () => {
    const res = await request(app).post('/orders').send({
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'Widget', quantity: 2, price: 5 }],
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');
    expect(res.body.total).toBe(10);
  });

  it('returns 400 for invalid status', async () => {
    const res = await request(app).post('/orders').send({
      status: 'nope',
      courier: 'DHL',
      products: [{ name: 'Widget', quantity: 1, price: 1 }],
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for missing courier', async () => {
    const res = await request(app).post('/orders').send({
      status: 'pending',
      courier: '',
      products: [{ name: 'Widget', quantity: 1, price: 1 }],
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid product', async () => {
    const res = await request(app).post('/orders').send({
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'Widget', quantity: 0, price: 1 }],
    });
    expect(res.status).toBe(400);
  });
});
