const prisma = require('../lib/prisma');

// GET /api/notes?tripId=xxx
exports.getNotes = async (req, res) => {
  const { tripId } = req.query;
  if (!tripId) return res.status(400).json({ error: 'tripId required' });
  const notes = await prisma.note.findMany({ where: { tripId }, orderBy: { updatedAt: 'desc' } });
  res.json(notes);
};

// POST /api/notes
exports.createNote = async (req, res) => {
  const { tripId, title, content } = req.body;
  if (!tripId || !title || !content)
    return res.status(400).json({ error: 'tripId, title, content required' });
  const note = await prisma.note.create({
    data: { tripId, userId: req.user.id, title, content },
  });
  res.status(201).json(note);
};

// PATCH /api/notes/:id
exports.updateNote = async (req, res) => {
  const note = await prisma.note.update({ where: { id: req.params.id }, data: req.body });
  res.json(note);
};

// DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  await prisma.note.delete({ where: { id: req.params.id } });
  res.json({ message: 'Note deleted' });
};
