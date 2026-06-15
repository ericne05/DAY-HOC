import React, { useState, useEffect, useRef } from 'react';
import './AnimalGame.css';

const riddlesConfig = [
  {
    riddle: "Thích ăn cà rốt, tai dài đuôi ngắn, chạy nhảy tung tăng, là con gì nhỉ?",
    correct: { emoji: '🐰', name: 'Con Thỏ' },
    wrongs: [
      { emoji: '🐵', name: 'Con Khỉ' },
      { emoji: '🐷', name: 'Con Heo' }
    ]
  },
  {
    riddle: "Kêu gâu gâu gâu, trông nhà cho chủ, vẫy đuôi mừng rỡ, là con gì thế?",
    correct: { emoji: '🐶', name: 'Con Chó' },
    wrongs: [
      { emoji: '🐱', name: 'Con Mèo' },
      { emoji: '🦊', name: 'Con Cáo' }
    ]
  },
  {
    riddle: "Thích bắt chuột nhắt, kêu meo meo meo, leo trèo cực siêu, là con gì nào?",
    correct: { emoji: '🐱', name: 'Con Mèo' },
    wrongs: [
      { emoji: '🐹', name: 'Chuột Hamster' },
      { emoji: '🐰', name: 'Con Thỏ' }
    ]
  },
  {
    riddle: "Bụng to mũi dài, tai như cái quạt, thích uống nước mát, là con gì ta?",
    correct: { emoji: '🐘', name: 'Con Voi' },
    wrongs: [
      { emoji: '🦁', name: 'Sư Tử' },
      { emoji: '🦒', name: 'Hươu Cao Cổ' }
    ]
  },
  {
    riddle: "Có cái bờm to, gầm rú rất to, xưng danh chúa tể, là con gì nhỉ?",
    correct: { emoji: '🦁', name: 'Sư Tử' },
    wrongs: [
      { emoji: '🐯', name: 'Con Hổ' },
      { emoji: '🐻', name: 'Con Gấu' }
    ]
  },
  {
    riddle: "Thích ăn lá non, cổ dài tít tắp, cao hơn mái nhà, là con gì đây?",
    correct: { emoji: '🦒', name: 'Hươu Cao Cổ' },
    wrongs: [
      { emoji: '🐴', name: 'Con Ngựa' },
      { emoji: '🐑', name: 'Con Cừu' }
    ]
  },
  {
    riddle: "Kêu cạp cạp cạp, bơi lội dưới ao, chân có màng mỏng, là con gì nào?",
    correct: { emoji: '🦆', name: 'Con Vịt' },
    wrongs: [
      { emoji: '🐓', name: 'Gà Trống' },
      { emoji: '🦅', name: 'Chim Ưng' }
    ]
  },
  {
    riddle: "Gáy ò ó o, đánh thức mọi người, mào đỏ tươi rói, là con gì thế?",
    correct: { emoji: '🐓', name: 'Gà Trống' },
    wrongs: [
      { emoji: '🦉', name: 'Chim Cú' },
      { emoji: '🦆', name: 'Con Vịt' }
    ]
  }
];

