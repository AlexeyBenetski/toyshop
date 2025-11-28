// src/models/users.js
const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // create user (register)
  async createUser({ username, email, password, role = 'user' }) {
    const hash = await bcrypt.hash(password, 10);
    const q = `INSERT INTO users (username, email, password_hash, role, is_email_confirmed)
               VALUES ($1,$2,$3,$4,FALSE) RETURNING id, username, email, role, created_at;`;
    const vals = [username, email, hash, role];
    const res = await pool.query(q, vals);
    return res.rows[0];
  },

  // find by email (full row)
  async findByEmail(email) {
    const res = await pool.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email]);
    return res.rows[0];
  },

  async findById(id) {
    const res = await pool.query('SELECT id, username, email, role, is_email_confirmed, created_at FROM users WHERE id=$1', [id]);
    return res.rows[0];
  },

  // validate credentials
  async verifyCredentials(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return null;
    // return sanitized
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_email_confirmed: user.is_email_confirmed
    };
  },

  // create email confirmation token
  async createEmailToken(userId, expiresAt) {
    const token = uuidv4();
    await pool.query(
      `INSERT INTO email_confirm_tokens (user_id, token, expires_at, created_at)
       VALUES ($1,$2,$3,NOW())`,
      [userId, token, expiresAt]
    );
    return token;
  },

  // verify email token (returns user id if ok)
  async verifyEmailToken(token) {
    const res = await pool.query(
      `SELECT id, user_id, expires_at FROM email_confirm_tokens WHERE token=$1 LIMIT 1`, [token]
    );
    const row = res.rows[0];
    if (!row) return null;
    const expiresAt = row.expires_at;
    if (new Date() > new Date(expiresAt)) return null;
    return row.user_id;
  },

  // mark email confirmed
  async markEmailConfirmed(userId) {
    await pool.query(`UPDATE users SET is_email_confirmed = TRUE WHERE id=$1`, [userId]);
    // optional: delete tokens for this user
    await pool.query(`DELETE FROM email_confirm_tokens WHERE user_id=$1`, [userId]);
  },

  // create password reset token
  async createPasswordResetToken(userId, expiresAt) {
    const token = uuidv4();
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at, used)
       VALUES ($1,$2,$3,NOW(),FALSE)`,
      [userId, token, expiresAt]
    );
    return token;
  },

  async verifyPasswordResetToken(token) {
    const res = await pool.query(
      `SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token=$1 LIMIT 1`,
      [token]
    );
    const row = res.rows[0];
    if (!row) return null;
    if (row.used) return null;
    if (new Date() > new Date(row.expires_at)) return null;
    return row.user_id;
  },

  async markPasswordResetUsed(token) {
    await pool.query(`UPDATE password_reset_tokens SET used = TRUE WHERE token=$1`, [token]);
  },

  // update password by userId
  async updatePassword(userId, newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE users SET password_hash=$1 WHERE id=$2`, [hash, userId]);
  },

  // admin: list users (sanitized)
  async listAll() {
    const res = await pool.query('SELECT id, username, email, role, is_email_confirmed, created_at FROM users ORDER BY id');
    return res.rows;
  },

  // simple update profile fields
  async updateProfile(userId, { username, email }) {
    const res = await pool.query(
      `UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE id=$3 RETURNING id, username, email, role, is_email_confirmed`,
      [username, email, userId]
    );
    return res.rows[0];
  }
};
