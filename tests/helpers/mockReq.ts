export function mockReq(overrides: { query?: any; body?: any } = {}): any {
  return {
    query: {},
    body: {},
    ...overrides,
  };
}
