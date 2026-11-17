import { afterEach, vi } from 'vitest';

// Keep tests deterministic and independent of the runtime .env
process.env.NODE_ENV = 'test';

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
