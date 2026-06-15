import React, { useState } from 'react';
import './NewsletterForm.css';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
      // Auto close/reset notification after 6 seconds
      setTimeout(() => setIsSubmitted(false), 6000);
    }
  };

  return (
    <div className="signup-section">
      <h3 className="signup-title">Bố mẹ nhận thông báo khi KidLand chính thức ra mắt nhé!</h3>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          placeholder="Nhập email của bố mẹ..."
          className="signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="signup-btn">Nhận Tin Ngay 💌</button>
      </form>
      
      {isSubmitted && (
        <div className="success-msg">
          <span>🎉 Cảm ơn bố mẹ! KidLand sẽ gửi tin nhắn ngay khi sẵn sàng nhé.</span>
        </div>
      )}
    </div>
  );
}
