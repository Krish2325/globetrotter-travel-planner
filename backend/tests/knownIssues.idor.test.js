jest.mock('../src/lib/prisma', () => require('./helpers/prismaMock'));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');
const { makeToken } = require('./helpers/authToken');

/**
 * Known-issue regression suite (see docs/qa/bug-reports.md, BUG-002..BUG-005).
 *
 * budget/checklist/expense/stop controllers only run `authenticate` — none
 * of them verify the resource belongs to the requester before reading or
 * mutating it, the same class of IDOR that was found and fixed on
 * note.controller and community.controller.shareTrip (see notes.test.js and
 * community.test.js). These use `test.failing` to assert the SECURE
 * behavior we expect once fixed; they fail today by design and should be
 * flipped to regular `test`s as each controller gets an ownership check.
 */

const userA = { id: 'userA', role: 'USER' };
const tokenA = makeToken(userA.id);

beforeEach(() => {
  jest.clearAllMocks();
  prisma.user.findUnique.mockResolvedValue(userA);
});

describe('BUG-002: GET /api/budgets/:tripId has no ownership check', () => {
  test.failing('should 404 for a budget belonging to a trip the requester does not own', async () => {
    prisma.budget.findUnique.mockResolvedValue({ tripId: 'trip-owned-by-userB', totalBudget: 50000 });
    const res = await request(app).get('/api/budgets/trip-owned-by-userB').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
  });
});

describe('BUG-003: PATCH /api/checklists/items/:itemId has no ownership check', () => {
  test.failing('should reject editing a checklist item on a trip the requester does not own', async () => {
    prisma.checklistItem.update.mockResolvedValue({ id: 'item-owned-by-userB', label: 'tampered' });
    const res = await request(app).patch('/api/checklists/items/item-owned-by-userB')
      .set('Authorization', `Bearer ${tokenA}`).send({ label: 'tampered' });
    expect([403, 404]).toContain(res.status);
  });
});

describe('BUG-004: DELETE /api/expenses/:id has no ownership check', () => {
  test.failing('should reject deleting an expense on a trip the requester does not own', async () => {
    prisma.expense.delete.mockResolvedValue({});
    const res = await request(app).delete('/api/expenses/expense-owned-by-userB').set('Authorization', `Bearer ${tokenA}`);
    expect([403, 404]).toContain(res.status);
  });
});

describe('BUG-005: PATCH /api/stops/:id has no ownership check', () => {
  test.failing('should reject editing a stop on a trip the requester does not own', async () => {
    prisma.stop.update.mockResolvedValue({ id: 'stop-owned-by-userB' });
    const res = await request(app).patch('/api/stops/stop-owned-by-userB')
      .set('Authorization', `Bearer ${tokenA}`).send({ notes: 'tampered' });
    expect([403, 404]).toContain(res.status);
  });
});
