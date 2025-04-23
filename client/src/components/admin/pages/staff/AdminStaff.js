import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminStaff.css';

function AdminStaff() {
    const [staffs, setStaffs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'staff',
    });
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [staffsPerPage] = useState(10);

    const permissionMatrix = {
        dashboard: {
            name: "Bảng điều khiển",
            admin: "Đầy đủ quyền",
            kitchen: "Không có quyền",
            staff: "Không có quyền"
        },
        tables: {
            name: "Bàn ăn",
            admin: "Đầy đủ quyền",
            kitchen: "Chỉ xem",
            staff: "Chỉ xem"
        },
        orders: {
            name: "Đơn hàng", 
            admin: "Đầy đủ quyền",
            kitchen: "Chỉ xem",
            staff: "Đầy đủ quyền"
        },
        products: {
            name: "Sản phẩm",
            admin: "Đầy đủ quyền", 
            kitchen: "Chỉ xem",
            staff: "Chỉ xem"
        },
        categories: {
            name: "Danh mục",
            admin: "Đầy đủ quyền",
            kitchen: "Chỉ xem", 
            staff: "Chỉ xem"
        },
        staff: {
            name: "Nhân viên",
            admin: "Đầy đủ quyền",
            kitchen: "Không có quyền",
            staff: "Không có quyền" 
        }
    };

    useEffect(() => {
        fetchStaffs();
    }, []);

    const fetchStaffs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setStaffs(response.data.data);
                setFilteredStaffs(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching staffs:', error);
            Swal.fire('Lỗi', 'Không thể tải danh sách nhân viên', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            if (formData.id) {
                // Cập nhật nhân viên
                const response = await axios.put(
                    `http://localhost:5000/api/users/${formData.username}`,
                    {
                        role: formData.role,
                        password: formData.password || undefined
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Cập nhật thất bại');
                }
                
                Swal.fire('Thành công', 'Cập nhật nhân viên thành công', 'success');
            } else {
                // Thêm nhân viên mới
                const response = await axios.post(
                    'http://localhost:5000/api/users',
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Thêm mới thất bại');
                }
                
                Swal.fire('Thành công', 'Thêm nhân viên thành công', 'success');
            }
            
            handleCloseForm();
            await fetchStaffs();
            
        } catch (error) {
            console.error('Error submitting staff:', error);
            Swal.fire('Lỗi', error.message || 'Không thể lưu thông tin nhân viên', 'error');
        }
    };

    const handleEdit = (staff) => {
        setFormData({
            id: staff.username, // Sử dụng username như id
            username: staff.username,
            password: '', // Để trống vì không hiển thị mật khẩu cũ
            role: staff.role
        });
        setShowForm(true);
    };

    const handleDelete = async (username) => {
        try {
            const result = await Swal.fire({
                title: 'Xác nhận xóa?',
                text: "Bạn không thể hoàn tác sau khi xóa!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/users/${username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Đã xóa!', 'Nhân viên đã được xóa thành công.', 'success');
                fetchStaffs();
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            Swal.fire('Lỗi!', 'Không thể xóa nhân viên.', 'error');
        }
    };

    const handleCloseForm = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowForm(false);
            setIsClosing(false);
            setFormData({ username: '', password: '', role: 'staff' });
        }, 500);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        if (!value.trim()) {
            setFilteredStaffs(staffs);
            return;
        }

        const searchValue = value.toLowerCase();
        const filtered = staffs.filter(staff => 
            staff.username.toLowerCase().includes(searchValue) ||
            (staff.role === 'admin' ? 'quản trị viên' : 
             staff.role === 'staff' ? 'nhân viên' : 'nhà bếp').includes(searchValue)
        );
        setFilteredStaffs(filtered);
    };

    // Tính toán phân trang
    const indexOfLastStaff = currentPage * staffsPerPage;
    const indexOfFirstStaff = indexOfLastStaff - staffsPerPage;
    const currentStaffs = filteredStaffs.slice(indexOfFirstStaff, indexOfLastStaff);
    const totalPages = Math.ceil(filteredStaffs.length / staffsPerPage);

    const paginate = (pageNumber) => {
        const tbody = document.querySelector('.staff-table tbody');
        tbody.style.opacity = '0';
        
        setTimeout(() => {
            setCurrentPage(pageNumber);
            tbody.style.opacity = '1';
        }, 300);
    };

    return (
        <div className="admin-staff">
            <div className="staff-header">
                <h2>Quản lý nhân viên</h2>
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
                    <button 
                        className="add-staff-btn"
                        onClick={() => showForm ? handleCloseForm() : setShowForm(true)}
                    >
                        <i className="fas fa-plus"></i> {showForm ? 'Ẩn form' : 'Thêm nhân viên'}
                    </button>
                </div>
            </div>

            {/* Form thêm/sửa nhân viên */}
            {showForm && (
                <div className={`staff-form-container ${isClosing ? 'form-exit' : 'form-enter'}`}>
                    <div className="staff-form">
                        <h3>{formData.id ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Tên đăng nhập</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                    disabled={formData.id}
                                />
                            </div>

                            <div className="form-group">
                                <label>Mật khẩu {formData.id && '(để trống nếu không đổi)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required={!formData.id}
                                />
                            </div>

                            <div className="form-group">
                                <label>Vai trò</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    required
                                >
                                    <option value="staff">Nhân viên</option>
                                    <option value="kitchen">Nhà bếp</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="submit-btn">
                                    <i className="fas fa-save"></i> Lưu
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCloseForm}
                                    className="cancel-btn"
                                >
                                    <i className="fas fa-times"></i> Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="permission-table">
                <h3>Bảng phân quyền</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Chức năng</th>
                            <th>Quản trị viên</th>
                            <th>Nhà bếp</th>
                            <th>Nhân viên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(permissionMatrix).map((permission, index) => (
                            <tr key={index}>
                                <td>{permission.name}</td>
                                <td className="permission admin">{permission.admin}</td>
                                <td className="permission kitchen">{permission.kitchen}</td>
                                <td className="permission staff">{permission.staff}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bảng danh sách nhân viên */}
            <div className="staff-table">
                <table>
                    <thead>
                        <tr>
                            <th>Tên đăng nhập</th>
                            <th>Vai trò</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStaffs.map(staff => (
                            <tr key={staff.username}>
                                <td>{staff.username}</td>
                                <td>
                                    <span className={`role-tag ${staff.role}`}>
                                        {staff.role === 'admin' ? 'Quản trị viên' : 
                                         staff.role === 'staff' ? 'Nhân viên' : 'Nhà bếp'}
                                    </span>
                                </td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(staff)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(staff.username)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
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
        </div>
    );
}

export default AdminStaff;