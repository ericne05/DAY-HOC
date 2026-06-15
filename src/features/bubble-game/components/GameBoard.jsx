import React, { useRef } from 'react';
import { useBubbleGame } from '../hooks/useBubbleGame';
import Bubble from './Bubble';
import './GameBoard.css';

export default function GameBoard() {
  const { score, bubbles, popEffects, popBubble, handleMiss } = useBubbleGame();
  const boardRef = useRef(null);

  const handleBubblePop = (id, e, color) => {
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      popBubble(id, x, y, color);
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">🎈 Trò chơi tương tác: Bé tập đập bong bóng</h2>
        <div className="score-badge">Điểm của bé: {score} ⭐</div>
      </div>
      <p className="game-instruction">
        Nhấp chuột hoặc chạm vào bong bóng chữ cái, con số và các loài vật đáng yêu để giúp chúng nổ nhé!
      </p>
      
      <div className="game-board-canvas" ref={boardRef}>
        {/* Pop Visual Particle Effects */}
        {popEffects.map((effect) => (
          <div
            key={effect.id}
            className="bubble-pop-particle"
            style={{
              left: effect.x,
              top: effect.y,
              borderColor: effect.color,
            }}
          />
        ))}

        {/* Active Bubbles */}
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            onPop={handleBubblePop}
            onMiss={handleMiss}
          />
        ))}
      </div>
    </div>
  );
}
