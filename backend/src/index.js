const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключаем маршруты
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const logsRouter = require('./routes/logs');
const productImagesRouter = require('./routes/productImages');

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/logs', logsRouter);
app.use('/api/product-images', productImagesRouter);

// Статика фронтенда
app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// 404 для остальных маршрутов
app.use((req,res)=>res.status(404).json({message:'Route not found'}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
