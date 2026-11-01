import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrder } from '../../../src/controllers/order.controller';

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

describe('createOrder controller', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 201 with created order', async () => {
    (orderService.createOrder as any).mockResolvedValue({ _id: '1' });
    const req: any = { body: { status: 'pending', courier: 'DHL', products: [] } };
    const res = mockRes();
    await createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: '1' });
  });

  it('returns 400 on error', async () => {
    (orderService.createOrder as any).mockRejectedValue(new Error('bad'));
    const req: any = { body: {} };
    const res = mockRes();
    await createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'bad' });
  });
});
