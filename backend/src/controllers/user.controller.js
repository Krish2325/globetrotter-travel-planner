const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, avatarUrl: true, isEmailVerified: true, role: true, createdAt: true },
  });
  res.json(user);
};

// PATCH /api/users/profile
exports.updateProfile = async (req, res) => {
  const { name, avatarUrl } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { ...(name && { name }), ...(avatarUrl !== undefined && { avatarUrl }) },
    select: { id: true, name: true, email: true, avatarUrl: true, isEmailVerified: true },
  });
  res.json(user);
};

// PATCH /api/users/change-password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'currentPassword and newPassword required' });

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
  res.json({ message: 'Password updated successfully' });
};

// GET /api/users/stats — for admin
exports.getStats = async (req, res) => {
  const [totalUsers, totalTrips, totalShares] = await prisma.$transaction([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.communityShare.count(),
  ]);
  res.json({ totalUsers, totalTrips, totalShares });
};
