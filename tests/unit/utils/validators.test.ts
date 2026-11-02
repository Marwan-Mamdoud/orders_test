import { describe, it, expect } from 'vitest';
import {
  validateProduct,
  validateOrderData,
  validateFilters,
  calculateTotal,
} from '../../../src/utils/order-validators';

describe('validateProduct', () => {
  it('accepts valid product', () => {
    expect(() => validateProduct({ name: 'A', quantity: 2, price: 5 })).not.toThrow();
  });
  it('throws when product is null', () => {
    expect(() => validateProduct(null, 0)).toThrow(/invalid/i);
  });
  it('throws when product is non-object', () => {
    expect(() => validateProduct('x' as any, 0)).toThrow(/invalid/i);
  });
  it('throws on missing name', () => {
    expect(() => validateProduct({ name: '', quantity: 1, price: 1 }, 0)).toThrow(/name/i);
  });
  it('throws on whitespace-only name', () => {
    expect(() => validateProduct({ name: '   ', quantity: 1, price: 1 }, 0)).toThrow(/name/i);
  });
  it('throws on invalid quantity (zero)', () => {
    expect(() => validateProduct({ name: 'A', quantity: 0, price: 1 }, 0)).toThrow(/quantity/i);
  });
  it('throws on invalid quantity (negative)', () => {
    expect(() => validateProduct({ name: 'A', quantity: -1, price: 1 }, 0)).toThrow(/quantity/i);
  });
  it('throws on non-finite quantity', () => {
    expect(() => validateProduct({ name: 'A', quantity: NaN, price: 1 }, 0)).toThrow(/quantity/i);
  });
  it('throws on invalid price (negative)', () => {
    expect(() => validateProduct({ name: 'A', quantity: 1, price: -1 }, 0)).toThrow(/price/i);
  });
  it('throws on non-finite price', () => {
    expect(() => validateProduct({ name: 'A', quantity: 1, price: Infinity }, 0)).toThrow(/price/i);
  });
  it('accepts zero price', () => {
    expect(() => validateProduct({ name: 'A', quantity: 1, price: 0 }, 0)).not.toThrow();
  });
  it('uses default index', () => {
    expect(() => validateProduct({ name: 'A', quantity: 1, price: 1 })).not.toThrow();
  });
});

describe('calculateTotal', () => {
  it('sums quantity*price', () => {
    expect(calculateTotal([{ name: 'A', quantity: 2, price: 5 }, { name: 'B', quantity: 1, price: 3 }])).toBe(13);
  });
  it('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
  it('throws on non-array', () => {
    expect(() => calculateTotal(null as any)).toThrow(/array/i);
  });
  it('throws on invalid product', () => {
    expect(() => calculateTotal([{ name: 'A', quantity: 0, price: 1 }])).toThrow(/quantity/i);
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
  it('throws on missing data', () => {
    expect(() => validateOrderData(null as any)).toThrow(/required/i);
  });
  it('throws on non-object data', () => {
    expect(() => validateOrderData('x' as any)).toThrow(/required/i);
  });
  it('throws on unknown status', () => {
    expect(() =>
      validateOrderData({ status: 'nope', courier: 'DHL', products: [] })
    ).toThrow(/unknown status/i);
  });
  it('throws on missing courier', () => {
    expect(() =>
      validateOrderData({ status: 'pending', courier: '', products: [] })
    ).toThrow(/courier/i);
  });
  it('throws on non-array products', () => {
    expect(() =>
      validateOrderData({ status: 'pending', courier: 'DHL', products: 'x' as any })
    ).toThrow(/array/i);
  });
  it('throws on invalid product', () => {
    expect(() =>
      validateOrderData({
        status: 'pending',
        courier: 'DHL',
        products: [{ name: 'A', quantity: 0, price: 1 }],
      })
    ).toThrow(/quantity/i);
  });
  it('accepts empty products', () => {
    expect(() =>
      validateOrderData({ status: 'pending', courier: 'DHL', products: [] })
    ).not.toThrow();
  });
});

describe('validateFilters', () => {
  it('accepts empty filters', () => {
    expect(() => validateFilters({})).not.toThrow();
  });
  it('accepts null/undefined', () => {
    expect(() => validateFilters(null as any)).not.toThrow();
    expect(() => validateFilters(undefined as any)).not.toThrow();
  });
  it('accepts valid status/courier/dates', () => {
    expect(() =>
      validateFilters({ status: 'pending', courier: 'DHL', startDate: '2026-01-01', endDate: '2026-01-31' })
    ).not.toThrow();
  });
  it('throws on unknown status', () => {
    expect(() => validateFilters({ status: 'nope' })).toThrow(/unknown status/i);
  });
  it('throws on invalid courier', () => {
    expect(() => validateFilters({ courier: '   ' })).toThrow(/courier/i);
  });
  it('throws on invalid startDate', () => {
    expect(() => validateFilters({ startDate: 'not-a-date' })).toThrow(/valid date/i);
  });
  it('throws on invalid endDate', () => {
    expect(() => validateFilters({ endDate: 'not-a-date' })).toThrow(/valid date/i);
  });
  it('treats empty strings as not provided', () => {
    expect(() => validateFilters({ status: '', courier: '', startDate: '', endDate: '' })).not.toThrow();
  });
});
