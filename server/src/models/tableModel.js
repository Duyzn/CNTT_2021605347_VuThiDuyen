const db = require('../config/database');

const tableModel = {
    getAllTables: async () => {
        const [rows] = await db.execute(`
            SELECT * FROM tables 
            ORDER BY position ASC, table_number ASC
        `);
        return rows;
    },

    getTableById: async (id) => {
        const [rows] = await db.execute(
            'SELECT * FROM tables WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    createTable: async (tableData) => {
        const { table_number, qr_code, status, position } = tableData;
        const [result] = await db.execute(
            `INSERT INTO tables (table_number, qr_code, status, position) 
             VALUES (?, ?, ?, ?)`,
            [table_number, qr_code, status || 'available', position]
        );
        return result.insertId;
    },

    updateTable: async (id, tableData) => {
        const { table_number, status, position } = tableData;
        const [result] = await db.execute(
            `UPDATE tables 
             SET table_number = ?, 
                 status = ?,
                 position = ?
             WHERE id = ?`,
            [table_number, status, position, id]
        );
        return result.affectedRows > 0;
    },

    updatePosition: async (id, position) => {
        const [result] = await db.execute(
            'UPDATE tables SET position = ? WHERE id = ?',
            [position, id]
        );
        return result.affectedRows > 0;
    },

    deleteTable: async (id) => {
        const [result] = await db.execute(
            'DELETE FROM tables WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = tableModel;