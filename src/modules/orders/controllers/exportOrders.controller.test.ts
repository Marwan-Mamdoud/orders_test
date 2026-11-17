import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { exportOrders } from './order.controller';
import { createOrder as createOrderService } from '../services/order.service';
import { mockRes } from '../../../../tests/helpers/mockRes';
import { mockReq } from '../../../../tests/helpers/mockReq';
import { startTestDb, stopTestDb, clearTestDb } from '../../../../tests/support/db';
import { buildOrderPayload } from '../../../../tests/factories/order';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('exportOrders controller', () => {
  it('returns exported orders from body filters', async () => {
    await createOrderService(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    const req = mockReq({ body: buildOrderPayload({ status: 'pending' }), query: {} });
    const res = mockRes();
    let error: any;
    const next = (err: any) => { error = err; };

    await exportOrders(req, res, next);

    expect(error).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    const returned = res.json.mock.calls[0][0];
    expect(returned).toHaveLength(1);
    expect(returned[0].status).toBe('pending');
  });

  it('forwards empty-filters error to next', async () => {
    const req = mockReq({ body: {}, query: {} });
    const res = mockRes();
    let error: any;
    const next = (err: any) => { error = err; };

    await exportOrders(req, res, next);

    expect(error).toBeDefined();
    expect(error.message).toMatch(/filter/i);
  });

  it('forwards unknown-status error to next', async () => {
    const req = mockReq({ body: buildOrderPayload({ status: 'definitely-unknown-status' }), query: {} });
    const res = mockRes();
    let error: any;
    const next = (err: any) => { error = err; };

    await exportOrders(req, res, next);

    expect(error).toBeDefined();
    expect(error.message).toMatch(/unknown/i);
  });
});
