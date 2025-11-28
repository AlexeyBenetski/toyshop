// src/controllers/cartController.js
const Cart = require('../models/cart');
const Logs = require('../models/logs');

module.exports = {
  async get(req, res) {
    const userId = req.user.id;
    const cart = await Cart.getCart(userId);
    res.json(cart);
  },

  async add(req, res) {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const item = await Cart.addItem(userId, productId, quantity || 1);
    await Logs.write(userId, 'cart_add', JSON.stringify(item));
    res.json(item);
  },

  async update(req, res) {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    const item = await Cart.updateItem(userId, productId, Number(quantity));
    await Logs.write(userId, 'cart_update', JSON.stringify({ productId, quantity }));
    res.json(item);
  },

  async remove(req, res) {
    const userId = req.user.id;
    const { productId } = req.params;
    await Cart.removeItem(userId, productId);
    await Logs.write(userId, 'cart_remove', JSON.stringify({ productId }));
    res.json({ success: true });
  }
};
