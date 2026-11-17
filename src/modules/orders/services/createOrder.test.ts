import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { createOrder } from './order.service';
import { Order } from '../models/order.model';
import { startTestDb, stopTestDb, clearTestDb } from '../../../../tests/support/db';
import { buildOrderPayload } from '../../../../tests/factories/order';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('createOrder', () => {
  it('creates an order and computes total', async () => {
    const input = buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'Widget', quantity: 2, price: 5 }] });
    const created = await createOrder(input);

    expect(created.status).toBe('pending');
    expect(created.total).toBe(10);
    expect((await Order.find()).length).toBe(1);
  });

  it('throws on missing data', async () => {
    await expect(createOrder(null as any)).rejects.toThrow(/required/i);
    await expect(createOrder(undefined as any)).rejects.toThrow(/required/i);
  });

  it('throws on invalid status', async () => {
    const input = buildOrderPayload({ status: 'nope', courier: 'DHL', products: [{ name: 'Widget', quantity: 1, price: 1 }] });
    await expect(createOrder(input)).rejects.toThrow(/unknown status/i);
    expect((await Order.find()).length).toBe(0);
  });

  it('throws on missing courier', async () => {
    const input = buildOrderPayload({ status: 'pending', courier: '', products: [{ name: 'Widget', quantity: 1, price: 1 }] });
    await expect(createOrder(input)).rejects.toThrow(/courier/i);
    expect((await Order.find()).length).toBe(0);
  });

  it('throws on invalid product', async () => {
    const input = buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'Widget', quantity: 0, price: 1 }] });
    await expect(createOrder(input)).rejects.toThrow(/quantity/i);
    expect((await Order.find()).length).toBe(0);
  });

  it('computes total for multiple products', async () => {
    const input = buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 2, price: 5 }, { name: 'B', quantity: 1, price: 3 }] });
    const created = await createOrder(input);
    expect(created.total).toBe(13);
  });

  it('throws on empty products', async () => {
    const input = buildOrderPayload({ status: 'pending', courier: 'DHL', products: [] });
    await expect(createOrder(input)).rejects.toThrow(/products must contain/i);
  });

  it('throws when products is not an array', async () => {
    const input = buildOrderPayload({ status: 'pending', courier: 'DHL', products: 'not-array' as any });
    await expect(createOrder(input)).rejects.toThrow(/products must contain/i);
  });

  it('overwrites provided total with computed total', async () => {
    const input = { ...buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 2, price: 5 }] }), total: 999 };
    const created = await createOrder(input);
    expect(created.total).toBe(10);
  });

});
