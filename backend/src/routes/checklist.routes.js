const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/checklist.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', ctrl.getChecklists);
router.post('/', ctrl.createChecklist);
router.post('/:id/items', ctrl.addItem);
router.delete('/:id', ctrl.deleteChecklist);
router.patch('/items/:itemId', ctrl.updateItem);
router.delete('/items/:itemId', ctrl.deleteItem);

module.exports = router;
