import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { hasPermission } from '../../../utils/roleConfig';

function Sidebar({ isAndroid }) {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('role');

    const menuItems = [
        { path: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
        { path: 'tables', icon: 'fas fa-chair', label: 'Bàn ăn' },
        { path: 'orders', icon: 'fas fa-shopping-cart', label: 'Đơn hàng' },
        { path: 'products', icon: 'fas fa-utensils', label: 'Sản phẩm' },
        { path: 'categories', icon: 'fas fa-tags', label: 'Danh mục' },
        { path: 'staff', icon: 'fas fa-user-tie', label: 'Nhân viên' }
    ];

    const handleLogout = () => {
        console.log('Is Android:', isAndroid);
        
        Swal.fire({
            title: 'Đăng xuất?',
            text: "Bạn có chắc muốn đăng xuất?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đăng xuất',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                if (isAndroid) {
                    navigate('/admin/login');
                } else {
                    window.location.replace('/');
                }
            }
        });
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>CƠM NHÀ ADMIN</h3>
                <p>Xin chào, {username}!</p>
            </div>
            
            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    hasPermission(userRole, item.path) && (
                        <NavLink 
                            key={item.path}
                            to={`/admin/${item.path}`} 
                            className={({isActive}) => isActive ? 'active' : ''}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    )
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;