import { describe, it, expect } from 'vitest';
import { buildOrderFilter } from './order-filters';

describe('buildOrderFilter', () => {
  it('returns empty object for no filters', () => {
    expect(buildOrderFilter({})).toEqual({});
  });
  it('filters by status', () => {
    expect(buildOrderFilter({ status: 'shipped' })).toEqual({ status: 'shipped' });
  });
  it('filters by courier', () => {
    expect(buildOrderFilter({ courier: 'FedEx' })).toEqual({ courier: 'FedEx' });
  });
  it('filters by start date', () => {
    const start = '2026-01-01';
    const result = buildOrderFilter({ startDate: start });
    expect(result.createdAt).toBeDefined();
    expect(result.createdAt.$gte).toBeInstanceOf(Date);
  });
  it('filters by end date', () => {
    const end = '2026-01-31';
    const result = buildOrderFilter({ endDate: end });
    expect(result.createdAt).toBeDefined();
    expect(result.createdAt.$lte).toBeInstanceOf(Date);
  });
  it('filters by date range', () => {
    const start = '2026-01-01';
    const end = '2026-01-31';
    const result = buildOrderFilter({ startDate: start, endDate: end });
    expect(result.createdAt.$gte).toBeInstanceOf(Date);
    expect(result.createdAt.$lte).toBeInstanceOf(Date);
  });
  it('ignores invalid dates', () => {
    expect(buildOrderFilter({ startDate: 'not-a-date', endDate: 'also-bad' })).toEqual({});
  });
  it('combines multiple filters', () => {
    const result = buildOrderFilter({ status: 'pending', courier: 'DHL', startDate: '2026-01-01' });
    expect(result.status).toBe('pending');
    expect(result.courier).toBe('DHL');
    expect(result.createdAt.$gte).toBeInstanceOf(Date);
  });

  it('excludes empty-string status and courier', () => {
    expect(buildOrderFilter({ status: '', courier: '' })).toEqual({});
  });
  it('accepts Date objects for dates', () => {
    const start = new Date('2026-01-01');
    const end = new Date('2026-01-31');
    const result = buildOrderFilter({ startDate: start, endDate: end });
    expect(result.createdAt.$gte).toBeInstanceOf(Date);
    expect(result.createdAt.$lte).toBeInstanceOf(Date);
  });
  it('keeps valid endDate when startDate is invalid', () => {
    const result = buildOrderFilter({ startDate: 'not-a-date', endDate: '2026-01-31' });
    expect(result.createdAt.$gte).toBeUndefined();
    expect(result.createdAt.$lte).toBeInstanceOf(Date);
  });

});
