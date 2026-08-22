const express = require('express');
const router = express.Router();
const { signup, adminSignup, login, verifyEmail, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/signup', authLimiter, signup);
router.post('/admin-signup', authLimiter, adminSignup);
router.post('/login', authLimiter, login);
router.get('/verify-email', verifyEmail);
router.get('/me', authenticate, getMe);

module.exports = router;
