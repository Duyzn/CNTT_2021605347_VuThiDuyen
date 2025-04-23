const db = require('../config/database');

const orderModel = {
    addToCart: async (tableId, productId, quantity, toppings = []) => {
        try {
            const [product] = await db.execute(
                'SELECT * FROM products WHERE id = ?',
                [productId]
            );

            if (!product || product.length === 0) {
                throw new Error('Sản phẩm không tồn tại');
            }

            const toppingTotalPrice = Array.isArray(toppings) 
                ? toppings.reduce((sum, topping) => sum + (Number(topping.price_adjustment) || 0), 0)
                : 0;

            const [existingOrder] = await db.execute(
                `SELECT o.id, oi.id as item_id 
                 FROM orders o
                 LEFT JOIN order_items oi ON o.id = oi.order_id
                 WHERE o.table_id = ? AND o.status = 'pending'
                 LIMIT 1`,
                [tableId]
            );

            let orderId;
            if (!existingOrder.length) {
                const orderCode = `ORD${Date.now() - (7 * 60 * 60 * 1000)}`;
                const [orderResult] = await db.execute(
                    `INSERT INTO orders (table_id, order_code, total_amount, status) 
                     VALUES (?, ?, 0, 'pending')`,
                    [tableId, orderCode]
                );
                orderId = orderResult.insertId;
            } else {
                orderId = existingOrder[0].id;
            }

            const [result] = await db.execute(
                `INSERT INTO order_items (
                    order_id,
                    product_id,
                    quantity,
                    base_price,
                    topping_price,
                    order_toppings
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    orderId,
                    productId,
                    quantity,
                    product[0].price,
                    toppingTotalPrice,
                    JSON.stringify(toppings)
                ]
            );

            await db.execute(
                `UPDATE orders o 
                 SET total_amount = (
                     SELECT SUM(total_price) 
                     FROM order_items 
                     WHERE order_id = o.id
                 )
                 WHERE id = ?`,
                [orderId]
            );

            return { orderId, itemId: result.insertId };
        } catch (error) {
            throw error;
        }
    },

    getCartItems: async (tableId) => {
        try {
            const [items] = await db.execute(
                `SELECT 
                    oi.*,
                    p.name,
                    p.image_name,
                    o.order_code,
                    oi.base_price as price,
                    oi.total_price as total_amount
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE o.table_id = ? AND o.status = 'pending'
                ORDER BY oi.id DESC`,
                [tableId]
            );
            return items;
        } catch (error) {
            throw error;
        }
    },

    updateQuantity: async (orderId, quantity) => {
        try {
            await db.execute(
                'UPDATE orders SET quantity = ? WHERE id = ? AND status = "pending"',
                [quantity, orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    removeItem: async (orderId) => {
        try {
            await db.execute(
                'DELETE FROM orders WHERE id = ? AND status = "pending"',
                [orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    clearCart: async (tableId) => {
        try {
            await db.execute(
                'DELETE FROM orders WHERE table_id = ? AND status = "pending"',
                [tableId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    createOrder: async (tableId, products) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Tạo đơn hàng mới
            const orderCode = `ORD${Date.now() - (7 * 60 * 60 * 1000)}`;
            const totalAmount = products.reduce((sum, product) => 
                sum + (product.quantity * (product.base_price + (product.topping_price || 0))), 0);

            const [orderResult] = await connection.execute(
                `INSERT INTO orders (table_id, order_code, total_amount, status) 
                 VALUES (?, ?, ?, 'pending')`,
                [tableId, orderCode, totalAmount]
            );

            const orderId = orderResult.insertId;

            // 2. Thêm từng sản phẩm vào order_items
            for (const product of products) {
                await connection.execute(
                    `INSERT INTO order_items (
                        order_id, 
                        product_id, 
                        quantity, 
                        base_price, 
                        topping_price,
                        order_toppings
                    ) VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        orderId,
                        product.product_id,
                        product.quantity,
                        product.base_price,
                        product.topping_price || 0,
                        JSON.stringify(product.order_toppings || [])
                    ]
                );
            }

            await connection.commit();
            return { order_id: orderId, order_code: orderCode };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getAllOrders: async () => {
        try {
            const [orders] = await db.execute(`
                SELECT 
                    o.id,
                    o.order_code,
                    o.table_id,
                    o.status,
                    o.created_at,
                    t.table_number,
                    SUM(oi.total_price) as total_amount,
                    GROUP_CONCAT(
                        CONCAT(
                            p.name,
                            COALESCE(
                                CASE 
                                    WHEN oi.order_toppings IS NOT NULL 
                                    AND oi.order_toppings != '[]' 
                                    THEN CONCAT(' - ', 
                                        REPLACE(
                                            REPLACE(
                                                JSON_EXTRACT(oi.order_toppings, '$[*].name'),
                                                '[', ''
                                            ),
                                            ']', ''
                                        )
                                    )
                                    ELSE ''
                                END,
                                ''
                            ),
                            '|',
                            oi.quantity,
                            '|',
                            oi.base_price,
                            '|',
                            oi.topping_price,
                            '|',
                            (oi.base_price + COALESCE(oi.topping_price, 0)) * oi.quantity
                        )
                        SEPARATOR '\n'
                    ) as product_details
                FROM orders o
                LEFT JOIN tables t ON o.table_id = t.id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE p.name IS NOT NULL
                GROUP BY 
                    o.id,
                    o.order_code,
                    o.table_id,
                    o.status,
                    o.created_at,
                    t.table_number
                ORDER BY o.created_at DESC
            `);
            
            return orders.map(order => ({
                ...order,
                product_details: order.product_details ? 
                    order.product_details.split('\n')
                    .filter(detail => detail.trim() !== '')
                    .map(detail => {
                        const [name, quantity, basePrice, toppingPrice, totalPrice] = detail.split('|');
                        return {
                            name: name.trim(),
                            quantity: parseInt(quantity),
                            basePrice: parseFloat(basePrice),
                            toppingPrice: parseFloat(toppingPrice || 0),
                            totalPrice: parseFloat(totalPrice)
                        };
                    }) : [],
                total_amount: parseFloat(order.total_amount || 0)
            }));
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (orderId, status) => {
        try {
            await db.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                [status, orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    updateOrder: async (orderId, data) => {
        try {
            const { quantity, note } = data;
            await db.execute(
                'UPDATE orders SET quantity = ?, note = ? WHERE id = ?',
                [quantity, note, orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    deleteOrder: async (orderId) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Xóa order items trước
            await connection.execute(
                'DELETE FROM order_items WHERE order_id = ?',
                [orderId]
            );
            
            // Sau đó xóa order
            await connection.execute(
                'DELETE FROM orders WHERE id = ?',
                [orderId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    exportOrder: async (orderId) => {
        try {
            const [order] = await db.execute(`
                SELECT 
                    o.*,
                    t.table_number,
                    GROUP_CONCAT(
                        DISTINCT
                        CONCAT(
                            p.name,
                            IF(oi.order_toppings IS NOT NULL AND oi.order_toppings != '[]',
                                CONCAT(
                                    ' - ',
                                    TRIM(
                                        BOTH ',' FROM
                                        REPLACE(
                                            REPLACE(
                                                JSON_EXTRACT(oi.order_toppings, '$[*].name'),
                                                '[', ''
                                            ),
                                            ']', ''
                                        )
                                    )
                                ),
                                ''
                            ),
                            ' x',
                            oi.quantity
                        )
                        SEPARATOR '\n'
                    ) as product_details
                FROM orders o
                LEFT JOIN tables t ON o.table_id = t.id
                INNER JOIN order_items oi ON o.id = oi.order_id
                INNER JOIN products p ON oi.product_id = p.id
                WHERE o.id = ?
                GROUP BY 
                    o.id,
                    o.order_code,
                    o.table_id,
                    o.status,
                    o.created_at,
                    t.table_number
            `, [orderId]);
            
            return {
                ...order[0],
                product_details: order[0]?.product_details?.split('\n') || []
            };
        } catch (error) {
            throw error;
        }
    },

    setOrderCompleted: async (orderId) => {
        try {
            await db.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['completed', orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    setOrderPending: async (orderId) => {
        try {
            await db.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['pending', orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = orderModel;