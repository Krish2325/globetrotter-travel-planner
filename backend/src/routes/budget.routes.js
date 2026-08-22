const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/budget.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/:tripId', ctrl.getBudget);
router.post('/', ctrl.createBudget);
router.patch('/:tripId', ctrl.updateBudget);
router.delete('/:tripId', ctrl.deleteBudget);

module.exports = router;
