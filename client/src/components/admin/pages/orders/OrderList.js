import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OrderList.css';
import OrderForm from './OrderForm';
import { hasPermission } from '../../../../utils/roleConfig';

function OrderList() {
  const userRole = localStorage.getItem('role');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(15);

  const canCreateOrder = hasPermission(userRole, 'orders', 'create');
  const canUpdateStatus = hasPermission(userRole, 'orders', 'updateStatus');
  const canDeleteOrder = hasPermission(userRole, 'orders', 'delete');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách đơn hàng', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => {
    if (showForm) {
      setIsClosing(true);
      setTimeout(() => {
        setShowForm(false);
        setIsClosing(false);
      }, 500);
    } else {
      setShowForm(true);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleSetCompleted = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/complete`);
      fetchOrders();
      Swal.fire('Thành công', 'Đã cập nhật trạng thái đơn hàng', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể cập nhật trạng thái đơn hàng', 'error');
    }
  };

  const handleSetPending = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/pending`);
      fetchOrders();
      Swal.fire('Thành công', 'Đã cập nhật trạng thái đơn hàng', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể cập nhật trạng thái đơn hàng', 'error');
    }
  };

  const handleUpdateOrder = async (updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${selectedOrder.id}`, updatedData);
      setShowEditModal(false);
      fetchOrders();
      Swal.fire('Thành công', 'Đã cập nhật đơn hàng', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể cập nhật đơn hàng', 'error');
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const searchValue = value.toLowerCase();
    const filtered = orders.filter(order => 
      order.order_code.toLowerCase().includes(searchValue) ||
      order.table_number.toString().includes(searchValue) ||
      order.total_amount.toString().includes(searchValue) ||
      order.status.toLowerCase().includes(searchValue) ||
      (order.product_details && order.product_details.some(detail => 
        detail.name.toLowerCase().includes(searchValue)
      )) ||
      new Date(order.created_at).toLocaleString('vi-VN').toLowerCase().includes(searchValue)
    );
    setFilteredOrders(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (key === 'order_code') {
        return direction === 'asc' 
          ? a.order_code.localeCompare(b.order_code)
          : b.order_code.localeCompare(a.order_code);
      }
      if (key === 'table_number') {
        return direction === 'asc'
          ? a.table_number.localeCompare(b.table_number)
          : b.table_number.localeCompare(a.table_number);
      }
      if (key === 'total_amount') {
        return direction === 'asc'
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount;
      }
      if (key === 'status') {
        return direction === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (key === 'created_at') {
        return direction === 'asc'
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

    setFilteredOrders(sortedOrders);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toLocaleString('vi-VN');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-area');
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    setShowEditModal(false);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    const tbody = document.querySelector('.orders-table tbody');
    tbody.style.opacity = '0';
    
    setTimeout(() => {
      setCurrentPage(pageNumber);
      tbody.style.opacity = '1';
    }, 300);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#d33'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
        fetchOrders();
        Swal.fire('Thành công', 'Đã xóa đơn hàng', 'success');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      Swal.fire('Lỗi', 'Không thể xóa đơn hàng', 'error');
    }
  };

  if (loading) return <div className="text-center p-5">Đang tải...</div>;

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>Quản lý đơn hàng</h2>
        <div className="header-actions">
          <div className={`search-container ${showSearch ? 'show' : ''}`}>
            <button 
              className="search-btn"
              onClick={() => setShowSearch(!showSearch)}
            >
              <i className="fas fa-search"></i>
            </button>
            {showSearch && (
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            )}
          </div>
          {canCreateOrder && (
            <button className="add-order-btn" onClick={handleAddOrder}>
              {showForm ? (
                <>
                  <i className="fas fa-minus"></i> Ẩn form
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Thêm đơn hàng
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className={`order-form-container ${isClosing ? 'form-exit' : 'form-enter'}`}>
          <OrderForm onClose={handleAddOrder} />
        </div>
      )}

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('order_code')} className="sortable">
                Mã đơn
                {sortConfig.key === 'order_code' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('table_number')} className="sortable">
                Bàn
                {sortConfig.key === 'table_number' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th>Sản phẩm</th>
              <th onClick={() => handleSort('total_amount')} className="sortable">
                Tổng tiền
                {sortConfig.key === 'total_amount' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Trạng thái
                {sortConfig.key === 'status' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('created_at')} className="sortable">
                Thời gian
                {sortConfig.key === 'created_at' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">Không có đơn hàng nào</td>
              </tr>
            ) : (
              currentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_code}</td>
                  <td>Bàn {order.table_number}</td>
                  <td>
                    {order.product_details && Array.isArray(order.product_details) ? (
                      order.product_details.map((detail, index) => (
                        <div key={index} className="product-detail-item">
                          {`${detail.name} x ${detail.quantity}`}
                        </div>
                      ))
                    ) : (
                      <div>Không có thông tin sản phẩm</div>
                    )}
                  </td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}</td>
                  <td>
                    <span className={`status-tag ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{formatDateTime(order.created_at)}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => handleViewOrder(order)}>
                      <i className="fas fa-print"></i>
                    </button>
                    {canUpdateStatus && (
                      <>
                        <button className="update-btn" onClick={() => handleSetCompleted(order.id)}>
                          <i className="fas fa-check text-success"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleSetPending(order.id)}>
                          <i className="fas fa-times text-danger"></i>
                        </button>
                      </>
                    )}
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteOrder(order.id)}
                      title="Xóa đơn hàng"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}

        <button 
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {showEditModal && selectedOrder && (
        <div className="modal" onClick={(e) => {
          if (e.target.classList.contains('modal')) {
            setShowEditModal(false);
          }
        }}>
          <div className={`modal-content invoice-modal ${showEditModal ? 'modal-enter' : 'modal-exit'}`}>
            <div id="print-area">
              <div className="invoice-header">
                <h2>HÓA ĐƠN</h2>
                <div className="invoice-info">
                  <p>Mã đơn: {selectedOrder.order_code}</p>
                  <p>Bàn: {selectedOrder.table_number}</p>
                  <p>Thời gian: {formatDateTime(selectedOrder.created_at)}</p>
                </div>
              </div>

              <div className="invoice-items">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-center" style={{width: "80px"}}>SL</th>
                      <th className="text-right" style={{width: "120px"}}>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(selectedOrder.product_details) ? 
                      selectedOrder.product_details.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td className="text-center">{product.quantity}</td>
                          <td className="text-right">
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND' 
                            }).format(product.totalPrice)}
                          </td>
                        </tr>
                      )) : null}
                  </tbody>
                </table>
              </div>

              <div className="invoice-summary">
                <div className="total-amount">
                  <h3>Tổng cộng:</h3>
                  <h3>
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(selectedOrder.total_amount)}
                  </h3>
                </div>
              </div>

              <div className="invoice-footer">
                <p>Cảm ơn quý khách!</p>
                <p>Hẹn gặp lại!</p>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handlePrint} className="print-btn">
                <i className="fas fa-print"></i> In hóa đơn
              </button>
              <button onClick={() => setShowEditModal(false)} className="close-btn">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;