const { v4: uuidv4 } = require('uuid');
const prisma = require('../lib/prisma');

// GET /api/community — all public shares
exports.getPublicShares = async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const shares = await prisma.communityShare.findMany({
    where: q ? { title: { contains: q } } : {},
    include: { user: { select: { id: true, name: true, avatarUrl: true } }, trip: { include: { stops: { include: { city: true } } } } },
    orderBy: { createdAt: 'desc' },
    skip,
    take: Number(limit),
  });
  res.json(shares);
};

// GET /api/community/:slug
exports.getShareBySlug = async (req, res) => {
  const share = await prisma.communityShare.findUnique({
    where: { slug: req.params.slug },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      trip: {
        include: {
          stops: {
            include: { city: true, stopActivities: { include: { activity: true }, orderBy: { order: 'asc' } } },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
  if (!share) return res.status(404).json({ error: 'Share not found' });

  // increment view count
  await prisma.communityShare.update({ where: { id: share.id }, data: { viewsCount: { increment: 1 } } });
  res.json(share);
};

// POST /api/community  — share a trip publicly
exports.shareTrip = async (req, res) => {
  const { tripId, title, description, tags } = req.body;
  if (!tripId || !title) return res.status(400).json({ error: 'tripId, title required' });

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uuidv4().slice(0, 6)}`;
  const share = await prisma.communityShare.create({
    data: { tripId, userId: req.user.id, slug, title, description, tags: tags ? JSON.stringify(tags) : null },
  });

  // mark trip as public
  await prisma.trip.update({ where: { id: tripId }, data: { isPublic: true } });

  res.status(201).json(share);
};

// POST /api/community/:slug/copy  — copy someone's trip to current user
exports.copyTrip = async (req, res) => {
  const share = await prisma.communityShare.findUnique({
    where: { slug: req.params.slug },
    include: {
      trip: {
        include: {
          stops: { include: { stopActivities: true } },
          budget: true,
          checklists: { include: { items: true } },
        },
      },
    },
  });
  if (!share) return res.status(404).json({ error: 'Share not found' });

  const original = share.trip;

  // deep copy trip
  const newTrip = await prisma.trip.create({
    data: {
      userId: req.user.id,
      title: `${original.title} (Copy)`,
      description: original.description,
      coverImage: original.coverImage,
      startDate: original.startDate,
      endDate: original.endDate,
    },
  });

  // copy stops & activities
  for (const stop of original.stops) {
    const newStop = await prisma.stop.create({
      data: { tripId: newTrip.id, cityId: stop.cityId, dayNumber: stop.dayNumber, order: stop.order, notes: stop.notes },
    });
    for (const sa of stop.stopActivities) {
      await prisma.stopActivity.create({
        data: { stopId: newStop.id, activityId: sa.activityId, order: sa.order, notes: sa.notes },
      });
    }
  }

  // record copy
  await prisma.tripCopy.create({ data: { originalTripId: original.id, copiedByUserId: req.user.id, newTripId: newTrip.id } });

  res.status(201).json({ message: 'Trip copied successfully', tripId: newTrip.id });
};

// DELETE /api/community/:slug
exports.deleteShare = async (req, res) => {
  const share = await prisma.communityShare.findUnique({ where: { slug: req.params.slug } });
  if (!share || share.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  await prisma.communityShare.delete({ where: { slug: req.params.slug } });
  res.json({ message: 'Share removed' });
};
