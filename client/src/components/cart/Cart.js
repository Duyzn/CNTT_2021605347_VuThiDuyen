import React from 'react';
import { useCart } from '../../contexts/CartContext';
import BreadcrumbSection from '../about/CartSection';  
import CartTable from './CartTable';
import CartTotal from './CartTotal';
import LogoCarousel from '../home/LogoCarousel'; 

function Cart() {
  const { cartItems } = useCart();

  return (
    <>
      <BreadcrumbSection 
        title="Giỏ hàng" 
        subtitle="Sạch & Tươi ngon"
      />

      <div className="cart-section mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <CartTable cartItems={cartItems} />
            </div>
            <div className="col-lg-4">
              <CartTotal cartItems={cartItems} />
            </div>
          </div>
        </div>
      </div>

      <LogoCarousel />
    </>
  );
}

export default Cart;