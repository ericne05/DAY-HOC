import React, { useState, useEffect, useRef } from 'react';
import './CountingGame.css';

const itemsConfig = [
  { emoji: '🍎', name: 'quả táo' },
  { emoji: '🚗', name: 'chiếc ô tô' },
  { emoji: '🧸', name: 'chú gấu bông' },
  { emoji: '🐥', name: 'chú vịt con' },
  { emoji: '🎈', name: 'quả bóng bay' },
  { emoji: '🌸', name: 'bông hoa' }
];

export default function CountingGame({ onFinish, onExit }) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [screen, setScreen] = useState('start'); // 'start' | 'play' | 'end'
  const [count, setCount] = useState(0);
  const [activeItem, setActiveItem] = useState(null);
  const [options, setOptions] = useState([]);
  const [wrongOptions, setWrongOptions] = useState({});
  const [confetti, setConfetti] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false); // click lock
  const playgroundRef = useRef(null);

  // Web Audio Synth
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
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'wrong') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'win') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.3);
          o.start(ctx.currentTime + idx * 0.1);
          o.stop(ctx.currentTime + idx * 0.1 + 0.3);
        });
      }
    } catch (e) {
      console.warn("AudioContext blocked", e);
    }
  };

  const handleStart = () => {
    setLevel(1);
    setScore(0);
    setIsTransitioning(false);
    setScreen('play');
  };

  const generateLevel = () => {
    // Generate a number between 1 and 10
    const targetCount = Math.floor(Math.random() * 10) + 1;
    // Choose random item
    const item = itemsConfig[Math.floor(Math.random() * itemsConfig.length)];
    
    const optsSet = new Set([targetCount]);
    while (optsSet.size < 4) {
      const randomVal = Math.floor(Math.random() * 10) + 1; // 1 to 10
      optsSet.add(randomVal);
    }

    const optsArr = Array.from(optsSet).sort((a, b) => a - b);

    setCount(targetCount);
    setActiveItem(item);
    setOptions(optsArr);
    setWrongOptions({});
  };

  useEffect(() => {
    if (screen === 'play') {
      generateLevel();
    }
  }, [level, screen]);

  const checkAnswer = (selected, e, optionIdx) => {
    if (isTransitioning) return; // lock spam click

    if (selected === count) {
      playSound('correct');
      setScore((prev) => prev + 10);
      setIsTransitioning(true); // lock clicks

      // Confetti effect at the center of the playground
      if (playgroundRef.current) {
        const rect = playgroundRef.current.getBoundingClientRect();
        const x = rect.width / 2;
        const y = rect.height / 2;
        triggerConfetti(x, y);
      }

      setTimeout(() => {
        if (level < 5) {
          setLevel((prev) => prev + 1);
          setIsTransitioning(false); // unlock click
        } else {
          playSound('win');
          setScreen('end');
          setIsTransitioning(false);
        }
      }, 1200);
    } else {
      playSound('wrong');
      setWrongOptions((prev) => ({ ...prev, [optionIdx]: true }));
      setTimeout(() => {
        setWrongOptions((prev) => ({ ...prev, [optionIdx]: false }));
      }, 300);
    }
  };

  const triggerConfetti = (x, y) => {
    const listColors = ['#ff6b8b', '#4ba3ff', '#ffd15c', '#6bcb77', '#ff9f43', '#a55eea'];
    const newConfetti = Array.from({ length: 20 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 90;
      return {
        id: Math.random().toString(36).substring(2, 9),
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: listColors[Math.floor(Math.random() * listColors.length)]
      };
    });

    setConfetti((prev) => [...prev, ...newConfetti]);

    setTimeout(() => {
      setConfetti((prev) => prev.filter((c) => !newConfetti.some(nc => nc.id === c.id)));
    }, 1000);
  };

  return (
    <div className="counting-game-wrapper">
      {screen === 'start' && (
        <div className="counting-stage active">
          <h1 className="game-main-title">🔢 ĐẾM SỐ THẦN KỲ</h1>
          
          <div className="wizard-avatar">
            <svg viewBox="0 0 100 100" width="140" height="140">
              <circle cx="50" cy="55" r="25" fill="#ffd15c" />
              <path d="M15 45 L50 2 L85 45 Z" fill="#4ba3ff" />
              <circle cx="40" cy="50" r="3" fill="#2d3748" />
              <circle cx="60" cy="50" r="3" fill="#2d3748" />
              <path d="M43 65 Q50 72 57 65" stroke="#2d3748" strokeWidth="3" fill="none" strokeLinecap="round" />
              <ellipse cx="50" cy="42" rx="36" ry="4" fill="#358ee6" />
              <polygon points="50,15 45,25 55,25" fill="#ff6b8b" />
            </svg>
          </div>

          <p className="game-intro-text">
            Bố mẹ và các thám tử nhí hãy cùng nhau đếm số lượng các đồ vật ngẫu nhiên trên màn hình và chọn kết quả chính xác nhé!
          </p>

          <div className="btn-group">
            <button className="primary-game-btn" onClick={handleStart}>BẮT ĐẦU ĐẾM! 🍎</button>
            <button className="exit-game-btn" onClick={onExit}>QUAY LẠI 🏠</button>
          </div>
        </div>
      )}

      {screen === 'play' && (
        <div className="counting-stage active">
          <div className="game-status-board">
            {/* Star progress bar */}
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

          <div className="counting-instruction-box">
            {activeItem && (
              <p>🧙‍♂️ "Các con ơi, cùng đếm xem có bao nhiêu {activeItem.name} nào!"</p>
            )}
          </div>

          {/* Playground for items display with a Cloud Container */}
          <div className="counting-playground" ref={playgroundRef}>
            {confetti.map((c) => (
              <div
                key={c.id}
                className="counting-confetti"
                style={{
                  left: c.x,
                  top: c.y,
                  backgroundColor: c.color,
                  '--dx': `${c.dx}px`,
                  '--dy': `${c.dy}px`,
                }}
              />
            ))}

            <div className="cloud-island">
              <div className="items-canvas">
                {activeItem && Array.from({ length: count }).map((_, idx) => (
                  <span
                    key={idx}
                    className="counting-item-emoji"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    {activeItem.emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Option selectors */}
          <div className="options-container">
            {options.map((option, idx) => {
              const shakeClass = wrongOptions[idx] ? 'shake-wrong-option' : '';
              return (
                <button
                  key={idx}
                  className={`option-btn ${shakeClass}`}
                  onClick={(e) => checkAnswer(option, e, idx)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {screen === 'end' && (
        <div className="counting-stage active">
          <h1 className="game-main-title">LỚP MÌNH SIÊU QUÁ! 🎉</h1>
          <div className="wizard-avatar">
            <svg viewBox="0 0 100 100" width="140" height="140">
              <circle cx="50" cy="55" r="25" fill="#ffd15c" />
              <path d="M15 45 L50 2 L85 45 Z" fill="#6bcb77" />
              <circle cx="38" cy="50" r="4" fill="#2d3748" />
              <circle cx="62" cy="50" r="4" fill="#2d3748" />
              <path d="M38 62 Q50 78 62 62" stroke="#2d3748" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <p className="game-congrats-text">
            "Tuyệt vời quá các thám tử đếm số giỏi giang! Lớp chúng ta đã hoàn thành bài thi với <strong>{score} điểm</strong> xuất sắc!"
          </p>
          <button className="primary-game-btn" onClick={() => onFinish(score)}>
            LƯU ĐIỂM & HOÀN THÀNH 🏆
          </button>
        </div>
      )}
    </div>
  );
}
