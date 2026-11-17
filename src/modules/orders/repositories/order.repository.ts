import { Order } from '../models/order.model';

export const orderRepository = {
  async create(data: any) {
    return Order.create(data);
  },

  async find(filter: Record<string, any>) {
    return Order.find(filter);
  },
};

export default orderRepository;
