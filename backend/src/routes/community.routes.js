const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/community.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', ctrl.getPublicShares);
router.get('/:slug', ctrl.getShareBySlug);
router.post('/', authenticate, ctrl.shareTrip);
router.post('/:slug/copy', authenticate, ctrl.copyTrip);
router.delete('/:slug', authenticate, ctrl.deleteShare);

module.exports = router;
