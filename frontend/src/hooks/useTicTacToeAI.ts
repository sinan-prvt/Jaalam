export type Player = 'X' | 'O' | null;

export const checkWinner = (board: Player[]): Player | 'Tie' | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== null)) {
    return 'Tie';
  }

  return null;
};

// Minimax algorithm for optimal AI moves
const minimax = (board: Player[], depth: number, isMaximizing: boolean): number => {
  const winner = checkWinner(board);
  if (winner === 'O') return 10 - depth; // AI wins
  if (winner === 'X') return depth - 10; // Human wins
  if (winner === 'Tie') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};
dsdsdsd
sds
d
sd
sd
sd
sd
s
d
sd
sdsd
s
d
ds
ds
d
export const getBestMove = (board: Player[]): number => {
  const emptyCount = board.filter(c => c === null).length;

  // Optimization: Hardcode first moves to avoid massive Minimax trees and prevent UI lag
  if (emptyCount === 9) {
    return 4; // Center
  }
  if (emptyCount === 8) {
    return board[4] === null ? 4 : 0; // Take center if available, else top-left corner
  }

  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
};
