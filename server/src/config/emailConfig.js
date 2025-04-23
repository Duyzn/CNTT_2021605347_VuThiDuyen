const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Sử dụng App Password từ Google
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Kiểm tra kết nối
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email config error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

module.exports = transporter;