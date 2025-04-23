import { Navigate } from 'react-router-dom';
import { hasPermission, rolePermissions } from '../../utils/roleConfig';

const PermissionRoute = ({ children, requiredPermission }) => {
    const role = localStorage.getItem('role');
    const isAuthenticated = !!localStorage.getItem('username');

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    if (!hasPermission(role, requiredPermission)) {
        // Lấy route đầu tiên mà user có quyền truy cập
        const availableRoutes = Object.keys(rolePermissions[role] || {});
        const firstAllowedRoute = availableRoutes[0];
        return firstAllowedRoute ? 
            <Navigate to={`/admin/${firstAllowedRoute}`} /> : 
            <Navigate to="/admin/login" />;
    }

    return children;
};

export default PermissionRoute;