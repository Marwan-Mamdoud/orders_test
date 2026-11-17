import { describe, it, expect } from 'vitest';
import { validateFilters } from './order-validators';

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

  it('throws on non-string status', () => {
    expect(() => validateFilters({ status: 123 as any })).toThrow(/unknown status/i);
  });
  it('throws on non-string courier', () => {
    expect(() => validateFilters({ courier: 123 as any })).toThrow(/courier/i);
  });
  it('accepts Date object for dates', () => {
    expect(() => validateFilters({ startDate: new Date(), endDate: new Date() })).not.toThrow();
  });
  it('accepts numeric timestamp for dates', () => {
    expect(() => validateFilters({ startDate: Date.now(), endDate: Date.now() })).not.toThrow();
  });
  it('throws on invalid startDate with valid endDate', () => {
    expect(() => validateFilters({ startDate: 'bad', endDate: '2026-01-31' })).toThrow(/valid date/i);
  });

});
