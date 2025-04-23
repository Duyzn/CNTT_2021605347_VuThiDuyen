const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Áp dụng middleware auth cho từng route riêng lẻ
router.get('/', auth, userController.getUsers);
router.post('/', auth, userController.createUser);
router.put('/:username', auth, userController.updateUser);
router.delete('/:username', auth, userController.deleteUser);

module.exports = router;