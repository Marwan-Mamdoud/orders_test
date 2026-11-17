import { describe, it, expect } from 'vitest';
import { calculateTotal } from './order-validators';

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

  it('sums a single valid product', () => {
    expect(calculateTotal([{ name: 'A', quantity: 3, price: 4 }])).toBe(12);
  });
  it('throws when product fields are missing', () => {
    expect(() => calculateTotal([{ name: 'A' } as any])).toThrow(/quantity/i);
  });

});
