import mongoose, { Schema, Model } from 'mongoose';
import { ORDER_STATUSES, OrderStatus, IProduct, IOrder } from '../order.types';

export { ORDER_STATUSES, OrderStatus, IProduct, IOrder } from '../order.types';

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
  if (this.total) return;

  this.total = (this.products || []).reduce(
    (sum, p) => sum + (p?.quantity || 0) * (p?.price || 0),
    0
  );
});

export const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', orderSchema);

export default Order;