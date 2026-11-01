import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Order } from '../../../src/models/order.model';
import { createOrder } from '../../../src/services/order.service';

vi.mock('../../../src/models/order.model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/models/order.model')>();
  return {
    ...actual,
    Order: { create: vi.fn(), find: vi.fn() },
  };
});

const mockedOrder = Order as unknown as { create: ReturnType<typeof vi.fn>; find: ReturnType<typeof vi.fn> };

describe('createOrder service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates an order and computes total', async () => {
    const input = {
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'Widget', quantity: 2, price: 5 }],
    };
    const created = { _id: '1', ...input, total: 10 };
    mockedOrder.create.mockResolvedValue(created);

    const result = await createOrder(input);

    expect(mockedOrder.create).toHaveBeenCalledWith({ ...input, total: 10 });
    expect(result).toEqual(created);
  });

  it('throws on invalid status', async () => {
    const input = {
      status: 'nope',
      courier: 'DHL',
      products: [{ name: 'Widget', quantity: 1, price: 1 }],
    };
    await expect(createOrder(input)).rejects.toThrow(/unknown status/i);
    expect(mockedOrder.create).not.toHaveBeenCalled();
  });

  it('throws on missing courier', async () => {
    const input = {
      status: 'pending',
      courier: '',
      products: [{ name: 'Widget', quantity: 1, price: 1 }],
    };
    await expect(createOrder(input)).rejects.toThrow(/courier/i);
    expect(mockedOrder.create).not.toHaveBeenCalled();
  });

  it('throws on invalid product', async () => {
    const input = {
      status: 'pending',
      courier: 'DHL',
      products: [{ name: 'Widget', quantity: 0, price: 1 }],
    };
    await expect(createOrder(input)).rejects.toThrow(/quantity/i);
    expect(mockedOrder.create).not.toHaveBeenCalled();
  });
});
