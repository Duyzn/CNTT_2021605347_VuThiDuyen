/* eslint-disable no-undef */
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

 
  //kiểm tra trạng thái bàn
  // Giả sử bạn đang gửi yêu cầu để kiểm tra đơn hàng với ID 3
   
  const checkPendingOrder = async (tableId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/has-pending/${tableId}`, config);
      console.log(response.data);
    } catch (error) {
      // Xử lý lỗi khi yêu cầu không thành công
      if (error.response) {
        // Nếu có phản hồi từ server
        console.error('Lỗi từ server:', error.response.data);
        if (error.response.status === 404) {
          // Hiển thị thông báo lỗi khi không tìm thấy đơn hàng
          alert('Đơn hàng không tồn tại hoặc không có đơn hàng đang chờ.');
        }
      } else if (error.request) {
        // Nếu không nhận được phản hồi từ server
        console.error('Lỗi kết nối đến server:', error.request);
      } else {
        console.error('Lỗi khi thiết lập yêu cầu:', error.message);
      }
    }
  };
  /* 
  const checkPendingOrder = async (tableId) => {
    try {
      //const res = await axios.get(`http://localhost:5000/api/orders/has-pending/${tableId}`, config);
      const url = `http://localhost:5000/api/orders/has-pending/${tableId}`;
      console.log('Gọi tới:', url); // 👉 CHÈN LOG này để xem Axios gọi gì

      const res = await axios.get(url, config);
      
      if (!res.data.success) return false;
      return !res.data.hasPendingOrder;
    } catch (error) {
      console.error('Lỗi kiểm tra đơn hàng:', error);
      return false;
    }
  };
*/
  /*
  const checkTableStatus = async (tableId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tables/info/${tableId}`, config);
      console.log('Kết quả kiểm tra bàn:', res.data);
  
      if (!res.data.success || !res.data.data) {
        console.warn('API không trả đúng data hoặc success');
        return false;
      }
  
      const status = res.data.data.status;
      console.log('Trạng thái bàn:', status);
  
      return status === 'available' || status === 'complete';
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái bàn:', error);
      return false;
    }
  };
  */
    const handlePlaceOrder = async () => {
    try {
      // Gọi API kiểm tra trạng thái đơn hàng
      const res = await axios.get(`http://localhost:5000/api/orders/has-pending/${tableId}`);

      if (res.data.hasPending) {
        alert('Bàn này đã có đơn đang chờ xử lý. Vui lòng đợi món được phục vụ trước khi gọi thêm.');
        return;
      }

      // Nếu không có đơn pending thì tiếp tục đặt đơn mới
      await axios.post('http://localhost:5000/api/orders', {
        table_id: tableId,
        items: cartItems, // hoặc dữ liệu món ăn đã chọn
        note: note || ""
      });

      alert('Đặt đơn thành công!');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Bàn không tồn tại hoặc đang bảo trì. Không thể đặt đơn.');
      } else {
        alert('Lỗi khi đặt đơn. Vui lòng thử lại.');
        console.error(error);
      }
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber || orderItems.length === 0) {
      Swal.fire('Lỗi', 'Vui lòng chọn số bàn và ít nhất một món', 'error');
      return;
    }

    
    // Kiểm tra trạng thái bàn
    const isTableFree = await checkPendingOrder(tableNumber);
    if (!isTableFree) {
      Swal.fire('Bàn này đang có đơn chưa xử lý', 'Vui lòng hoàn tất đơn cũ trước khi tạo đơn mới.', 'warning');
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