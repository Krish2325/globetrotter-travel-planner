const prisma = require('../lib/prisma');

// GET /api/stops?tripId=xxx
exports.getStops = async (req, res) => {
  const { tripId } = req.query;
  if (!tripId) return res.status(400).json({ error: 'tripId query param required' });
  const stops = await prisma.stop.findMany({
    where: { tripId },
    include: { city: true, stopActivities: { include: { activity: true }, orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  });
  res.json(stops);
};

// POST /api/stops
exports.createStop = async (req, res) => {
  const { tripId, cityId, dayNumber, arrivalAt, departAt, notes, order } = req.body;
  if (!tripId || !cityId || dayNumber == null)
    return res.status(400).json({ error: 'tripId, cityId, dayNumber required' });

  const stop = await prisma.stop.create({
    data: {
      tripId, cityId, dayNumber,
      arrivalAt: arrivalAt ? new Date(arrivalAt) : null,
      departAt: departAt ? new Date(departAt) : null,
      notes, order: order || 0,
    },
    include: { city: true },
  });
  res.status(201).json(stop);
};

// PATCH /api/stops/:id
exports.updateStop = async (req, res) => {
  const { dayNumber, arrivalAt, departAt, notes, order } = req.body;
  const stop = await prisma.stop.update({
    where: { id: req.params.id },
    data: {
      ...(dayNumber != null && { dayNumber }),
      ...(arrivalAt !== undefined && { arrivalAt: arrivalAt ? new Date(arrivalAt) : null }),
      ...(departAt !== undefined && { departAt: departAt ? new Date(departAt) : null }),
      ...(notes !== undefined && { notes }),
      ...(order != null && { order }),
    },
    include: { city: true },
  });
  res.json(stop);
};

// DELETE /api/stops/:id
exports.deleteStop = async (req, res) => {
  await prisma.stop.delete({ where: { id: req.params.id } });
  res.json({ message: 'Stop deleted' });
};

// POST /api/stops/:stopId/activities/:activityId
exports.addActivityToStop = async (req, res) => {
  const { stopId, activityId } = req.params;
  const { startTime, endTime, notes, order } = req.body;
  const sa = await prisma.stopActivity.create({
    data: {
      stopId, activityId,
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
      notes, order: order || 0,
    },
    include: { activity: true },
  });
  res.status(201).json(sa);
};

// DELETE /api/stops/:stopId/activities/:activityId
exports.removeActivityFromStop = async (req, res) => {
  const { stopId, activityId } = req.params;
  await prisma.stopActivity.deleteMany({ where: { stopId, activityId } });
  res.json({ message: 'Activity removed from stop' });
};
