import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { orderRepository } from './order.repository';
import { Order } from '../models/order.model';
import { startTestDb, stopTestDb, clearTestDb } from '../../../../tests/support/db';
import { buildOrderPayload } from '../../../../tests/factories/order';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('orderRepository.create', () => {
  it('creates and persists an order', async () => {
    const data = buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 2, price: 5 }] });
    const created = await orderRepository.create(data);

    expect(created.status).toBe('pending');
    expect(created.courier).toBe('DHL');
    expect(created.total).toBe(10);

    const found = await Order.findById(created._id);
    expect(found).not.toBeNull();
    expect(found!.status).toBe('pending');
  });

  it('uses provided total when present', async () => {
    const data = { ...buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }), total: 99 };
    const created = await orderRepository.create(data);
    expect(created.total).toBe(99);
  });
});
