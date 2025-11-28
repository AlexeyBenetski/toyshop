const router = require('express').Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} = require('../controllers/ordersController');

router.use(authMiddleware);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id/status', requireRole('admin'), updateOrderStatus);

module.exports = router;
