const orderModel = require('../models/orderModel');
const { success, error } = require('../utils/response');
const db = require('../config/database');

const orderController = {
    checkPendingOrderByTable: async (req, res) => {
        const { tableId } = req.params;
        try {
          const [orders] = await db.execute(
            'SELECT * FROM orders WHERE table_id = ? AND status = ?',
            [tableId, 'pending']
          );
      
          if (orders.length > 0) {
            return res.json({ success: true, hasPendingOrder: true });
          } else {
            return res.json({ success: true, hasPendingOrder: false });
          }
        } catch (err) {
          console.error('Lỗi khi kiểm tra đơn pending:',err);
          return res.status(500).json({ success: false, message: 'Lỗi server' });
        }
      },
      
    addOrder: async (req, res) => {
        try {
            console.log('Request body:', req.body);
            const { tableId, products } = req.body;

            if (!tableId || !products || !Array.isArray(products)) {
                return error(res, 'Dữ liệu đơn hàng không hợp lệ');
            }
        /*
            // ❗️Kiểm tra trạng thái bàn trước khi tạo đơn
            const [tableResult] = await db.execute(
                'SELECT status FROM tables WHERE id = ?',
                [tableId]
            );

            if (!tableResult || tableResult.length === 0) {
                return error(res, 'Không tìm thấy bàn');
            }

            const tableStatus = tableResult[0].status;
            
            if (tableStatus === 'pending') {
                return error(res, 'Bàn này đang có đơn chờ, không thể tạo đơn mới');
            }
*/

  
            // Xử lý từng sản phẩm trong đơn hàng
            const processedProducts = await Promise.all(products.map(async (product) => {
                const [productInfo] = await db.execute(
                    'SELECT * FROM products WHERE id = ?',
                    [product.product_id]
                );

                if (!productInfo || productInfo.length === 0) {
                    throw new Error(`Sản phẩm ${product.product_id} không tồn tại`);
                }

                const toppingTotalPrice = Array.isArray(product.order_toppings) 
                    ? product.order_toppings.reduce((sum, topping) => 
                        sum + (Number(topping.price_adjustment) || 0), 0)
                    : 0;

                return {
                    ...product,
                    base_price: productInfo[0].price,
                    topping_price: toppingTotalPrice
                };
            }));

            const result = await orderModel.createOrder(tableId, processedProducts);
            await db.execute('UPDATE tables SET status = ? WHERE id = ?', ['pending', tableId]);

            return success(res, 'Đơn hàng đã được tạo thành công', result);
        } catch (err) {
            console.error('Error in addOrder:', err);
            return error(res, 'Không thể tạo đơn hàng', err);
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await orderModel.getAllOrders();
            return success(res, 'Lấy danh sách đơn hàng thành công', orders);
        } catch (err) {
            console.error('Error in getAllOrders:', err);
            return error(res, 'Không thể lấy danh sách đơn hàng', err);
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await orderModel.updateStatus(id, status);
            return success(res, 'Cập nhật trạng thái đơn hàng thành công');
        } catch (err) {
            console.error('Error in updateOrderStatus:', err);
            return error(res, 'Không thể cập nhật trạng thái đơn hàng', err);
        }
    },

    updateOrder: async (req, res) => {
        try {
            const { id } = req.params;
            await orderModel.updateOrder(id, req.body);
            return success(res, 'Cập nhật đơn hàng thành công');
        } catch (err) {
            return error(res, 'Không thể cập nhật đơn hàng', err);
        }
    },

    setOrderCompleted: async (req, res) => {
        try {
            const { id } = req.params;
            await orderModel.setOrderCompleted(id);
            return success(res, 'Đã chuyển đơn hàng sang trạng thái hoàn thành');
        } catch (err) {
            return error(res, 'Không thể cập nhật trạng thái đơn hàng', err);
        }
    },

    setOrderPending: async (req, res) => {
        try {
            const { id } = req.params;
            await orderModel.setOrderPending(id);
            return success(res, 'Đã chuyển đơn hàng sang trạng thái chờ');
        } catch (err) {
            return error(res, 'Không thể cập nhật trạng thái đơn hàng', err);
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            await orderModel.deleteOrder(id);
            return success(res, 'Xóa đơn hàng thành công');
        } catch (err) {
            return error(res, 'Không thể xóa đơn hàng', err);
        }
    },

    exportOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await orderModel.exportOrder(id);
            return success(res, 'Xuất hóa đơn thành công', order);
        } catch (err) {
            return error(res, 'Không thể xuất hóa đơn', err);
        }
    }
};

module.exports = orderController;