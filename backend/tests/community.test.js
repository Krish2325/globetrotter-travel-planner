jest.mock('../src/lib/prisma', () => require('./helpers/prismaMock'));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');
const { makeToken } = require('./helpers/authToken');

// Regression suite for the fix that made shareTrip verify trip ownership
// before publishing it — previously any authenticated user could pass any
// tripId and make someone else's private trip public.
const userA = { id: 'userA', role: 'USER' };
const tokenA = makeToken(userA.id);

beforeEach(() => {
  jest.clearAllMocks();
  prisma.user.findUnique.mockResolvedValue(userA);
});

describe('POST /api/community', () => {
  it("404s and does not publish when the tripId doesn't belong to the requester", async () => {
    prisma.trip.findFirst.mockResolvedValue(null);
    const res = await request(app).post('/api/community').set('Authorization', `Bearer ${tokenA}`)
      .send({ tripId: 'trip-owned-by-userB', title: 'Someone else\'s Bali trip' });
    expect(res.status).toBe(404);
    expect(prisma.communityShare.create).not.toHaveBeenCalled();
    expect(prisma.trip.update).not.toHaveBeenCalled();
  });

  it('publishes the share when the requester owns the trip', async () => {
    prisma.trip.findFirst.mockResolvedValue({ id: 'tripA', userId: userA.id, title: 'My Bali Trip' });
    prisma.communityShare.create.mockResolvedValue({ id: 'share1', slug: 'my-bali-trip-abc123' });
    prisma.trip.update.mockResolvedValue({});

    const res = await request(app).post('/api/community').set('Authorization', `Bearer ${tokenA}`)
      .send({ tripId: 'tripA', title: 'My Bali Trip' });

    expect(res.status).toBe(201);
    expect(prisma.communityShare.create).toHaveBeenCalled();
    expect(prisma.trip.update).toHaveBeenCalledWith({ where: { id: 'tripA' }, data: { isPublic: true } });
  });
});

describe('DELETE /api/community/:slug', () => {
  it("returns 403 when the share doesn't belong to the requester", async () => {
    prisma.communityShare.findUnique.mockResolvedValue({ slug: 'x', userId: 'userB' });
    const res = await request(app).delete('/api/community/x').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(403);
    expect(prisma.communityShare.delete).not.toHaveBeenCalled();
  });
});
