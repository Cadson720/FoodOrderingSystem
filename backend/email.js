// backend/email.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Load environment variables
require('dotenv').config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail App Password
    },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error configuring nodemailer transporter:', error);
    } else {
        console.log('Nodemailer transporter is configured successfully.');
    }
});

// Endpoint to send verification email
router.post('/send-verification-email', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'Email and code are required.' });
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your Verification Code',
        text: `Hello,

Your verification code is ${code}. It is valid for 60 seconds.

Thank you!
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send verification email.' });
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Verification email sent successfully.' });
        }
    });
});

module.exports = router;
