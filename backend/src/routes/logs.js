// src/routes/logs.js
const router = require('express').Router();
const ctrl = require('../controllers/logsController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, requireRole('admin'), ctrl.list);

module.exports = router;
