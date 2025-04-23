// src/components/home/LogoCarousel.js
import React, { useEffect } from 'react';

function LogoCarousel() {
  useEffect(() => {
    // Khởi tạo owl carousel cho logo carousel
    if (window.jQuery) {
      window.jQuery('.logo-carousel-inner').owlCarousel({
        items: 5,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 30,
        responsive: {
          0: { items: 1 },
          480: { items: 2 },
          768: { items: 3 },
          992: { items: 4 },
          1200: { items: 5 }
        }
      });
    }
  }, []);

  return (
    <div className="logo-carousel-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="logo-carousel-inner">
              <div className="single-logo-item">
                <img src="assets/img/company-logos/1.png" alt="Logo 1" />
              </div>
              <div className="single-logo-item">
                <img src="assets/img/company-logos/2.png" alt="Logo 2" />
              </div>
              <div className="single-logo-item">
                <img src="assets/img/company-logos/3.png" alt="Logo 3" />
              </div>
              <div className="single-logo-item">
                <img src="assets/img/company-logos/4.png" alt="Logo 4" />
              </div>
              <div className="single-logo-item">
                <img src="assets/img/company-logos/5.png" alt="Logo 5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoCarousel;