const router = require('express').Router();
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const { getAllLogs } = require('../controllers/logsController');

router.use(authMiddleware, requireRole('admin'));

router.get('/', getAllLogs);

module.exports = router;
