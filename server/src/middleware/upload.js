const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../../public/uploads/products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.memoryStorage(); // Dùng memory storage để xử lý ảnh

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Middleware xử lý và resize ảnh
const processImage = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const filename = 'product-' + Date.now() + '.jpg';
        const filepath = path.join(uploadDir, filename);

        // Resize và optimize ảnh
        await sharp(req.file.buffer)
            .resize(800, 800, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 90 })
            .toFile(filepath);

        // Gán thông tin file đã xử lý vào request
        req.file.filename = filename;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { upload, processImage };