const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Public routes - không cần auth
router.post('/add', cartController.addToCart);
router.get('/:tableId', cartController.getCartItems);
router.put('/update', cartController.updateQuantity);
router.delete('/item/:orderId', cartController.removeItem);
router.delete('/clear/:tableId', cartController.clearCart);

module.exports = router;