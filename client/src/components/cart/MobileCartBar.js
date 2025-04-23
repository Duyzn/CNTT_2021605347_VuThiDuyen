import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function MobileCartBar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Chỉ hiển thị khi có sản phẩm trong giỏ
  if (cartItems.length === 0) return null;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const toppingsTotal = item.toppings ? item.toppings.reduce((t, topping) => 
      t + (parseFloat(topping.price_adjustment) || 0), 0) : 0;
    return sum + itemTotal + (toppingsTotal * item.quantity);
  }, 0);

  return (
    <div className="mobile-cart-bar">
      <div className="cart-info">
        <span className="cart-count">{totalItems}</span>
        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
      </div>
      <button 
        className="view-cart-btn"
        onClick={() => navigate('/cart')}
      >
        Xem giỏ hàng & Thanh toán
      </button>
    </div>
  );
}

export default MobileCartBar;