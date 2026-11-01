import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOrders } from '../../../src/controllers/order.controller';

vi.mock('../../../src/services/order.service', () => ({
  createOrder: vi.fn(),
  listOrders: vi.fn(),
  exportOrders: vi.fn(),
}));

import * as orderService from '../../../src/services/order.service';

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('getOrders controller', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns orders list', async () => {
    (orderService.listOrders as any).mockResolvedValue([{ _id: '1' }]);
    const req: any = { query: { status: 'pending' } };
    const res = mockRes();
    await getOrders(req, res);
    expect(res.json).toHaveBeenCalledWith([{ _id: '1' }]);
  });

  it('returns 400 on error', async () => {
    (orderService.listOrders as any).mockRejectedValue(new Error('bad'));
    const req: any = { query: {} };
    const res = mockRes();
    await getOrders(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'bad' });
  });
});
