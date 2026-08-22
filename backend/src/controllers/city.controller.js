const prisma = require('../lib/prisma');

// GET /api/cities?q=xxx
exports.getCities = async (req, res) => {
  const { q } = req.query;
  const cities = await prisma.city.findMany({
    where: q ? { name: { contains: q } } : {},
    orderBy: { name: 'asc' },
    take: 20,
  });
  res.json(cities);
};

// GET /api/cities/:id
exports.getCityById = async (req, res) => {
  const city = await prisma.city.findUnique({
    where: { id: req.params.id },
    include: { activities: { orderBy: { name: 'asc' } } },
  });
  if (!city) return res.status(404).json({ error: 'City not found' });
  res.json(city);
};

// POST /api/cities  (admin)
exports.createCity = async (req, res) => {
  const { name, country, countryCode, latitude, longitude, imageUrl, description, timezone } = req.body;
  if (!name || !country || !countryCode || latitude == null || longitude == null)
    return res.status(400).json({ error: 'name, country, countryCode, latitude, longitude required' });

  const city = await prisma.city.create({
    data: { name, country, countryCode, latitude, longitude, imageUrl, description, timezone },
  });
  res.status(201).json(city);
};

// PATCH /api/cities/:id  (admin)
exports.updateCity = async (req, res) => {
  const city = await prisma.city.update({ where: { id: req.params.id }, data: req.body });
  res.json(city);
};

// DELETE /api/cities/:id  (admin)
exports.deleteCity = async (req, res) => {
  await prisma.city.delete({ where: { id: req.params.id } });
  res.json({ message: 'City deleted' });
};
