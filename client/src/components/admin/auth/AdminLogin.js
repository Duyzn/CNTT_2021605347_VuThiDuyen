import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { rolePermissions } from '../../../utils/roleConfig';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        if (role && username) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu'
            });
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
    
            console.log('Login response:', response.data);
    
            if (response.data.success) {
                if (!response.data.token) {
                    throw new Error('Token không được trả về từ server');
                }
    
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('username', response.data.username);
                
                console.log('Stored token:', localStorage.getItem('token'));
                console.log('Stored role:', localStorage.getItem('role'));
                
                const userRole = response.data.role;
                const availableRoutes = Object.keys(rolePermissions[userRole] || {});
                const firstAllowedRoute = availableRoutes[0];

                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đăng nhập thành công!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    if (firstAllowedRoute) {
                        navigate(`/admin/${firstAllowedRoute}`);
                    } else {
                        console.error('No available routes for role:', userRole);
                        navigate('/admin/login');
                    }
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi đăng nhập',
                text: error.response?.data?.message || error.message || 'Tài khoản hoặc mật khẩu không chính xác'
            });
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-session">
                <div className="admin-left">
                    <svg enableBackground="new 0 0 300 302.5" version="1.1" viewBox="0 0 300 302.5">
                        <path fill="#fff" d="m126 302.2c-2.3 0.7-5.7 0.2-7.7-1.2l-105-71.6c-2-1.3-3.7-4.4-3.9-6.7l-9.4-126.7c-0.2-2.4 1.1-5.6 2.8-7.2l93.2-86.4c1.7-1.6 5.1-2.6 7.4-2.3l125.6 18.9c2.3 0.4 5.2 2.3 6.4 4.4l63.5 110.1c1.2 2 1.4 5.5 0.6 7.7l-46.4 118.3c-0.9 2.2-3.4 4.6-5.7 5.3l-121.4 37.4zm63.4-102.7c2.3-0.7 4.8-3.1 5.7-5.3l19.9-50.8c0.9-2.2 0.6-5.7-0.6-7.7l-27.3-47.3c-1.2-2-4.1-4-6.4-4.4l-53.9-8c-2.3-0.4-5.7 0.7-7.4 2.3l-40 37.1c-1.7 1.6-3 4.9-2.8 7.2l4.1 54.4c0.2 2.4 1.9 5.4 3.9 6.7l45.1 30.8c2 1.3 5.4 1.9 7.7 1.2l52-16.2z"/>
                    </svg>
                </div>
                <form className="admin-log-in" onSubmit={handleSubmit}>
                    <h4>Welcome to <span>Cơm Nhà</span></h4>
                    <p>Đăng nhập để truy cập vào hệ thống quản trị:</p>
                    <div className="admin-floating-label">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="admin-icon">
                            <i className="fas fa-user"></i>
                        </div>
                    </div>
                    <div className="admin-floating-label">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="admin-icon">
                            <i className="fas fa-lock"></i>
                        </div>
                    </div>
                    <button type="submit">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;