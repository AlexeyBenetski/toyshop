const Products = require('../models/products');
const Logs = require('../models/logs');

module.exports = {
  async list(req, res) {
    const { q, categoryId, minPrice, maxPrice, age, limit, offset } = req.query;
    const items = await Products.list({
      q: q || '',
      categoryId: categoryId ? Number(categoryId) : null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      age: age ? Number(age) : null,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0
    });
    res.json(items);
  },

  async getOne(req, res) {
    const id = Number(req.params.id);
    const p = await Products.getById(id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  },

  async create(req, res) {
    // admin check should be via middleware in routes
    const payload = req.body;
    const created = await Products.create(payload);
    // log
    if (req.user) await Logs.write(req.user.id, 'create_product', JSON.stringify({ productId: created.id }));
    res.json(created);
  },

  async update(req, res) {
    const id = Number(req.params.id);
    const updated = await Products.update(id, req.body);
    if (req.user) await Logs.write(req.user.id, 'update_product', JSON.stringify({ productId: id }));
    res.json(updated);
  },

  async remove(req, res) {
    const id = Number(req.params.id);
    await Products.remove(id);
    if (req.user) await Logs.write(req.user.id, 'delete_product', JSON.stringify({ productId: id }));
    res.json({ success: true });
  }
};