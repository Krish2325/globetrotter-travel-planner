const prisma = require('../lib/prisma');

const toFloat = (v) => (v != null && v !== '' ? parseFloat(v) : undefined);

// GET /api/budgets/:tripId
exports.getBudget = async (req, res) => {
  try {
    const budget = await prisma.budget.findUnique({ where: { tripId: req.params.tripId } });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// POST /api/budgets
exports.createBudget = async (req, res) => {
  try {
    const { tripId, totalBudget, currency, accommodation, food, transport, activities, shopping, miscellaneous } = req.body;
    if (!tripId || totalBudget == null)
      return res.status(400).json({ error: 'tripId, totalBudget required' });

    const budget = await prisma.budget.create({
      data: {
        tripId,
        totalBudget: parseFloat(totalBudget),
        currency: currency || 'INR',
        accommodation: toFloat(accommodation),
        food: toFloat(food),
        transport: toFloat(transport),
        activities: toFloat(activities),
        shopping: toFloat(shopping),
        miscellaneous: toFloat(miscellaneous),
      },
    });
    res.status(201).json(budget);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// PATCH /api/budgets/:tripId
exports.updateBudget = async (req, res) => {
  try {
    const data = { ...req.body };
    // Coerce all numeric fields
    ['totalBudget','accommodation','food','transport','activities','shopping','miscellaneous'].forEach(k => {
      if (data[k] != null) data[k] = parseFloat(data[k]);
    });
    const budget = await prisma.budget.update({ where: { tripId: req.params.tripId }, data });
    res.json(budget);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// DELETE /api/budgets/:tripId
exports.deleteBudget = async (req, res) => {
  try {
    await prisma.budget.delete({ where: { tripId: req.params.tripId } });
    res.json({ message: 'Budget deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
