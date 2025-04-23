// src/components/home/FeaturesList.js
import React from 'react';

function FeaturesList() {
  return (
    <div className="list-section pt-80 pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <div className="list-box d-flex align-items-center">
              <div className="list-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <div className="content">
                <h3>Không lo "Bê - Vác"</h3>
                <p>Đặt trực tuyến - Phục vụ trực tiếp</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <div className="list-box d-flex align-items-center">
              <div className="list-icon">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div className="content">
                <h3>Không cần nghĩ ngợi</h3>
                <p>Đội ngũ chuyên nghiệp, nhanh gọn</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="list-box d-flex justify-content-start align-items-center">
              <div className="list-icon">
                <i className="fas fa-sync"></i>
              </div>
              <div className="content">
                <h3>Không lo về giá</h3>
                <p>Ăn không ngon - Không thanh toán</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesList;