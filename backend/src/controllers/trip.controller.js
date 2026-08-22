const prisma = require('../lib/prisma');

// ── Admin: Get ALL trips (not just current user's) ────────────────────────────
exports.adminGetAllTrips = async (req, res) => {
  try {
    const { q, status, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (q) where.title = { contains: q };
    if (status) where.status = status;

    const [trips, total] = await prisma.$transaction([
      prisma.trip.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } }, stops: { include: { city: true } }, budget: true },
        orderBy: { createdAt: 'desc' },
        skip, take: parseInt(limit),
      }),
      prisma.trip.count({ where }),
    ]);
    res.json({ trips, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── Admin: Create trip (no userId requirement — admin can create catalog trips) ─
exports.adminCreateTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, coverImage, isPublic, startingLocation,
      destination, durationDays, packageType, basePrice, bestSeason, images,
      rating, views, popularity, isTrending, maxPeople, status } = req.body;

    if (!title || !startDate || !endDate)
      return res.status(400).json({ error: 'title, startDate, endDate required' });

    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title, description, startingLocation, destination,
        durationDays: durationDays ? parseInt(durationDays) : null,
        packageType,
        basePrice: basePrice ? parseFloat(basePrice) : null,
        bestSeason, images,
        rating: rating ? parseFloat(rating) : 0,
        views: views ? parseInt(views) : 0,
        popularity: popularity ? parseInt(popularity) : 0,
        isTrending: !!isTrending,
        maxPeople: maxPeople ? parseInt(maxPeople) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverImage,
        isPublic: isPublic !== undefined ? !!isPublic : true,
        status: status || 'AVAILABLE',
      },
    });
    res.status(201).json(trip);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── Admin: Update any trip ─────────────────────────────────────────────────────
exports.adminUpdateTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const data = {};
    const fields = ['title','description','startingLocation','destination','packageType','bestSeason','images','coverImage','status'];
    const floats = ['basePrice','rating'];
    const ints = ['durationDays','views','popularity','maxPeople'];
    const bools = ['isTrending','isPublic'];
    const dates = ['startDate','endDate'];

    fields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
    floats.forEach(f => { if (req.body[f] !== undefined) data[f] = parseFloat(req.body[f]); });
    ints.forEach(f => { if (req.body[f] !== undefined) data[f] = parseInt(req.body[f]); });
    bools.forEach(f => { if (req.body[f] !== undefined) data[f] = !!req.body[f]; });
    dates.forEach(f => { if (req.body[f]) data[f] = new Date(req.body[f]); });

    const updated = await prisma.trip.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── Admin: Delete any trip ─────────────────────────────────────────────────────
exports.adminDeleteTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    await prisma.trip.delete({ where: { id: req.params.id } });
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── User: Get own trips ────────────────────────────────────────────────────────
exports.getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: { stops: { include: { city: true } }, budget: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(trips);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── User: Get public/available trips (for discovery) ──────────────────────────
exports.getPublicTrips = async (req, res) => {
  try {
    const { q, season, type, sort = 'popularity' } = req.query;
    const where = { OR: [{ isPublic: true }, { status: 'AVAILABLE' }] };
    if (q) where.title = { contains: q };
    if (season) where.bestSeason = season;
    if (type) where.packageType = type;

    const orderBy = sort === 'rating' ? { rating: 'desc' }
      : sort === 'newest' ? { createdAt: 'desc' }
      : { popularity: 'desc' };

    const trips = await prisma.trip.findMany({
      where, orderBy,
      include: { stops: { include: { city: true } } },
      take: 50,
    });
    res.json(trips);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        stops: {
          include: { city: true, stopActivities: { include: { activity: true } } },
          orderBy: { order: 'asc' },
        },
        budget: true, expenses: true,
        checklists: { include: { items: { orderBy: { order: 'asc' } } } },
        notes: true,
      },
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, coverImage, isPublic, startingLocation,
      destination, durationDays, packageType, basePrice, bestSeason, images,
      rating, views, popularity, isTrending, maxPeople, status } = req.body;
    if (!title || !startDate || !endDate)
      return res.status(400).json({ error: 'title, startDate, endDate required' });

    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id, title, description, startingLocation, destination,
        durationDays: durationDays ? parseInt(durationDays) : null,
        packageType,
        basePrice: basePrice ? parseFloat(basePrice) : null,
        bestSeason, images,
        rating: rating ? parseFloat(rating) : 0,
        views: views ? parseInt(views) : 0,
        popularity: popularity ? parseInt(popularity) : 0,
        isTrending: !!isTrending,
        maxPeople: maxPeople ? parseInt(maxPeople) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverImage,
        isPublic: !!isPublic,
        status: status || 'PLANNING',
      },
    });
    res.status(201).json(trip);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    const data = {};
    const fields = ['title','description','startingLocation','destination','packageType','bestSeason','images','coverImage','status'];
    const floats = ['basePrice','rating']; const ints = ['durationDays','views','popularity','maxPeople'];
    const bools = ['isTrending','isPublic']; const dates = ['startDate','endDate'];
    fields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
    floats.forEach(f => { if (req.body[f] !== undefined) data[f] = parseFloat(req.body[f]); });
    ints.forEach(f => { if (req.body[f] !== undefined) data[f] = parseInt(req.body[f]); });
    bools.forEach(f => { if (req.body[f] !== undefined) data[f] = !!req.body[f]; });
    dates.forEach(f => { if (req.body[f]) data[f] = new Date(req.body[f]); });
    const updated = await prisma.trip.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    await prisma.trip.delete({ where: { id: req.params.id } });
    res.json({ message: 'Trip deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
