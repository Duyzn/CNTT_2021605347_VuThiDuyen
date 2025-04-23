import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductFilters({ currentFilter, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Sử dụng API public
        const response = await axios.get('http://localhost:5000/api/categories/public');
        
        if (response.data.success) {
          const allCategories = [
            { id: '*', name: 'Tất cả' },
            ...response.data.data
          ];
          setCategories(allCategories);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Không thể tải danh mục sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="product-filters">
          <ul>
            {categories.map(category => (
              <li
                key={category.id}
                className={currentFilter === category.id.toString() ? 'active' : ''}
                onClick={() => onFilterChange(category.id.toString())}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;