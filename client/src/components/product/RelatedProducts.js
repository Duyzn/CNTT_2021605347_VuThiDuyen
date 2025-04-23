import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductItem from '../menu/ProductItem';

function RelatedProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Giả sử API trả về các sản phẩm cùng danh mục
        const response = await axios.get(`http://localhost:5000/api/products/related/${id}`);
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setError('Không thể tải sản phẩm liên quan');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [id]);

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (products.length === 0) return null;

  return (
    <div className="more-products mb-150">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center">
            <div className="section-title">	
              <h3><span className="orange-text">Sản phẩm</span> Liên quan</h3>
              <p>Các sản phẩm cùng danh mục có thể bạn quan tâm</p>
            </div>
          </div>
        </div>
        <div className="row">
          {products.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RelatedProducts;