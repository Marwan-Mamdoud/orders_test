import { describe, it, expect } from 'vitest';
import { validateOrderData } from './order-validators';

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
    ).toThrow(/products must contain/i);
  });

  it('throws on empty products', () => {
    expect(() =>
      validateOrderData({ status: 'pending', courier: 'DHL', products: [] })
    ).toThrow(/products must contain/i);
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


  it('throws when status is undefined', () => {
    expect(() => validateOrderData({ courier: 'DHL', products: [] } as any)).toThrow(/status/i);
  });
  it('throws when courier is undefined', () => {
    expect(() => validateOrderData({ status: 'pending', products: [] } as any)).toThrow(/courier/i);
  });
  it('throws when products is undefined', () => {
    expect(() => validateOrderData({ status: 'pending', courier: 'DHL' } as any)).toThrow(/products/i);
  });
  it('throws on whitespace-only courier', () => {
    expect(() => validateOrderData({ status: 'pending', courier: '   ', products: [] })).toThrow(/courier/i);
  });
  it('throws when product array contains invalid product', () => {
    expect(() => validateOrderData({ status: 'pending', courier: 'DHL', products: [{ name: 'A', quantity: 0, price: 1 }] })).toThrow(/quantity/i);
  });

});
