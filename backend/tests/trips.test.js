jest.mock('../src/lib/prisma', () => require('./helpers/prismaMock'));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');
const { makeToken } = require('./helpers/authToken');

const userA = { id: 'userA', role: 'USER' };
const admin = { id: 'admin1', role: 'ADMIN' };
const tokenA = makeToken(userA.id);
const tokenAdmin = makeToken(admin.id);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/trips/:id', () => {
  it("404s instead of leaking another user's trip", async () => {
    prisma.user.findUnique.mockResolvedValue(userA);
    prisma.trip.findFirst.mockResolvedValue(null); // trip belongs to someone else
    const res = await request(app).get('/api/trips/trip-owned-by-userB').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
  });

  it("scopes the lookup to the requester's own trips", async () => {
    prisma.user.findUnique.mockResolvedValue(userA);
    prisma.trip.findFirst.mockResolvedValue({ id: 'tripA', userId: userA.id, title: 'My Trip' });
    const res = await request(app).get('/api/trips/tripA').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(prisma.trip.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ id: 'tripA', userId: userA.id }) })
    );
  });
});

describe('POST /api/trips', () => {
  it('always creates the trip under the authenticated user, ignoring any userId in the body', async () => {
    prisma.user.findUnique.mockResolvedValue(userA);
    prisma.trip.create.mockResolvedValue({ id: 'newTrip' });

    await request(app).post('/api/trips').set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Trip', startDate: '2026-01-01', endDate: '2026-01-05', userId: 'attacker-controlled' });

    const [[callArgs]] = prisma.trip.create.mock.calls;
    expect(callArgs.data.userId).toBe(userA.id);
  });
});

describe('PATCH /api/trips/:id and DELETE /api/trips/:id', () => {
  it("404s on update when the trip isn't owned by the requester", async () => {
    prisma.user.findUnique.mockResolvedValue(userA);
    prisma.trip.findFirst.mockResolvedValue(null);
    const res = await request(app).patch('/api/trips/not-mine').set('Authorization', `Bearer ${tokenA}`).send({ title: 'x' });
    expect(res.status).toBe(404);
    expect(prisma.trip.update).not.toHaveBeenCalled();
  });

  it("404s on delete when the trip isn't owned by the requester", async () => {
    prisma.user.findUnique.mockResolvedValue(userA);
    prisma.trip.findFirst.mockResolvedValue(null);
    const res = await request(app).delete('/api/trips/not-mine').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
    expect(prisma.trip.delete).not.toHaveBeenCalled();
  });
});

describe('GET /api/trips/admin/all', () => {
  it('rejects non-admin users with 403', async () => {
    prisma.user.findUnique.mockResolvedValue(userA);
    const res = await request(app).get('/api/trips/admin/all').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(403);
  });

  it('rejects unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/trips/admin/all');
    expect(res.status).toBe(401);
  });

  it('allows admin users through', async () => {
    prisma.user.findUnique.mockResolvedValue(admin);
    prisma.trip.findMany.mockResolvedValue([]);
    prisma.trip.count.mockResolvedValue(0);
    const res = await request(app).get('/api/trips/admin/all').set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
  });
});
