import React from 'react';
import './Leaderboard.css';

export default function Leaderboard({ board, onBack, onClear }) {
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h1 className="leaderboard-title">🏆 BẢNG VÀNG THÁM TỬ NHÍ</h1>
        
        {board.length === 0 ? (
          <div className="empty-board">
            <span className="empty-emoji">🎒</span>
            <p>Chưa có lớp học nào ghi điểm vàng. Bố mẹ và cô giáo hãy cùng các bé chơi game để vinh danh nhé!</p>
          </div>
        ) : (
          <div className="board-list">
            <div className="board-header">
              <span>Hạng</span>
              <span>Lớp Học / Cô Giáo</span>
              <span>Điểm Số</span>
              <span>Ngày Ghi Nhận</span>
            </div>
            
            {board.map((item, idx) => {
              let medal = '';
              let rankClass = `rank-${idx + 1}`;
              if (idx === 0) medal = '🥇 ';
              else if (idx === 1) medal = '🥈 ';
              else if (idx === 2) medal = '🥉 ';

              return (
                <div key={idx} className={`board-item ${rankClass}`}>
                  <span className="rank-num">
                    {medal || `${idx + 1}`}
                  </span>
                  <span className="class-name">{item.name}</span>
                  <span className="class-score">⭐ {item.score}</span>
                  <span className="record-date">{item.date}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="leaderboard-actions">
          <button className="back-btn" onClick={onBack}>
            VỀ BẢNG ĐIỀU KHIỂN 🏠
          </button>
          
          {board.length > 0 && (
            <button className="clear-btn" onClick={onClear}>
              Xóa Lịch Sử 🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
