// Hàm trả về response thành công
exports.success = (res, message, data = null) => {
    return res.json({
        success: true,
        message: message,
        data: data
    });
};

// Hàm trả về response lỗi
exports.error = (res, message, error = null) => {
    return res.status(500).json({
        success: false,
        message: message,
        error: error?.message || error
    });
};
