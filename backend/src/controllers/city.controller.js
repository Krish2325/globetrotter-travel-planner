const prisma = require('../lib/prisma');
const { handleError } = require('../lib/errors');

// GET /api/cities?q=xxx
exports.getCities = async (req, res, next) => {
  try {
    const { q } = req.query;
    const cities = await prisma.city.findMany({
      where: q ? { name: { contains: q } } : {},
      orderBy: { name: 'asc' },
      take: 20,
    });
    res.json(cities);
  } catch (err) { handleError(err, res, next); }
};

// GET /api/cities/:id
exports.getCityById = async (req, res, next) => {
  try {
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { activities: { orderBy: { name: 'asc' } } },
    });
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json(city);
  } catch (err) { handleError(err, res, next); }
};

// POST /api/cities  (admin)
exports.createCity = async (req, res, next) => {
  try {
    const { name, country, countryCode, latitude, longitude, imageUrl, description, timezone } = req.body;
    if (!name || !country || !countryCode || latitude == null || longitude == null)
      return res.status(400).json({ error: 'name, country, countryCode, latitude, longitude required' });

    const city = await prisma.city.create({
      data: { name, country, countryCode, latitude, longitude, imageUrl, description, timezone },
    });
    res.status(201).json(city);
  } catch (err) { handleError(err, res, next); }
};

// PATCH /api/cities/:id  (admin)
exports.updateCity = async (req, res, next) => {
  try {
    const city = await prisma.city.update({ where: { id: req.params.id }, data: req.body });
    res.json(city);
  } catch (err) { handleError(err, res, next); }
};

// DELETE /api/cities/:id  (admin)
exports.deleteCity = async (req, res, next) => {
  try {
    await prisma.city.delete({ where: { id: req.params.id } });
    res.json({ message: 'City deleted' });
  } catch (err) { handleError(err, res, next); }
};
