// src/controllers/authController.js
const Users = require('../models/users');
const { sendMail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'dev_secret';
const APP_URL = process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`;

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '7d' });
}

module.exports = {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
      // check exist
      const existing = await Users.findByEmail(email);
      if (existing) return res.status(400).json({ message: 'Email already used' });

      const user = await Users.createUser({ username, email, password });
      // create confirm token (expires in 24h)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const token = await Users.createEmailToken(user.id, expiresAt);

      const link = `${APP_URL}/api/auth/verify-email?token=${token}`;
      await sendMail({
        to: user.email,
        subject: 'Подтвердите email — ToyShop',
        html: `<p>Здравствуйте, ${user.username}!</p><p>Подтвердите email — <a href="${link}">Нажмите здесь</a></p>`
      });

      return res.json({ message: 'User created, check email to confirm' });
    } catch (err) {
      console.error('Register error', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  // GET /api/auth/verify-email?token=...
  async verifyEmail(req, res) {
    try {
      const token = req.query.token;
      if (!token) return res.status(400).json({ message: 'Token required' });
      const userId = await Users.verifyEmailToken(token);
      if (!userId) return res.status(400).json({ message: 'Invalid or expired token' });
      await Users.markEmailConfirmed(userId);
      return res.json({ message: 'Email confirmed' });
    } catch (err) {
      console.error('Verify email error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
      const user = await Users.verifyCredentials(email, password);
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const token = signToken(user);
      return res.json({ token, user });
    } catch (err) {
      console.error('Login error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // POST /api/auth/forgot-password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Email required' });
      const user = await Users.findByEmail(email);
      if (!user) return res.status(200).json({ message: 'If email exists, reset link will be sent' });

      // create reset token (expires in 1h)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const token = await Users.createPasswordResetToken(user.id, expiresAt);
      const link = `${APP_URL}/reset-password?token=${token}`; // front route (you'll create)
      await sendMail({
        to: user.email,
        subject: 'Сброс пароля — ToyShop',
        html: `<p>Чтобы сбросить пароль нажмите <a href="${link}">сюда</a>. Ссылка действительна 1 час.</p>`
      });

      return res.json({ message: 'If that email exists, a reset link was sent' });
    } catch (err) {
      console.error('Forgot password error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // POST /api/auth/reset-password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) return res.status(400).json({ message: 'Missing fields' });
      const userId = await Users.verifyPasswordResetToken(token);
      if (!userId) return res.status(400).json({ message: 'Invalid or expired token' });

      await Users.updatePassword(userId, newPassword);
      await Users.markPasswordResetUsed(token);

      return res.json({ message: 'Password updated' });
    } catch (err) {
      console.error('Reset password error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // GET /api/auth/me
  async me(req, res) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    return res.json(req.user);
  }
};
