const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

const productController = {
    // Lấy sản phẩm cho trang admin
    getAdminProducts: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    p.*,
                    c.name as category_name,
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'id', o.id,
                            'name', o.name,
                            'price_adjustment', o.price_adjustment
                        )
                    ) as options
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_options po ON p.id = po.product_id
                LEFT JOIN options o ON po.option_id = o.id
                GROUP BY p.id
                ORDER BY p.created_at DESC
            `);

            // Parse options string thành JSON
            const productsWithOptions = rows.map(product => ({
                ...product,
                options: product.options 
                    ? JSON.parse(`[${product.options}]`.replace(/\\/g, ''))
                    : []
            }));
            
            res.json({
                success: true,
                data: productsWithOptions
            });
        } catch (error) {
            console.error('Error getting products:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách sản phẩm'
            });
        }
    },

    // Lấy sản phẩm cho public
    getProducts: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.is_available = 1
                ORDER BY p.created_at DESC
            `);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting public products:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách sản phẩm'
            });
        }
    },

    // Thêm sản phẩm mới
    addProduct: async (req, res) => {
        try {
            const { name, price, description, category_id } = req.body;
            const selectedOptions = req.body.selectedOptions ? JSON.parse(req.body.selectedOptions) : [];
            let image_name = null;

            if (req.file) {
                image_name = req.file.filename;
            }

            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Thêm sản phẩm
                const [result] = await connection.execute(
                    'INSERT INTO products (name, price, description, category_id, image_name) VALUES (?, ?, ?, ?, ?)',
                    [name, price, description, category_id, image_name]
                );

                const productId = result.insertId;

                // Thêm options cho sản phẩm nếu có
                if (selectedOptions.length > 0) {
                    const optionValues = selectedOptions.map(optionId => [productId, optionId]);
                    await connection.query(
                        'INSERT INTO product_options (product_id, option_id) VALUES ?',
                        [optionValues]
                    );
                }

                await connection.commit();

                res.json({
                    success: true,
                    message: 'Thêm sản phẩm thành công',
                    data: {
                        id: productId,
                        name,
                        price,
                        description,
                        category_id,
                        image_name
                    }
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm sản phẩm'
            });
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, description, category_id, is_available } = req.body;
            let selectedOptions = [];
            
            try {
                selectedOptions = JSON.parse(req.body.selectedOptions || '[]');
            } catch (error) {
                console.error('Error parsing selectedOptions:', error);
                selectedOptions = [];
            }

            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Convert is_available từ 'true'/'false' thành 1/0
                const isAvailableInt = is_available === 'true' ? 1 : 0;

                // Cập nhật thông tin sản phẩm
                let updateQuery = 'UPDATE products SET name = ?, price = ?, description = ?, category_id = ?, is_available = ?';
                let params = [name, price, description, category_id, isAvailableInt];

                if (req.file) {
                    updateQuery += ', image_name = ?';
                    params.push(req.file.filename);
                }

                updateQuery += ' WHERE id = ?';
                params.push(id);

                await connection.execute(updateQuery, params);

                // Xóa tất cả options hiện tại
                await connection.execute('DELETE FROM product_options WHERE product_id = ?', [id]);

                // Thêm options mới nếu có
                if (selectedOptions.length > 0) {
                    const optionValues = selectedOptions.map(optionId => [id, optionId]);
                    await connection.query(
                        'INSERT INTO product_options (product_id, option_id) VALUES ?',
                        [optionValues]
                    );
                }

                await connection.commit();

                res.json({
                    success: true,
                    message: 'Cập nhật sản phẩm thành công'
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật sản phẩm'
            });
        }
    },

    // Xóa sản phẩm
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            // Bắt đầu transaction
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Xóa các liên kết options trước
                await connection.execute('DELETE FROM product_options WHERE product_id = ?', [id]);

                // Sau đó xóa sản phẩm
                await connection.execute('DELETE FROM products WHERE id = ?', [id]);

                await connection.commit();

                res.json({
                    success: true,
                    message: 'Xóa sản phẩm thành công'
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa sản phẩm'
            });
        }
    },

    // Lấy chi tiết sản phẩm
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await db.execute(`
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            `, [id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm'
                });
            }

            // Lấy options của sản phẩm
            const [options] = await db.execute(`
                SELECT o.* 
                FROM options o
                JOIN product_options po ON o.id = po.option_id
                WHERE po.product_id = ?
            `, [id]);

            const product = {
                ...rows[0],
                options
            };

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Error getting product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin sản phẩm'
            });
        }
    },

    // Lấy sản phẩm liên quan
    getRelatedProducts: async (req, res) => {
        try {
            const { id } = req.params;
            const [product] = await db.execute('SELECT category_id FROM products WHERE id = ?', [id]);
            
            if (product.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm'
                });
            }

            const [rows] = await db.execute(`
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.category_id = ? AND p.id != ? AND p.is_available = 1
                LIMIT 3
            `, [product[0].category_id, id]);

            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting related products:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy sản phẩm liên quan'
            });
        }
    },

    getProductToppings: async (req, res) => {
        try {
            const { productId } = req.params;
            
            // Lấy thông tin topping
            const [toppings] = await db.execute(`
                SELECT o.* 
                FROM options o
                JOIN product_options po ON o.id = po.option_id
                WHERE po.product_id = ?
            `, [productId]);

            res.json({
                success: true,
                data: {
                    hasToppings: toppings.length > 0,
                    toppings: toppings
                }
            });
        } catch (error) {
            console.error('Error getting product toppings:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin topping'
            });
        }
    }
};

module.exports = productController;