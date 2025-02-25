const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    adminCode: Joi.string().optional().allow('')
  });

  exports.register = async (req, res, next) => {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const { username, email, password, adminCode } = req.body;
  
      // Проверяем, существует ли пользователь с таким email
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
      }
  
      // Хэшируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Если adminCode совпадает с переменной окружения, роль = 'admin', иначе 'user'
      let role = 'user';
      if (adminCode && adminCode === process.env.ADMIN_CODE) {
        role = 'admin';
      }
  
      user = new User({ username, email, password: hashedPassword, role });
      await user.save();
  
      res.status(201).json({ message: 'Регистрация прошла успешно' });
    } catch (error) {
      next(error);
    }
  };

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверные данные' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверные данные' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    next(error);
  }
};
