const db = require('../config/database');

const DashboardModel = {
    getStats: async () => {
        const [userCount] = await db.query('SELECT COUNT(*) as total FROM users');
        const [categoryCount] = await db.query('SELECT COUNT(*) as total FROM categories WHERE is_active = true');
        const [productCount] = await db.query('SELECT COUNT(*) as total FROM products WHERE is_available = true');
        const [tableCount] = await db.query('SELECT COUNT(*) as total FROM tables WHERE status = "available"');
        const [orderCount] = await db.query('SELECT COUNT(*) as total FROM orders');
        const [revenue] = await db.query('SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"');
        
        // Thêm thống kê theo thời gian
        const [revenueByMonth] = await db.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(total_amount) as revenue
            FROM orders 
            WHERE status = 'completed'
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month DESC
            LIMIT 6
        `);

        // Thống kê sản phẩm bán chạy
        const [topProducts] = await db.query(`
            SELECT 
                p.name,
                SUM(oi.quantity) as total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status = 'completed'
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 5
        `);

        return {
            users: userCount[0].total,
            categories: categoryCount[0].total,
            products: productCount[0].total,
            tables: tableCount[0].total,
            orders: orderCount[0].total,
            revenue: revenue[0].total || 0,
            revenueByMonth,
            topProducts
        };
    }
};

module.exports = DashboardModel;
