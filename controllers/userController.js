const User = require('../models/User');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // Добавляем опциональное поле password в схему обновления
    const updateSchema = Joi.object({
      username: Joi.string().min(3).max(30),
      email: Joi.string().email(),
      password: Joi.string().min(6)
    });
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updates = req.body;
    // Если указан новый пароль, захэшируем его
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};
