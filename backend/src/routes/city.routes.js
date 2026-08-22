const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/city.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', ctrl.getCities);
router.get('/:id', ctrl.getCityById);
router.post('/', authenticate, requireAdmin, ctrl.createCity);
router.patch('/:id', authenticate, requireAdmin, ctrl.updateCity);
router.delete('/:id', authenticate, requireAdmin, ctrl.deleteCity);

module.exports = router;
