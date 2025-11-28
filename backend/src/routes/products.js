const express = require('express');
const pool = require('../db/pool');
const authenticateToken = require('../middlewares/auth');
const router = express.Router();

// ---------- Получить все товары ----------
router.get('/', async (req,res)=>{
  try{
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Ошибка сервера'});
  }
});

// ---------- Получить товар по ID ----------
router.get('/:id', async (req,res)=>{
  try{
    const result = await pool.query('SELECT * FROM products WHERE id=$1',[req.params.id]);
    if(!result.rows.length) return res.status(404).json({error:'Товар не найден'});
    res.json(result.rows[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Ошибка сервера'});
  }
});

// ---------- Удаление товара (admin) ----------
router.delete('/:id', authenticateToken, async (req,res)=>{
  if(!req.user.is_admin) return res.status(403).json({error:'Нет доступа'});
  try{
    await pool.query('DELETE FROM products WHERE id=$1',[req.params.id]);
    res.json({message:'Товар удалён'});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Ошибка сервера'});
  }
});

module.exports = router;
