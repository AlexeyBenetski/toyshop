// src/controllers/logsController.js
const Logs = require('../models/logs');

module.exports = {
  async list(req, res) {
    const rows = await Logs.listAll();
    res.json(rows);
  }
};
