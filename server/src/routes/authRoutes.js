const express = require('express');
const router = express.Router();
const db = require('../config/database');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Thêm dòng này

// Thêm JWT_SECRET vào .env
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        const [rows] = await db.execute(
            'SELECT username, role FROM users WHERE username = ? AND password = ?',
            [username, hashedPassword]
        );

        if (rows.length > 0) {
            // Tạo JWT token
            const token = jwt.sign(
                { 
                    username: rows[0].username,
                    role: rows[0].role 
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                token: token,  // Thêm token vào response
                role: rows[0].role,
                username: rows[0].username
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Tài khoản hoặc mật khẩu không chính xác'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;