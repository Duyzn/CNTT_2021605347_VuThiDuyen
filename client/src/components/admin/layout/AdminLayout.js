import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { hasPermission, rolePermissions } from '../../../utils/roleConfig';
import { Capacitor } from '@capacitor/core';
import './AdminLayout.css';

function AdminLayout() {
    const location = useLocation();
    const currentPath = location.pathname.split('/')[2];
    const role = localStorage.getItem('role');

    // Kiểm tra có phải Android không
    const isAndroid = Capacitor.getPlatform() === 'android';
    console.log('Current platform:', Capacitor.getPlatform()); // Debug log

    // Nếu đang ở route /admin, redirect về route đầu tiên có quyền
    if (!currentPath) {
        const availableRoutes = Object.keys(rolePermissions[role] || {});
        const firstAllowedRoute = availableRoutes[0];
        return firstAllowedRoute ? 
            <Navigate to={`/admin/${firstAllowedRoute}`} /> : 
            <Navigate to="/admin/login" />;
    }

    // Kiểm tra quyền truy cập
    if (currentPath && !hasPermission(role, currentPath)) {
        const availableRoutes = Object.keys(rolePermissions[role] || {});
        const firstAllowedRoute = availableRoutes[0];
        return firstAllowedRoute ? 
            <Navigate to={`/admin/${firstAllowedRoute}`} /> : 
            <Navigate to="/admin/login" />;
    }

    return (
        <div className="admin-layout">
            <Sidebar isAndroid={isAndroid} />
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;