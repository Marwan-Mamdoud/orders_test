import { describe, it, expect } from 'vitest';
import { extractFilters } from './order.controller';

describe('extractFilters', () => {
  it('uses query params when present', () => {
    const req: any = {
      query: { status: 'shipped', courier: 'DHL', startDate: '2026-01-01', endDate: '2026-01-31' },
      body: {},
    };
    expect(extractFilters(req)).toEqual({
      status: 'shipped',
      courier: 'DHL',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });
  });

  it('uses body.filters when no query params', () => {
    const req: any = { query: {}, body: { filters: { status: 'pending' } } };
    expect(extractFilters(req)).toEqual({
      status: 'pending',
      courier: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  });

  it('uses body directly when no filters key', () => {
    const req: any = { query: {}, body: { courier: 'FedEx' } };
    expect(extractFilters(req)).toEqual({
      status: undefined,
      courier: 'FedEx',
      startDate: undefined,
      endDate: undefined,
    });
  });

  it('handles empty request', () => {
    const req: any = { query: {}, body: {} };
    expect(extractFilters(req)).toEqual({
      status: undefined,
      courier: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  });

  it('handles undefined query and body', () => {
    const req: any = {};
    expect(extractFilters(req)).toEqual({
      status: undefined,
      courier: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  });

  it('handles undefined body with empty query', () => {
    const req: any = { query: {} };
    expect(extractFilters(req)).toEqual({
      status: undefined,
      courier: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  });
});
