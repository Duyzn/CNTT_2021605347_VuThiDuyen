import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

function CartBar() {
  const { cartCount } = useCart();

  return (
    <div className="cart-bar">
      <Link to="/cart" className="cart-bar-content">
        <i className="fas fa-shopping-cart"></i>
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        <span className="cart-total">Xem giỏ hàng</span>
      </Link>
    </div>
  );
}

export default CartBar;