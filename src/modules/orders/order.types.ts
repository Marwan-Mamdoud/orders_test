import { Document } from 'mongoose';

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface IProduct {
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  status: OrderStatus;
  createdAt: Date;
  courier: string;
  products: IProduct[];
  total: number;
}

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