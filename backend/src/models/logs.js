// src/models/logs.js
const pool = require('../db/pool');

module.exports = {
  async write(userId, action, details = null) {
    await pool.query('INSERT INTO user_logs (user_id, action, details, created_at) VALUES ($1,$2,$3,NOW())', [userId, action, details]);
  },

  async listAll() {
    const res = await pool.query(`
      SELECT ul.*, u.username FROM user_logs ul
      LEFT JOIN users u ON u.id = ul.user_id
      ORDER BY ul.created_at DESC
    `);
    return res.rows;
  }
};
