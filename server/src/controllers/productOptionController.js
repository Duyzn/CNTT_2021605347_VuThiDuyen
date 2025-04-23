const db = require('../config/database');

const productOptionController = {
    // Lấy tất cả options có sẵn
    getAllOptions: async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM options ORDER BY name');
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting options:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách tùy chọn'
            });
        }
    },

    // Lấy options của một sản phẩm cụ thể
    getProductOptions: async (req, res) => {
        try {
            const { product_id } = req.params;
            const [rows] = await db.execute(`
                SELECT o.*, 
                       CASE WHEN po.product_id IS NOT NULL THEN 1 ELSE 0 END as is_selected
                FROM options o
                LEFT JOIN product_options po ON o.id = po.option_id AND po.product_id = ?
                ORDER BY o.name
            `, [product_id]);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting product options:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy tùy chọn sản phẩm'
            });
        }
    },

    // Tạo option mới
    createOption: async (req, res) => {
        try {
            const { name, price_adjustment } = req.body;
            
            const [result] = await db.execute(
                'INSERT INTO options (name, price_adjustment) VALUES (?, ?)',
                [name, price_adjustment]
            );

            res.json({
                success: true,
                message: 'Thêm tùy chọn thành công',
                data: {
                    id: result.insertId,
                    name,
                    price_adjustment
                }
            });
        } catch (error) {
            console.error('Error creating option:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm tùy chọn'
            });
        }
    },

    // Xóa option
    deleteOption: async (req, res) => {
        try {
            const { id } = req.params;

            // Bắt đầu transaction
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Xóa liên kết trong product_options trước
                await connection.execute(
                    'DELETE FROM product_options WHERE option_id = ?',
                    [id]
                );

                // Sau đó xóa option
                await connection.execute(
                    'DELETE FROM options WHERE id = ?',
                    [id]
                );

                await connection.commit();

                res.json({
                    success: true,
                    message: 'Xóa tùy chọn thành công'
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error deleting option:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa tùy chọn'
            });
        }
    },

    // Cập nhật liên kết giữa sản phẩm và options
    updateProductOptions: async (req, res) => {
        try {
            const { product_id, option_ids } = req.body;
            
            // Bắt đầu transaction
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Xóa tất cả options hiện tại của sản phẩm
                await connection.execute(
                    'DELETE FROM product_options WHERE product_id = ?',
                    [product_id]
                );

                // Thêm các options mới
                if (option_ids && option_ids.length > 0) {
                    const values = option_ids.map(option_id => [product_id, option_id]);
                    await connection.query(
                        'INSERT INTO product_options (product_id, option_id) VALUES ?',
                        [values]
                    );
                }

                await connection.commit();

                res.json({
                    success: true,
                    message: 'Cập nhật tùy chọn thành công'
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error updating product options:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật tùy chọn'
            });
        }
    }
};

module.exports = productOptionController;