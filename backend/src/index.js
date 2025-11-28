const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение маршрутов
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/product-images', require('./routes/productImages'));

// Статика фронтенда
app.use(express.static(path.join(__dirname,'../../frontend')));
app.get('/', (req,res)=>res.sendFile(path.join(__dirname,'../../frontend/index.html')));

// 404 для остальных
app.use((req,res)=>res.status(404).json({message:'Route not found'}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
