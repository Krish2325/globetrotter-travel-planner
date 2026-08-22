const prisma = require("../lib/prisma");

// GET /api/public/trips?sort=popular|trending|newest&season=&type=&q=&limit=
exports.getPublicTrips = async (req, res) => {
  try {
    const { sort = "popular", season, type, q, limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
      isPublic: true,
      status: { in: ["AVAILABLE", "ACTIVE", "ONGOING"] },
    };
    if (season) where.bestSeason = { contains: season };
    if (type)   where.packageType = type;
    if (q)      where.OR = [
      { title:       { contains: q } },
      { destination: { contains: q } },
      { description: { contains: q } },
    ];
    const orderBy =
      sort === "trending" ? [{ isTrending: "desc" }, { popularity: "desc" }]
      : sort === "newest"  ? { createdAt: "desc" }
      : sort === "rating"  ? { rating: "desc" }
      : { popularity: "desc" };

    const [trips, total] = await prisma.$transaction([
      prisma.trip.findMany({ where, orderBy, skip, take: parseInt(limit) }),
      prisma.trip.count({ where }),
    ]);
    res.json({ trips, total, page: parseInt(page) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/public/trips/recommended  — top 10 by popularity + trending
exports.getRecommendedTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { isPublic: true, status: { in: ["AVAILABLE", "ACTIVE"] } },
      orderBy: [{ isTrending: "desc" }, { popularity: "desc" }, { rating: "desc" }],
      take: 10,
    });
    res.json(trips);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/public/trips/active
exports.getActiveTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { isPublic: true, status: "ACTIVE" },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(trips);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/public/trips/trending
exports.getTrendingTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { isPublic: true, isTrending: true, status: { in: ["AVAILABLE", "ACTIVE"] } },
      orderBy: { popularity: "desc" },
      take: 10,
    });
    res.json(trips);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/public/cities?q=&limit=
exports.getPublicCities = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    const where = q ? { OR: [{ name: { contains: q } }, { country: { contains: q } }] } : {};
    const cities = await prisma.city.findMany({
      where, orderBy: { name: "asc" }, take: parseInt(limit),
      include: { _count: { select: { activities: true } } },
    });
    res.json(cities.map(c => ({ ...c, activityCount: c._count.activities })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/public/cities/popular — cities with most activities
exports.getPopularCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      take: 12,
      include: { _count: { select: { activities: true, stops: true } } },
      orderBy: { activities: { _count: "desc" } },
    });
    res.json(cities.map(c => ({ ...c, activityCount: c._count.activities, tripCount: c._count.stops })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/public/activities?cityId=&category=&q=
exports.getPublicActivities = async (req, res) => {
  try {
    const { cityId, category, q, limit = 30 } = req.query;
    const where = {};
    if (cityId)   where.cityId = cityId;
    if (category) where.category = category;
    if (q)        where.name = { contains: q };
    const activities = await prisma.activity.findMany({
      where, orderBy: { name: "asc" }, take: parseInt(limit),
      include: { city: { select: { name: true, country: true } } },
    });
    res.json(activities);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/public/search?q=  — unified search across trips + cities
exports.globalSearch = async (req, res) => {
  try {
    const { q = "" } = req.query;
    if (q.length < 2) return res.json({ trips: [], cities: [], activities: [] });

    const [trips, cities, activities] = await Promise.all([
      prisma.trip.findMany({
        where: {
          isPublic: true, status: { in: ["AVAILABLE", "ACTIVE"] },
          OR: [{ title: { contains: q } }, { destination: { contains: q } }],
        },
        take: 5,
      }),
      prisma.city.findMany({
        where: { OR: [{ name: { contains: q } }, { country: { contains: q } }] },
        take: 5,
      }),
      prisma.activity.findMany({
        where: { name: { contains: q } },
        include: { city: { select: { name: true } } },
        take: 5,
      }),
    ]);
    res.json({ trips, cities, activities });
  } catch (err) { res.status(500).json({ error: err.message }); }
};