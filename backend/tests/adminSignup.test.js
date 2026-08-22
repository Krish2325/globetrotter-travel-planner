jest.mock('../src/lib/prisma', () => require('./helpers/prismaMock'));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');

// Regression suite for the fix that closed the public admin-registration
// hole: /api/auth/admin-signup previously let anyone grant themselves the
// ADMIN role with no authorization check at all.
const body = { name: 'Grace Hopper', email: 'grace@example.com', password: 'Str0ngPass' };

beforeEach(() => {
  jest.clearAllMocks();
  prisma.user.findUnique.mockResolvedValue(null);
  prisma.user.create.mockResolvedValue({ id: 'admin1', name: body.name, email: body.email, role: 'ADMIN' });
});

describe('POST /api/auth/admin-signup', () => {
  it('rejects the request when no invite code is supplied', async () => {
    const res = await request(app).post('/api/auth/admin-signup').send(body);
    expect(res.status).toBe(403);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects the request when the invite code is wrong', async () => {
    const res = await request(app).post('/api/auth/admin-signup').send({ ...body, inviteCode: 'guessed-code' });
    expect(res.status).toBe(403);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('creates an ADMIN account when the correct invite code is supplied', async () => {
    // tests/setup.js sets ADMIN_SIGNUP_SECRET to 'test-admin-invite-code'
    const res = await request(app).post('/api/auth/admin-signup').send({ ...body, inviteCode: 'test-admin-invite-code' });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('ADMIN');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('is disabled entirely (503) when ADMIN_SIGNUP_SECRET is not configured', async () => {
    const original = process.env.ADMIN_SIGNUP_SECRET;
    delete process.env.ADMIN_SIGNUP_SECRET;
    try {
      const res = await request(app).post('/api/auth/admin-signup').send({ ...body, inviteCode: 'anything' });
      expect(res.status).toBe(503);
      expect(prisma.user.create).not.toHaveBeenCalled();
    } finally {
      process.env.ADMIN_SIGNUP_SECRET = original;
    }
  });
});
