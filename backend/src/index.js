// src/index.js
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
const authRoutes = require('./routes/auth');
const prodRoutes = require('./routes/products');
const catRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const logRoutes = require('./routes/logs');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/products', prodRoutes);
app.use('/api/categories', catRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/users', userRoutes);

// health
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date() }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
