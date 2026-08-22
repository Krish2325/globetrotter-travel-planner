// Maps known Prisma error codes to safe HTTP responses; anything unexpected
// goes to the global error handler in app.js instead of leaking err.message.
const handleError = (err, res, next) => {
  if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' });
  if (err.code === 'P2002') return res.status(409).json({ error: 'A record with that value already exists' });
  if (err.code === 'P2003') return res.status(409).json({ error: 'This item is still referenced by other records' });
  next(err);
};

module.exports = { handleError };
