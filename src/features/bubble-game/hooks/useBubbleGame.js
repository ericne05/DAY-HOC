import { useState, useEffect } from 'react';
import { playPopSound } from '../utils/soundSynth';

/**
 * Custom hook for managing the bubble popping game state.
 * Encapsulates the score, active bubbles array, pop particle effects, and game loop.
 * 
 * @param {number} maxBubbles - The base number of bubbles to keep on screen.
 */
export const useBubbleGame = (maxBubbles = 5) => {
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [popEffects, setPopEffects] = useState([]);

  const bubbleContents = [
    'A', 'B', 'C', 'D', 'E', 'H', 'I', 'K', 'O', 'U', 'V',
    '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '🦁', '🐯', '🐼', '🦊', '🐰', '🍏', '🍌', '🍉', '🍓', '🍒', '🎈', '🧸', '🚗', '☀️'
  ];

  const bubbleColors = [
    '#ff6b8b', // pink
    '#4ba3ff', // blue
    '#ffd15c', // yellow
    '#6bcb77', // green
    '#ff9f43', // orange
    '#a55eea', // purple
  ];

  // Creates a new bubble with randomized position, contents, and speed
  const createBubble = () => {
    const randomContent = bubbleContents[Math.floor(Math.random() * bubbleContents.length)];
    const randomColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    const randomLeft = 5 + Math.random() * 80; // keep away from edges
    const randomDuration = 4 + Math.random() * 3; // speed: 4s to 7s

    return {
      id: Math.random().toString(36).substring(2, 9),
      content: randomContent,
      color: randomColor,
      left: `${randomLeft}%`,
      duration: `${randomDuration}s`,
    };
  };

  // Pre-populate bubbles and run maintenance loop
  useEffect(() => {
    const initialBubbles = Array.from({ length: maxBubbles }, () => createBubble());
    setBubbles(initialBubbles);

    const interval = setInterval(() => {
      setBubbles((prev) => {
        // Automatically replenish if count drops below threshold
        if (prev.length < maxBubbles + 1) {
          return [...prev, createBubble()];
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [maxBubbles]);

  // Handle clicking/popping a bubble
  const popBubble = (id, x, y, color) => {
    playPopSound();
    setScore((prev) => prev + 1);

    const newEffect = {
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
      color
    };

    setPopEffects((prev) => [...prev, newEffect]);

    // Cleanup particle animation effect after CSS transition ends (400ms)
    setTimeout(() => {
      setPopEffects((prev) => prev.filter(effect => effect.id !== newEffect.id));
    }, 400);

    // Remove popped bubble and spawn a new one
    setBubbles((prev) => prev.filter((b) => b.id !== id).concat(createBubble()));
  };

  // Handle bubble floating off the screen without interaction
  const handleMiss = (id) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id).concat(createBubble()));
  };

  return {
    score,
    bubbles,
    popEffects,
    popBubble,
    handleMiss
  };
};
