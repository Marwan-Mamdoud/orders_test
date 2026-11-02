import mongoose, { Schema, Document, Model } from 'mongoose';

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

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>({
  status: { type: String, enum: ORDER_STATUSES, required: true },
  createdAt: { type: Date, default: () => new Date() },
  courier: { type: String, required: true },
  products: { type: [productSchema], default: [] },
  total: { type: Number, default: 0 },
});

orderSchema.pre<IOrder>('save', function () {
  if (this.total != null) return;

  this.total = (this.products || []).reduce(
    (sum, p) => sum + (p?.quantity || 0) * (p?.price || 0),
    0
  );
});

export const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
