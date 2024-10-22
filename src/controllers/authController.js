const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { Op } = require('sequelize');

// Helper function to send verification email
const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const url = `http://localhost:${process.env.PORT}/auth/verify/${token}`;
    await transporter.sendMail({
        to: email,
        subject: 'Email Verification',
        html: `<h1>Verify your email</h1><p>Please click <a href="${url}">here</a> to verify your email.</p>`,
    });
};

// User Registration
const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(email, token);

    return res.status(201).json({ message: 'User registered. Please verify your email.' });
};

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send back user details and token
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                // Add any other fields you want to include
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


// Email Verification
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        user.isVerified = true;
        await user.save();
        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = { register, login, verifyEmail };
