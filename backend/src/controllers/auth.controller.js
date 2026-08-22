const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../lib/prisma');

// ── Helpers ───────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isValidEmail = (e) => EMAIL_RE.test(String(e).toLowerCase());

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email, and password are required' });
    if (name.length < 2 || name.length > 60)
      return res.status(400).json({ error: 'Name must be 2–60 characters' });
    if (!isValidEmail(email))
      return res.status(400).json({ error: 'Please enter a valid email address' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const emailToken = uuidv4();

    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), passwordHash, emailToken },
    });

    try {
      const { sendVerificationEmail } = require('../services/email.service');
      await sendVerificationEmail(email, name, emailToken);
    } catch (emailErr) {
      console.warn('Email send skipped (no SMTP config):', emailErr.message);
    }

    const token = signToken(user.id);
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email, isEmailVerified: user.isEmailVerified, role: user.role },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ── POST /api/auth/admin-signup ───────────────────────────────────────────────
exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email, and password are required' });
    if (name.length < 2 || name.length > 60)
      return res.status(400).json({ error: 'Name must be 2–60 characters' });
    if (!isValidEmail(email))
      return res.status(400).json({ error: 'Please enter a valid email address' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const emailToken = uuidv4();

    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), passwordHash, emailToken, role: 'ADMIN' },
    });

    const token = signToken(user.id);
    console.log(`[Admin] New admin registered: ${email}`);

    res.status(201).json({
      message: 'Admin account created successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Admin signup error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required' });
    if (!isValidEmail(email))
      return res.status(400).json({ error: 'Please enter a valid email address' });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// ── GET /api/auth/verify-email?token=xxx ─────────────────────────────────────
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required' });

    const user = await prisma.user.findUnique({ where: { emailToken: token } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailToken: null },
    });
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true,
        avatarUrl: true, isEmailVerified: true,
        role: true, createdAt: true,
      },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch user data' });
  }
};
