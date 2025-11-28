const router = require('express').Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoriesController');

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

router.post('/', authMiddleware, requireRole('admin'), createCategory);
router.put('/:id', authMiddleware, requireRole('admin'), updateCategory);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteCategory);

module.exports = router;
