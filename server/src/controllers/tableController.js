const db = require('../config/database');
const QRCode = require('qrcode');

const tableController = {
    getTables: async (req, res) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM tables ORDER BY table_number'
            );
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting tables:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách bàn'
            });
        }
    },

    createTable: async (req, res) => {
        try {
            const { table_number, status } = req.body;
            const qr_code = `qr_code_${table_number.toLowerCase()}`;

            const result = await db.execute(
                'INSERT INTO tables (table_number, qr_code, status, position) VALUES (?, ?, ?, ?)',
                [table_number, qr_code, status || 'available', req.body.position]
            );

            res.json({
                success: true,
                message: 'Thêm bàn thành công',
                data: {
                    id: result[0].insertId,
                    table_number,
                    qr_code,
                    status: status || 'available',
                    position: req.body.position
                }
            });
        } catch (error) {
            console.error('Error creating table:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể thêm bàn mới'
            });
        }
    },

    updateTable: async (req, res) => {
        try {
            const { id } = req.params;
            const { table_number, status, position } = req.body;

            await db.execute(
                'UPDATE tables SET table_number = ?, status = ?, position = ? WHERE id = ?',
                [table_number, status, position, id]
            );

            res.json({
                success: true,
                message: 'Cập nhật bàn thành công'
            });
        } catch (error) {
            console.error('Error updating table:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật bàn'
            });
        }
    },

    updatePosition: async (req, res) => {
        try {
            const { id } = req.params;
            const { position } = req.body;

            // Kiểm tra xem có phải bàn CASH không
            const [existingTable] = await db.execute(
                'SELECT * FROM tables WHERE id = ?',
                [id]
            );

            if (existingTable[0].table_number === 'CASH') {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể di chuyển bàn thu ngân'
                });
            }

            await db.execute(
                'UPDATE tables SET position = ? WHERE id = ?',
                [position, id]
            );

            res.json({
                success: true,
                message: 'Cập nhật vị trí bàn thành công'
            });
        } catch (error) {
            console.error('Error updating table position:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật vị trí bàn'
            });
        }
    },

    deleteTable: async (req, res) => {
        try {
            const { id } = req.params;
            await db.execute('DELETE FROM tables WHERE id = ?', [id]);
            
            res.json({
                success: true,
                message: 'Xóa bàn thành công'
            });
        } catch (error) {
            console.error('Error deleting table:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa bàn'
            });
        }
    },

    getTableInfo: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [table] = await db.execute(
                'SELECT * FROM tables WHERE id = ?',
                [id]
            );

            if (table.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy bàn'
                });
            }

            res.json({
                success: true,
                data: table[0]
            });
        } catch (error) {
            console.error('Error getting table info:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin bàn'
            });
        }
    }
};

module.exports = tableController;