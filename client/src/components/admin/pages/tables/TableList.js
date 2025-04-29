import React, { useState, useEffect } from 'react';
import './TableList.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';
import qrTemplate from '../../../../assets/images/qr-template.png';
import { hasPermission } from '../../../../utils/roleConfig';

const QRModalComponent = ({ tableId, onClose, tables }) => {
    const [mergedImage, setMergedImage] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    //const qrValue = `https://foodee.namtech.me/table/${tableId}`;
    const qrValue = `http://192.168.1.106:3000/tables/${tableId}`;
    useEffect(() => {
        const generateMergedImage = async () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1414;
                canvas.height = 2000;
                const ctx = canvas.getContext('2d');

                const template = new Image();
                template.src = qrTemplate;
                
                await new Promise((resolve) => {
                    template.onload = () => {
                        ctx.drawImage(template, 0, 0, 1414, 2000);
                        
                        const qrCanvas = document.createElement('canvas');
                        QRCode.toCanvas(qrCanvas, qrValue, {
                            width: 650,
                            margin: 0
                        }, () => {
                            ctx.drawImage(qrCanvas, 380, 790);

                            const table = tables.find(t => t.id === tableId);
                            if (table) {
                                ctx.font = 'bold 80px Arial';
                                ctx.fillStyle = '#000000';
                                ctx.textAlign = 'center';
                                ctx.fillText(`Bàn ${table.table_number}`, 705, 1610);
                            }

                            setMergedImage(canvas.toDataURL());
                            resolve();
                        });
                    };
                });
            } catch (err) {
                console.error('Error generating merged image:', err);
            }
        };
        
        generateMergedImage();
    }, [qrValue, tableId, tables]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <div className={`qr-modal-overlay ${isClosing ? 'closing' : ''}`}>
            <div className={`qr-modal ${isClosing ? 'closing' : ''}`}>
                <div className="qr-modal-header">
                    <h3>Mã QR cho bàn</h3>
                    <button onClick={handleClose}>&times;</button>
                </div>
                <div className="qr-modal-body">
                    {mergedImage && (
                        <img 
                            src={mergedImage} 
                            alt="QR Code"
                            style={{ width: '100%', maxWidth: '400px' }}
                        />
                    )}
                </div>
                <div className="qr-modal-footer">
                    <button 
                        className="download-btn" 
                        onClick={() => {
                            if (mergedImage) {
                                const link = document.createElement('a');
                                link.download = `table-qr-${tableId}.png`;
                                link.href = mergedImage;
                                link.click();
                            }
                        }}
                    >
                        Tải QR Code
                    </button>
                    <button className="close-btn" onClick={handleClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

const userRole = localStorage.getItem('role');

function TableList() {
  const emptySlots = Array(16).fill(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [newTable, setNewTable] = useState({
    table_number: '',
    status: 'available',
    position: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTables, setFilteredTables] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tables', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTables(response.data.data);
        setFilteredTables(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách bàn', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Tìm vị trí trống đầu tiên
      const positions = tables.map(t => t.position);
      const firstEmptyPosition = emptySlots.findIndex((_, index) => 
        !positions.includes(index)
      );

      const tableData = {
        ...newTable,
        position: firstEmptyPosition >= 0 ? firstEmptyPosition : tables.length
      };

      const response = await axios.post(
        'http://localhost:5000/api/tables',
        tableData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        Swal.fire('Thành công', 'Thêm bàn mới thành công', 'success');
        fetchTables();
        handleAddTable();
      }
    } catch (error) {
      console.error('Error creating table:', error);
      Swal.fire('Lỗi', 'Không thể thêm bàn mới', 'error');
    }
  };

  const handleDragStart = (e, table) => {
    e.dataTransfer.setData('tableId', table.id.toString());
  };

  const handleDrop = async (e, newPosition) => {
    e.preventDefault();
    const tableId = parseInt(e.dataTransfer.getData('tableId'));
    const draggedTable = tables.find(t => t.id === tableId);
    
    if (!draggedTable) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `http://localhost:5000/api/tables/${tableId}`,
            {
                table_number: draggedTable.table_number,
                status: draggedTable.status,
                position: newPosition
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.success) {
            fetchTables();
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error updating table position:', error);
        Swal.fire('Lỗi', 'Không thể cập nhật vị trí bàn', 'error');
    }
  };

  const renderSlot = (index) => {
    const table = filteredTables.find(t => t.position === index);
    
    if (table) {
        return (
            <div key={`table-${table.id}`}>
                {renderTableItem(table)}
            </div>
        );
    }

    return (
        <div 
            key={`empty-${index}`}
            className="empty-slot"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
        >
            <div className="empty-slot-text">Ô trống {index + 1}</div>
        </div>
    );
  };

  const renderTableItem = (table) => {
    return (
        <div 
            className={`table-item ${table.status} ${table.table_number === 'CASH' ? 'cashier' : ''}`}
            draggable={hasPermission(userRole, 'tables', 'edit')}
            onDragStart={(e) => handleDragStart(e, table)}
        >
            <div className="table-number">{table.table_number}</div>
            <div className="table-status">
                {table.status === 'available' ? 'Hoạt động' : 'Bảo trì'}
            </div>
            <div className="table-actions">
                {hasPermission(userRole, 'tables', 'edit') && (
                    <button className="edit-btn" onClick={() => handleEdit(table)}>
                        <i className="fas fa-edit"></i>
                    </button>
                )}
                <button className="qr-btn" onClick={() => handleShowQR(table.id)}>
                    <i className="fas fa-qrcode"></i>
                </button>
            </div>
        </div>
    );
  };

  const handleAddTable = () => {
    if (showForm) {
      setIsClosing(true);
      setTimeout(() => {
        setShowForm(false);
        setIsClosing(false);
        setNewTable({
          table_number: '',
          status: 'available',
          position: null
        });
      }, 300);
    } else {
      setShowForm(true);
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/tables/${editingTable.id}`,
        {
          table_number: editingTable.table_number,
          status: editingTable.status,
          position: editingTable.position
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Thành công', 'Cập nhật bàn thành công', 'success');
        fetchTables();
        handleCloseForm();
      }
    } catch (error) {
      console.error('Error updating table:', error);
      Swal.fire('Lỗi', 'Không thể cập nhật bàn', 'error');
    }
  };

  const handleCloseForm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setIsClosing(false);
      setIsEditing(false);
      setEditingTable(null);
    }, 300);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa?',
        text: "Bạn không thể hoàn tác sau khi xóa!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tables/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire('Đã xóa!', 'Bàn đã được xóa thành công.', 'success');
        fetchTables();
        handleCloseForm();
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      Swal.fire('Lỗi', 'Không thể xóa bàn', 'error');
    }
  };

  const handleShowQR = (tableId) => {
    setSelectedTableId(tableId);
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
    setSelectedTableId(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredTables(tables);
      return;
    }

    const searchValue = value.toLowerCase();
    const filtered = tables.filter(table => 
      table.table_number.toLowerCase().includes(searchValue) ||
      table.status.toLowerCase().includes(searchValue) ||
      (table.status === 'available' ? 'hoạt động' : 'bảo trì').includes(searchValue)
    );
    setFilteredTables(filtered);
  };

  return (
    <div className="table-management">
      <div className="table-header">
        <h2>Quản lý bàn ăn</h2>
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
          {hasPermission(userRole, 'tables', 'create') && (
            <button className="add-table-btn" onClick={() => {
              setIsEditing(false);
              setEditingTable(null);
              setShowForm(!showForm);
            }}>
              {showForm ? (
                <>
                  <i className="fas fa-minus"></i> Ẩn form
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Thêm bàn ăn
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className={`table-form-container ${isClosing ? 'form-exit' : 'form-enter'}`}>
          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Số bàn</label>
                <input
                  type="text"
                  value={isEditing ? editingTable.table_number : newTable.table_number}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditingTable({
                        ...editingTable,
                        table_number: e.target.value
                      });
                    } else {
                      setNewTable({
                        ...newTable,
                        table_number: e.target.value
                      });
                    }
                  }}
                  placeholder="Nhập số bàn"
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={isEditing ? editingTable.status : newTable.status}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditingTable({
                        ...editingTable,
                        status: e.target.value
                      });
                    } else {
                      setNewTable({
                        ...newTable,
                        status: e.target.value
                      });
                    }
                  }}
                >
                  <option value="available">Hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  className="delete-btn"
                  onClick={() => handleDelete(editingTable.id)}
                >
                  Xóa bàn
                </button>
              )}
              <button type="button" className="cancel-btn" onClick={handleCloseForm}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-layout">
        <div className="table-grid">
          {emptySlots.map((_, index) => (
            <React.Fragment key={`slot-${index}`}>
                {renderSlot(index)}
            </React.Fragment>
          ))}
        </div>
      </div>
      {showQRModal && selectedTableId && (
        <QRModalComponent 
          tableId={selectedTableId}
          onClose={handleCloseQR}
          tables={tables}
        />
      )}
    </div>
  );
}

export default TableList;