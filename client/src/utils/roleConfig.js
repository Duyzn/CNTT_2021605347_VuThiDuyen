// src/utils/roleConfig.js
export const rolePermissions = {
    admin: {
        dashboard: ['view'],
        tables: ['view', 'create', 'edit', 'delete'],
        orders: ['view', 'create', 'edit', 'delete', 'updateStatus'],
        products: ['view', 'create', 'edit', 'delete'],
        categories: ['view', 'create', 'edit', 'delete'],
        staff: ['view', 'create', 'edit', 'delete']
    },
    kitchen: {
        tables: ['view'],
        orders: ['view', 'updateStatus'],
        products: ['view'],
        categories: ['view']
    },
    staff: {
        tables: ['view'],
        orders: ['view', 'create', 'edit', 'delete', 'updateStatus'],
        products: ['view'],
        categories: ['view']
    }
};

// Hàm helper kiểm tra quyền
export const hasPermission = (role, route, action = 'view') => {
    if (!role || !rolePermissions[role]) return false;
    return rolePermissions[role][route]?.includes(action);
};