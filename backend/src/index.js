const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');

// Раздаём статические файлы фронтенда
app.use(express.static(path.join(__dirname, '../../frontend')));

// Маршрут по умолчанию на index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});


// --- подключаем роуты ---
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

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- запуск сервера ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
