import React from 'react';
import './FeatureGrid.css';

export default function FeatureGrid() {
  const features = [
    {
      icon: '🅰️',
      title: 'Học Chữ Cái',
      desc: 'Nhận diện bảng chữ cái Tiếng Việt qua hình ảnh vui nhộn và âm thanh sinh động dễ nhớ.',
      colorClass: 'pink',
    },
    {
      icon: '🔢',
      title: 'Đếm Số Cực Vui',
      desc: 'Bé học đếm con vật, đồ chơi và thực hiện phép cộng trừ cơ bản trực quan.',
      colorClass: 'blue',
    },
    {
      icon: '🧩',
      title: 'Trò Chơi Trí Tuệ',
      desc: 'Các trò chơi ghép hình, tìm cặp thẻ giống nhau giúp bé luyện trí nhớ và tư duy.',
      colorClass: 'green',
    },
    {
      icon: '📖',
      title: 'Thư Viện Thơ Truyện',
      desc: 'Nghe kể chuyện cổ tích, học thơ thiếu nhi giúp làm giàu vốn từ và tâm hồn của bé.',
      colorClass: 'orange',
    },
  ];

  return (
    <section className="features-section">
      <h2 className="section-title">KidLand sắp có những gì?</h2>
      <div className="features-grid">
        {features.map((feature, idx) => (
          <div key={idx} className={`feature-card ${feature.colorClass}`}>
            <div className="feature-icon-wrapper">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
