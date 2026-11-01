import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { OrderFilters } from '../utils/order-filters';

function extractFilters(req: Request): OrderFilters {
  const query = req.query || {};
  const hasQuery = Object.keys(query).length > 0;
  const source = hasQuery
    ? query
    : (req.body && typeof req.body === 'object' && req.body.filters
        ? req.body.filters
        : req.body || {});

  return {
    status: source?.status as string | undefined,
    courier: source?.courier as string | undefined,
    startDate: source?.startDate as string | undefined,
    endDate: source?.endDate as string | undefined,
  };
}

export async function createOrder(req: Request, res: Response) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Bad request' });
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const orders = await orderService.listOrders(extractFilters(req));
    res.json(orders);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Bad request' });
  }
}

export async function exportOrders(req: Request, res: Response) {
  try {
    const orders = await orderService.exportOrders(extractFilters(req));
    res.json(orders);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Bad request' });
  }
}
