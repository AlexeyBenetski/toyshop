const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const router = express.Router();
require('dotenv').config();

// ---------- Регистрация ----------
router.post('/register', async (req,res)=>{
  const { name,email,password } = req.body;
  if(!name || !email || !password) return res.status(400).json({error:'Заполните все поля'});

  try {
    const hashed = await bcrypt.hash(password,10);
    const result = await pool.query(
      'INSERT INTO users (name,email,password,is_admin) VALUES ($1,$2,$3,$4) RETURNING id,name,email,is_admin',
      [name,email,hashed,false]
    );
    res.json({ message: 'Регистрация успешна', user: result.rows[0] });
  } catch(err){
    if(err.code==='23505') res.status(400).json({error:'Пользователь с таким email уже существует'});
    else res.status(500).json({error:'Ошибка сервера'});
  }
});

// ---------- Вход ----------
router.post('/login', async (req,res)=>{
  const { email,password } = req.body;
  if(!email || !password) return res.status(400).json({error:'Заполните все поля'});

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
    if(!result.rows.length) return res.status(400).json({error:'Неверный email или пароль'});

    const user = result.rows[0];
    const valid = await bcrypt.compare(password,user.password);
    if(!valid) return res.status(400).json({error:'Неверный email или пароль'});

    const token = jwt.sign(
      { id:user.id, email:user.email, is_admin:user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn:'8h' }
    );

    res.json({ message:'Вход успешен', token, user:{id:user.id,name:user.name,email:user.email,is_admin:user.is_admin} });
  } catch(err){
    console.error(err);
    res.status(500).json({error:'Ошибка сервера'});
  }
});

module.exports = router;
