import React, { useState, useEffect, useRef } from 'react';
import './ShapeGame.css';

const shapeTypes = [
  { id: 'circle', name: 'Hình Tròn' },
  { id: 'square', name: 'Hình Vuông' },
  { id: 'triangle', name: 'Hình Tam Giác' }
];

const colors = [
  { id: 'red', name: 'Màu Đỏ' },
  { id: 'blue', name: 'Màu Xanh Dương' },
  { id: 'yellow', name: 'Màu Vàng' },
  { id: 'green', name: 'Màu Xanh Lá' }
];

const sizes = [
  { id: 'big', name: 'To' },
  { id: 'small', name: 'Nhỏ' }
];

export default function ShapeGame({ onFinish, onExit }) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [screen, setScreen] = useState('start'); // 'start' | 'play' | 'end'
  const [listShapes, setListShapes] = useState([]);
  const [targetShape, setTargetShape] = useState(null);
  const [wrongItems, setWrongItems] = useState({}); // tracker for shaken incorrect items
  const [popEffects, setPopEffects] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false); // click lock
  const gameBoardRef = useRef(null);

  // Web Audio Sound Synthesizer
  const playSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'wrong') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'win') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.15, ctx.currentTime + index * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.3);
          o.start(ctx.currentTime + index * 0.1);
          o.stop(ctx.currentTime + index * 0.1 + 0.3);
        });
      }
    } catch (e) {
      console.warn("Audio Context blocked", e);
    }
  };

  const handleStartGame = () => {
    setLevel(1);
    setScore(0);
    setIsTransitioning(false);
    setScreen('play');
  };

  // Generate shapes for a level
  const generateLevel = () => {
    const list = [];
    while (list.length < 3) {
      const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

      const isDuplicate = list.some(
        (s) => s.type.id === randomType.id && s.color.id === randomColor.id && s.size.id === randomSize.id
      );

      if (!isDuplicate) {
        list.push({
          id: `shape-${list.length}-${Math.random().toString(36).substring(2, 5)}`,
          type: randomType,
          color: randomColor,
          size: randomSize
        });
      }
    }

    const target = list[Math.floor(Math.random() * list.length)];
    setListShapes(list);
    setTargetShape(target);
    setWrongItems({});
  };

  // Generate new layout whenever level changes on play screen
  useEffect(() => {
    if (screen === 'play') {
      generateLevel();
    }
  }, [level, screen]);

  // Check child answer
  const checkAnswer = (selected, e, index) => {
    if (isTransitioning) return; // ignore clicks during transition

    let isCorrect = false;

    if (level === 1) {
      isCorrect = (selected.type.id === targetShape.type.id);
    } else if (level <= 3) {
      isCorrect = (selected.type.id === targetShape.type.id && selected.color.id === targetShape.color.id);
    } else {
      isCorrect = (
        selected.type.id === targetShape.type.id &&
        selected.color.id === targetShape.color.id &&
        selected.size.id === targetShape.size.id
      );
    }

    if (isCorrect) {
      playSound('correct');
      setScore((prev) => prev + 10);
      setIsTransitioning(true); // lock clicks immediately
      
      // Spawn particle effect
      if (gameBoardRef.current) {
        const rect = gameBoardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createEffects(x, y, selected.color.id);
      }

      setTimeout(() => {
        if (level < 5) {
          setLevel((prev) => prev + 1);
          setIsTransitioning(false); // unlock click for next level
        } else {
          playSound('win');
          setScreen('end');
          setIsTransitioning(false);
        }
      }, 1000);
    } else {
      playSound('wrong');
      // Trigger shaking animation
      setWrongItems((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setWrongItems((prev) => ({ ...prev, [index]: false }));
      }, 300);
    }
  };

  // Sparkles particles
  const createEffects = (x, y, colorId) => {
    const listColors = {
      red: '#ff4d4d',
      blue: '#3b82f6',
      yellow: '#ffd166',
      green: '#06d6a0'
    };
    
    const newEffects = Array.from({ length: 15 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 80;
      return {
        id: Math.random().toString(36).substring(2, 9),
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: listColors[colorId] || '#ff4757'
      };
    });

    setPopEffects((prev) => [...prev, ...newEffects]);

    setTimeout(() => {
      setPopEffects((prev) => prev.filter((effect) => !newEffects.some(ne => ne.id === effect.id)));
    }, 1000);
  };

  // Witch Dialogues
  const getSpeechText = () => {
    if (!targetShape) return '';
    if (level === 1) {
      return `Hãy tìm giúp cô ${targetShape.type.name} nhé!`;
    } else if (level <= 3) {
      return `Hãy tìm giúp cô ${targetShape.type.name} màu ${targetShape.color.name.toLowerCase()} nhé!`;
    } else {
      return `Hãy tìm giúp cô ${targetShape.type.name} màu ${targetShape.color.name.toLowerCase()} cỡ ${targetShape.size.name.toLowerCase()} nhé!`;
    }
  };

  return (
    <div className="game-wrapper">
      {screen === 'start' && (
        <div className="game-stage active">
          <h1 className="game-main-title">TÌM HÌNH BÍ MẬT</h1>
          <svg className="witch-svg-img" viewBox="0 0 100 100" width="150" height="150">
            <circle cx="50" cy="55" r="25" fill="#fbc531"/>
            <path d="M20 40 L50 5 L80 40 Z" fill="#9c88ff"/>
            <ellipse cx="50" cy="40" rx="35" ry="5" fill="#8c7ae6"/>
            <circle cx="42" cy="52" r="3" fill="#000"/>
            <circle cx="58" cy="52" r="3" fill="#000"/>
            <path d="M45 65 Q50 70 55 65" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M30 55 Q25 55 25 58" stroke="#ff9f43" strokeWidth="4" fill="none"/>
            <path d="M70 55 Q75 55 75 58" stroke="#ff9f43" strokeWidth="4" fill="none"/>
          </svg>
          <p className="game-intro-text">
            Chào mừng các thám tử nhí đến với vùng đất hình học của phù thủy thông thái! Cô giáo hãy bắt đầu chơi cùng các bé nhé!
          </p>
          <div className="btn-group">
            <button className="primary-game-btn" onClick={handleStartGame}>CHƠI NGAY THÔI! 🚀</button>
            <button className="exit-game-btn" onClick={onExit}>QUAY LẠI 🏠</button>
          </div>
        </div>
      )}

      {screen === 'play' && (
        <div className="game-stage active">
          <div className="game-status-board">
            {/* Playful Animated Stars Progress Bar */}
            <div className="star-progress-container">
              {Array.from({ length: 5 }).map((_, idx) => {
                const isPassed = idx + 1 < level;
                const isActive = idx + 1 === level;
                return (
                  <span
                    key={idx}
                    className={`progress-star ${isPassed ? 'passed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    ⭐
                  </span>
                );
              })}
            </div>
            <button className="exit-top-btn" onClick={onExit}>Thoát 🏠</button>
            <span className="score-indicator">Điểm: {score} ⭐</span>
          </div>

          <div className="witch-instruction-box">
            <p>{getSpeechText()}</p>
          </div>

          {/* Interactive Shape Board */}
          <div className="shapes-playground" ref={gameBoardRef}>
            {/* Confetti Particles */}
            {popEffects.map((p) => (
              <div
                key={p.id}
                className="game-confetti-particle"
                style={{
                  left: p.x,
                  top: p.y,
                  backgroundColor: p.color,
                  '--dx': `${p.dx}px`,
                  '--dy': `${p.dy}px`,
                }}
              />
            ))}

            {/* Shape Choices Grid */}
            <div className="shapes-play-grid">
              {listShapes.map((item, idx) => {
                const isTriangle = item.type.id === 'triangle';
                const colorClass = `color-${item.color.id}`;
                const sizeClass = `size-${item.size.id}`;
                const shakeClass = wrongItems[idx] ? 'shake-wrong' : '';

                return (
                  <div
                    key={item.id}
                    className={`shape-box ${item.type.id} ${colorClass} ${sizeClass} ${shakeClass}`}
                    style={
                      isTriangle
                        ? { borderBottomColor: getTriangleColor(item.color.id) }
                        : {}
                    }
                    onClick={(e) => checkAnswer(item, e, idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {screen === 'end' && (
        <div className="game-stage active">
          <h1 className="game-main-title">BÉ SIÊU QUÁ! 🎉</h1>
          <svg className="witch-svg-img" viewBox="0 0 100 100" width="150" height="150">
            <circle cx="50" cy="55" r="25" fill="#fbc531"/>
            <path d="M20 40 L50 5 L80 40 Z" fill="#4cd137"/>
            <ellipse cx="50" cy="40" rx="35" ry="5" fill="#44bd32"/>
            <circle cx="40" cy="52" r="4" fill="#000"/>
            <circle cx="60" cy="52" r="4" fill="#000"/>
            <path d="M40 62 Q50 75 60 62" stroke="#000" strokeWidth="3" fill="none"/>
          </svg>
          <p className="game-congrats-text">
            "Chúc mừng lớp học của chúng ta đạt được <strong>{score} điểm</strong>! Các con đã giúp cô tìm ra tất cả những hình bí mật đang trốn rồi!"
          </p>
          <button className="primary-game-btn" onClick={() => onFinish(score)}>
            LƯU ĐIỂM & HOÀN THÀNH 🏆
          </button>
        </div>
      )}
    </div>
  );
}

// Helpers for Triangle styles
const getTriangleColor = (colorId) => {
  const map = {
    red: '#ff4d4d',
    blue: '#3b82f6',
    yellow: '#ffd166',
    green: '#06d6a0'
  };
  return map[colorId] || '#ff4d4d';
};
