const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analytics.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.get('/dashboard',  authenticate, requireAdmin, ctrl.getDashboardAnalytics);
router.get('/users',      authenticate, requireAdmin, ctrl.getUserAnalytics);
router.get('/community',  authenticate, requireAdmin, ctrl.getCommunityAnalytics);

module.exports = router;
