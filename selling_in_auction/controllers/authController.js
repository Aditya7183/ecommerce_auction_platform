const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, location, language, pincode, mobile } = req.body;

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

        const existingMobile = await User.findByMobile(mobile);
        if (existingMobile) return res.status(400).json({ message: 'User already exists with this mobile' });

        const password_hash = await bcrypt.hash(password, 10);
        const id = uuidv4();

        await User.create({
            id, name, email, password_hash, location, pin_code: pincode, mobile, language
        });

        const token = generateToken(id);
        res.status(201).json({ token, user: { id, name, email } });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier = email or mobile

        let user = await User.findByEmail(identifier);
        if (!user) {
            user = await User.findByMobile(identifier);
        }

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user.id);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // In a real app, send email here.
        console.log(`[OTP] Sending OTP ${otp} to ${email}`);

        res.json({ message: 'OTP sent to your email address' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
