import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Order } from '../../../src/models/order.model';
import { exportOrders, listOrders } from '../../../src/services/order.service';
import { buildOrderFilter } from '../../../src/utils/order-filters';

vi.mock('../../../src/models/order.model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/models/order.model')>();
  return {
    ...actual,
    Order: { create: vi.fn(), find: vi.fn() },
  };
});

const mockedOrder = Order as unknown as { create: ReturnType<typeof vi.fn>; find: ReturnType<typeof vi.fn> };

describe('exportOrders service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('throws when no filters provided', async () => {
    await expect(exportOrders({})).rejects.toThrow(/filter/i);
  });

  it('uses same filter as listOrders', async () => {
    const filters = { status: 'pending', courier: 'DHL' };
    const orders = [{ _id: '1' }];
    mockedOrder.find.mockResolvedValue(orders);

    const exported = await exportOrders(filters);
    expect(mockedOrder.find).toHaveBeenCalledWith(buildOrderFilter(filters));
    expect(exported).toEqual(orders);
  });

  it('throws on unknown status', async () => {
    await expect(exportOrders({ status: 'unknown-status' })).rejects.toThrow(/unknown/i);
  });

  it('parity with listOrders for identical filters', async () => {
    const filters = { status: 'pending', startDate: '2026-01-01' };
    const orders = [{ _id: '2', status: 'pending' }];
    mockedOrder.find.mockResolvedValue(orders);

    const a = await listOrders(filters);
    const b = await exportOrders(filters);
    expect(a).toEqual(b);
  });
});
