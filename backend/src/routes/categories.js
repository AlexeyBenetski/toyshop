// src/routes/categories.js
const router = require('express').Router();
const ctrl = require('../controllers/categoriesController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

router.get('/', ctrl.list);
router.post('/', authMiddleware, requireRole('admin'), ctrl.create);
router.put('/:id', authMiddleware, requireRole('admin'), ctrl.update);
router.delete('/:id', authMiddleware, requireRole('admin'), ctrl.remove);

module.exports = router;
