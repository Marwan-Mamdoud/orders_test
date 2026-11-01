import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Order } from '../../../src/models/order.model';
import { listOrders } from '../../../src/services/order.service';
import { buildOrderFilter } from '../../../src/utils/order-filters';

vi.mock('../../../src/models/order.model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/models/order.model')>();
  return {
    ...actual,
    Order: { create: vi.fn(), find: vi.fn() },
  };
});

const mockedOrder = Order as unknown as { create: ReturnType<typeof vi.fn>; find: ReturnType<typeof vi.fn> };

describe('listOrders service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists with no filters', async () => {
    const orders = [{ _id: '1' }];
    mockedOrder.find.mockResolvedValue(orders);
    const result = await listOrders();
    expect(mockedOrder.find).toHaveBeenCalledWith({});
    expect(result).toEqual(orders);
  });

  it('filters by status', async () => {
    const orders = [{ _id: '1', status: 'shipped' }];
    mockedOrder.find.mockResolvedValue(orders);
    const result = await listOrders({ status: 'shipped' });
    expect(mockedOrder.find).toHaveBeenCalledWith({ status: 'shipped' });
    expect(result).toEqual(orders);
  });

  it('filters by courier', async () => {
    const orders = [{ _id: '1', courier: 'FedEx' }];
    mockedOrder.find.mockResolvedValue(orders);
    const result = await listOrders({ courier: 'FedEx' });
    expect(mockedOrder.find).toHaveBeenCalledWith({ courier: 'FedEx' });
    expect(result).toEqual(orders);
  });

  it('filters by date range', async () => {
    const start = '2026-01-01';
    const end = '2026-01-31';
    const orders = [{ _id: '1' }];
    mockedOrder.find.mockResolvedValue(orders);
    const result = await listOrders({ startDate: start, endDate: end });
    expect(mockedOrder.find).toHaveBeenCalledWith(buildOrderFilter({ startDate: start, endDate: end }));
    expect(result).toEqual(orders);
  });

  it('throws on unknown status', async () => {
    await expect(listOrders({ status: 'unknown-status' })).rejects.toThrow(/unknown/i);
  });

  it('throws on unknown courier', async () => {
    mockedOrder.find.mockResolvedValue([]);
    await expect(listOrders({ courier: 'unknown-courier' })).rejects.toThrow(/unknown/i);
  });
});
