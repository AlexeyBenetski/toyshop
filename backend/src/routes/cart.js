const express = require('express');
const pool = require('../db/pool');
const authenticateToken = require('../middlewares/auth');
const router = express.Router();

// ---------- Добавить товар в корзину ----------
router.post('/', authenticateToken, async (req,res)=>{
  const { product_id, quantity } = req.body;
  if(!product_id || !quantity) return res.status(400).json({error:'Товар и количество обязательны'});

  try{
    const result = await pool.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING *',
      [req.user.id, product_id, quantity]
    );
    res.json(result.rows[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Ошибка сервера'});
  }
});

// ---------- Получить корзину пользователя ----------
router.get('/', authenticateToken, async (req,res)=>{
  try{
    const result = await pool.query(
      `SELECT ci.id, p.name AS product_name, p.price, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id=p.id
       WHERE ci.user_id=$1`, [req.user.id]
    );
    res.json(result.rows);
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Ошибка сервера'});
  }
});

// ---------- Удалить товар из корзины ----------
router.delete('/:id', authenticateToken, async (req,res)=>{
  try{
    await pool.query('DELETE FROM cart_items WHERE id=$1 AND user_id=$2',[req.params.id, req.user.id]);
    res.json({message:'Товар удалён из корзины'});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Ошибка сервера'});
  }
});

module.exports = router;
