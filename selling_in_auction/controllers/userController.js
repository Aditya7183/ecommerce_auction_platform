const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateEmail = async (req, res) => {
    try {
        const { email } = req.body;
        // Check uniqueness
        const existing = await User.findByEmail(email);
        if (existing && existing.id !== req.user.id) {
            return res.status(400).json({ message: 'Email already used by another account' });
        }

        await User.updateEmail(req.user.id, email);
        res.json({ message: 'Email updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMobile = async (req, res) => {
    try {
        const { mobile } = req.body;
        // Check uniqueness
        const existing = await User.findByMobile(mobile);
        if (existing && existing.id !== req.user.id) {
            return res.status(400).json({ message: 'Mobile already used by another account' });
        }

        await User.updateMobile(req.user.id, mobile);
        res.json({ message: 'Mobile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        await User.updatePassword(req.user.id, password_hash);
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
