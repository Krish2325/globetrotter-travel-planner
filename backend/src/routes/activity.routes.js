const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/activity.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', ctrl.getActivities);
router.get('/:id', ctrl.getActivityById);
router.post('/', authenticate, requireAdmin, ctrl.createActivity);
router.patch('/:id', authenticate, requireAdmin, ctrl.updateActivity);
router.delete('/:id', authenticate, requireAdmin, ctrl.deleteActivity);

module.exports = router;
