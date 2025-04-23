// src/components/home/TestimonialSection.js
import React, { useEffect } from 'react';

function TestimonialSection() {
  useEffect(() => {
    // Khởi tạo owl carousel cho testimonials
    if (window.jQuery) {
      window.jQuery('.testimonial-sliders').owlCarousel({
        items: 1,
        loop: true,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 6000,
        smartSpeed: 1000
      });
    }
  }, []);

  return (
    <div className="testimonail-section mt-150 mb-150">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 offset-lg-1 text-center">
            <div className="testimonial-sliders">
              {/* Testimonial 1 */}
              <div className="single-testimonial-slider">
                <div className="client-avater">
                  <img src="assets/img/avaters/avatar1.png" alt="Trần Thị Hạnh" />
                </div>
                <div className="client-meta">
                  <h3>Trần Thị Hạnh <span>Giáo viên, Hà Nam</span></h3>
                  <p className="testimonial-body">
                    " Món ăn ngon, đội ngũ phục vụ nhanh nhẹn, giá cả phải chăng. Đặc biệt là các đầu bếp rất chuyên nghiệp, biết cách phục vụ khách hàng. "
                  </p>
                  <div className="last-icon">
                    <i className="fas fa-quote-right"></i>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="single-testimonial-slider">
                <div className="client-avater">
                  <img src="assets/img/avaters/avatar2.png" alt="Nguyễn Văn Hải" />
                </div>
                <div className="client-meta">
                  <h3>Nguyễn Văn Hải <span>Nhân viên giao hàng, Hà Nội</span></h3>
                  <p className="testimonial-body">
                    " Không gian nhà hàng thoáng mát, sạch sẽ. Menu đa dạng với nhiều món ăn hấp dẫn. Nhân viên thân thiện, chu đáo. Chắc chắn sẽ quay lại lần sau. "
                  </p>
                  <div className="last-icon">
                    <i className="fas fa-quote-right"></i>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="single-testimonial-slider">
                <div className="client-avater">
                  <img src="assets/img/avaters/avatar3.png" alt="Nguyễn Phú Hưng" />
                </div>
                <div className="client-meta">
                  <h3>Nguyễn Phú Hưng <span>Nhân viên văn phòng, Hà Nội </span></h3>
                  <p className="testimonial-body">
                    " Tôi rất ấn tượng với cách bày trí món ăn ở đây. Không chỉ ngon miệng mà còn đẹp mắt. Giá thành hợp lý cho chất lượng món ăn. Đặc biệt là các món đặc sản rất đậm đà, đúng vị. "
                  </p>
                  <div className="last-icon">
                    <i className="fas fa-quote-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialSection;