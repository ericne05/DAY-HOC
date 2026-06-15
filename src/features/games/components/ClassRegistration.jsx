import React, { useState } from 'react';
import './ClassRegistration.css';

export default function ClassRegistration({ onRegister }) {
  const [teacher, setTeacher] = useState('');
  const [className, setClassName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teacher.trim() && className.trim()) {
      onRegister(`${teacher.trim()} - Lớp ${className.trim()}`);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1 className="registration-title">🎒 THÁM TỬ NHÍ NHẬP HỘI</h1>
        
        {/* Animated Cute Bag Icon */}
        <div className="registration-icon-wrapper">
          <svg className="school-bag-svg" viewBox="0 0 100 100" width="120" height="120">
            <rect x="25" y="30" width="50" height="50" rx="15" fill="#ff4757" />
            <path d="M35 30 V20 Q50 10 65 20 V30" fill="none" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round" />
            <rect x="35" y="45" width="30" height="25" rx="5" fill="#eccc68" />
            <circle cx="50" cy="50" r="4" fill="#2c3e50" />
            <rect x="20" y="35" width="10" height="40" rx="5" fill="#ff6b81" />
            <rect x="70" y="35" width="10" height="40" rx="5" fill="#ff6b81" />
          </svg>
        </div>

        <p className="registration-instruction">
          Chào mừng cô giáo đến với nền tảng giảng dạy tương tác KidLand! Bố mẹ và các bé hãy cùng cô nhập tên lớp để tích lũy điểm sao nhé!
        </p>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="input-group">
            <label htmlFor="teacher-input">👩‍🏫 Tên cô giáo:</label>
            <input
              id="teacher-input"
              type="text"
              placeholder="Ví dụ: Cô Lan, Cô Hồng..."
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="class-input">🏫 Tên lớp học:</label>
            <input
              id="class-input"
              type="text"
              placeholder="Ví dụ: Mầm A, Chồi 1, Lá 2..."
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="registration-btn">
            BẮT ĐẦU DẠY HỌC 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
