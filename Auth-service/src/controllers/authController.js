
const authService = require('../services/authService');

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await authService.register({ username, email, password });
        const { password: _pw, ...safeUser } = user.toJSON();
        res.status(201).json({ user: safeUser });
    } catch (error) {
        // Business logic errors (validation)
        if (error.message.includes('required') || error.message.includes('exists')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login({ email, password });
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 3600000 });
        res.status(200).json({ message: 'Login successful' });
    }

    catch (error) {
        // Business logic errors (validation)
        if (error.message.includes('Invalid')) {x 
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};

// Logout user
exports.logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
    res.status(200).json({ message: 'Logged out successfully' });
};

// Get current authenticated user
exports.me = (req, res) => {
    // req.user is set by verifyToken middleware
    res.status(200).json({ user: req.user });
};
