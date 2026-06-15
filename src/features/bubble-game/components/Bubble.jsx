import React from 'react';
import './Bubble.css';

export default function Bubble({ bubble, onPop, onMiss }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onPop(bubble.id, e, bubble.color);
  };

  return (
    <div
      className="game-bubble"
      style={{
        left: bubble.left,
        backgroundColor: bubble.color,
        animationDuration: bubble.duration,
      }}
      onClick={handleClick}
      onAnimationEnd={() => onMiss(bubble.id)}
    >
      {bubble.content}
    </div>
  );
}
