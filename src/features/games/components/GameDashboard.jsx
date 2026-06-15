import React, { useState } from 'react';
import ClassRegistration from './ClassRegistration';
import Leaderboard from './Leaderboard';
import ShapeGame from '../shape-finder/components/ShapeGame';
import CountingGame from '../counting-game/components/CountingGame';
import AnimalGame from '../animal-riddle/components/AnimalGame';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { useLeaderboard } from '../hooks/useLeaderboard';
import './GameDashboard.css';

export default function GameDashboard() {
  const [activeClass, setActiveClass] = useState(() => {
    return localStorage.getItem('kidland_active_class') || '';
  });
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'leaderboard' | 'game-shape' | 'game-count' | 'game-animal'
  const { leaderboard, saveScore, clearLeaderboard } = useLeaderboard();

  const handleRegister = (name) => {
    localStorage.setItem('kidland_active_class', name);
    setActiveClass(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('kidland_active_class');
    setActiveClass('');
    setActiveView('dashboard');
  };

  const handleFinishGame = (score) => {
    saveScore(activeClass, score);
    setActiveView('leaderboard');
  };

  // 1. If not registered class name, show registration page
  if (!activeClass) {
    return (
      <div className="dashboard-layout">
        <Header />
        <ClassRegistration onRegister={handleRegister} />
        <Footer />
      </div>
    );
  }

  // 2. If leaderboard view is active
  if (activeView === 'leaderboard') {
    return (
      <div className="dashboard-layout">
        <Header />
        <Leaderboard
          board={leaderboard}
          onBack={() => setActiveView('dashboard')}
          onClear={clearLeaderboard}
        />
        <Footer />
      </div>
    );
  }

  // 3. Render Game 1: Shape Finder
  if (activeView === 'game-shape') {
    return (
      <div className="dashboard-layout">
        <ShapeGame
          onFinish={handleFinishGame}
          onExit={() => setActiveView('dashboard')}
        />
      </div>
    );
  }

  // 4. Render Game 2: Counting Game
  if (activeView === 'game-count') {
    return (
      <div className="dashboard-layout">
        <CountingGame
          onFinish={handleFinishGame}
          onExit={() => setActiveView('dashboard')}
        />
      </div>
    );
  }

  // 5. Render Game 3: Animal Riddles
  if (activeView === 'game-animal') {
    return (
      <div className="dashboard-layout">
        <AnimalGame
          onFinish={handleFinishGame}
          onExit={() => setActiveView('dashboard')}
        />
      </div>
    );
  }

  // 6. Default: Main dashboard selector
  return (
    <div className="dashboard-layout">
      {/* Background ambient bubble containers */}
      <div className="bubble-bg-container">
        <div className="bg-bubble" style={{ width: '80px', height: '80px', left: '10%', animationDelay: '0s', animationDuration: '22s' }} />
        <div className="bg-bubble" style={{ width: '120px', height: '120px', left: '25%', animationDelay: '4s', animationDuration: '28s' }} />
        <div className="bg-bubble" style={{ width: '60px', height: '60px', left: '50%', animationDelay: '1s', animationDuration: '20s' }} />
        <div className="bg-bubble" style={{ width: '90px', height: '90px', left: '75%', animationDelay: '7s', animationDuration: '25s' }} />
        <div className="bg-bubble" style={{ width: '110px', height: '110px', left: '88%', animationDelay: '2s', animationDuration: '30s' }} />
      </div>

      <Header />

      {/* Class welcome bar */}
      <div className="welcome-classroom-bar">
        <span className="welcome-text">👩‍🏫 Lớp học của: <strong>{activeClass}</strong></span>
        <button className="change-class-btn" onClick={handleLogout}>Đổi Lớp Khác 🔄</button>
      </div>

      {/* Main Board Selector */}
      <main className="dashboard-main">
        <h1 className="dashboard-heading">🎮 GIAN HÀNG TRÒ CHƠI TƯƠNG TÁC</h1>
        <p className="dashboard-desc">
          Cô giáo hãy chọn một trong các trò chơi dưới đây để trình chiếu và dạy học cùng các bé nhé!
        </p>

        <div className="games-menu-grid">
          {/* Game Card 1 */}
          <div className="game-menu-card shape">
            <span className="game-card-emoji">🧙‍♂️🎨</span>
            <h3 className="game-card-title">Tìm Hình Bí Mật</h3>
            <p className="game-card-desc">
              Phân biệt Hình tròn, Hình vuông, Hình tam giác theo nhiều màu sắc và kích thước khác nhau.
            </p>
            <button className="enter-game-btn pink" onClick={() => setActiveView('game-shape')}>
              VÀO HỌC NGAY 🚀
            </button>
          </div>

          {/* Game Card 2 */}
          <div className="game-menu-card count">
            <span className="game-card-emoji">🍎🔢</span>
            <h3 className="game-card-title">Đếm Số Thần Kỳ</h3>
            <p className="game-card-desc">
              Đếm số con vật, đồ chơi, hoa quả sinh động và làm quen với các con số từ 1 đến 10.
            </p>
            <button className="enter-game-btn blue" onClick={() => setActiveView('game-count')}>
              VÀO HỌC NGAY 🚀
            </button>
          </div>

          {/* Game Card 3 */}
          <div className="game-menu-card animal">
            <span className="game-card-emoji">🦁🦁</span>
            <h3 className="game-card-title">Đố Vui Muôn Thú</h3>
            <p className="game-card-desc">
              Cô giáo đọc câu đố vui dân gian, các bé quan sát và nhận biết các loài vật nuôi quen thuộc.
            </p>
            <button className="enter-game-btn purple" onClick={() => setActiveView('game-animal')}>
              VÀO HỌC NGAY 🚀
            </button>
          </div>
        </div>

        {/* Global leader action */}
        <div className="leaderboard-entry-panel">
          <button className="gold-leaderboard-btn" onClick={() => setActiveView('leaderboard')}>
            🏆 XEM BẢNG VÀNG THÀM TỬ NHÍ
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
