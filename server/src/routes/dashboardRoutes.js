const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { auth, checkRole } = require('../middleware/auth'); 

// Route này yêu cầu đăng nhập và là admin
router.get('/stats', auth, checkRole(['admin']), DashboardController.getStats);

// router.get('/stats', DashboardController.getStats);

router.get('/export/orders', DashboardController.exportOrders);
router.get('/export/revenue', DashboardController.exportRevenue);

module.exports = router;