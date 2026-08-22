const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { handleError } = require('../lib/errors');

// GET /api/users/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, avatarUrl: true, isEmailVerified: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (err) { handleError(err, res, next); }
};

// PATCH /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name && { name }), ...(avatarUrl !== undefined && { avatarUrl }) },
      select: { id: true, name: true, email: true, avatarUrl: true, isEmailVerified: true },
    });
    res.json(user);
  } catch (err) { handleError(err, res, next); }
};

// PATCH /api/users/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'currentPassword and newPassword required' });
    if (newPassword.length < 8)
      return res.status(400).json({ error: 'New password must be at least 8 characters' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
    res.json({ message: 'Password updated successfully' });
  } catch (err) { handleError(err, res, next); }
};

// GET /api/users/stats — for admin
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTrips, totalShares] = await prisma.$transaction([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.communityShare.count(),
    ]);
    res.json({ totalUsers, totalTrips, totalShares });
  } catch (err) { handleError(err, res, next); }
};
