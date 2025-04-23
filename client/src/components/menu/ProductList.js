import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductItem from './ProductItem';
import { useCart } from '../../contexts/CartContext';
import ToppingModal from '../common/ToppingModal';
import Swal from 'sweetalert2';

function ProductList({ filter, viewMode }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [toppings, setToppings] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/public');
        if (response.data.success) {
          let filteredProducts = response.data.data;
          if (filter !== '*') {
            filteredProducts = filteredProducts.filter(product => 
              product.category_id.toString() === filter
            );
          }
          // Sort theo category_id
          filteredProducts.sort((a, b) => {
            return a.category_id - b.category_id;
          });
          setProducts(filteredProducts);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter]);

  const handleAddToCart = async (product) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/toppings/${product.id}`);
      
      if (response.data.data.hasToppings) {
        setToppings(response.data.data.toppings);
        setSelectedProduct(product);
        setShowToppingModal(true);
      } else {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image_name: product.image_name,
          toppings: []
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
      addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image_name: selectedProduct.image_name
      }, quantity, selectedToppings);

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

  const handleCloseModal = () => {
    setShowToppingModal(false);
    setSelectedProduct(null);
  };

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="row product-lists">
          {/* {products.map(product => (
            <ProductItem key={product.id} product={product} />
          ))} */}
          {products.map((product, index) => {
            const prevProduct = products[index - 1];
            const showDivider = !prevProduct || prevProduct.category_id !== product.category_id;
            
            return (
              <React.Fragment key={product.id}>
                {showDivider && (
                  <div className="col-12">
                    <div className="category-divider">
                      <h3>{product.category_name}</h3>
                    </div>
                  </div>
                )}
                <ProductItem product={product} />
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="product-list">
          {products.map((product, index) => {
            const prevProduct = products[index - 1];
            const showDivider = !prevProduct || prevProduct.category_id !== product.category_id;
            
            return (
              <React.Fragment key={product.id}>
                {showDivider && (
                  <div className="category-divider">
                    <h3>{product.category_name}</h3>
                  </div>
                )}
                <div className="product-list-item row align-items-center mb-4 p-3 border rounded">
                  <div className="col-md-3">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={`http://localhost:5000/uploads/products/${product.image_name}`} 
                        alt={product.name}
                        className="img-fluid rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/img/products/default-product.jpg';
                        }}
                      />
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to={`/product/${product.id}`}>
                      <h4>{product.name}</h4>
                    </Link>
                    <p className="product-description">{product.description}</p>
                  </div>
                  <div className="col-md-3 text-right">
                    <div className="price mb-2">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>
                    <button 
                      className="cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="fas fa-cart-plus"></i>
                      <span> Thêm vào giỏ</span>
                    </button>
                  </div>
                </div>
                </React.Fragment>
            );
          })} 
        </div>
      )}

      <ToppingModal 
        show={showToppingModal}
        onClose={handleCloseModal}
        toppings={toppings}
        onConfirm={handleToppingConfirm}
        product={selectedProduct}
      />
    </>
  );
}

export default ProductList;