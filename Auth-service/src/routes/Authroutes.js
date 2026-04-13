const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const loginRateLimiter = require('../middleware/loginRateLimiter');

// Register new user
router.post('/register', authController.register);
// Login user
router.post('/login', loginRateLimiter, authController.login);
// Logout user
router.post('/logout', authController.logout);

module.exports = router;

