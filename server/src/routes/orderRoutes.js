const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Route để thêm đơn hàng mới (có thể được gọi bởi cả admin và khách hàng)
router.post('/add', orderController.addOrder);

// Route để lấy danh sách đơn hàng
router.get('/', orderController.getAllOrders);

// Route để cập nhật trạng thái đơn hàng
router.put('/:id/status', orderController.updateOrderStatus);

router.put('/:id', orderController.updateOrder);
router.put('/:id/complete', orderController.setOrderCompleted);
router.put('/:id/pending', orderController.setOrderPending);

// Thêm route xóa đơn hàng
router.delete('/:id', orderController.deleteOrder);

module.exports = router;