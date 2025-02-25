const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', verifyToken, userController.getProfile);

// PUT /api/users/profile
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router;
