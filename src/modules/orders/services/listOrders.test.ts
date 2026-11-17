import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { listOrders } from './order.service';
import { createOrder } from './order.service';
import { startTestDb, stopTestDb, clearTestDb } from '../../../../tests/support/db';
import { buildOrderPayload } from '../../../../tests/factories/order';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('listOrders', () => {
  it('lists with no filters', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    const result = await listOrders();
    expect(result).toHaveLength(1);
  });

  it('filters by status', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await createOrder(buildOrderPayload({ status: 'shipped', courier: 'DHL', products: [{ name: 'B', quantity: 1, price: 1 }] }));
    const result = await listOrders({ status: 'shipped' });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('shipped');
  });

  it('filters by courier', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'FedEx', products: [{ name: 'B', quantity: 1, price: 1 }] }));
    const result = await listOrders({ courier: 'FedEx' });
    expect(result).toHaveLength(1);
    expect(result[0].courier).toBe('FedEx');
  });

  it('filters by date range', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    const now = new Date();
    const start = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    const result = await listOrders({ startDate: start, endDate: end });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('throws on unknown status', async () => {
    await expect(listOrders({ status: 'unknown-status' })).rejects.toThrow(/unknown/i);
  });

  it('throws on unknown courier', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await expect(listOrders({ courier: 'unknown-courier' })).rejects.toThrow(/unknown/i);
  });

  it('throws when status exists but has no matches', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await expect(listOrders({ status: 'cancelled' })).rejects.toThrow(/unknown/i);
  });

  it('throws when courier exists but has no matches', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await expect(listOrders({ courier: 'UPS' })).rejects.toThrow(/unknown/i);
  });

  it('filters by combined status and courier', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'FedEx', products: [{ name: 'B', quantity: 1, price: 1 }] }));
    await createOrder(buildOrderPayload({ status: 'shipped', courier: 'DHL', products: [{ name: 'C', quantity: 1, price: 1 }] }));
    const result = await listOrders({ status: 'pending', courier: 'DHL' });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('pending');
    expect(result[0].courier).toBe('DHL');
  });

  it('filters by start date only', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    const now = new Date();
    const start = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const result = await listOrders({ startDate: start });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

});
