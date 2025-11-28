// src/models/products.js
const pool = require('../db/pool');

module.exports = {
  async create({ title, description, price, age_min, age_max, stock, category_id }) {
    const q = `INSERT INTO products (title, description, price, age_min, age_max, stock, category_id, created_at, updated_at)
               VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()) RETURNING *;`;
    const vals = [title, description, price, age_min, age_max, stock, category_id];
    const res = await pool.query(q, vals);
    return res.rows[0];
  },

  async getById(id) {
    const res = await pool.query('SELECT * FROM products WHERE id=$1 LIMIT 1', [id]);
    return res.rows[0];
  },

  async list({ q = '', categoryId = null, minPrice = null, maxPrice = null, age = null, limit = 50, offset = 0 }) {
    let sql = 'SELECT p.* FROM products p WHERE 1=1';
    const vals = [];
    let i = 1;

    if (q) {
      sql += ` AND (p.title ILIKE $${i} OR p.description ILIKE $${i})`;
      vals.push(`%${q}%`); i++;
    }
    if (categoryId) {
      sql += ` AND p.category_id = $${i}`; vals.push(categoryId); i++;
    }
    if (minPrice !== null) { sql += ` AND p.price >= $${i}`; vals.push(minPrice); i++; }
    if (maxPrice !== null) { sql += ` AND p.price <= $${i}`; vals.push(maxPrice); i++; }
    if (age !== null) { sql += ` AND p.age_min <= $${i} AND p.age_max >= $${i}`; vals.push(age); i++; }

    sql += ` ORDER BY p.created_at DESC LIMIT $${i} OFFSET $${i+1}`;
    vals.push(limit, offset);

    const res = await pool.query(sql, vals);
    return res.rows;
  },

  async update(id, fields) {
    const keys = [];
    const vals = [];
    let i = 1;
    for (const k of ['title','description','price','age_min','age_max','stock','category_id']) {
      if (fields[k] !== undefined) {
        keys.push(`${k} = $${i}`);
        vals.push(fields[k]);
        i++;
      }
    }
    if (keys.length === 0) return this.getById(id);
    // updated_at
    keys.push(`updated_at = NOW()`);
    const sql = `UPDATE products SET ${keys.join(', ')} WHERE id=$${i} RETURNING *`;
    vals.push(id);
    const res = await pool.query(sql, vals);
    return res.rows[0];
  },

  async remove(id) {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    return { success: true };
  }
};
