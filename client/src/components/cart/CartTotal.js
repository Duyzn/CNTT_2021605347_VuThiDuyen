import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function CartTotal() {
  const { cartItems, setCartItems } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const basePrice = parseFloat(item.price);
      const toppingTotal = item.toppings ? item.toppings.reduce((t, topping) => 
        t + (parseFloat(topping.price_adjustment) || 0), 0) : 0;
      return sum + ((basePrice + toppingTotal) * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        Swal.fire({
          title: 'Giỏ hàng trống',
          text: 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán',
          icon: 'warning'
        });
        return;
      }

      const tableId = localStorage.getItem('tableId');
      
      if (!tableId) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Vui lòng quét mã QR trên mặt bàn để đặt món nhé khách iu',
          icon: 'error'
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Xác nhận thanh toán',
        text: `Tổng số tiền: ${calculateTotal().toLocaleString('vi-VN')}đ`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const orderData = {
          tableId: parseInt(tableId),
          products: cartItems.map(item => {
            const toppingTotal = item.toppings ? item.toppings.reduce((sum, t) => 
              sum + (parseFloat(t.price_adjustment) || 0), 0) : 0;
            
            return {
              product_id: item.productId,
              quantity: item.quantity,
              base_price: parseFloat(item.price),
              topping_price: toppingTotal,
              order_toppings: item.toppings || []
            };
          })
        };

        console.log('Sending order data:', orderData);
        const response = await axios.post('http://localhost:5000/api/orders/add', orderData);

        if (response.data.success) {
          // Gửi thông báo qua Telegram sau khi lưu đơn hàng thành công
          await axios.post('http://localhost:5000/api/support/notify-order', {
            tableId: parseInt(tableId),
            products: cartItems,
            totalAmount: calculateTotal()
          });

          await Swal.fire({
            title: 'Thanh toán thành công!', 
            text: 'Cảm ơn bạn đã đặt hàng',
            icon: 'success',
            timer: 2000
          });
          
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Swal.fire({
        title: 'Lỗi',
        text: 'Không thể hoàn tất thanh toán',
        icon: 'error'
      });
    }
  };

  return (
    <div className="total-section">
      <table className="total-table">
        <thead className="total-table-head">
          <tr className="table-total-row">
            <th>Tổng cộng</th>
            <th>Giá tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr className="total-data">
            <td><strong>Tổng tiền: </strong></td>
            <td>{calculateTotal().toLocaleString('vi-VN')}đ</td>
          </tr>
        </tbody>
      </table>
      <div className="cart-buttons">
        <Link to="/menu" className="boxed-btn">Tiếp tục đặt món</Link>
        <Link onClick={handleCheckout} className="boxed-btn black">Thanh toán</Link>
      </div>
    </div>
  );
}

export default CartTotal;