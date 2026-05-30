import { motion } from 'framer-motion';
import type { BingoSize } from '../types';
import { useGameStore } from '../store/gameStore';

const DECO_EMOJIS = ['🦁', '🐘', '🦒', '🐼', '🐧', '🦜', '🐢', '🦊', '🦋', '🌿'];

const sizes: { size: BingoSize; label: string; desc: string; age: string; emoji: string }[] = [
  { size: 9,  label: '3×3（9マス）',   desc: 'かんたん',    age: '3〜5さい',  emoji: '🐼' },
  { size: 16, label: '4×4（16マス）',  desc: 'ふつう',      age: '5〜8さい',  emoji: '🦁' },
  { size: 25, label: '5×5（25マス）',  desc: 'むずかしい',  age: '8さい〜',   emoji: '🦒' },
];

function DecoEmoji({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <span className="absolute text-2xl select-none pointer-events-none opacity-40" style={style}>
      {emoji}
    </span>
  );
}

export function SelectSizeScreen() {
  const setSize = useGameStore(s => s.setSize);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      className="min-h-svh flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden"
      style={{ background: '#FFF9F0' }}
    >
      {/* 装飾絵文字 */}
      {DECO_EMOJIS.map((e, i) => (
        <DecoEmoji key={i} emoji={e} style={{
          top: `${8 + (i * 9) % 85}%`,
          left: i % 2 === 0 ? `${2 + (i * 7) % 12}%` : undefined,
          right: i % 2 === 1 ? `${2 + (i * 5) % 12}%` : undefined,
        }} />
      ))}

      {/* タイトル */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-black text-zoo-text leading-tight drop-shadow-sm">
          どうぶつえん<br />ビンゴ🐾
        </h1>
        <p className="mt-3 text-xl text-zoo-text/70">
          <ruby>何<rt className="text-xs">なん</rt></ruby>マスにする？
        </p>
      </motion.div>

      {/* サイズ選択ボタン */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        {sizes.map((s, i) => (
          <motion.button
            key={s.size}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 260 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSize(s.size)}
            className="w-full rounded-3xl shadow-lg active:shadow-md transition-shadow bg-white border-2 border-zoo-primary/30 py-4 px-6 flex items-center gap-4 text-left"
          >
            <span className="text-4xl">{s.emoji}</span>
            <div className="flex-1">
              <div className="text-xl font-bold text-zoo-text">{s.label}</div>
              <div className="text-sm text-zoo-text/60">
                {s.desc}・<ruby>目安<rt className="text-xs">めやす</rt></ruby>：{s.age}
              </div>
            </div>
            <span className="text-zoo-primary text-2xl">›</span>
          </motion.button>
        ))}
      </div>

      <p className="mt-10 text-zoo-text/40 text-sm">
        🌿 どうぶつえんで あそぼう！
      </p>
    </motion.div>
  );
}
