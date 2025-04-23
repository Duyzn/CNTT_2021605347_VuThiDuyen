const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth } = require('../middleware/auth');

// Public route - không cần auth
router.get('/public', categoryController.getActiveCategories);

// Routes yêu cầu auth
router.get('/', auth, categoryController.getCategories);

// Route lấy danh mục đang hoạt động cho form thêm/sửa sản phẩm
router.get('/active', auth, categoryController.getActiveCategories);

// Route thêm mới danh mục
router.post('/', auth, categoryController.createCategory);

// Route cập nhật danh mục
router.put('/:id', auth, categoryController.updateCategory);

// Route xóa danh mục
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;