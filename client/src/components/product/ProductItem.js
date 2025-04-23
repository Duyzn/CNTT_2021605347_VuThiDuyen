import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import ToppingModal from '../common/ToppingModal';
import Swal from 'sweetalert2';

function ProductItem({ product }) {
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [toppings, setToppings] = useState([]);
  const { cartItems, addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/toppings/${product.id}`);
      
      if (response.data.data.hasToppings) {
        setToppings(response.data.data.toppings);
        setShowToppingModal(true);
      } else {
        // Thêm sản phẩm không có topping
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image_name: product.image_name,
          toppings: [] // Thêm mảng toppings rỗng
        }, 1);
        
        Swal.fire({
          icon: 'success',
          title: 'Đã thêm vào giỏ',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể thêm sản phẩm vào giỏ hàng'
      });
    }
  };

  const handleToppingConfirm = async (quantity, selectedToppings) => {
    try {
      // Thêm sản phẩm với topping đã chọn
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_name: product.image_name,
        toppings: selectedToppings // Thêm topping đã chọn
      }, quantity);

      setShowToppingModal(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Đã thêm vào giỏ',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể thêm sản phẩm vào giỏ hàng'
      });
    }
  };

  return (
    <div className="col-lg-4 col-md-6 text-center">
      <div className="single-product-item">
        <div className="product-image">
          <Link to={`/product/${product.id}`}>
            <img 
              src={`http://localhost:5000/uploads/products/${product.image_name}`}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/img/products/default-product.jpg';
              }}
            />
          </Link>
        </div>
        <h3>{product.name}</h3>
        <p className="product-price">
          <span> </span> 
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </p>
        <button onClick={handleAddToCart} className="cart-btn">
          <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
        </button>
      </div>

      <ToppingModal 
        show={showToppingModal}
        onClose={() => setShowToppingModal(false)}
        toppings={toppings}
        onConfirm={handleToppingConfirm}
      />
    </div>
  );
}

export default ProductItem;