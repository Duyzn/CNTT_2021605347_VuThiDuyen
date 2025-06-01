import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import OrderProductCard from './OrderProductCard';
import ToppingModal from './ToppingModal';
import './OrderForm.css';

function OrderForm({ onClose }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [toppings, setToppings] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [tables, setTables] = useState([]);

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');

  // Config cho axios với headers
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTables();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/public');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách sản phẩm', 'error');
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tables', config);
      if (response.data.success) {
        const availableTables = response.data.data.filter(table => 
          table.status === 'available' && table.table_number !== 'CASH'
        );
        setTables(availableTables);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách bàn', 'error');
    }
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/toppings/${product.id}`,
        config
      );
      
      if (response.data.data.hasToppings) {
        setToppings(response.data.data.toppings);
        setShowToppingModal(true);
      } else {
        // Kiểm tra xem sản phẩm đã tồn tại trong orderItems chưa
        const existingItemIndex = orderItems.findIndex(item => 
          item.product.id === product.id && item.toppings.length === 0
        );

        if (existingItemIndex !== -1) {
          // Nếu đã tồn tại, tăng số lượng
          const updatedItems = [...orderItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
            total: (updatedItems[existingItemIndex].quantity + 1) * product.price
          };
          setOrderItems(updatedItems);
        } else {
          // Nếu chưa tồn tại, thêm mới
          const newItem = {
            product: product,
            quantity: 1,
            toppings: [],
            total: product.price
          };
          setOrderItems([...orderItems, newItem]);
        }
      }
    } catch (error) {
      console.error('Error fetching toppings:', error);
      Swal.fire('Lỗi', 'Không thể tải thông tin topping', 'error');
    }
  };

  const handleToppingConfirm = (quantity, selectedToppings) => {
    // Đảm bảo các giá trị là số
    const basePrice = Number(selectedProduct.price) || 0;
    const toppingTotal = selectedToppings.reduce((sum, t) => sum + (Number(t.price_adjustment) || 0), 0);
    const totalPrice = (basePrice + toppingTotal) * quantity;

    // Kiểm tra sản phẩm với cùng topping đã tồn tại chưa
    const existingItemIndex = orderItems.findIndex(item => {
      if (item.product.id !== selectedProduct.id) return false;
      if (item.toppings.length !== selectedToppings.length) return false;
      return item.toppings.every(t1 => 
        selectedToppings.some(t2 => t2.id === t1.id)
      );
    });

    if (existingItemIndex !== -1) {
      // Nếu đã tồn tại, cập nhật số lượng và tính lại tổng tiền
      const updatedItems = [...orderItems];
      const existingItem = updatedItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        total: (basePrice + toppingTotal) * newQuantity
      };
      setOrderItems(updatedItems);
    } else {
      // Nếu chưa tồn tại, thêm mới
      const newItem = {
        product: selectedProduct,
        quantity: quantity,
        toppings: selectedToppings,
        total: totalPrice
      };
      setOrderItems([...orderItems, newItem]);
    }

    setShowToppingModal(false);
  };

  const calculateItemTotal = (product, quantity, toppings) => {
    const toppingTotal = toppings.reduce((sum, t) => sum + t.price_adjustment, 0);
    return (product.price + toppingTotal) * quantity;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber || orderItems.length === 0) {
      Swal.fire('Lỗi', 'Vui lòng chọn số bàn và ít nhất một món', 'error');
      return;
    }

    try {
      // Tạo cấu trúc dữ liệu giống như trong CartTotal
      const orderData = {
        tableId: tableNumber,
        products: orderItems.map(item => {
          const toppingTotal = item.toppings.reduce((sum, topping) => 
            sum + (parseFloat(topping.price_adjustment) || 0), 0);

          return {
            product_id: item.product.id,
            quantity: item.quantity,
            base_price: parseFloat(item.product.price),
            topping_price: toppingTotal,
            order_toppings: item.toppings || []
          };
        })
      };

      // Gửi một request duy nhất với tất cả sản phẩm
      const response = await axios.post('http://localhost:5000/api/orders/add', orderData);
  
      if (response.data.success) {
        await Swal.fire({
          title: 'Thành công',
          text: 'Đã thêm đơn hàng mới',
          icon: 'success',
          timer: 2000
        });
        onClose();
      }
    } catch (error) {
      console.error('Error adding order:', error);
      Swal.fire('Lỗi', 'Không thể thêm đơn hàng', 'error');
    }
  };

  const calculateTotal = () => {
    if (!orderItems || orderItems.length === 0) return 0;
    
    return orderItems.reduce((sum, item) => {
        const basePrice = Number(item.product.price) || 0;
        const toppingTotal = item.toppings.reduce((tSum, t) => tSum + (Number(t.price_adjustment) || 0), 0);
        const itemTotal = (basePrice + toppingTotal) * item.quantity;
        return sum + itemTotal;
    }, 0);
};

  return (
    <div className="order-form">
      <h3>Thêm đơn hàng mới</h3>
      
      <div className="form-group-order">
        <label>Chọn bàn</label>
        <select
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          required
          className="table-select"
        >
          <option value="">-- Chọn bàn --</option>
          {tables.map(table => (
            <option key={table.id} value={table.id}>
              Bàn {table.table_number}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <OrderProductCard
            key={product.id}
            product={product}
            onSelect={handleProductSelect}
          />
        ))}
      </div>

      {orderItems.length > 0 && (
        <div className="selected-items">
          <h4>Món đã chọn:</h4>
          {orderItems.map((item, index) => (
            <div key={index} className="selected-item">
              <span>{item.product.name} x {item.quantity}</span>
              {item.toppings.length > 0 && (
                <div className="item-toppings">
                  {item.toppings.map(t => t.name).join(', ')}
                </div>
              )}
              <span>{new Intl.NumberFormat('vi-VN').format(item.total)}đ</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Tổng cộng: </strong>
            <span>
              {new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND',
                maximumFractionDigits: 0 
              }).format(calculateTotal())}
            </span>
          </div>
        </div>
      )}

      <div className="form-buttons">
        <button type="button" className="submit-btn" onClick={handleSubmit}>
          Xác nhận đơn hàng
        </button>
        <button type="button" className="cancel-btn" onClick={onClose}>
          Hủy
        </button>
      </div>

      {showToppingModal && (
        <ToppingModal
          product={selectedProduct}
          toppings={toppings}
          onConfirm={handleToppingConfirm}
          onClose={() => setShowToppingModal(false)}
        />
      )}
    </div>
  );
}

export default OrderForm;