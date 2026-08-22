const prisma = require('../lib/prisma');

// ── GET /api/analytics/dashboard  (admin) ────────────────────────────────────
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const [totalUsers, activeTrips, citiesListed, activitiesCount, totalTrips, communityPosts] =
      await prisma.$transaction([
        prisma.user.count(),
        prisma.trip.count({ where: { status: { in: ['ACTIVE', 'ONGOING', 'AVAILABLE'] } } }),
        prisma.city.count(),
        prisma.activity.count(),
        prisma.trip.count(),
        prisma.communityShare.count(),
      ]);

    const recentTrips = (await prisma.trip.findMany({
      take: 5, orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    })).map(t => ({
      id: t.id, title: t.title,
      user: t.user?.name || 'Unknown',
      status: t.status,
      date: t.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    const recentUsers = (await prisma.user.findMany({
      take: 5, orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })).map(u => ({ ...u, joined: u.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }));

    res.json({ stats: { totalUsers, activeTrips, citiesListed, activitiesCount, totalTrips, communityPosts }, recentTrips, recentUsers });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── GET /api/analytics/users  (admin) ────────────────────────────────────────
exports.getUserAnalytics = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true, isEmailVerified: true, _count: { select: { trips: true } } },
    });
    res.json(users.map(u => ({
      ...u, trips: u._count.trips,
      joined: u.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'active',
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ── GET /api/analytics/community  (admin) ────────────────────────────────────
exports.getCommunityAnalytics = async (req, res) => {
  try {
    const posts = await prisma.communityShare.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } }, trip: { select: { title: true } } },
    });
    res.json(posts.map(p => ({
      id: p.id, title: p.title, slug: p.slug, likes: p.likesCount, views: p.viewsCount,
      user: p.user?.name || 'Unknown', trip: p.trip?.title, status: 'active',
      date: p.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};
