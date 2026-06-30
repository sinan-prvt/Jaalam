import React, { useState, useEffect } from 'react';
import { Player, checkWinner, getBestMove } from '../hooks/useTicTacToeAI';

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true); // Human is X, AI is O
  const [winner, setWinner] = useState<Player | 'Tie' | null>(null);

  useEffect(() => {
    const currentWinner = checkWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      return;
    }

    if (!isXNext) {
      // AI's turn
      const timer = setTimeout(() => {
        const bestMoveIndex = getBestMove(board);
        if (bestMoveIndex !== -1) {
          const newBoard = [...board];
          newBoard[bestMoveIndex] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 500); // Small delay to make it feel more natural
      return () => clearTimeout(timer);
    }
  }, [board, isXNext]);

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const getStatus = () => {
    if (winner === 'Tie') return "It's a Tie!";
    if (winner === 'X') return 'You Win!';
    if (winner === 'O') return 'AI Wins!';
    return `Next Player: ${isXNext ? 'You (X)' : 'AI (O)'}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-xl shadow-2xl max-w-md mx-auto my-12 border border-gray-700">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 drop-shadow-md">
        Tic-Tac-Toe
      </h1>
      <div className="text-xl font-medium text-gray-200 mb-6 bg-gray-800 px-6 py-2 rounded-full shadow-inner">
        {getStatus()}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8 bg-gray-800 p-3 rounded-lg shadow-inner">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`w-24 h-24 text-5xl font-bold rounded-md flex items-center justify-center transition-all duration-300 shadow-md ${
              cell === 'X'
                ? 'text-blue-400 bg-gray-700'
                : cell === 'O'
                ? 'text-purple-500 bg-gray-700'
                : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
            } ${winner || (!isXNext && cell === null) ? 'cursor-not-allowed opacity-80' : 'active:scale-95'}`}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner || !isXNext}
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
        onClick={resetGame}
      >
        Restart Game
      </button>
    </div>
  );
};
