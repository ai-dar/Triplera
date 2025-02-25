require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const { errorHandler } = require('./middleware/errorHandler');
const path = require('path');

const app = express();

// Подключаемся к MongoDB
connectDB();

// Middleware для парсинга JSON и urlencoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API маршруты
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Глобальный обработчик ошибок
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
