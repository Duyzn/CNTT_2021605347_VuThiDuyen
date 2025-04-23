import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import ToppingModal from '../common/ToppingModal';
import Swal from 'sweetalert2';

function ProductItem({ product }) {
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [toppings, setToppings] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(
        `http://localhost:5000/api/products/toppings/${product.id}`,
        { headers }
      );
      
      if (response.data.data.hasToppings) {
        setToppings(response.data.data.toppings);
        setSelectedProduct(product);
        setShowToppingModal(true);
      } else {
        console.log('Adding product:', product);
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image_name: product.image_name
        }, 1);
        
        Swal.fire({
          icon: 'success',
          title: 'Đã thêm vào giỏ',
          text: 'Sản phẩm đã được thêm vào giỏ hàng',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Chưa đăng nhập',
          text: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể thêm sản phẩm vào giỏ hàng'
        });
      }
    }
  };

  const handleToppingConfirm = async (quantity, selectedToppings) => {
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_name: product.image_name
      }, quantity, selectedToppings);
      
      Swal.fire({
        icon: 'success',
        title: 'Đã thêm vào giỏ',
        text: 'Sản phẩm đã được thêm vào giỏ hàng',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể thêm sản phẩm vào giỏ hàng'
      });
    }
  };

  const handleCloseModal = () => {
    setShowToppingModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className={`col-lg-4 col-md-6 text-center ${product.category}`}>
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
        onClose={handleCloseModal}
        toppings={toppings}
        onConfirm={handleToppingConfirm}
        product={selectedProduct}
      />
    </div>
  );
}

export default ProductItem;