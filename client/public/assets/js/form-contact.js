function validateForm(event) {
    event.preventDefault();
    
    // Lấy giá trị các trường
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate tên
    if (name.length < 2) {
        alert('Vui lòng nhập tên hợp lệ');
        return false;
    }
    
    // Validate số điện thoại
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Vui lòng nhập số điện thoại 10 chữ số');
        return false;
    }
    
    // Validate email nếu đã nhập
    if (email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert('Vui lòng nhập email hợp lệ');
            return false;
        }
    }
    
    // Validate nội dung phản hồi
    if (message.length < 10) {
        alert('Vui lòng nhập ý kiến phản hồi ít nhất 10 ký tự');
        return false;
    }
    
    // Nếu mọi thứ hợp lệ, submit form
    document.getElementById('Foodee-contact').submit();
    return true;
}

// Thêm dấu * cho các trường bắt buộc
document.addEventListener('DOMContentLoaded', function() {
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (field.placeholder) {
            field.placeholder += ' *';
        }
    });
});