const express = require('express');
const router = express.Router();
const productOptionController = require('../controllers/productOptionController');
const { auth, checkRole } = require('../middleware/auth');

// Public routes
router.get('/all', productOptionController.getAllOptions);
router.get('/product/:product_id', productOptionController.getProductOptions);

// Protected routes
router.use(auth);
router.use(checkRole(['admin']));

router.post('/', productOptionController.createOption);
router.delete('/:id', productOptionController.deleteOption);

module.exports = router;