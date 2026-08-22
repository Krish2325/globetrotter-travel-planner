const prisma = require('../lib/prisma');

// GET /api/activities?cityId=xxx&category=xxx&q=xxx
exports.getActivities = async (req, res) => {
  const { cityId, category, q } = req.query;
  const activities = await prisma.activity.findMany({
    where: {
      ...(cityId && { cityId }),
      ...(category && { category }),
      ...(q && { name: { contains: q } }),
    },
    include: { city: true },
    orderBy: { name: 'asc' },
  });
  res.json(activities);
};

// GET /api/activities/:id
exports.getActivityById = async (req, res) => {
  const activity = await prisma.activity.findUnique({
    where: { id: req.params.id },
    include: { city: true },
  });
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  res.json(activity);
};

// POST /api/activities  (admin)
exports.createActivity = async (req, res) => {
  const { cityId, name, description, category, address, latitude, longitude, durationMin, costEstimate, imageUrl, externalUrl } = req.body;
  if (!cityId || !name || !category)
    return res.status(400).json({ error: 'cityId, name, category required' });

  const activity = await prisma.activity.create({
    data: { cityId, name, description, category, address, latitude, longitude, durationMin, costEstimate, imageUrl, externalUrl },
  });
  res.status(201).json(activity);
};

// PATCH /api/activities/:id  (admin)
exports.updateActivity = async (req, res) => {
  const activity = await prisma.activity.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(activity);
};

// DELETE /api/activities/:id  (admin)
exports.deleteActivity = async (req, res) => {
  await prisma.activity.delete({ where: { id: req.params.id } });
  res.json({ message: 'Activity deleted' });
};