export default function AnimalGame({ onFinish, onExit }) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [screen, setScreen] = useState('start'); // 'start' | 'play' | 'end'
  const [currentRiddle, setCurrentRiddle] = useState(null);
  const [options, setOptions] = useState([]);
  const [wrongSelections, setWrongSelections] = useState({});
  const [effects, setEffects] = useState([]);
  const playgroundRef = useRef(null);

  // Web Audio Synthesizer
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
    setScreen('play');
  };

  const generateLevel = () => {
    // Pick a random riddle
    const riddle = riddlesConfig[Math.floor(Math.random() * riddlesConfig.length)];
    
    // Shuffle options
    const listOpts = [
      { ...riddle.correct, isCorrect: true },
      ...riddle.wrongs.map(w => ({ ...w, isCorrect: false }))
    ];

    // Shuffle array
    for (let i = listOpts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [listOpts[i], listOpts[j]] = [listOpts[j], listOpts[i]];
    }

    setCurrentRiddle(riddle);
    setOptions(listOpts);
    setWrongSelections({});
  };

  useEffect(() => {
    if (screen === 'play') {
      generateLevel();
    }
  }, [level, screen]);

  const checkAnswer = (selected, e, optionIdx) => {
    if (selected.isCorrect) {
      playSound('correct');
      setScore((prev) => prev + 10);

      if (playgroundRef.current) {
        const rect = playgroundRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        triggerExplosion(x, y);
      }

      setTimeout(() => {
        if (level < 5) {
          setLevel((prev) => prev + 1);
        } else {
          playSound('win');
          setScreen('end');
        }
      }, 1200);
    } else {
      playSound('wrong');
      setWrongSelections((prev) => ({ ...prev, [optionIdx]: true }));
      setTimeout(() => {
        setWrongSelections((prev) => ({ ...prev, [optionIdx]: false }));
      }, 300);
    }
  };

  const triggerExplosion = (x, y) => {
    const listColors = ['#ff6b8b', '#4ba3ff', '#ffd15c', '#6bcb77', '#ff9f43', '#a55eea'];
    const newEffects = Array.from({ length: 15 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 80;
      return {
        id: Math.random().toString(36).substring(2, 9),
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: listColors[Math.floor(Math.random() * listColors.length)]
      };
    });

    setEffects((prev) => [...prev, ...newEffects]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((eff) => !newEffects.some(ne => ne.id === eff.id)));
    }, 1000);
  };

  return (
    <div className="animal-game-wrapper">
      {screen === 'start' && (
        <div className="animal-stage active">
          <h1 className="game-main-title">🦁 ĐỐ VUI MUÔN THÚ</h1>
          
          <div className="game-mascot">
            <svg viewBox="0 0 100 100" width="140" height="140">
              <circle cx="50" cy="55" r="25" fill="#ff9f43" />
              <circle cx="35" cy="35" r="10" fill="#ff9f43" />
              <circle cx="65" cy="35" r="10" fill="#ff9f43" />
              <circle cx="35" cy="35" r="6" fill="#fff" />
              <circle cx="65" cy="35" r="6" fill="#fff" />
              <circle cx="43" cy="52" r="3" fill="#2d3748" />
              <circle cx="57" cy="52" r="3" fill="#2d3748" />
              <polygon points="50,60 46,55 54,55" fill="#2d3748" />
              <path d="M44 68 Q50 74 56 68" stroke="#2d3748" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <p className="game-intro-text">
            Bé hãy lắng nghe cô giáo đọc câu đố vui dân gian và đoán xem đó là loài động vật đáng yêu nào nhé!
          </p>

          <div className="btn-group">
            <button className="primary-game-btn" onClick={handleStart}>BẮT ĐẦU ĐOÁN! 🦊</button>
            <button className="exit-game-btn" onClick={onExit}>QUAY LẠI 🏠</button>
          </div>
        </div>
      )}

      {screen === 'play' && (
        <div className="animal-stage active">
          <div className="game-status-board">
            <span className="level-indicator">Câu đố: {level}/5 ⭐</span>
            <button className="exit-top-btn" onClick={onExit}>Thoát 🏠</button>
            <span className="score-indicator">⭐ Điểm: {score}</span>
          </div>

          <div className="riddle-speech-bubble">
            {currentRiddle && (
              <p>🧙‍♂️ {currentRiddle.riddle}</p>
            )}
          </div>

          {/* Interactive display board */}
          <div className="animal-playground" ref={playgroundRef}>
            {effects.map((e) => (
              <div
                key={e.id}
                className="animal-pop-confetti"
                style={{
                  left: e.x,
                  top: e.y,
                  backgroundColor: e.color,
                  '--dx': `${e.dx}px`,
                  '--dy': `${e.dy}px`,
                }}
              />
            ))}

            <div className="animal-grid">
              {options.map((option, idx) => {
                const shakeClass = wrongSelections[idx] ? 'shake-wrong-animal' : '';
                return (
                  <div
                    key={idx}
                    className={`animal-option-card ${shakeClass}`}
                    onClick={(e) => checkAnswer(option, e, idx)}
                  >
                    <span className="animal-emoji">{option.emoji}</span>
                    <span className="animal-label">{option.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {screen === 'end' && (
        <div className="animal-stage active">
          <h1 className="game-main-title">QUÁ XUẤT SẮC! 🎉</h1>
          <div className="game-mascot">
            <svg viewBox="0 0 100 100" width="140" height="140">
              <circle cx="50" cy="55" r="25" fill="#6bcb77" />
              <circle cx="35" cy="35" r="10" fill="#6bcb77" />
              <circle cx="65" cy="35" r="10" fill="#6bcb77" />
              <circle cx="40" cy="52" r="4" fill="#2d3748" />
              <circle cx="60" cy="52" r="4" fill="#2d3748" />
              <path d="M40 64 Q50 78 60 64" stroke="#2d3748" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <p className="game-congrats-text">
            "Tuyệt vời ông mặt trời! Các thám tử nhí đã tìm ra tất cả muôn thú trốn tìm rồi. Đạt điểm tuyệt đối <strong>{score} điểm</strong>!"
          </p>
          <button className="primary-game-btn" onClick={() => onFinish(score)}>
            LƯU ĐIỂM & HOÀN THÀNH 🏆
          </button>
        </div>
      )}
    </div>
  );
}
