const prisma = require('../lib/prisma');

// GET /api/checklists?tripId=xxx
exports.getChecklists = async (req, res) => {
  const { tripId } = req.query;
  if (!tripId) return res.status(400).json({ error: 'tripId required' });
  const lists = await prisma.checklist.findMany({
    where: { tripId },
    include: { items: { orderBy: { order: 'asc' } } },
  });
  res.json(lists);
};

// POST /api/checklists
exports.createChecklist = async (req, res) => {
  const { tripId, title, category } = req.body;
  if (!tripId || !title) return res.status(400).json({ error: 'tripId, title required' });
  const list = await prisma.checklist.create({
    data: { tripId, userId: req.user.id, title, category: category || 'PACKING' },
    include: { items: true },
  });
  res.status(201).json(list);
};

// POST /api/checklists/:id/items
exports.addItem = async (req, res) => {
  const { label, order } = req.body;
  if (!label) return res.status(400).json({ error: 'label required' });
  const item = await prisma.checklistItem.create({
    data: { checklistId: req.params.id, label, order: order || 0 },
  });
  res.status(201).json(item);
};

// PATCH /api/checklists/items/:itemId
exports.updateItem = async (req, res) => {
  const item = await prisma.checklistItem.update({
    where: { id: req.params.itemId },
    data: req.body,
  });
  res.json(item);
};

// DELETE /api/checklists/:id
exports.deleteChecklist = async (req, res) => {
  await prisma.checklist.delete({ where: { id: req.params.id } });
  res.json({ message: 'Checklist deleted' });
};

// DELETE /api/checklists/items/:itemId
exports.deleteItem = async (req, res) => {
  await prisma.checklistItem.delete({ where: { id: req.params.itemId } });
  res.json({ message: 'Item deleted' });
};
