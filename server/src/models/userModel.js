const db = require('../config/database');

const userModel = {
    getAllUsers: async () => {
        const [rows] = await db.execute('SELECT username, role FROM users');
        return rows;
    },

    getUserByUsername: async (username) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },

    createUser: async (username, hashedPassword, role) => {
        const [result] = await db.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );
        return result;
    },

    updateUser: async (username, data) => {
        const updates = [];
        const values = [];

        if (data.password) {
            updates.push('password = ?');
            values.push(data.password);
        }
        if (data.role) {
            updates.push('role = ?');
            values.push(data.role);
        }

        values.push(username);

        const [result] = await db.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE username = ?`,
            values
        );
        return result;
    },

    deleteUser: async (username) => {
        const [result] = await db.execute('DELETE FROM users WHERE username = ?', [username]);
        return result;
    }
};

module.exports = userModel;