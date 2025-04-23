// src/components/common/SearchArea.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function SearchArea() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.jQuery) {
      window.jQuery('.search-bar-icon').on('click', function(e) {
        e.preventDefault();
        window.jQuery('.search-area').addClass('search-active');
      });

      window.jQuery('.close-btn').on('click', function() {
        window.jQuery('.search-area').removeClass('search-active');
        setSearchResults([]); // Reset kết quả khi đóng
        setSearchTerm(''); // Reset từ khóa
      });

      window.jQuery(document).on('click', function(e) {
        if (!window.jQuery(e.target).closest('.search-bar-tablecell, .search-bar-icon').length) {
          window.jQuery('.search-area').removeClass('search-active');
          setSearchResults([]); // Reset kết quả khi đóng
          setSearchTerm(''); // Reset từ khóa
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng nhập từ khóa tìm kiếm',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/products/public`);
      if (response.data.success) {
        const searchTermLower = searchTerm.toLowerCase();
        const filteredProducts = response.data.data.filter(product => 
          product.name.toLowerCase().includes(searchTermLower) ||
          product.description?.toLowerCase().includes(searchTermLower) ||
          product.price.toString().includes(searchTerm) ||
          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(product.price)
            .toLowerCase()
            .includes(searchTermLower)
        );
        
        setSearchResults(filteredProducts);
        
        if (filteredProducts.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Không tìm thấy kết quả',
            text: 'Vui lòng thử với từ khóa khác',
            timer: 1500,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error('Error searching products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tìm kiếm',
        text: 'Không thể tìm kiếm sản phẩm'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <span className="close-btn">
              <i className="fas fa-window-close"></i>
            </span>
            <div className="search-bar">
              <div className="search-bar-tablecell">
                <h3>Tìm kiếm:</h3>
                <form onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    placeholder="Nhập từ khóa..." 
                    aria-label="Search input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Đang tìm...' : 'Tìm kiếm'} <i className="fas fa-search"></i>
                  </button>
                </form>

                {/* Hiển thị kết quả tìm kiếm */}
                {searchResults.length > 0 && (
                  <div className="search-results mt-4">
                    <h4>Kết quả tìm kiếm:</h4>
                    <div className="row">
                      {searchResults.map(product => (
                        <div key={product.id} className="col-md-4 mb-4">
                          <div className="card h-100">
                            <img 
                              src={`http://localhost:5000/uploads/products/${product.image_name}`}
                              className="card-img-top"
                              alt={product.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/img/products/default-product.jpg';
                              }}
                            />
                            <div className="card-body">
                              <h5 className="card-title">
                                <Link to={`/product/${product.id}`}>{product.name}</Link>
                              </h5>
                              {/* <p className="card-text">{product.description}</p> */}
                              <p className="card-text">
                                <strong>Giá: </strong>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchArea;