// src/components/home/HomeSlider.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HelpButton from '../common/HelpButton';

function HomeSlider() {
  useEffect(() => {
    // Khởi tạo owl carousel cho slider
    if (window.jQuery) {
        const $slider = window.jQuery('.homepage-slider');
        
        $slider.owlCarousel({
          items: 1,
          loop: true,
          nav: true,
          dots: false,
          autoplay: true,
          autoplayTimeout: 5000,
          smartSpeed: 1500,
          navText: ["<i class='fas fa-angle-left'></i>","<i class='fas fa-angle-right'></i>"],
          // Bỏ animateIn và animateOut
          onInitialized: function() {
            // Animation cho slide đầu tiên
            const $active = $slider.find('.owl-item.active');
            $active.find('.subtitle').addClass('animated fadeInUp');
            setTimeout(() => {
              $active.find('h1').addClass('animated fadeInUp');
            }, 300);
            setTimeout(() => {
              $active.find('.hero-btns').addClass('animated fadeInUp');
            }, 600);
          },
          onChange: function() {
            // Reset animation khi slide thay đổi
            $slider.find('.subtitle, h1, .hero-btns')
              .removeClass('animated fadeInUp');
          },
          onChanged: function() {
            // Thêm animation cho slide mới
            const $active = $slider.find('.owl-item.active');
            setTimeout(() => {
              $active.find('.subtitle').addClass('animated fadeInUp');
            }, 100);
            setTimeout(() => {
              $active.find('h1').addClass('animated fadeInUp');
            }, 400);
            setTimeout(() => {
              $active.find('.hero-btns').addClass('animated fadeInUp');
            }, 700);
          }
        });
      }
    }, []);

  return (
    <div className="homepage-slider">
      {/* Slider 1 */}
      <div className="single-homepage-slider homepage-bg-1">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-7 offset-lg-1 offset-xl-0">
              <div className="hero-text">
                <div className="hero-text-tablecell">
                  <p className="subtitle">Sạch & Tươi ngon</p>
                  <h1>Mừng Bạn Đã Tới Nhà Hàng </h1>
                  <div className="hero-btns">
                    <a href="menu" className="boxed-btn">Đặt món</a>
                    <HelpButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider 2 */}
      <div className="single-homepage-slider homepage-bg-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1 text-center">
              <div className="hero-text">
                <div className="hero-text-tablecell">
                  <p className="subtitle">Giảm Giá Sốc Tháng 12</p>
                  <h1>Chuẩn "Cơm Mẹ Nấu" Với Các Đầu Bếp Hàng Đầu</h1>
                  <div className="hero-btns">
                    <a href="menu" className="boxed-btn">Đặt món</a>
                    <HelpButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider 3 */}
      <div className="single-homepage-slider homepage-bg-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1 text-right">
              <div className="hero-text">
                <div className="hero-text-tablecell">
                  <p className="subtitle">Tươi mới - Mỗi ngày</p>
                  <h1>100% Nguyên Liệu Chuẩn OCOP 4 Sao</h1>
                  <div className="hero-btns">
                    <a href="menu" className="boxed-btn">Đặt món</a>
                    <HelpButton />
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

export default HomeSlider;