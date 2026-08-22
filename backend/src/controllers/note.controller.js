const prisma = require('../lib/prisma');
const { handleError } = require('../lib/errors');

const ownsTrip = (tripId, userId) => prisma.trip.findFirst({ where: { id: tripId, userId } });

// GET /api/notes?tripId=xxx
exports.getNotes = async (req, res, next) => {
  try {
    const { tripId } = req.query;
    if (!tripId) return res.status(400).json({ error: 'tripId required' });
    if (!(await ownsTrip(tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });
    const notes = await prisma.note.findMany({ where: { tripId }, orderBy: { updatedAt: 'desc' } });
    res.json(notes);
  } catch (err) { handleError(err, res, next); }
};

// POST /api/notes
exports.createNote = async (req, res, next) => {
  try {
    const { tripId, title, content } = req.body;
    if (!tripId || !title || !content)
      return res.status(400).json({ error: 'tripId, title, content required' });
    if (!(await ownsTrip(tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });
    const note = await prisma.note.create({
      data: { tripId, userId: req.user.id, title, content },
    });
    res.status(201).json(note);
  } catch (err) { handleError(err, res, next); }
};

// PATCH /api/notes/:id
exports.updateNote = async (req, res, next) => {
  try {
    const existing = await prisma.note.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Note not found' });
    const note = await prisma.note.update({ where: { id: req.params.id }, data: req.body });
    res.json(note);
  } catch (err) { handleError(err, res, next); }
};

// DELETE /api/notes/:id
exports.deleteNote = async (req, res, next) => {
  try {
    const existing = await prisma.note.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Note not found' });
    await prisma.note.delete({ where: { id: req.params.id } });
    res.json({ message: 'Note deleted' });
  } catch (err) { handleError(err, res, next); }
};
