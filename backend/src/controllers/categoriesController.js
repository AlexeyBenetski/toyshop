const pool = require('../db/pool');

async function getAllCategories(req,res){
  const result = await pool.query('SELECT * FROM categories ORDER BY id');
  res.json(result.rows);
}

async function getCategoryById(req,res){
  const result = await pool.query('SELECT * FROM categories WHERE id=$1',[req.params.id]);
  res.json(result.rows[0]);
}

async function createCategory(req,res){
  const { name } = req.body;
  const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *',[name]);
  res.status(201).json(result.rows[0]);
}

async function updateCategory(req,res){
  const { name } = req.body;
  const result = await pool.query('UPDATE categories SET name=$1 WHERE id=$2 RETURNING *',[name,req.params.id]);
  res.json(result.rows[0]);
}

async function deleteCategory(req,res){
  await pool.query('DELETE FROM categories WHERE id=$1',[req.params.id]);
  res.json({message:'Category deleted'});
}

module.exports = { getAllCategories,getCategoryById,createCategory,updateCategory,deleteCategory };
