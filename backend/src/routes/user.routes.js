const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/profile', ctrl.getProfile);
router.patch('/profile', ctrl.updateProfile);
router.patch('/change-password', ctrl.changePassword);
router.get('/stats', requireAdmin, ctrl.getStats);

module.exports = router;
