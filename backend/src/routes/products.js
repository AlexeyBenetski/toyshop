const router = require('express').Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');

// Публичные маршруты
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin только
router.post('/', authMiddleware, requireRole('admin'), createProduct);
router.put('/:id', authMiddleware, requireRole('admin'), updateProduct);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteProduct);

module.exports = router;
