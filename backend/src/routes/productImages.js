const router = require('express').Router();
const { uploadImages, upload } = require('../controllers/productImagesController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// admin only, до 10 файлов одновременно
router.post('/:id', authMiddleware, requireRole('admin'), upload.array('images', 10), uploadImages);

module.exports = router;
