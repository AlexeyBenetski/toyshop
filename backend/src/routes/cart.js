// src/routes/cart.js
const router = require('express').Router();
const ctrl = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get('/', ctrl.get);
router.post('/add', ctrl.add);
router.put('/update/:productId', ctrl.update);
router.delete('/remove/:productId', ctrl.remove);

module.exports = router;
