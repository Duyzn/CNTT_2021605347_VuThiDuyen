import React from 'react';
import './OrderProductCard.css';

function OrderProductCard({ product, onSelect }) {
  return (
    <div className="order-product-card" onClick={() => onSelect(product)}>
      <div className="product-image">
        <img 
          src={`http://localhost:5000/uploads/products/${product.image_name}`} 
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-product.png';
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{new Intl.NumberFormat('vi-VN').format(product.price)}đ</p>
      </div>
    </div>
  );
}

export default OrderProductCard;