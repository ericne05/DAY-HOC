import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the persistent high-score leaderboard using localStorage.
 */
export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kidland_leaderboard');
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load leaderboard from localStorage", e);
    }
  }, []);

  // Save score to leaderboard
  const saveScore = (className, score) => {
    if (!className || className.trim() === '') return [];

    try {
      const stored = localStorage.getItem('kidland_leaderboard');
      let currentBoard = stored ? JSON.parse(stored) : [];

      // Find if class name already exists
      const existingIdx = currentBoard.findIndex(
        (item) => item.name.toLowerCase() === className.trim().toLowerCase()
      );

      if (existingIdx !== -1) {
        // Only update if new score is higher
        if (score > currentBoard[existingIdx].score) {
          currentBoard[existingIdx].score = score;
          currentBoard[existingIdx].date = new Date().toLocaleDateString('vi-VN');
        }
      } else {
        // Add new entry
        currentBoard.push({
          name: className.trim(),
          score: score,
          date: new Date().toLocaleDateString('vi-VN'),
        });
      }

      // Sort descending by score
      currentBoard.sort((a, b) => b.score - a.score);

      // Slice to top 10
      const newBoard = currentBoard.slice(0, 10);
      
      localStorage.setItem('kidland_leaderboard', JSON.stringify(newBoard));
      setLeaderboard(newBoard);
      return newBoard;
    } catch (e) {
      console.error("Failed to save score to localStorage", e);
      return [];
    }
  };

  const clearLeaderboard = () => {
    try {
      localStorage.removeItem('kidland_leaderboard');
      setLeaderboard([]);
    } catch (e) {
      console.error("Failed to clear leaderboard", e);
    }
  };

  return {
    leaderboard,
    saveScore,
    clearLeaderboard,
  };
};
