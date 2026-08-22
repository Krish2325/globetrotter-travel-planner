jest.mock('../src/lib/prisma', () => require('./helpers/prismaMock'));

const request = require('supertest');
const app = require('../src/app');

// Verification for BUG-010 (hardened HTTP security headers) and BUG-009
// (rate limiting present on the API surface).
describe('security headers', () => {
  it('sets a restrictive CSP, HSTS, and referrer policy on every response', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-security-policy']).toContain("default-src 'none'");
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('exposes rate-limit headers on API responses', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.headers['ratelimit-limit']).toBeDefined();
  });
});
