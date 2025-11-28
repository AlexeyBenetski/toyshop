
// src/controllers/categoriesController.js
const Categories = require('../models/categories');
const Logs = require('../models/logs');

module.exports = {
  async list(req, res) {
    const rows = await Categories.getAll();
    res.json(rows);
  },

  async create(req, res) {
    const created = await Categories.create(req.body);
    if (req.user) await Logs.write(req.user.id, 'create_category', JSON.stringify({ id: created.id }));
    res.json(created);
  },

  async update(req, res) {
    const id = Number(req.params.id);
    const upd = await Categories.update(id, req.body);
    if (req.user) await Logs.write(req.user.id, 'update_category', JSON.stringify({ id }));
    res.json(upd);
  },

  async remove(req, res) {
    const id = Number(req.params.id);
    await Categories.remove(id);
    if (req.user) await Logs.write(req.user.id, 'delete_category', JSON.stringify({ id }));
    res.json({ success: true });
  }
};
