const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trip.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

// ── Public discovery ──────────────────────────────────────────────────────────
router.get('/public', ctrl.getPublicTrips);

// ── Admin routes (all trips) ──────────────────────────────────────────────────
router.get('/admin/all',       authenticate, requireAdmin, ctrl.adminGetAllTrips);
router.post('/admin',          authenticate, requireAdmin, ctrl.adminCreateTrip);
router.patch('/admin/:id',     authenticate, requireAdmin, ctrl.adminUpdateTrip);
router.delete('/admin/:id',    authenticate, requireAdmin, ctrl.adminDeleteTrip);

// ── User routes (own trips) ───────────────────────────────────────────────────
router.use(authenticate);
router.get('/',       ctrl.getTrips);
router.post('/',      ctrl.createTrip);
router.get('/:id',    ctrl.getTripById);
router.patch('/:id',  ctrl.updateTrip);
router.delete('/:id', ctrl.deleteTrip);

module.exports = router;
