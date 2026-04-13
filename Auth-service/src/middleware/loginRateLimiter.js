const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // max 10 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again after 15 minutes' },
});

module.exports = loginRateLimiter;
