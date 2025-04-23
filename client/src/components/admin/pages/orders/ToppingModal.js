import React, { useState, useRef, useEffect } from 'react';
import './ToppingModalAdmin.css';

function ToppingModal({ product, toppings, onConfirm, onClose }) {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleToppingToggle = (topping) => {
    const exists = selectedToppings.find(t => t.id === topping.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const calculateTotal = () => {
    const basePrice = Number(product.price) || 0;
    const toppingTotal = selectedToppings.reduce((sum, t) => sum + (Number(t.price_adjustment) || 0), 0);
    return (basePrice + toppingTotal) * quantity;
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-container">
        <div className="admin-modal-grid">
          {/* Cột trái */}
          <div className="admin-product-info">
            <img 
              className="admin-topping-product-image"
              src={`http://localhost:5000/uploads/products/${product.image_name}`}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-product.png';
              }}
            />
            <h3 className="admin-product-name">{product.name}</h3>
            <div className="admin-quantity-controls">
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {/* Cột phải */}
          <div className="admin-topping-selection">
            <h4>Tùy chọn thêm:</h4>
            <div className="admin-topping-list">
              {toppings.map(topping => (
                <div 
                  key={topping.id} 
                  className={`admin-topping-item ${selectedToppings.some(t => t.id === topping.id) ? 'selected' : ''}`}
                  onClick={() => handleToppingToggle(topping)}
                >
                  <span>{topping.name}</span>
                  <span>+{new Intl.NumberFormat('vi-VN').format(topping.price_adjustment)}đ</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <div className="admin-price-summary">
            <div className="admin-base-price">
              <span>Giá gốc:</span>
              <span>{new Intl.NumberFormat('vi-VN').format(product.price)}đ</span>
            </div>
            <div className="admin-total-price">
              <strong>Tổng cộng:</strong>
              <strong>{new Intl.NumberFormat('vi-VN').format(calculateTotal())}đ</strong>
            </div>
          </div>
          <div className="admin-action-buttons">
            <button className="admin-confirm-btn" onClick={() => onConfirm(quantity, selectedToppings)}>
              Xác nhận
            </button>
            <button className="admin-cancel-btn" onClick={onClose}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToppingModal;