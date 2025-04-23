import React from 'react';

function AboutSection() {
  return (
    <div className="abt-section mb-150">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="abt-bg">
              <a href="https://youtu.be/dQw4w9WgXcQ?si=E3sqhQDui5W6aozj" className="video-play-btn popup-youtube"><i className="fas fa-play"></i></a>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="abt-text">
              <p className="top-sub">Since Year 2004</p>
              <h2>We are <span className="orange-text">Foodee</span></h2>
              <p>Foodee - nơi hội tụ tinh hoa ẩm thực Việt Nam và quốc tế. Với hơn 20 năm kinh nghiệm, chúng tôi tự hào mang đến những trải nghiệm ẩm thực tuyệt vời nhất thông qua những món ăn được chế biến từ nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn thực phẩm.</p>
              <p>Đội ngũ đầu bếp giàu kinh nghiệm của chúng tôi luôn tâm huyết trong từng món ăn, từ khâu chọn nguyên liệu đến cách chế biến và trình bày, nhằm mang đến cho thực khách những bữa ăn không chỉ ngon miệng mà còn đẹp mắt, xứng đáng với niềm tin của quý khách.</p>
              <a href="about" className="boxed-btn mt-4">know more</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;