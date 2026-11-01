import { Router } from 'express';
import {
  createOrder,
  getOrders,
  exportOrders,
} from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.post('/export', exportOrders);

export default router;
