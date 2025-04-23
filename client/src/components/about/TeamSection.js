import React from 'react';

function TeamSection() {
  return (
    <div className="mt-150">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center">
            <div className="section-title">
              <h3>Our <span className="orange-text">Team</span></h3>
              <p>Gặp gỡ những con người tài năng và đầy nhiệt huyết của chúng tôi - những người luôn nỗ lực không ngừng để mang đến cho quý khách những trải nghiệm ẩm thực tuyệt vời nhất.</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="single-team-item">
              <div className="team-bg team-bg-1"></div>
              <h4>Trần Đức Mạnh <span>Đầu bếp phó</span></h4>
              <ul className="social-link-team">
                <li><a href="#" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                <li><a href="#" target="_blank"><i className="fab fa-twitter"></i></a></li>
                <li><a href="#" target="_blank"><i className="fab fa-instagram"></i></a></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="single-team-item">
              <div className="team-bg team-bg-2"></div>
              <h4>Nguyễn Phương Hằng <span>Đầu bếp trưởng</span></h4>
              <ul className="social-link-team">
                <li><a href="#" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                <li><a href="#" target="_blank"><i className="fab fa-twitter"></i></a></li>
                <li><a href="#" target="_blank"><i className="fab fa-instagram"></i></a></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0">
            <div className="single-team-item">
              <div className="team-bg team-bg-3"></div>
              <h4>Trần Đại Thanh <span>Đầu bếp phó</span></h4>
              <ul className="social-link-team">
                <li><a href="#" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                <li><a href="#" target="_blank"><i className="fab fa-twitter"></i></a></li>
                <li><a href="#" target="_blank"><i className="fab fa-instagram"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamSection;