// src/routes/products.js
const router = require('express').Router();
const ctrl = require('../controllers/productsController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Public list + get
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

// Protected admin routes
router.post('/', authMiddleware, requireRole('admin'), ctrl.create);
router.put('/:id', authMiddleware, requireRole('admin'), ctrl.update);
router.delete('/:id', authMiddleware, requireRole('admin'), ctrl.remove);

module.exports = router;
