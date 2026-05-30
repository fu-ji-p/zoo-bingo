import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';
import { getCompletedLineIndices } from '../utils/bingo';
import type { BingoCell } from '../types';

function ConfirmModal({
  cell,
  onYes,
  onNo,
}: {
  cell: BingoCell;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onNo}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-8 mx-6 text-center max-w-xs w-full"
      >
        <div className="text-6xl mb-3">{cell.animal.emoji}</div>
        <div className="text-xl font-black text-zoo-text mb-1">{cell.animal.name}</div>
        <div className="text-zoo-text/50 text-sm mb-6">みつけた？</div>
        <div className="flex gap-3">
          <button
            onClick={onNo}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-lg active:scale-95 transition-transform"
          >
            まだ
          </button>
          <button
            onClick={onYes}
            className="flex-1 py-3 rounded-2xl bg-zoo-primary text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            みつけた！
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BingoOverlay({ lines, onClose }: { lines: number; onClose: () => void }) {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#4CAF50', '#FF9800', '#E91E8C', '#FFD700', '#2196F3'],
    });
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        className="bg-white rounded-3xl shadow-2xl px-10 py-8 text-center mx-6"
      >
        <div className="text-5xl mb-2">🎊</div>
        <div className="text-3xl font-black text-zoo-accent leading-tight">
          {lines}ライン<br />ビンゴ たっせい！
        </div>
        <div className="text-xl font-bold text-zoo-text mt-2">おめでとう！🎉</div>
        <div className="text-xs text-zoo-text/40 mt-4">タップでとじる</div>
      </motion.div>
    </motion.div>
  );
}

export function BingoScreen() {
  const { cells, gridSize, completedLines, lastNewLine, markFound, finishGame } = useGameStore(s => ({
    cells: s.cells,
    gridSize: s.gridSize,
    completedLines: s.completedLines,
    lastNewLine: s.lastNewLine,
    markFound: s.markFound,
    finishGame: s.finishGame,
  }));

  const [confirmCell, setConfirmCell] = useState<BingoCell | null>(null);
  const [showBingo, setShowBingo] = useState(false);
  const prevLines = useRef(completedLines);

  useEffect(() => {
    if (lastNewLine !== null && lastNewLine > prevLines.current) {
      setShowBingo(true);
    }
    prevLines.current = completedLines;
  }, [lastNewLine, completedLines]);

  const lineIndices = getCompletedLineIndices(cells, gridSize ?? 3);

  const cellSize = gridSize === 5 ? 'text-xs' : gridSize === 4 ? 'text-sm' : 'text-base';
  const emojiSize = gridSize === 5 ? 'text-2xl' : gridSize === 4 ? 'text-3xl' : 'text-4xl';

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      className="min-h-svh flex flex-col"
      style={{ background: '#FFF9F0' }}
    >
      {/* ヘッダー */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-lg font-black text-zoo-text">どうぶつえんビンゴ🐾</h1>
        {completedLines > 0 && (
          <motion.div
            key={completedLines}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-zoo-secondary text-white px-3 py-1 rounded-full text-sm font-bold shadow"
          >
            🎉 {completedLines}ライン！
          </motion.div>
        )}
      </div>

      {/* ビンゴグリッド */}
      <div className="flex-1 flex items-center justify-center px-3 py-2">
        <div
          className="w-full max-w-md"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '6px',
          }}
        >
          {cells.map((cell, idx) => {
            const isLine = lineIndices.has(idx);
            return (
              <motion.button
                key={cell.animal.id}
                whileTap={!cell.isFound ? { scale: 0.92 } : {}}
                onClick={() => !cell.isFound && setConfirmCell(cell)}
                aria-label={`${cell.animal.name}${cell.isFound ? '（発見済み）' : ''}`}
                className={`
                  relative rounded-2xl shadow-md border-2 flex flex-col items-center justify-center
                  select-none transition-colors duration-300 aspect-square
                  ${isLine
                    ? 'border-zoo-line bg-yellow-50'
                    : cell.isFound
                      ? 'border-zoo-found bg-zoo-found/20'
                      : `border-transparent ${cell.animal.color}`}
                `}
                style={isLine ? {
                  boxShadow: '0 0 0 2px #FFD700, 0 4px 12px rgba(255,215,0,0.4)',
                } : undefined}
              >
                {isLine && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #FFD700 50%, transparent)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }}
                  />
                )}
                <span className={`${emojiSize} leading-none`}>{cell.animal.emoji}</span>
                <span className={`${cellSize} font-bold text-zoo-text text-center leading-tight mt-0.5 px-1`}>
                  <ruby>
                    {cell.animal.name}
                    <rt style={{ fontSize: '0.55em', color: '#999' }}>{cell.animal.reading}</rt>
                  </ruby>
                </span>
                {cell.isFound && (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-zoo-found/70"
                  >
                    <span className="text-white font-black text-center leading-tight"
                      style={{ fontSize: gridSize === 5 ? '0.65rem' : '0.75rem' }}>
                      ✅<br />はっけん！
                    </span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 下部バー */}
      <div className="px-6 pb-6 pt-2">
        <button
          onClick={finishGame}
          className="w-full py-4 rounded-3xl bg-zoo-text text-white font-black text-lg shadow-lg active:scale-95 transition-transform"
        >
          おわる
        </button>
      </div>

      {/* 確認モーダル */}
      <AnimatePresence>
        {confirmCell && (
          <ConfirmModal
            cell={confirmCell}
            onYes={() => {
              markFound(confirmCell.animal.id);
              setConfirmCell(null);
            }}
            onNo={() => setConfirmCell(null)}
          />
        )}
      </AnimatePresence>

      {/* ビンゴ達成オーバーレイ */}
      <AnimatePresence>
        {showBingo && (
          <BingoOverlay
            lines={completedLines}
            onClose={() => setShowBingo(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
