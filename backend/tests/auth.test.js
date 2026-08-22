jest.mock('../src/lib/prisma', () => require('./helpers/prismaMock'));

const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');

const validSignupBody = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'Str0ngPass' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/signup', () => {
  it('rejects a request missing required fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('rejects a malformed email address', async () => {
    const res = await request(app).post('/api/auth/signup').send({ ...validSignupBody, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/valid email/i);
  });

  it.each([
    ['too short', 'Ab1'],
    ['no digits', 'Abcdefgh'],
    ['no letters', '12345678'],
  ])('rejects a weak password (%s)', async (_label, password) => {
    const res = await request(app).post('/api/auth/signup').send({ ...validSignupBody, password });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  it('rejects signup when the email is already registered', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: validSignupBody.email });
    const res = await request(app).post('/api/auth/signup').send(validSignupBody);
    expect(res.status).toBe(409);
  });

  it('creates a USER account and returns a token on valid input', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'u1', name: validSignupBody.name, email: validSignupBody.email,
      isEmailVerified: false, role: 'USER',
    });

    const res = await request(app).post('/api/auth/signup').send(validSignupBody);

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('USER');
    // regression guard: signup must never be able to grant ADMIN
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.not.objectContaining({ role: 'ADMIN' }) })
    );
  });
});

describe('POST /api/auth/login', () => {
  it('rejects missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'ada@example.com' });
    expect(res.status).toBe(400);
  });

  it('returns 401 for an unknown email without revealing which field was wrong', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ email: 'ghost@example.com', password: 'whatever1' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('returns 401 for a wrong password', async () => {
    const hash = await bcrypt.hash('CorrectPass1', 10);
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'ada@example.com', passwordHash: hash, role: 'USER' });
    const res = await request(app).post('/api/auth/login').send({ email: 'ada@example.com', password: 'WrongPass1' });
    expect(res.status).toBe(401);
  });

  it('logs in successfully with correct credentials', async () => {
    const hash = await bcrypt.hash('CorrectPass1', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1', name: 'Ada', email: 'ada@example.com', passwordHash: hash,
      isEmailVerified: true, role: 'USER',
    });
    const res = await request(app).post('/api/auth/login').send({ email: 'ada@example.com', password: 'CorrectPass1' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
