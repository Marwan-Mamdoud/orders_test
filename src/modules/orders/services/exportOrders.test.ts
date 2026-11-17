import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { exportOrders, listOrders, createOrder } from './order.service';
import { startTestDb, stopTestDb, clearTestDb } from '../../../../tests/support/db';
import { buildOrderPayload } from '../../../../tests/factories/order';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('exportOrders', () => {
  it('throws when no filters provided', async () => {
    await expect(exportOrders({})).rejects.toThrow(/filter/i);
  });

  it('uses same filter as listOrders', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    const exported = await exportOrders({ status: 'pending' });
    expect(exported).toHaveLength(1);
    expect(exported[0].status).toBe('pending');
  });

  it('throws on unknown status', async () => {
    await expect(exportOrders({ status: 'unknown-status' })).rejects.toThrow(/unknown/i);
  });

  it('parity with listOrders for identical filters', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    const filters = { status: 'pending' };
    const a = await listOrders(filters);
    const b = await exportOrders(filters);
    expect(a).toEqual(b);
  });

  it('exports by start date only', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    const now = new Date();
    const start = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const exported = await exportOrders({ startDate: start });
    expect(exported.length).toBeGreaterThanOrEqual(1);
  });

  it('throws when status exists but has no matches', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await expect(exportOrders({ status: 'cancelled' })).rejects.toThrow(/unknown/i);
  });

  it('throws when courier exists but has no matches', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await expect(exportOrders({ courier: 'UPS' })).rejects.toThrow(/unknown/i);
  });

  it('throws on unknown courier', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await expect(exportOrders({ courier: 'unknown-courier' })).rejects.toThrow(/unknown/i);
  });

  it('exports by combined filters', async () => {
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await createOrder(buildOrderPayload({ status: 'pending', courier: 'FedEx', products: [{ name: 'B', quantity: 1, price: 1 }] }));
    const exported = await exportOrders({ status: 'pending', courier: 'DHL' });
    expect(exported).toHaveLength(1);
    expect(exported[0].courier).toBe('DHL');
  });

});
