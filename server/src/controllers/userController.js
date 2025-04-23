const db = require('../config/database');
const crypto = require('crypto');

const userController = {
    getUsers: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT username, role 
                FROM users 
                ORDER BY username ASC
            `);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách nhân viên'
            });
        }
    },

    createUser: async (req, res) => {
        try {
            const { username, password, role } = req.body;

            // Kiểm tra user đã tồn tại
            const [existingUser] = await db.execute(
                'SELECT username FROM users WHERE username = ?',
                [username]
            );

            if (existingUser.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên đăng nhập đã tồn tại'
                });
            }

            // Hash password
            const hashedPassword = crypto
                .createHash('sha256')
                .update(password)
                .digest('hex');

            const [result] = await db.execute(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, role]
            );

            res.json({
                success: true,
                message: 'Thêm nhân viên thành công',
                data: { username, role }
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm nhân viên'
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { username } = req.params;
            const { password, role } = req.body;

            // Kiểm tra user tồn tại
            const [existingUser] = await db.execute(
                'SELECT role FROM users WHERE username = ?',
                [username]
            );

            if (existingUser.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }

            // Xây dựng câu query update
            let query = 'UPDATE users SET';
            const values = [];

            if (password) {
                const hashedPassword = crypto
                    .createHash('sha256')
                    .update(password)
                    .digest('hex');
                query += ' password = ?,';
                values.push(hashedPassword);
            }

            if (role) {
                query += ' role = ?,';
                values.push(role);
            }

            // Xóa dấu phẩy cuối cùng
            query = query.slice(0, -1);
            query += ' WHERE username = ?';
            values.push(username);

            await db.execute(query, values);

            res.json({
                success: true,
                message: 'Cập nhật nhân viên thành công'
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật nhân viên'
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { username } = req.params;

            // Kiểm tra và không cho phép xóa admin
            const [user] = await db.execute(
                'SELECT role FROM users WHERE username = ?',
                [username]
            );

            if (user[0]?.role === 'admin') {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể xóa tài khoản admin'
                });
            }

            await db.execute('DELETE FROM users WHERE username = ?', [username]);

            res.json({
                success: true,
                message: 'Xóa nhân viên thành công'
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa nhân viên'
            });
        }
    }
};

module.exports = userController;