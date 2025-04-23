const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload, processImage } = require('../middleware/upload');
const { auth, checkRole } = require('../middleware/auth');

// Public routes - không cần auth
router.get('/public', productController.getProducts);
router.get('/public/:id', productController.getProductById);
router.get('/related/:id', productController.getRelatedProducts);
router.get('/toppings/:productId', productController.getProductToppings);

// Protected routes - cho phép admin, kitchen và staff xem sản phẩm
router.get('/', auth, checkRole(['admin', 'kitchen', 'staff']), productController.getAdminProducts);

// Middleware cho các routes admin - chỉ admin mới được thêm/sửa/xóa
router.use(auth);
router.use(checkRole(['admin']));

// Routes quản lý sản phẩm (CRUD) - chỉ admin
router.post('/', upload.single('image'), processImage, productController.addProduct);
router.put('/:id', upload.single('image'), processImage, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;