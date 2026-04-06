
const authService = require('../services/authService');

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await authService.register({ username, email, password });
        res.status(201).json({ user });
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
        res.status(200).json({ token });
    }

    catch (error) {
        // Business logic errors (validation)
        if (error.message.includes('Invalid')) {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};
