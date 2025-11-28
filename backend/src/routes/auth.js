// src/routes/auth.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Register
router.post('/register', ctrl.register);

// Verify email
router.get('/verify-email', ctrl.verifyEmail);

// Login
router.post('/login', ctrl.login);

// Forgot/reset
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

// Get current user
router.get('/me', authMiddleware, ctrl.me);

module.exports = router;
