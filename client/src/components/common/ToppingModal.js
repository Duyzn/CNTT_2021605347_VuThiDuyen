import React, { useState, useRef, useEffect } from 'react';
import './ToppingModal.css';

function ToppingModal({ show, onClose, toppings, onConfirm, product }) {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef();

  // Xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  const handleToppingChange = (topping) => {
    const exists = selectedToppings.find(t => t.id === topping.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, { ...topping, quantity: 1 }]);
    }
  };

  // Thêm các hàm xử lý tăng giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (!show) return null;

  return (
    <div className="topping-modal-overlay">
      <div className="topping-modal-content" ref={modalRef}>
        <div className="topping-modal-header">
          <h3>Chọn Topping</h3>
          <button className="topping-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="topping-modal-body">
          <div className="topping-product-info">
            <div className="topping-product-image">
              <img 
                src={`http://localhost:5000/uploads/products/${product?.image_name}`}
                alt={product?.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/img/products/default-product.jpg';
                }}
              />
            </div>
            <div className="topping-product-details">
              <h4>{product?.name}</h4>
              <p className="topping-price">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.price)}
              </p>
            </div>
          </div>

          <div className="topping-quantity-section">
            <label>Số lượng:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          </div>

          <div className="topping-toppings-list">
            {toppings.map(topping => (
              <div key={topping.id} className="topping-topping-item">
                <div className="topping-topping-checkbox">
                  <input
                    type="checkbox"
                    id={`topping-${topping.id}`}
                    checked={selectedToppings.some(t => t.id === topping.id)}
                    onChange={() => handleToppingChange(topping)}
                  />
                </div>
                <div className="topping-topping-info">
                  <label htmlFor={`topping-${topping.id}`}>
                    {topping.name}
                  </label>
                  <span className="topping-topping-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(topping.price_adjustment)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="topping-modal-footer">
          <button className="topping-btn-cancel" onClick={onClose}>Hủy</button>
          <button 
            className="topping-btn-confirm"
            onClick={() => onConfirm(quantity, selectedToppings)}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToppingModal;