const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Route để thêm đơn hàng mới (có thể được gọi bởi cả admin và khách hàng)
router.post('/add', orderController.addOrder);

// Route để lấy danh sách đơn hàng
router.get('/', orderController.getAllOrders);

// Kiểm tra xem bàn có đơn hàng pending không
//router.get('/has-pending/:tableId', orderController.checkPendingOrderByTable);
// src/routes/orderRoutes.js

router.get('/has-pending/:tableId', async (req, res) => {
    const tableId = req.params.tableId;

    try {
        // Bước 1: Kiểm tra bàn có tồn tại và đang ở trạng thái "available"
        const [tableRows] = await db.execute(
            'SELECT * FROM tables WHERE id = ? AND status = "available"',
            [tableId]
        );

        if (tableRows.length === 0) {
            return res.status(404).json({ message: 'Bàn không tồn tại hoặc đang bảo trì' });
        }

        // Bước 2: Kiểm tra xem có đơn hàng nào "pending" không
        const [orderRows] = await db.execute(
            'SELECT * FROM orders WHERE table_id = ? AND status = "pending" ORDER BY created_at DESC LIMIT 1',
            [tableId]
        );

        if (orderRows.length > 0) {
            return res.status(200).json({
                hasPending: true,
                message: 'Đã có đơn hàng đang chờ xử lý',
                order: orderRows[0]
            });
        } else {
            return res.status(200).json({ hasPending: false });
        }
    } catch (error) {
        console.error('Lỗi kiểm tra đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});


// Route để cập nhật trạng thái đơn hàng
router.put('/:id/status', orderController.updateOrderStatus);

router.put('/:id', orderController.updateOrder);
router.put('/:id/complete', orderController.setOrderCompleted);
router.put('/:id/pending', orderController.setOrderPending);

// Thêm route xóa đơn hàng
router.delete('/:id', orderController.deleteOrder);

module.exports = router;