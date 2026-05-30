import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getCompletedLineIndices } from '../utils/bingo';
import { captureAndShare } from '../utils/screenshot';

export function ResultScreen() {
  const { cells, gridSize, completedLines, resetGame } = useGameStore(s => ({
    cells: s.cells,
    gridSize: s.gridSize,
    completedLines: s.completedLines,
    resetGame: s.resetGame,
  }));

  const lineIndices = getCompletedLineIndices(cells, gridSize ?? 3);
  const foundCount = cells.filter(c => c.isFound).length;
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const emojiSize = gridSize === 5 ? 'text-xl' : gridSize === 4 ? 'text-2xl' : 'text-3xl';
  const cellFontSize = gridSize === 5 ? '0.55rem' : '0.65rem';

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      className="min-h-svh flex flex-col items-center px-4 py-6"
      style={{ background: '#FFF9F0' }}
    >
      {/* キャプチャ対象エリア */}
      <div
        id="bingo-result-capture"
        className="w-full max-w-md rounded-3xl shadow-xl p-5 mb-6"
        style={{ background: '#FFF9F0', border: '3px solid #4CAF50' }}
      >
        {/* タイトル */}
        <div className="text-center mb-4">
          <div className="text-2xl font-black text-zoo-text">きょうのきろく🌟</div>
          <div className="text-xs text-zoo-text/50 mt-1">{today}</div>
        </div>

        {/* グリッド */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '4px',
          }}
        >
          {cells.map((cell, idx) => {
            const isLine = lineIndices.has(idx);
            return (
              <div
                key={cell.animal.id}
                className={`
                  relative rounded-xl flex flex-col items-center justify-center aspect-square
                  border-2 text-center
                  ${isLine
                    ? 'border-zoo-line bg-yellow-50'
                    : cell.isFound
                      ? 'border-zoo-found bg-zoo-found/20'
                      : `border-gray-100 ${cell.animal.color}`}
                `}
                style={isLine ? { boxShadow: '0 0 0 2px #FFD700' } : undefined}
              >
                <span className={`${emojiSize} leading-none`}>{cell.animal.emoji}</span>
                <span
                  className="font-bold text-zoo-text leading-tight px-0.5 mt-0.5"
                  style={{ fontSize: cellFontSize }}
                >
                  {cell.animal.name}
                </span>
                {cell.isFound && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-zoo-found/60">
                    <span className="text-white font-black" style={{ fontSize: cellFontSize }}>✅</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* サマリー */}
        <div className="mt-4 flex gap-3 justify-center">
          <div className="bg-zoo-secondary/10 rounded-2xl px-4 py-2 text-center">
            <div className="text-xl font-black text-zoo-secondary">{completedLines}</div>
            <div className="text-xs text-zoo-text/60">ライン</div>
          </div>
          <div className="bg-zoo-primary/10 rounded-2xl px-4 py-2 text-center">
            <div className="text-xl font-black text-zoo-primary">{foundCount}</div>
            <div className="text-xs text-zoo-text/60">はっけん</div>
          </div>
          <div className="bg-zoo-accent/10 rounded-2xl px-4 py-2 text-center">
            <div className="text-xl font-black text-zoo-accent">{cells.length}</div>
            <div className="text-xs text-zoo-text/60">マス</div>
          </div>
        </div>

        {/* フッターロゴ */}
        <div className="text-center mt-3 text-xs text-zoo-text/30 font-bold">
          どうぶつえんビンゴ🐾
        </div>
      </div>

      {/* ボタン */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => captureAndShare('bingo-result-capture')}
          className="w-full py-4 rounded-3xl bg-zoo-secondary text-white font-black text-lg shadow-lg"
        >
          📸 スクリーンショットをとる！
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="w-full py-4 rounded-3xl bg-zoo-primary text-white font-black text-lg shadow-lg"
        >
          🔄 もういちどあそぶ！
        </motion.button>
      </div>
    </motion.div>
  );
}
