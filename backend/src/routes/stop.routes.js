const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stop.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', ctrl.getStops);
router.post('/', ctrl.createStop);
router.patch('/:id', ctrl.updateStop);
router.delete('/:id', ctrl.deleteStop);
router.post('/:stopId/activities/:activityId', ctrl.addActivityToStop);
router.delete('/:stopId/activities/:activityId', ctrl.removeActivityFromStop);

module.exports = router;
