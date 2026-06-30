import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Sparkles, Layout, Palette, Code, Smartphone, Image as ImageIcon, Zap, Trophy, AlertTriangle, RefreshCw, ChevronLeft, Circle, X } from 'lucide-react';

interface MiniGameProps {
  onClose: () => void;
  isAiFinished: boolean;
}

// ==========================================
// 1. MATCH GAME
// ==========================================
const MATCH_ICONS = [
  <Layout size={24} />, <Palette size={24} />, <Code size={24} />,
  <Smartphone size={24} />, <ImageIcon size={24} />, <Zap size={24} />,
];

const generateDeck = () => {
  const deck = [...MATCH_ICONS, ...MATCH_ICONS].map((icon, index) => ({
    id: index, icon, isFlipped: false, isMatched: false,
  }));
  return deck.sort(() => Math.random() - 0.5);
};

function MatchGame() {
  const [deck, setDeck] = useState(generateDeck());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    if (matches === MATCH_ICONS.length) setIsWon(true);
  }, [matches]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || deck[index].isFlipped || deck[index].isMatched) return;

    const newDeck = [...deck];
    newDeck[index].isFlipped = true;
    setDeck(newDeck);
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves((m) => m + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (deck[firstIndex].icon.type === deck[secondIndex].icon.type) {
        setTimeout(() => {
          const matchedDeck = [...newDeck];
          matchedDeck[firstIndex].isMatched = true;
          matchedDeck[secondIndex].isMatched = true;
          setDeck(matchedDeck);
          setFlippedIndices([]);
          setMatches((m) => m + 1);
        }, 500);
      } else {
        setTimeout(() => {
          const resetDeck = [...newDeck];
          resetDeck[firstIndex].isFlipped = false;
          resetDeck[secondIndex].isFlipped = false;
          setDeck(resetDeck);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const restartGame = () => {
    setDeck(generateDeck());
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700">Matches: {matches}/{MATCH_ICONS.length}</h3>
        <span className="font-mono font-bold text-indigo-600">Moves: {moves}</span>
      </div>
      {isWon && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
            <Trophy size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">You Won!</h3>
          <button onClick={restartGame} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">Play Again</button>
        </div>
      )}
      <div className="grid grid-cols-4 gap-3">
        {deck.map((card, index) => (
          <div key={card.id} onClick={() => handleCardClick(index)} className="relative w-full aspect-square cursor-pointer" style={{ perspective: '1000px' }}>
            <div className={`w-full h-full transition-transform duration-500 rounded-2xl shadow-sm ${card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center [backface-visibility:hidden]">
                <Gamepad2 size={24} className="text-white/30" />
              </div>
              <div className={`absolute w-full h-full bg-indigo-50 border-2 rounded-2xl flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${card.isMatched ? 'border-emerald-200 text-emerald-600' : 'border-indigo-100 text-indigo-600'}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. RUNNER GAME
// ==========================================
function RunnerGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  
  const characterRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const [obstacleLeft, setObstacleLeft] = useState(500);
  const gameLoopRef = useRef<any>(null);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setObstacleLeft(500);
  };

  const jump = useCallback(() => {
    if (isJumping || !isPlaying || isGameOver) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  }, [isJumping, isPlaying, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!isPlaying && !isGameOver) startGame();
        else jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, isPlaying, isGameOver]);

  useEffect(() => {
    if (!isPlaying) return;
    let currentScore = score;
    let currentSpeed = 5;

    const loop = () => {
      setObstacleLeft((prev) => {
        let nextLeft = prev - currentSpeed;
        if (nextLeft <= -40) {
          nextLeft = 500;
          currentScore += 10;
          setScore(currentScore);
          if (currentSpeed < 12) currentSpeed += 0.5;
        }
        return nextLeft;
      });
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const checkCollision = setInterval(() => {
      if (characterRef.current && obstacleRef.current) {
        const charRect = characterRef.current.getBoundingClientRect();
        const obsRect = obstacleRef.current.getBoundingClientRect();
        if (charRect.right > obsRect.left + 10 && charRect.left < obsRect.right - 10 && charRect.bottom > obsRect.top + 10) {
          setIsGameOver(true);
          setIsPlaying(false);
        }
      }
    }, 50);
    return () => clearInterval(checkCollision);
  }, [isPlaying]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700">Score</h3>
        <span className="font-mono font-bold text-indigo-600">{score}</span>
      </div>
      <div className="w-full h-[250px] bg-slate-50 border-2 border-slate-200 rounded-2xl relative overflow-hidden cursor-pointer" onClick={jump}>
        <div className="absolute bottom-0 left-0 w-full h-[30px] bg-slate-200 border-t-2 border-slate-300"></div>
        
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/50 backdrop-blur-sm">
            <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-black shadow-lg">Start Jumping</button>
          </div>
        )}
        
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80 rounded-2xl text-white">
            <h3 className="text-3xl font-black mb-2">Game Over!</h3>
            <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="mt-4 bg-white text-indigo-600 px-6 py-2 rounded-full font-bold flex items-center gap-2"><RefreshCw size={16}/> Retry</button>
          </div>
        )}

        <div 
          ref={characterRef}
          className={`absolute left-[50px] bottom-[30px] w-[40px] h-[40px] bg-indigo-600 rounded-lg z-20 ${isJumping ? 'animate-[jump_500ms_ease-in-out]' : ''}`}
        ></div>
        
        <div 
          ref={obstacleRef}
          style={{ transform: `translateX(${obstacleLeft}px)` }}
          className="absolute bottom-[30px] w-[30px] h-[40px] bg-rose-500 rounded-t-lg z-10 flex items-center justify-center"
        >
          <AlertTriangle size={16} className="text-white/80" />
        </div>
        <style>{`@keyframes jump { 0%, 100% { bottom: 30px; } 50% { bottom: 140px; } }`}</style>
      </div>
    </div>
  );
}

// ==========================================
// 3. TIC TAC TOE (AI)
// ==========================================
import { getBestMove, checkWinner } from './../hooks/useTicTacToeAI';

function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // User is X
  const [winnerState, setWinnerState] = useState<string | null>(null);

  useEffect(() => {
    const currentWinner = checkWinner(board);
    if (currentWinner) {
      setWinnerState(currentWinner);
      return;
    }
    
    if (!xIsNext) {
      const timer = setTimeout(() => {
        const aiMove = getBestMove(board);
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          setXIsNext(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, xIsNext]);

  const isDraw = winnerState === 'Tie';
  const winner = winnerState && winnerState !== 'Tie' ? winnerState : null;

  const handleClick = (i: number) => {
    if (board[i] || winner || isDraw || !xIsNext) return;
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setXIsNext(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-lg font-bold text-slate-700 mb-6">
        {winner ? (
          <span className="text-emerald-600 flex items-center gap-2">
            <Trophy size={20}/> Player {winner} Wins!
          </span>
        ) : isDraw ? (
          "It's a Draw!"
        ) : (
          `Next Player: ${xIsNext ? 'You (X)' : 'AI (O)'}`
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2 w-[260px] h-[260px]">
        {board.map((cell, i) => (
          <button 
            key={i} 
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner || !!isDraw || !xIsNext}
            className="bg-slate-100 hover:bg-slate-200 rounded-xl text-4xl font-black text-slate-700 transition-colors flex items-center justify-center disabled:opacity-80"
          >
            {cell === 'X' && <X size={48} className="text-indigo-600" />}
            {cell === 'O' && <Circle size={40} strokeWidth={3} className="text-rose-500" />}
          </button>
        ))}
      </div>

      {(winner || isDraw) && (
        <button 
          onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); setWinnerState(null); }}
          className="mt-8 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
        >
          <RefreshCw size={16}/> Play Again
        </button>
      )}
    </div>
  );
}


// ==========================================
// MAIN ARCADE WRAPPER
// ==========================================
export default function MiniGame({ onClose, isAiFinished }: MiniGameProps) {
  const [activeGame, setActiveGame] = useState<'menu' | 'match' | 'runner' | 'tictactoe'>('menu');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 shrink-0 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {activeGame !== 'menu' ? (
              <button onClick={() => setActiveGame('menu')} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <ChevronLeft size={20} />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Gamepad2 size={24} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-800">AI Arcade</h2>
              <p className="text-xs text-slate-500 font-medium">Have fun while you wait!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAiFinished && (
              <button onClick={onClose} className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-colors animate-pulse text-sm">
                View Website!
              </button>
            )}
            {!isAiFinished && (
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-2 text-sm">
                Close
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          {activeGame === 'menu' && (
            <div className="space-y-3 w-full max-w-sm mx-auto">
              <button onClick={() => setActiveGame('match')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group text-left">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Layout size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Designer Match</h3>
                  <p className="text-sm text-slate-500">Test your memory</p>
                </div>
              </button>

              <button onClick={() => setActiveGame('runner')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-rose-500 hover:bg-rose-50 transition-all group text-left">
                <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Runner AI</h3>
                  <p className="text-sm text-slate-500">Jump over obstacles</p>
                </div>
              </button>

              <button onClick={() => setActiveGame('tictactoe')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <X size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Tic-Tac-Toe</h3>
                  <p className="text-sm text-slate-500">Classic board game</p>
                </div>
              </button>
            </div>
          )}

          {activeGame === 'match' && <MatchGame />}
          {activeGame === 'runner' && <RunnerGame />}
          {activeGame === 'tictactoe' && <TicTacToeGame />}
        </div>

      </div>
    </div>
  );
}
