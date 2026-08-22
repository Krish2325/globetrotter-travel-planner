const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { signup, adminSignup, login, verifyEmail, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// 20 attempts per 15 min per IP — generous enough for real users, tight enough
// to blunt brute-force login guessing and mass account/admin creation.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});

router.post('/signup', authLimiter, signup);
router.post('/admin-signup', authLimiter, adminSignup);
router.post('/login', authLimiter, login);
router.get('/verify-email', verifyEmail);
router.get('/me', authenticate, getMe);

module.exports = router;
