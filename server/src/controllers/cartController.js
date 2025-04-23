const orderModel = require('../models/orderModel');

const cartController = {
    addToCart: async (req, res) => {
        try {
            const { tableId, productId, quantity, toppings } = req.body;
            
            // Đảm bảo toppings là array
            const toppingArray = Array.isArray(toppings) ? toppings : [];
            
            await orderModel.addToCart(tableId, productId, quantity, toppingArray);
            
            res.json({
                success: true,
                message: 'Thêm vào giỏ hàng thành công'
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm vào giỏ hàng'
            });
        }
    },

    getCartItems: async (req, res) => {
        try {
            const { tableId } = req.params;
            const items = await orderModel.getCartItems(tableId);
            
            // Format toppings trước khi trả về
            const formattedItems = items.map(item => ({
                ...item,
                order_toppings: Array.isArray(item.order_toppings) 
                    ? item.order_toppings 
                    : (item.order_toppings ? JSON.parse(item.order_toppings) : [])
            }));
            
            res.json({
                success: true,
                data: formattedItems
            });
        } catch (error) {
            console.error('Error getting cart items:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin giỏ hàng'
            });
        }
    },

    updateQuantity: async (req, res) => {
        try {
            const { orderId, quantity } = req.body;
            await orderModel.updateQuantity(orderId, quantity);
            
            res.json({
                success: true,
                message: 'Cập nhật số lượng thành công'
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật số lượng'
            });
        }
    },

    removeItem: async (req, res) => {
        try {
            const { orderId } = req.params;
            await orderModel.removeItem(orderId);
            
            res.json({
                success: true,
                message: 'Xóa sản phẩm thành công'
            });
        } catch (error) {
            console.error('Error removing item:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa sản phẩm'
            });
        }
    },

    clearCart: async (req, res) => {
        try {
            const { tableId } = req.params;
            await orderModel.clearCart(tableId);
            
            res.json({
                success: true,
                message: 'Xóa giỏ hàng thành công'
            });
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa giỏ hàng'
            });
        }
    }
};

module.exports = cartController;