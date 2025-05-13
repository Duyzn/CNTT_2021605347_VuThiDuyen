import React from 'react';

function FeaturedSection() {
  return (
    <div className="feature-bg">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="featured-text">
              <h2 className="pb-3">Tại <span className="orange-text">Cơm Nhà</span></h2>
              <div className="row">
                <div className="col-lg-6 col-md-6 mb-4 mb-md-5">
                  <div className="list-box d-flex">
                    <div className="list-icon">
                      <i className="fas fa-shipping-fast"></i>
                    </div>
                    <div className="content">
                      <h3>Không lo "Bê - Vác"</h3>
                      <p>Đặt trực tuyến - Phục vụ trực tiếp - Giao hàng tận nơi - Chỉ cần bạn muốn</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 mb-5 mb-md-5">
                  <div className="list-box d-flex">
                    <div className="list-icon">
                      <i className="fas fa-money-bill-alt"></i>
                    </div>
                    <div className="content">
                      <h3>Không lo về giá</h3>
                      <p>Ăn không ngon - Không thanh toán - Bảo đảm giá cả cạnh tranh - Dịch vụ tương xứng</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 mb-5 mb-md-5">
                  <div className="list-box d-flex">
                    <div className="list-icon">
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <div className="content">
                      <h3>Không lo bảo mật</h3>
                      <p>Bảo mật thông tin khách hàng - Dữ liệu được reset hàng tháng - Tuân thủ quy định pháp luật</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="list-box d-flex">
                    <div className="list-icon">
                      <i className="fas fa-sync-alt"></i>
                    </div>
                    <div className="content">
                      <h3>Không lo "hoàn món"</h3>
                      <p>Thay thế đồ ăn - Hoàn tiền ngay lập tức nếu khách hàng không hài lòng về chất lượng.</p>
                    </div>
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

export default FeaturedSection;