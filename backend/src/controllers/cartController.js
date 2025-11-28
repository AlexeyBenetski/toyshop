const pool = require('../db/pool');

async function getCart(req,res){
  const result = await pool.query('SELECT * FROM cart_items WHERE user_id=$1',[req.user.id]);
  res.json(result.rows);
}

async function addItemToCart(req,res){
  const { product_id, quantity } = req.body;
  const result = await pool.query(
    'INSERT INTO cart_items (user_id,product_id,quantity) VALUES ($1,$2,$3) RETURNING *',
    [req.user.id, product_id, quantity]
  );
  res.status(201).json(result.rows[0]);
}

async function updateCartItem(req,res){
  const { quantity } = req.body;
  const result = await pool.query(
    'UPDATE cart_items SET quantity=$1 WHERE id=$2 AND user_id=$3 RETURNING *',
    [quantity, req.params.itemId, req.user.id]
  );
  res.json(result.rows[0]);
}

async function removeCartItem(req,res){
  await pool.query('DELETE FROM cart_items WHERE id=$1 AND user_id=$2',[req.params.itemId,req.user.id]);
  res.json({message:'Cart item removed'});
}

async function clearCart(req,res){
  await pool.query('DELETE FROM cart_items WHERE user_id=$1',[req.user.id]);
  res.json({message:'Cart cleared'});
}

module.exports = { getCart, addItemToCart, updateCartItem, removeCartItem, clearCart };
