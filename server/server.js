require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/config/database');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://nhahangcomnha-production.up.railway.app',
    'http://localhost:3000',
    'https://nhahangcomnha.vercel.app', // Domain frontend thật
   // 'https://foodee.namtech.me'
  ],
//    methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Thêm middleware để serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Test database connection
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT 1');
        res.json({ message: 'Database connection successful', data: rows });
    } catch (error) {
        console.error('Database test failed:', error);
        res.status(500).json({ 
            message: 'Database connection failed',
            error: error.message,
            code: error.code
        });
    }
});

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Cơm Nhà API' });
});

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const tableRoutes = require('./src/routes/tableRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes'); 
const productOptionRoutes = require('./src/routes/productOptionRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const supportRoutes = require('./src/routes/supportRoutes');
const userRoutes = require('./src/routes/userRoutes');
const newsletterRoutes = require('./src/routes/newsletterRoutes');

// Apply public routes first (không cần auth)
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes); // Cart routes không cần auth
app.use('/api/products', productRoutes); // Product routes có cả public và protected
app.use('/api/support', supportRoutes);

// Apply protected routes (cần auth)
app.use('/api/categories', categoryRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/product-options', productOptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Global error handling
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        code: err.code
    });

    // Database connection errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return res.status(500).json({
            message: 'Database connection failed',
            error: 'Không thể kết nối đến cơ sở dữ liệu'
        });
    }

    // SQL errors
    if (err.sqlMessage) {
        return res.status(500).json({
            message: 'Database error',
            error: err.sqlMessage
        });
    }

    // Default error response
    res.status(500).json({ 
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Test database connection on startup
    db.getConnection()
        .then(connection => {
            console.log('Database connected successfully');
            connection.release();
        })
        .catch(err => {
            console.error('Database connection failed:', err);
        });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});