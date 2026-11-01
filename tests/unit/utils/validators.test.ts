import { describe, it, expect } from 'vitest';
import {
  validateProduct,
  validateOrderData,
  validateFilters,
  calculateTotal,
} from '../../../src/utils/order-validators';

describe('validateProduct', () => {
  it('accepts valid product', () => {
    expect(() => validateProduct({ name: 'A', quantity: 2, price: 5 }, 0)).not.toThrow();
  });
  it('throws on missing name', () => {
    expect(() => validateProduct({ name: '', quantity: 1, price: 1 }, 0)).toThrow(/name/i);
  });
  it('throws on invalid quantity', () => {
    expect(() => validateProduct({ name: 'A', quantity: 0, price: 1 }, 0)).toThrow(/quantity/i);
  });
  it('throws on invalid price', () => {
    expect(() => validateProduct({ name: 'A', quantity: 1, price: -1 }, 0)).toThrow(/price/i);
  });
});

describe('calculateTotal', () => {
  it('sums quantity*price', () => {
    expect(calculateTotal([{ name: 'A', quantity: 2, price: 5 }, { name: 'B', quantity: 1, price: 3 }])).toBe(13);
  });
  it('throws on non-array', () => {
    expect(() => calculateTotal(null as any)).toThrow(/array/i);
  });
});

describe('validateOrderData', () => {
  it('accepts valid order', () => {
    expect(() =>
      validateOrderData({
        status: 'pending',
        courier: 'DHL',
        products: [{ name: 'A', quantity: 1, price: 1 }],
      })
    ).not.toThrow();
  });
  it('throws on unknown status', () => {
    expect(() =>
      validateOrderData({ status: 'nope', courier: 'DHL', products: [] })
    ).toThrow(/unknown status/i);
  });
});

describe('validateFilters', () => {
  it('accepts empty filters', () => {
    expect(() => validateFilters({})).not.toThrow();
  });
  it('throws on invalid status', () => {
    expect(() => validateFilters({ status: 'nope' })).toThrow(/unknown status/i);
  });
  it('throws on invalid date', () => {
    expect(() => validateFilters({ startDate: 'not-a-date' })).toThrow(/valid date/i);
  });
});
