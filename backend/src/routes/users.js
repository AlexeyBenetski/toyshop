const router = require('express').Router();
const { registerUser, loginUser, getAllUsers, getUserById } = require('../controllers/usersController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Регистрация и логин
router.post('/register', registerUser);
router.post('/login', loginUser);

// CRUD (только для admin)
router.get('/', authMiddleware, requireRole('admin'), getAllUsers);
router.get('/:id', authMiddleware, requireRole('admin'), getUserById);

module.exports = router;
