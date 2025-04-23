import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import ToppingModal from '../common/ToppingModal';
import Swal from 'sweetalert2';

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [toppings, setToppings] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/public/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Xem sản phẩm ${product.name} tại Foodee`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      default:
        break;
    }
  };

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
        setShowToppingModal(true);
      } else {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image_name: product.image_name
        }, quantity);
        
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

  const handleToppingConfirm = async (qty, selectedToppings) => {
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_name: product.image_name
      }, qty, selectedToppings);
      
      setShowToppingModal(false);
      
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
  };

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!product) return <div className="text-center">Không tìm thấy sản phẩm</div>;

  return (
    <div className="row">
      <div className="col-md-5">
        <div className="single-product-img">
          <img 
            src={`http://localhost:5000/uploads/products/${product.image_name}`}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/img/products/default-product.jpg';
            }}
          />
        </div>
      </div>
      <div className="col-md-7">
        <div className="single-product-content">
          <h3>{product.name}</h3>
          <p className="single-product-pricing">
            <span> </span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>
          <p>{product.description}</p>
          <div className="single-product-form">
            <form action="index.html">
              <input 
                type="number" 
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
            </form>
            <button onClick={handleAddToCart} className="cart-btn">
              <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
            </button>
            <p><strong>Danh mục: </strong>{product.category_name}</p>
          </div>
          <h4>Chia sẻ:</h4>
          <ul className="product-share">
            <li>
              <button onClick={() => handleShare('facebook')} className="share-btn">
                <i className="fab fa-facebook-f"></i>
              </button>
            </li>
            <li>
              <button onClick={() => handleShare('twitter')} className="share-btn">
                <i className="fab fa-twitter"></i>
              </button>
            </li>
            <li>
              <button onClick={() => handleShare('linkedin')} className="share-btn">
                <i className="fab fa-linkedin"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <ToppingModal 
        show={showToppingModal}
        onClose={handleCloseModal}
        toppings={toppings}
        onConfirm={handleToppingConfirm}
        product={product}
      />
    </div>
  );
}

export default ProductDetail;