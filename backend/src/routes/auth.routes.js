const express = require('express');
const router = express.Router();
const { signup, adminSignup, login, verifyEmail, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/signup', signup);
router.post('/admin-signup', adminSignup);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.get('/me', authenticate, getMe);

module.exports = router;
