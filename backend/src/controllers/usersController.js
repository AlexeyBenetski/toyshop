const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role',
      [name,email,hashedPassword,'user']
    );
    res.status(201).json(result.rows[0]);
  } catch(err) { console.error(err); res.status(500).json({message:'Registration failed'}); }
}

async function loginUser(req,res) {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
    const user = result.rows[0];
    if(!user) return res.status(400).json({message:'User not found'});
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({message:'Invalid password'});
    const token = jwt.sign({id:user.id,role:user.role}, process.env.JWT_SECRET,{expiresIn:'1d'});
    res.json({token});
  } catch(err){console.error(err); res.status(500).json({message:'Login failed'});}
}

async function getAllUsers(req,res){
  const result = await pool.query('SELECT id,name,email,role FROM users');
  res.json(result.rows);
}

async function getUserById(req,res){
  const result = await pool.query('SELECT id,name,email,role FROM users WHERE id=$1',[req.params.id]);
  res.json(result.rows[0]);
}

module.exports = { registerUser, loginUser, getAllUsers, getUserById };
