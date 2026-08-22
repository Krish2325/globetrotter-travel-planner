const prisma = require('../lib/prisma');
const { handleError } = require('../lib/errors');

const ownsTrip = (tripId, userId) => prisma.trip.findFirst({ where: { id: tripId, userId } });

// GET /api/checklists?tripId=xxx
exports.getChecklists = async (req, res, next) => {
  try {
    const { tripId } = req.query;
    if (!tripId) return res.status(400).json({ error: 'tripId required' });
    if (!(await ownsTrip(tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });
    const lists = await prisma.checklist.findMany({
      where: { tripId },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    res.json(lists);
  } catch (err) { handleError(err, res, next); }
};

// POST /api/checklists
exports.createChecklist = async (req, res, next) => {
  try {
    const { tripId, title, category } = req.body;
    if (!tripId || !title) return res.status(400).json({ error: 'tripId, title required' });
    if (!(await ownsTrip(tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });
    const list = await prisma.checklist.create({
      data: { tripId, userId: req.user.id, title, category: category || 'PACKING' },
      include: { items: true },
    });
    res.status(201).json(list);
  } catch (err) { handleError(err, res, next); }
};

// POST /api/checklists/:id/items
exports.addItem = async (req, res, next) => {
  try {
    const { label, order } = req.body;
    if (!label) return res.status(400).json({ error: 'label required' });
    const checklist = await prisma.checklist.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!checklist) return res.status(404).json({ error: 'Checklist not found' });
    const item = await prisma.checklistItem.create({
      data: { checklistId: req.params.id, label, order: order || 0 },
    });
    res.status(201).json(item);
  } catch (err) { handleError(err, res, next); }
};

// PATCH /api/checklists/items/:itemId
exports.updateItem = async (req, res, next) => {
  try {
    const existing = await prisma.checklistItem.findFirst({
      where: { id: req.params.itemId, checklist: { userId: req.user.id } },
    });
    if (!existing) return res.status(404).json({ error: 'Item not found' });
    const item = await prisma.checklistItem.update({ where: { id: req.params.itemId }, data: req.body });
    res.json(item);
  } catch (err) { handleError(err, res, next); }
};

// DELETE /api/checklists/:id
exports.deleteChecklist = async (req, res, next) => {
  try {
    const existing = await prisma.checklist.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Checklist not found' });
    await prisma.checklist.delete({ where: { id: req.params.id } });
    res.json({ message: 'Checklist deleted' });
  } catch (err) { handleError(err, res, next); }
};

// DELETE /api/checklists/items/:itemId
exports.deleteItem = async (req, res, next) => {
  try {
    const existing = await prisma.checklistItem.findFirst({
      where: { id: req.params.itemId, checklist: { userId: req.user.id } },
    });
    if (!existing) return res.status(404).json({ error: 'Item not found' });
    await prisma.checklistItem.delete({ where: { id: req.params.itemId } });
    res.json({ message: 'Item deleted' });
  } catch (err) { handleError(err, res, next); }
};
