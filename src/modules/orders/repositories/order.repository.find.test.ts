import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { orderRepository } from './order.repository';
import { startTestDb, stopTestDb, clearTestDb } from '../../../../tests/support/db';
import { buildOrderPayload } from '../../../../tests/factories/order';

beforeAll(startTestDb);
afterEach(clearTestDb);
afterAll(stopTestDb);

describe('orderRepository.find', () => {
  it('returns all orders when filter is empty', async () => {
    await orderRepository.create(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await orderRepository.create(buildOrderPayload({ status: 'shipped', courier: 'FedEx', products: [{ name: 'B', quantity: 1, price: 1 }] }));
    const result = await orderRepository.find({});
    expect(result).toHaveLength(2);
  });

  it('filters by status', async () => {
    await orderRepository.create(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await orderRepository.create(buildOrderPayload({ status: 'shipped', courier: 'DHL', products: [{ name: 'B', quantity: 1, price: 1 }] }));
    const result = await orderRepository.find({ status: 'shipped' });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('shipped');
  });

  it('filters by courier', async () => {
    await orderRepository.create(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await orderRepository.create(buildOrderPayload({ status: 'pending', courier: 'FedEx', products: [{ name: 'B', quantity: 1, price: 1 }] }));
    const result = await orderRepository.find({ courier: 'FedEx' });
    expect(result).toHaveLength(1);
    expect(result[0].courier).toBe('FedEx');
  });

  it('filters by date range', async () => {
    await orderRepository.create(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    const now = new Date();
    const start = new Date(now.getTime() - 60 * 60 * 1000);
    const end = new Date(now.getTime() + 60 * 60 * 1000);
    const result = await orderRepository.find({ createdAt: { $gte: start, $lte: end } });
    expect(result).toHaveLength(1);
  });

  it('filters by combined status and courier', async () => {
    await orderRepository.create(buildOrderPayload({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 1, price: 1 }] }));
    await orderRepository.create(buildOrderPayload({ status: 'pending', courier: 'FedEx', products: [{ name: 'B', quantity: 1, price: 1 }] }));
    await orderRepository.create(buildOrderPayload({ status: 'shipped', courier: 'DHL', products: [{ name: 'C', quantity: 1, price: 1 }] }));
    const result = await orderRepository.find({ status: 'pending', courier: 'DHL' });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('pending');
    expect(result[0].courier).toBe('DHL');
  });
});
