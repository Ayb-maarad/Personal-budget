const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const loginRateLimiter = require('../middleware/loginRateLimiter');
const verifyToken = require('../middleware/verifyToken');

// Register new user
router.post('/register', authController.register);
// Login user
router.post('/login', loginRateLimiter, authController.login);
// Logout user
router.post('/logout', authController.logout);
// Get current user (used by frontend to check auth status)
router.get('/me', verifyToken, authController.me);

module.exports = router;

