const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.error('Authentication failed: No token provided');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('Lỗi cấu hình máy chủ: JWT_SECRET chưa được xác định');
      return res.status(500).json({ message: 'Lỗi cấu hình máy chủ' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    //res.status(401).json({ message: 'Token verification failed' });
    console.error('Authentication error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(500).json({ message: 'Server error during authentication', error: err.message });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { auth, checkRole };