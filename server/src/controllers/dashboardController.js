const db = require('../config/database');
const ExcelJS = require('exceljs');

const DashboardController = {
    getStats: async (req, res) => {
        try {
            console.log('Starting getStats...');

            // Đếm số người dùng
            const [userCount] = await db.query(
                'SELECT COUNT(*) as total FROM users'
            );
            console.log('Users count:', userCount);

            // Đếm số danh mục đang active
            const [categoryCount] = await db.query(
                'SELECT COUNT(*) as total FROM categories WHERE is_active = true'
            );
            console.log('Categories count:', categoryCount);

            // Đếm số món ăn đang available
            const [productCount] = await db.query(
                'SELECT COUNT(*) as total FROM products WHERE is_available = true'
            );
            console.log('Products count:', productCount);

            // Đếm số bàn đang available
            const [tableCount] = await db.query(
                'SELECT COUNT(*) as total FROM tables WHERE status = "available"'
            );
            console.log('Tables count:', tableCount);

            // Đếm tổng số đơn hàng
            const [orderCount] = await db.query(
                'SELECT COUNT(*) as total FROM orders'
            );
            console.log('Orders count:', orderCount);

            // Tính tổng doanh thu
            const [revenue] = await db.query(`
                SELECT COALESCE(SUM(total_amount), 0) as total 
                FROM orders 
                WHERE status = 'completed'
            `);
            console.log('Revenue:', revenue);

            // Sửa lại query thống kê doanh thu theo tháng
            const [revenueByMonth] = await db.query(`
                SELECT 
                    month,
                    SUM(revenue) as revenue
                FROM (
                    SELECT 
                        DATE_FORMAT(created_at, '%m/%Y') as month,
                        total_amount as revenue
                    FROM orders 
                    WHERE status = 'completed'
                        AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
                ) as monthly_data
                GROUP BY month
                ORDER BY STR_TO_DATE(CONCAT('01/', month), '%d/%m/%Y') ASC
            `);
            console.log('Revenue by month:', revenueByMonth);

            // Sửa lại query top sản phẩm
            const [topProducts] = await db.query(`
                SELECT 
                    p.name,
                    COALESCE(SUM(oi.quantity), 0) as total_sold
                FROM products p
                LEFT JOIN order_items oi ON p.id = oi.product_id
                LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
                GROUP BY p.id, p.name
                HAVING total_sold > 0
                ORDER BY total_sold DESC
                LIMIT 5
            `);
            console.log('Top products:', topProducts);

            // Sửa lại query đếm số đơn hàng theo tháng
            const [ordersByMonth] = await db.query(`
                SELECT 
                    DATE_FORMAT(created_at, '%m/%Y') as month,
                    COUNT(*) as count
                FROM orders 
                WHERE status = 'completed'
                    AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
                GROUP BY month
                ORDER BY month ASC
            `);
            console.log('Orders by month:', ordersByMonth);

            const responseData = {
                users: userCount[0].total,
                categories: categoryCount[0].total,
                products: productCount[0].total,
                tables: tableCount[0].total,
                orders: orderCount[0].total,
                revenue: revenue[0].total,
                revenueByMonth: revenueByMonth,
                topProducts: topProducts,
                ordersByMonth: ordersByMonth
            };

            console.log('Final response data:', responseData);

            res.json({
                success: true,
                data: responseData
            });

        } catch (error) {
            console.error('Error in getStats:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thống kê',
                error: error.message
            });
        }
    },

    exportOrders: async (req, res) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Đơn hàng');

            // Định dạng header giữ nguyên
            worksheet.columns = [
                { header: 'Mã đơn', key: 'order_code', width: 20 },
                { header: 'Bàn', key: 'table_number', width: 10 },
                { header: 'Món ăn + Topping', key: 'items', width: 40 },
                { header: 'Số lượng', key: 'quantity', width: 10 },
                { header: 'Giá', key: 'price', width: 15 },
                // { header: 'Topping', key: 'toppings', width: 30 },
                { header: 'Tổng tiền', key: 'total_amount', width: 15 },
                { header: 'Trạng thái', key: 'status', width: 15 },
                { header: 'Ngày tạo', key: 'created_at', width: 20 }
            ];

            // Cập nhật query để lấy thêm thông tin topping
            const [orders] = await db.query(`
                SELECT 
                    o.order_code,
                    t.table_number,
                    o.total_amount,
                    o.status,
                    o.created_at,
                    p.name as product_name,
                    oi.quantity,
                    oi.base_price,
                    oi.order_toppings,
                    oi.topping_price,
                    GROUP_CONCAT(
                        CONCAT(opt.name, ' (+', tj.price, 'đ)')
                        SEPARATOR ', '
                    ) as topping_details
                FROM orders o
                JOIN tables t ON o.table_id = t.id
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                LEFT JOIN JSON_TABLE(
                    oi.order_toppings,
                    '$[*]' COLUMNS(
                        option_id INT PATH '$.option_id',
                        price DECIMAL(10,2) PATH '$.price'
                    )
                ) tj ON true
                LEFT JOIN options opt ON tj.option_id = opt.id
                GROUP BY o.order_code, t.table_number, o.total_amount, o.status, 
                         o.created_at, p.name, oi.quantity, oi.base_price, 
                         oi.order_toppings, oi.topping_price
                ORDER BY o.created_at DESC, o.order_code
            `);

            // Nhóm các món ăn theo đơn hàng
            const groupedOrders = orders.reduce((acc, curr) => {
                if (!acc[curr.order_code]) {
                    acc[curr.order_code] = {
                        order_code: curr.order_code,
                        table_number: curr.table_number,
                        total_amount: curr.total_amount,
                        status: curr.status,
                        created_at: curr.created_at,
                        items: []
                    };
                }

                // Thêm chi tiết món ăn và topping
                acc[curr.order_code].items.push({
                    product_name: curr.product_name,
                    quantity: curr.quantity,
                    base_price: curr.base_price,
                    topping_price: curr.topping_price,
                    toppings: curr.topping_details || ''
                });

                return acc;
            }, {});

            // Thêm d�� liệu vào worksheet
            Object.values(groupedOrders).forEach(order => {
                order.items.forEach((item, index) => {
                    worksheet.addRow({
                        order_code: index === 0 ? order.order_code : '',
                        table_number: index === 0 ? order.table_number : '',
                        items: item.product_name,
                        quantity: item.quantity,
                        price: `${item.base_price}đ`,
                        toppings: item.toppings,
                        total_amount: index === 0 ? `${order.total_amount}đ` : '',
                        status: index === 0 ? (order.status === 'completed' ? 'Hoàn thành' : 'Đang chờ') : '',
                        created_at: index === 0 ? new Date(new Date(order.created_at).getTime() - (7 * 60 * 60 * 1000)).toLocaleString('vi-VN') : ''
                    });
                });

                // Thêm dòng trống giữa các đơn hàng
                worksheet.addRow({});
            });

            // Style cho worksheet giữ nguyên
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };

            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');

            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error('Error exporting orders:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xuất dữ liệu đơn hàng',
                error: error.message
            });
        }
    },

    exportRevenue: async (req, res) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Doanh thu theo tháng');

            worksheet.columns = [
                { header: 'Tháng', key: 'month', width: 15 },
                { header: 'Doanh thu', key: 'revenue', width: 20 },
                { header: 'Số đơn hàng', key: 'order_count', width: 15 }
            ];

            const [revenueData] = await db.query(`
                SELECT 
                    DATE_FORMAT(created_at, '%m/%Y') as month,
                    SUM(total_amount) as revenue,
                    COUNT(*) as order_count
                FROM orders 
                WHERE status = 'completed'
                GROUP BY month
                ORDER BY STR_TO_DATE(CONCAT('01/', month), '%d/%m/%Y') DESC
            `);

            revenueData.forEach(data => {
                worksheet.addRow({
                    month: data.month,
                    revenue: data.revenue,
                    order_count: data.order_count
                });
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=revenue.xlsx');

            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error('Error exporting revenue:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xuất dữ liệu doanh thu'
            });
        }
    }
};

module.exports = DashboardController;