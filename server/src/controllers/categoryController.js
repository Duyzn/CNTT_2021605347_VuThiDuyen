const db = require('../config/database');

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM categories 
                ORDER BY name ASC
            `);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting categories:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách danh mục'
            });
        }
    },

    getActiveCategories: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM categories 
                WHERE is_active = 1
                ORDER BY name ASC
            `);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting active categories:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách danh mục'
            });
        }
    },

    createCategory: async (req, res) => {
        try {
            const { name, description, is_active } = req.body;
            
            const [result] = await db.execute(
                'INSERT INTO categories (name, description, is_active) VALUES (?, ?, ?)',
                [name, description, is_active]
            );
            
            res.json({
                success: true,
                message: 'Thêm danh mục thành công',
                data: { id: result.insertId, name, description, is_active }
            });
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm danh mục'
            });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, is_active } = req.body;

            if (is_active === false || is_active === 'false') {
                const [products] = await db.execute(
                    'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
                    [id]
                );

                if (products[0].count > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không thể tạm ngưng danh mục này vì đang có sản phẩm sử dụng'
                    });
                }
            }

            await db.execute(
                'UPDATE categories SET name = ?, description = ?, is_active = ? WHERE id = ?',
                [name, description, is_active === true || is_active === 'true' ? 1 : 0, id]
            );

            res.json({
                success: true,
                message: 'Cập nhật danh mục thành công'
            });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật danh mục'
            });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            
            await db.execute('DELETE FROM categories WHERE id = ?', [id]);
            
            res.json({
                success: true,
                message: 'Xóa danh mục thành công'
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa danh mục'
            });
        }
    }
};

module.exports = categoryController;