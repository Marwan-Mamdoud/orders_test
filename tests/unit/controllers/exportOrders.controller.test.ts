import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportOrders } from '../../../src/controllers/order.controller';

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

describe('exportOrders controller', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns exported orders from body filters', async () => {
    (orderService.exportOrders as any).mockResolvedValue([{ _id: '1' }]);
    const req: any = { body: { status: 'pending' }, query: {} };
    const res = mockRes();
    await exportOrders(req, res);
    expect(orderService.exportOrders).toHaveBeenCalledWith({ status: 'pending', courier: undefined, startDate: undefined, endDate: undefined });
    expect(res.json).toHaveBeenCalledWith([{ _id: '1' }]);
  });

  it('returns 400 on error', async () => {
    (orderService.exportOrders as any).mockRejectedValue(new Error('bad'));
    const req: any = { body: {}, query: {} };
    const res = mockRes();
    await exportOrders(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'bad' });
  });
});
