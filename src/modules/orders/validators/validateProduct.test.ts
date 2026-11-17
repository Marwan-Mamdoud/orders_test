import { describe, it, expect } from 'vitest';
import { validateProduct } from './order-validators';

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

  it('throws when name is missing', () => {
    expect(() => validateProduct({ quantity: 1, price: 1 }, 0)).toThrow(/name/i);
  });
  it('throws when quantity is missing', () => {
    expect(() => validateProduct({ name: 'A', price: 1 }, 0)).toThrow(/quantity/i);
  });
  it('throws when price is missing', () => {
    expect(() => validateProduct({ name: 'A', quantity: 1 }, 0)).toThrow(/price/i);
  });
  it('accepts product with extra fields', () => {
    expect(() => validateProduct({ name: 'A', quantity: 1, price: 1, extra: true }, 0)).not.toThrow();
  });

});
