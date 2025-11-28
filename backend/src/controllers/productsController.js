const pool = require('../db/pool');

// Получить все продукты
async function getAllProducts(req, res) {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get products' });
  }
}

// Получить продукт по ID
async function getProductById(req, res) {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get product' });
  }
}

// Создать продукт
async function createProduct(req, res) {
  try {
    const { name, description, price, category_id, age_limit } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, description, price, category_id, age_limit) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, category_id, age_limit]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product' });
  }
}

// Обновить продукт
async function updateProduct(req, res) {
  try {
    const { name, description, price, category_id, age_limit } = req.body;
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, category_id=$4, age_limit=$5 WHERE id=$6 RETURNING *',
      [name, description, price, category_id, age_limit, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
}

// Удалить продукт
async function deleteProduct(req, res) {
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
