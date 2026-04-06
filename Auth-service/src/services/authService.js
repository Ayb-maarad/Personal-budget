const User = require("../db").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (userData) => {
    const { username, email, password } = userData;
    // Business logic validation
    if (!username || !email || !password) {
        throw new Error('Username, email and password are required');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    return newUser;
};

const login = async (userData) => {
    const { email, password } = userData;
    // Business logic validation
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

module.exports = { register, login };