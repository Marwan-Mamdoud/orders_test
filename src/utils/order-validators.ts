import { ORDER_STATUSES } from '../models/order.model';

export interface ProductInput {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderInput {
  status?: string;
  courier?: string;
  products?: ProductInput[];
}

export interface OrderFilters {
  status?: string;
  courier?: string;
  startDate?: string | Date;
  endDate?: string | Date;
}

export function validateProduct(product: any, index: number = 0): void {
  if (!product || typeof product !== 'object') {
    throw new Error(`product at index ${index} is invalid`);
  }
  if (typeof product.name !== 'string' || !product.name.trim()) {
    throw new Error(`product at index ${index} is missing a valid name`);
  }
  if (typeof product.quantity !== 'number' || !Number.isFinite(product.quantity) || product.quantity <= 0) {
    throw new Error(`product at index ${index} has an invalid quantity`);
  }
  if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0) {
    throw new Error(`product at index ${index} has an invalid price`);
  }
}

export function calculateTotal(products: any[]): number {
  if (!Array.isArray(products)) {
    throw new Error('products must be an array');
  }
  return products.reduce((sum, p, index) => {
    validateProduct(p, index);
    return sum + p.quantity * p.price;
  }, 0);
}

export function validateOrderData(data: any): void {
  if (!data || typeof data !== 'object') {
    throw new Error('order data is required');
  }
  if (!ORDER_STATUSES.includes(data.status)) {
    throw new Error(`Unknown status value: ${data.status}`);
  }
  if (typeof data.courier !== 'string' || !data.courier.trim()) {
    throw new Error('courier is required');
  }
  if (!Array.isArray(data.products)) {
    throw new Error('products must be an array');
  }
  data.products.forEach((product: any, index: number) => {
    validateProduct(product, index);
  });
}

export function validateFilters(filters: any): void {
  if (!filters || typeof filters !== 'object') {
    return;
  }

  if (filters.status !== undefined && filters.status !== null && filters.status !== '') {
    if (!ORDER_STATUSES.includes(filters.status)) {
      throw new Error(`Unknown status value: ${filters.status}`);
    }
  }

  if (filters.courier !== undefined && filters.courier !== null && filters.courier !== '') {
    if (typeof filters.courier !== 'string' || !filters.courier.trim()) {
      throw new Error('courier filter is invalid');
    }
  }

  if (filters.startDate !== undefined && filters.startDate !== null && filters.startDate !== '') {
    const d = new Date(filters.startDate);
    if (isNaN(d.getTime())) {
      throw new Error('startDate is not a valid date');
    }
  }

  if (filters.endDate !== undefined && filters.endDate !== null && filters.endDate !== '') {
    const d = new Date(filters.endDate);
    if (isNaN(d.getTime())) {
      throw new Error('endDate is not a valid date');
    }
  }

}
