import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';

// Import các components
import Loader from './components/common/Loader.js';
import Layout from './components/layout/Layout';  
import Home from './components/home/Home.js';
import About from './components/about/About.js';
import Contact from './components/contact/Contact.js';
import Menu from './components/menu/Menu';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import SingleProduct from './components/product/SingleProduct';
import AdminLogin from './components/admin/auth/AdminLogin';
import AdminLayout from './components/admin/layout/AdminLayout';
import Dashboard from './components/admin/pages/dashboard/Dashboard';
import AdminProducts from './components/admin/pages/products/AdminProducts.js';
import AdminCategories from './components/admin/pages/categories/AdminCategories';
import OrderList from './components/admin/pages/orders/OrderList';
import { CartProvider } from './contexts/CartContext';
import TableList from './components/admin/pages/tables/TableList';
import { TableProvider } from './contexts/TableContext';
import TableRedirect from './components/table/TableRedirect';
import AdminStaff from './components/admin/pages/staff/AdminStaff';
import PermissionRoute from './components/common/PermissionRoute';
import MobileCartBar from './components/cart/MobileCartBar';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  
  if (!role || !username) {
      return <Navigate to="/admin/login" />;
  }
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  // Effect cho việc khởi tạo plugins
  useEffect(() => {
    const initPlugins = () => {
      if (window.jQuery) {
        window.jQuery('.main-menu').meanmenu({
          meanMenuContainer: '.mobile-menu',
          meanScreenWidth: "992"
        });
        setLoading(false);
      } else {
        setTimeout(initPlugins, 100);
      }
    };
    initPlugins();
  }, []);

  useEffect(() => {
    if (!loading) {
      setIsNavigating(true);
      window.scrollTo(0, 0);
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, loading]);

  if (loading || isNavigating) {
    return <Loader />;
  }

  return (
    <TableProvider>
      <CartProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={
              <PermissionRoute requiredPermission="dashboard">
                <Dashboard />
              </PermissionRoute>
            } />
            <Route path="products" element={
              <PermissionRoute requiredPermission="products">
                <AdminProducts />
              </PermissionRoute>
            } />
            <Route path="categories" element={
              <PermissionRoute requiredPermission="categories">
                <AdminCategories />
              </PermissionRoute>
            } />
            <Route path="orders" element={
              <PermissionRoute requiredPermission="orders">
                <OrderList />
              </PermissionRoute>
            } />
            <Route path="tables" element={
              <PermissionRoute requiredPermission="tables">
                <TableList />
              </PermissionRoute>
            } />
            <Route path="staff" element={
              <PermissionRoute requiredPermission="staff">
                <AdminStaff />
              </PermissionRoute>
            } />
          </Route>

          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="product/:id" element={<SingleProduct />} />
            <Route path="/table/:tableId" element={<TableRedirect />} />
          </Route>
        </Routes>
        <MobileCartBar />
      </CartProvider>
    </TableProvider>
  );
}

export default App;