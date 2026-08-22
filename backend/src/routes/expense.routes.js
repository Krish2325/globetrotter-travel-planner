const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/expense.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', ctrl.getExpenses);
router.post('/', ctrl.createExpense);
router.patch('/:id', ctrl.updateExpense);
router.delete('/:id', ctrl.deleteExpense);

module.exports = router;
