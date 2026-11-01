import { orderRepository } from "../repositories/order.repository";
import { buildOrderFilter, OrderFilters } from "../utils/order-filters";
import {
  validateOrderData,
  validateFilters,
  calculateTotal,
} from "../utils/order-validators";

export async function createOrder(data: any) {
  validateOrderData(data);
  const total = calculateTotal(data.products);
  return orderRepository.create({ ...data, total });
}

export async function listOrders(filters: OrderFilters = {}) {
  validateFilters(filters);
  const filter = buildOrderFilter(filters);
  const orders = await orderRepository.find(filter);

  if (
    (filters.status || filters.courier) &&
    Array.isArray(orders) &&
    orders.length === 0
  ) {
    throw new Error("Unknown status or courier value");
  }

  return orders;
}

export async function exportOrders(filters: OrderFilters = {}) {
  const hasFilter =
    !!filters.status ||
    !!filters.courier ||
    !!filters.startDate ||
    !!filters.endDate;
  if (!hasFilter) {
    throw new Error("Export requires at least one filter");
  }

  validateFilters(filters);

  const filter = buildOrderFilter(filters);
  const orders = await orderRepository.find(filter);

  if (
    (filters.status || filters.courier) &&
    Array.isArray(orders) &&
    orders.length === 0
  ) {
    throw new Error("Unknown status or courier value");
  }

  return orders;
}
