const prisma = require('../lib/prisma');
const { handleError } = require('../lib/errors');

const ownsTrip = (tripId, userId) => prisma.trip.findFirst({ where: { id: tripId, userId } });

// GET /api/expenses?tripId=xxx
exports.getExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.query;
    if (!tripId) return res.status(400).json({ error: 'tripId required' });
    if (!(await ownsTrip(tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });
    const expenses = await prisma.expense.findMany({ where: { tripId }, orderBy: { date: 'desc' } });
    res.json(expenses);
  } catch (err) { handleError(err, res, next); }
};

// POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const { tripId, title, amount, currency, category, date, notes, receiptUrl } = req.body;
    if (!tripId || !title || amount == null || !category || !date)
      return res.status(400).json({ error: 'tripId, title, amount, category, date required' });
    if (!(await ownsTrip(tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });

    const expense = await prisma.expense.create({
      data: {
        tripId, title,
        amount: parseFloat(amount),
        currency: currency || 'INR',
        category,
        date: new Date(date),
        notes,
        receiptUrl,
      },
    });
    res.status(201).json(expense);
  } catch (err) { handleError(err, res, next); }
};

// PATCH /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    const existing = await prisma.expense.findFirst({ where: { id: req.params.id, trip: { userId: req.user.id } } });
    if (!existing) return res.status(404).json({ error: 'Expense not found' });

    const data = { ...req.body };
    if (data.amount != null) data.amount = parseFloat(data.amount);
    if (data.date) data.date = new Date(data.date);
    const expense = await prisma.expense.update({ where: { id: req.params.id }, data });
    res.json(expense);
  } catch (err) { handleError(err, res, next); }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const existing = await prisma.expense.findFirst({ where: { id: req.params.id, trip: { userId: req.user.id } } });
    if (!existing) return res.status(404).json({ error: 'Expense not found' });
    await prisma.expense.delete({ where: { id: req.params.id } });
    res.json({ message: 'Expense deleted' });
  } catch (err) { handleError(err, res, next); }
};
