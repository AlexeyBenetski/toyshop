// src/models/cart.js
const pool = require('../db/pool');

module.exports = {
  async ensureCartForUser(userId) {
    const res = await pool.query('SELECT * FROM carts WHERE user_id=$1', [userId]);
    if (res.rows[0]) return res.rows[0];
    const create = await pool.query('INSERT INTO carts (user_id, created_at) VALUES ($1,NOW()) RETURNING *', [userId]);
    return create.rows[0];
  },

  async getCart(userId) {
    const cart = await this.ensureCartForUser(userId);
    const items = await pool.query(
      `SELECT ci.id, ci.product_id, ci.quantity, p.title, p.price
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = $1`,
      [cart.id]
    );
    return { cart: cart, items: items.rows };
  },

  async addItem(userId, productId, quantity = 1) {
    const cart = await this.ensureCartForUser(userId);
    const res = await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1,$2,$3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cart.id, productId, quantity]
    );
    return res.rows[0];
  },

  async updateItem(userId, productId, quantity) {
    const cart = await this.ensureCartForUser(userId);
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE cart_id=$1 AND product_id=$2', [cart.id, productId]);
      return { removed: true };
    }
    const res = await pool.query(
      'UPDATE cart_items SET quantity=$1 WHERE cart_id=$2 AND product_id=$3 RETURNING *',
      [quantity, cart.id, productId]
    );
    return res.rows[0];
  },

  async removeItem(userId, productId) {
    const cart = await this.ensureCartForUser(userId);
    await pool.query('DELETE FROM cart_items WHERE cart_id=$1 AND product_id=$2', [cart.id, productId]);
    return { success: true };
  },

  async clearCart(userId) {
    const cart = await this.ensureCartForUser(userId);
    await pool.query('DELETE FROM cart_items WHERE cart_id=$1', [cart.id]);
    return { success: true };
  }
};
