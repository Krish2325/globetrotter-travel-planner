// Manual mock for src/lib/prisma — used via:
//   jest.mock('../../src/lib/prisma', () => require('../helpers/prismaMock'));
// Keeps controller/route tests fast and independent of a real database.
// Each model exposes jest.fn() stand-ins for the Prisma Client methods this
// codebase actually calls; configure return values per-test with
// `prisma.model.method.mockResolvedValue(...)`.

const model = () => ({
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
});

const prismaMock = {
  user: model(),
  trip: model(),
  note: model(),
  communityShare: model(),
  budget: model(),
  checklist: model(),
  checklistItem: model(),
  expense: model(),
  stop: model(),
  stopActivity: model(),
  tripCopy: model(),
  city: model(),
  activity: model(),
  $transaction: jest.fn((ops) => Promise.all(ops)),
  $connect: jest.fn().mockResolvedValue(undefined),
};

module.exports = prismaMock;
