import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { createOrder } from './order.controller';
import { mockRes } from '../../../../tests/helpers/mockRes';
import { mockReq } from '../../../../tests/helpers/mockReq';
import { startTestDb, stopTestDb, clearTestDb } from '../../../../tests/support/db';
import { buildOrderPayload } from '../../../../tests/factories/order';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('createOrder controller', () => {
  it('returns 201 with created order', async () => {
    const req = mockReq({
      body: buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'Widget', quantity: 2, price: 5 }] }),
    });
    const res = mockRes();
    let error: any;
    const next = (err: any) => { error = err; };

    await createOrder(req, res, next);

    expect(error).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'pending', total: 10 }));
  });

  it('forwards validation errors to next', async () => {
    const req = mockReq({
      body: buildOrderPayload({ status: 'nope', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }),
    });
    const res = mockRes();
    let error: any;
    const next = (err: any) => { error = err; };

    await createOrder(req, res, next);

    expect(error).toBeDefined();
    expect(error.message).toMatch(/unknown status/i);
  });

  it('forwards empty-products error to next', async () => {
    const req = mockReq({
      body: buildOrderPayload({ status: 'pending', courier: 'DHL', products: [] }),
    });
    const res = mockRes();
    let error: any;
    const next = (err: any) => { error = err; };

    await createOrder(req, res, next);

    expect(error).toBeDefined();
    expect(error.message).toMatch(/products must contain/i);
  });
});
