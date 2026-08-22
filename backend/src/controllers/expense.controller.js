const prisma = require('../lib/prisma');

// GET /api/expenses?tripId=xxx
exports.getExpenses = async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId) return res.status(400).json({ error: 'tripId required' });
    const expenses = await prisma.expense.findMany({ where: { tripId }, orderBy: { date: 'desc' } });
    res.json(expenses);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { tripId, title, amount, currency, category, date, notes, receiptUrl } = req.body;
    if (!tripId || !title || amount == null || !category || !date)
      return res.status(400).json({ error: 'tripId, title, amount, category, date required' });

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
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// PATCH /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.amount != null) data.amount = parseFloat(data.amount);
    if (data.date) data.date = new Date(data.date);
    const expense = await prisma.expense.update({ where: { id: req.params.id }, data });
    res.json(expense);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    await prisma.expense.delete({ where: { id: req.params.id } });
    res.json({ message: 'Expense deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
