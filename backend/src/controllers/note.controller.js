const prisma = require('../lib/prisma');

// GET /api/notes?tripId=xxx
exports.getNotes = async (req, res) => {
  const { tripId } = req.query;
  if (!tripId) return res.status(400).json({ error: 'tripId required' });

  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.id } });
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  const notes = await prisma.note.findMany({ where: { tripId }, orderBy: { updatedAt: 'desc' } });
  res.json(notes);
};

// POST /api/notes
exports.createNote = async (req, res) => {
  const { tripId, title, content } = req.body;
  if (!tripId || !title || !content)
    return res.status(400).json({ error: 'tripId, title, content required' });

  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.id } });
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  const note = await prisma.note.create({
    data: { tripId, userId: req.user.id, title, content },
  });
  res.status(201).json(note);
};

// PATCH /api/notes/:id
exports.updateNote = async (req, res) => {
  const existing = await prisma.note.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Note not found' });

  const { title, content } = req.body;
  const data = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;

  const note = await prisma.note.update({ where: { id: req.params.id }, data });
  res.json(note);
};

// DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  const existing = await prisma.note.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Note not found' });

  await prisma.note.delete({ where: { id: req.params.id } });
  res.json({ message: 'Note deleted' });
};
