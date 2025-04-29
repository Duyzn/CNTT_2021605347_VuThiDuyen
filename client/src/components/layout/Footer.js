// src/components/layout/Footer.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', {
        email: email
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Đăng ký thành công!',
          text: 'Cảm ơn bạn đã đăng ký nhận tin từ Cơm Nhà'
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Chưa được phép!',
        text: 'Tính năng đang làm mà thấy vô dụng nên cho ngừng rồi nghen;))'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Footer area */}
      <div className="footer-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="footer-box about-widget">
                <h2 className="widget-title">Về chúng tôi</h2>
                <p>Cơm Nhà - nơi hội tụ tinh hoa ẩm thực Việt Nam và quốc tế. Với hơn 20 năm kinh nghiệm, chúng tôi tự hào mang đến những trải nghiệm ẩm thực tuyệt vời nhất thông qua những món ăn được chế biến từ nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn thực phẩm.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-box get-in-touch">
                <h2 className="widget-title">Thông tin liên hệ</h2>
                <ul>
                  <li>122 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội.</li>
                  <li>support@ComNha.com</li>
                  <li>+00 111 222 3333</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-box pages">
                <h2 className="widget-title">Pages</h2>
                <ul>
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/about">Về chúng tôi</Link></li>
                    <li><Link to="/contact">Thông tin liên hệ</Link></li>
                    <li><Link to="/menu">Menu</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-box subscribe">
                <h2 className="widget-title">Đăng ký nhận tin</h2>
                <p>Đăng ký nhận thông báo để cập nhật những tin tức mới nhất từ chúng tôi.</p>
                <form onSubmit={handleSubmit}>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <p>Copyrights &copy; 2024 - <a href="https://imransdesign.com/">Duyên Vũ</a>, All Rights Reserved.<br />
                Distributed By - Duyên Vũ
              </p>
            </div>
            <div className="col-lg-6 text-right col-md-12">
              <div className="social-icons">
                <ul>
                  <li><a href="#" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                  <li><a href="#" target="_blank"><i className="fab fa-twitter"></i></a></li>
                  <li><a href="#" target="_blank"><i className="fab fa-instagram"></i></a></li>
                  <li><a href="#" target="_blank"><i className="fab fa-linkedin"></i></a></li>
                  <li><a href="#" target="_blank"><i className="fab fa-dribbble"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;