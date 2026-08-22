jest.mock('../src/lib/prisma', () => require('./helpers/prismaMock'));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');
const { makeToken } = require('./helpers/authToken');

// Regression suite for the IDOR fix: note.controller previously trusted
// tripId/note :id from the request with no ownership check, so any logged-in
// user could read, edit, or delete another user's notes.
const userA = { id: 'userA', role: 'USER' };
const tokenA = makeToken(userA.id);

beforeEach(() => {
  jest.clearAllMocks();
  prisma.user.findUnique.mockResolvedValue(userA); // satisfies auth.middleware
});

describe('GET /api/notes', () => {
  it('requires tripId', async () => {
    const res = await request(app).get('/api/notes').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(400);
  });

  it("404s when the trip isn't owned by the requester (cross-user access blocked)", async () => {
    prisma.trip.findFirst.mockResolvedValue(null); // trip belongs to someone else
    const res = await request(app).get('/api/notes?tripId=trip-owned-by-userB').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
    expect(prisma.note.findMany).not.toHaveBeenCalled();
  });

  it('returns notes for a trip the requester owns', async () => {
    prisma.trip.findFirst.mockResolvedValue({ id: 'tripA', userId: userA.id });
    prisma.note.findMany.mockResolvedValue([{ id: 'n1', title: 'Packing list' }]);
    const res = await request(app).get('/api/notes?tripId=tripA').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('POST /api/notes', () => {
  it("404s when creating a note under a trip the requester doesn't own", async () => {
    prisma.trip.findFirst.mockResolvedValue(null);
    const res = await request(app).post('/api/notes').set('Authorization', `Bearer ${tokenA}`)
      .send({ tripId: 'trip-owned-by-userB', title: 'x', content: 'y' });
    expect(res.status).toBe(404);
    expect(prisma.note.create).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/notes/:id', () => {
  it("404s when the note doesn't belong to the requester", async () => {
    prisma.note.findFirst.mockResolvedValue(null);
    const res = await request(app).patch('/api/notes/note-owned-by-userB').set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'hijacked' });
    expect(res.status).toBe(404);
    expect(prisma.note.update).not.toHaveBeenCalled();
  });

  it('updates only title/content and ignores attempts to reassign tripId/userId', async () => {
    prisma.note.findFirst.mockResolvedValue({ id: 'n1', userId: userA.id, tripId: 'tripA' });
    prisma.note.update.mockResolvedValue({ id: 'n1', title: 'New title' });

    const res = await request(app).patch('/api/notes/n1').set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'New title', userId: 'attacker-controlled', tripId: 'someone-elses-trip' });

    expect(res.status).toBe(200);
    const [[callArgs]] = prisma.note.update.mock.calls;
    expect(callArgs.data).toEqual({ title: 'New title' });
  });
});

describe('DELETE /api/notes/:id', () => {
  it("404s when the note doesn't belong to the requester", async () => {
    prisma.note.findFirst.mockResolvedValue(null);
    const res = await request(app).delete('/api/notes/note-owned-by-userB').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
    expect(prisma.note.delete).not.toHaveBeenCalled();
  });

  it('deletes a note the requester owns', async () => {
    prisma.note.findFirst.mockResolvedValue({ id: 'n1', userId: userA.id });
    prisma.note.delete.mockResolvedValue({});
    const res = await request(app).delete('/api/notes/n1').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
  });
});
