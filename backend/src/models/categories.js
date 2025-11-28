// src/models/categories.js
const pool = require('../db/pool');

module.exports = {
  async getAll() {
    const res = await pool.query('SELECT * FROM categories ORDER BY id');
    return res.rows;
  },

  async create({ name, description }) {
    const res = await pool.query(
      'INSERT INTO categories (name, description, created_at) VALUES ($1,$2,NOW()) RETURNING *',
      [name, description]
    );
    return res.rows[0];
  },

  async update(id, { name, description }) {
    const res = await pool.query(
      'UPDATE categories SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id=$3 RETURNING *',
      [name, description, id]
    );
    return res.rows[0];
  },

  async remove(id) {
    await pool.query('DELETE FROM categories WHERE id=$1', [id]);
    return { success: true };
  }
};
