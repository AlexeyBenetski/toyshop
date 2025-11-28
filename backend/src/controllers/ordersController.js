const pool = require('../db/pool');

async function getOrders(req,res){
  let result;
  if(req.user.role==='admin'){
    result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
  } else {
    result = await pool.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC',[req.user.id]);
  }
  res.json(result.rows);
}

async function getOrderById(req,res){
  const result = await pool.query('SELECT * FROM orders WHERE id=$1',[req.params.id]);
  res.json(result.rows[0]);
}

async function createOrder(req,res){
  const { items, total } = req.body; // items: [{product_id,quantity}]
  const result = await pool.query('INSERT INTO orders (user_id,total) VALUES ($1,$2) RETURNING *',[req.user.id,total]);
  const order = result.rows[0];
  for(const item of items){
    await pool.query('INSERT INTO order_items (order_id,product_id,quantity) VALUES ($1,$2,$3)',
      [order.id,item.product_id,item.quantity]);
  }
  res.status(201).json(order);
}

async function updateOrderStatus(req,res){
  const { status } = req.body;
  const result = await pool.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',[status,req.params.id]);
  res.json(result.rows[0]);
}

module.exports = { getOrders,getOrderById,createOrder,updateOrderStatus };
