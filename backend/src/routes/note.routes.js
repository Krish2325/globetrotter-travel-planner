const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/note.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', ctrl.getNotes);
router.post('/', ctrl.createNote);
router.patch('/:id', ctrl.updateNote);
router.delete('/:id', ctrl.deleteNote);

module.exports = router;
