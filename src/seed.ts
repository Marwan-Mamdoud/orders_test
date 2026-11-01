import { connectDB } from './db';
import { Order, ORDER_STATUSES } from './models/order.model';
import mongoose from 'mongoose';

const COURIERS = ['DHL', 'FedEx', 'UPS', 'Aramex', 'USPS', 'Canada Post'];
const PRODUCT_NAMES = ['Widget', 'Gadget', 'Doohickey', 'Thingamajig', 'Gizmo', 'Sprocket'];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomProduct() {
  return {
    name: PRODUCT_NAMES[randomInt(0, PRODUCT_NAMES.length - 1)],
    quantity: randomInt(1, 5),
    price: randomInt(5, 50),
  };
}

function buildOrder(i: number) {
  const products = Array.from({ length: randomInt(1, 4) }, () => randomProduct());
  const total = products.reduce((s, p) => s + p.quantity * p.price, 0);
  const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
  const courier = COURIERS[i % COURIERS.length];
  const daysAgo = randomInt(0, 30);
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return { status, courier, products, total, createdAt };
}

async function seed() {
  await connectDB();
  await Order.deleteMany({});
  const orders = Array.from({ length: 50 }, (_, i) => buildOrder(i));
  await Order.insertMany(orders);
  console.log(`Seeded ${orders.length} orders.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
