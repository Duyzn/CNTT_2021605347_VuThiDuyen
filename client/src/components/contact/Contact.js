import React from 'react';

function Contact() {
  const validateForm = (event) => {
    event.preventDefault();
    // Xử lý validate form ở đây
  };

  return (
    <>
      {/* breadcrumb section */}
      <div className="breadcrumb-section breadcrumb-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="breadcrumb-text">
                <p>Hỗ trợ 24/7</p>
                <h1>Thông tin liên hệ</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* contact form section */}
      <div className="contact-from-section mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-5 mb-lg-0">
              <div className="form-title">
                <h2>Bạn có câu hỏi gì không?</h2>
                <p>Nếu bạn có bất kỳ câu hỏi hoặc ý kiến đóng góp, xin vui lòng gọi nhân viên tại quầy và yêu cầu trực tiếp! Nếu ở xa, liên hệ với chúng tôi qua form bên dưới. Chúng tôi sẽ trả lời sớm nhất có thể.</p>
              </div>
              <div id="form_status"></div>
              <div className="contact-form">
                <form onSubmit={validateForm}>
                  <p>
                    <input type="text" placeholder="Tên của bạn *" name="name" id="name" required />
                    <input type="email" placeholder="Email" name="email" id="email" 
                           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                           title="Vui lòng nhập email hợp lệ (ví dụ: example@domain.com)" />
                  </p>
                  <p>
                    <input type="tel" placeholder="Số điện thoại *" name="phone" id="phone" 
                           pattern="[0-9]{10}" 
                           title="Vui lòng nhập số điện thoại 10 chữ số" 
                           required />
                  </p>
                  <p>
                    <textarea name="message" id="message" cols="30" rows="10" 
                             placeholder="Ý kiến phản hồi *" required></textarea>
                  </p>
                  <input type="hidden" name="token" value="FsWga4&@f6aw" />
                  <p><input type="submit" value="Gửi phản hồi" /></p>
                </form>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="contact-form-wrap">
                <div className="contact-form-box">
                  <h4><i className="fas fa-map"></i> Địa chỉ</h4>
                  <p>122 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội.</p>
                </div>
                <div className="contact-form-box">
                  <h4><i className="far fa-clock"></i> Giờ mở cửa</h4>
                  <p>T2 - CN: 8h00 - 22h00</p>
                </div>
                <div className="contact-form-box">
                  <h4><i className="fas fa-address-book"></i> Thông tin liên hệ</h4>
                  <p>Phone: +00 111 222 3333 <br /> Email: support@ComNha.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* location section */}
      <div className="find-location blue-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <p><i className="fas fa-map-marker-alt"></i> Tìm địa chỉ của chúng tôi</p>
            </div>
          </div>
        </div>
      </div>

      {/* google map */}
      <div className="embed-responsive embed-responsive-21by9">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1418.1883567557402!2d105.79098029289554!3d21.046544704206827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab303f75aa1d%3A0xc569edc8f17029d2!2zMTIyIEhvw6BuZyBRdeG7kWMgVmnhu4d0LCBD4buVIE5odeG6vywgQ-G6p3UgR2nhuqV5LCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e1!3m2!1svi!2s!4v1732602306909!5m2!1svi!2s"
          width="600"
          height="450"
          style={{border: 0}}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="embed-responsive-item"
          title="google-map"
        />
      </div>
    </>
  );
}

export default Contact;