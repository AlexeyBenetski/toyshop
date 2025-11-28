const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addItemToCart);
router.put('/update/:itemId', updateCartItem);
router.delete('/remove/:itemId', removeCartItem);
router.delete('/clear', clearCart);

module.exports = router;
