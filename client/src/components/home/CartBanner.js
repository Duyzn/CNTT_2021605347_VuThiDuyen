// src/components/home/CartBanner.js
import React, { useState, useEffect } from 'react';

function CartBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set thời gian kết thúc là 23:59:59 ngày 31/12/2024
    const endDate = new Date(2024, 11, 31, 23, 59, 59);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        // Tính toán ngày, giờ, phút, giây còn lại
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="cart-banner pt-100 pb-100">
      <div className="container">
        <div className="row clearfix">
          {/* Image Column */}
          <div className="image-column col-lg-6">
            <div className="image">
              <div className="price-box">
                <div className="inner-price">
                  <span className="price">
                    <strong>-30%</strong> <br /> cho 01 cốc
                  </span>
                </div>
              </div>
              <img src="assets/img/a.jpg" alt="" />
            </div>
          </div>

          {/* Content Column */}
          <div className="content-column col-lg-6">
            <h3 className="promo-text">
              Đồ uống ngon <br />
              <span className="orange-text">Giảm giá mạnh</span>
            </h3>
            <h4>Trà sữa dâu</h4>
            <div className="text">
              Trà sữa dâu là sự hòa quyện hoàn hảo giữa vị ngọt dịu của trà sữa béo thơm 
              và hương dâu tươi mát, từng ngụm như một làn gió mát lành mang theo chút 
              ngọt ngào tan chảy nơi đầu lưỡi, khiến bạn khó lòng cưỡng lại.
            </div>

            {/* Countdown Timer */}
            <div className="time-counter">
              <div className="time-countdown clearfix">
                <div className="counter-column">
                  <div className="inner">
                    <span className="count">{String(timeLeft.days).padStart(2, '0')}</span>Ngày
                  </div>
                </div>
                <div className="counter-column">
                  <div className="inner">
                    <span className="count">{String(timeLeft.hours).padStart(2, '0')}</span>Giờ
                  </div>
                </div>
                <div className="counter-column">
                  <div className="inner">
                    <span className="count">{String(timeLeft.minutes).padStart(2, '0')}</span>Phút
                  </div>
                </div>
                <div className="counter-column">
                  <div className="inner">
                    <span className="count">{String(timeLeft.seconds).padStart(2, '0')}</span>Giây
                  </div>
                </div>
              </div>
            </div>

            {/* <a className="cart-btn mt-3">
              <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartBanner;