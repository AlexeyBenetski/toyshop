// src/routes/users.js
const router = require('express').Router();
const ctrl = require('../controllers/usersController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, requireRole('admin'), ctrl.list);
router.get('/:id', authMiddleware, requireRole('admin'), ctrl.getOne);
router.put('/:id', authMiddleware, requireRole('admin'), ctrl.update);
router.delete('/:id', authMiddleware, requireRole('admin'), ctrl.remove);

module.exports = router;
