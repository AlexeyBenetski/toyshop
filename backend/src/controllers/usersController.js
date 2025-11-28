// src/controllers/usersController.js
const Users = require('../models/users');
const Logs = require('../models/logs');

module.exports = {
  async list(req, res) {
    const rows = await Users.listAll();
    res.json(rows);
  },

  async getOne(req, res) {
    const id = Number(req.params.id);
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  },

  async update(req, res) {
    const id = Number(req.params.id);
    const updated = await Users.updateProfile(id, req.body);
    if (req.user) await Logs.write(req.user.id, 'user_update', JSON.stringify({ target: id }));
    res.json(updated);
  },

  async remove(req, res) {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM users WHERE id=$1', [id]); // small inline
    if (req.user) await Logs.write(req.user.id, 'user_delete', JSON.stringify({ target: id }));
    res.json({ success: true });
  }
};

