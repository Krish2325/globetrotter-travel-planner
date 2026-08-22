const prisma = require('../lib/prisma');
const { handleError } = require('../lib/errors');

const toFloat = (v) => (v != null && v !== '' ? parseFloat(v) : undefined);

const ownsTrip = (tripId, userId) => prisma.trip.findFirst({ where: { id: tripId, userId } });

// GET /api/budgets/:tripId
exports.getBudget = async (req, res, next) => {
  try {
    if (!(await ownsTrip(req.params.tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });
    const budget = await prisma.budget.findUnique({ where: { tripId: req.params.tripId } });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) { handleError(err, res, next); }
};

// POST /api/budgets
exports.createBudget = async (req, res, next) => {
  try {
    const { tripId, totalBudget, currency, accommodation, food, transport, activities, shopping, miscellaneous } = req.body;
    if (!tripId || totalBudget == null)
      return res.status(400).json({ error: 'tripId, totalBudget required' });
    if (!(await ownsTrip(tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });

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
  } catch (err) { handleError(err, res, next); }
};

// PATCH /api/budgets/:tripId
exports.updateBudget = async (req, res, next) => {
  try {
    if (!(await ownsTrip(req.params.tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });
    const data = { ...req.body };
    ['totalBudget','accommodation','food','transport','activities','shopping','miscellaneous'].forEach(k => {
      if (data[k] != null) data[k] = parseFloat(data[k]);
    });
    const budget = await prisma.budget.update({ where: { tripId: req.params.tripId }, data });
    res.json(budget);
  } catch (err) { handleError(err, res, next); }
};

// DELETE /api/budgets/:tripId
exports.deleteBudget = async (req, res, next) => {
  try {
    if (!(await ownsTrip(req.params.tripId, req.user.id))) return res.status(404).json({ error: 'Trip not found' });
    await prisma.budget.delete({ where: { tripId: req.params.tripId } });
    res.json({ message: 'Budget deleted' });
  } catch (err) { handleError(err, res, next); }
};
