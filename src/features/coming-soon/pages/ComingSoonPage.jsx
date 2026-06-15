import React from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import NewsletterForm from '../components/NewsletterForm';
import FeatureGrid from '../components/FeatureGrid';
import GameBoard from '../../bubble-game/components/GameBoard';
import './ComingSoonPage.css';

export default function ComingSoonPage() {
  return (
    <>
      {/* Background ambient bubble containers */}
      <div className="bubble-bg-container">
        <div className="bg-bubble" style={{ width: '80px', height: '80px', left: '10%', animationDelay: '0s', animationDuration: '22s' }} />
        <div className="bg-bubble" style={{ width: '120px', height: '120px', left: '25%', animationDelay: '4s', animationDuration: '28s' }} />
        <div className="bg-bubble" style={{ width: '60px', height: '60px', left: '50%', animationDelay: '1s', animationDuration: '20s' }} />
        <div className="bg-bubble" style={{ width: '90px', height: '90px', left: '75%', animationDelay: '7s', animationDuration: '25s' }} />
        <div className="bg-bubble" style={{ width: '110px', height: '110px', left: '88%', animationDelay: '2s', animationDuration: '30s' }} />
      </div>

      <div className="coming-soon-layout">
        <Header />

        {/* Hero Section */}
        <section className="hero-card">
          <div className="hero-info">
            <span className="badge">🚀 Sắp Ra Mắt</span>
            <h1 className="main-title">
              Học Mà Chơi, <br />
              <span className="highlight">Khám Phá Thế Giới!</span>
            </h1>
            <p className="subtitle">
              KidLand là thế giới học tập tương tác diệu kỳ dành cho trẻ mầm non. Bé yêu sẽ được làm quen với mặt chữ, con số, con vật và tư duy logic qua những câu chuyện sinh động và trò chơi bổ ích nhất.
            </p>

            <NewsletterForm />
          </div>

          <div className="mascot-container">
            <div className="mascot-image-wrapper">
              <img
                src="/preschool_mascot.png"
                alt="KidLand Mascot - Chú cú thông thái"
                className="mascot-img"
              />
            </div>
          </div>
        </section>

        {/* Game Section */}
        <GameBoard />

        {/* Features Preview Section */}
        <FeatureGrid />

        <Footer />
      </div>
    </>
  );
}
